// Rubiks Cube Solver: Common solver utilities
// By Amy Burnett
// =======================================================================

/**
 * Finds the minimum solution to reach the given solved state with the
 * given set of moves and movesets.
 * Note that the given cube is modified.
 * @param {*} cube the given rubiks cube for keeping track of the cube
 * state
 * @param {*} maxMoves the max number of moves allowed to reach the solved
 * state
 * @param {*} isSolved a function that should return true if the cube
 * reached the desired solved state, false otherwise.
 * @param {*} moveSetsToTry a list of moves or movesets to try
 * @param {*} shouldCheckLengthBeforeSolved by default, the solver checks
 * if the solution was reached before ensuring the number of moves does
 * not exceed the limit. Setting this to true will check the move count
 * first before checking for the solution.
 * Sidenote, this is very ad hoc and likely the default behavior needs to
 * be changed.
 * @returns the solution if one was found, otherwise null.
 * Note that if a solution is found, the cube remains in the solved state
 */
function findMinSolution (cube, maxMoves, isSolved, moveSetsToTry, shouldCheckLengthBeforeSolved = false)
{
    // This is using an iterative deepening Depth First Search
    // algorithm to find the solution with the minimum number of moves.
    let solution = null;
    for (var i = 1; i < maxMoves; ++i) {
        let abbreviatedSolution = [];
        solution = findMinSolution_ (cube, [], 0, i, isSolved, moveSetsToTry, shouldCheckLengthBeforeSolved, abbreviatedSolution);
        if (solution != null) {
            // Found the solution!
            console.log ("min solution:", moveSetToString (solution));
            const abbreviatedSolutionStrings = [];
            for (let j = 0; j < abbreviatedSolution.length; ++j)
            {
                if (abbreviatedSolution[j] instanceof PatternAlgorithm)
                    abbreviatedSolutionStrings.push (`Alg(${abbreviatedSolution[j].getName ()})`);
                else
                    abbreviatedSolutionStrings.push (cubeMoveNotation.toString (abbreviatedSolution[j]));
            }
            console.log ("min solution (abbreviated):", abbreviatedSolutionStrings.join(" "));
                
            break;
        }
    }
    return solution;
}

// =======================================================================

/**
 * Recursive helper function for findMinSolution. findMinSolution should
 * be used instead of using this function directly.
 * @param {*} cube 
 * @param {*} path 
 * @param {*} prevMove 
 * @param {*} limit 
 * @param {*} isSolved 
 * @param {*} moveSetsToTry 
 * @param {*} shouldCheckLengthBeforeSolved 
 * @returns 
 */
function findMinSolution_ (cube, path, prevMove, limit, isSolved, moveSetsToTry, shouldCheckLengthBeforeSolved, abbreviatedSolution) {
    // Ensure max moves are not exceeded before checking solution
    if (shouldCheckLengthBeforeSolved && path.length >= limit)
        return null;

    // solution found
    if (isSolved (cube)) {
        return path;
    }

    // Ensure we aren't going to exceed the max number of moves
    if (path.length >= limit)
        return null;

    // path not found
    // keep searching
    let result;
    for (const moveSetOrPattern of moveSetsToTry)
    {
        const moveSet = moveSetOrPattern instanceof PatternAlgorithm ? moveSetOrPattern.getAlgorithm () : moveSetOrPattern;
        // If algorithm requires a pattern, ensure the pattern matches
        if (moveSetOrPattern instanceof PatternAlgorithm && !moveSetOrPattern.matches (cube))
            // Pattern doesnt match - skip algorithm
            continue;

        // Ensure this move isnt the reverse of the previous move
        // since that would undo progress - only applies to moveSets
        // with a single move
        if (moveSet.length == 1 && prevMove == cubeMoveNotation.getReverseMove (moveSet[0]))
            // skip trying move
            continue;

        if (moveSetOrPattern instanceof PatternAlgorithm)
            abbreviatedSolution.push (moveSetOrPattern);

        // Apply moveSet to cube
        for (const move of moveSet)
        {
            const axisMove = cubeMoveNotation.toAxisNotation (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push (move);
            if (!(moveSetOrPattern instanceof PatternAlgorithm))
                abbreviatedSolution.push (move);
        }
        // Try to solve from this state
        result = findMinSolution_ (cube, path, moveSet.length == 1 ? moveSet[0] : 0, limit, isSolved, moveSetsToTry, shouldCheckLengthBeforeSolved, abbreviatedSolution);
        if (result != null) return result;
        // MoveSet did not work so
        // Undo moveSet (by doing the reverse moves in reverse order)
        for (let i = moveSet.length-1; i >= 0; --i)
        {
            const move = moveSet[i];
            const axisMove = cubeMoveNotation.toAxisNotation (move);
            // Do the reverse move to undo (-direction)
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
            path.pop ();
            if (!(moveSetOrPattern instanceof PatternAlgorithm))
                abbreviatedSolution.pop ();
        }

        if (moveSetOrPattern instanceof PatternAlgorithm)
            abbreviatedSolution.pop ();
    }
    // no solution found
    return null;
}

// =======================================================================

function areSameStickers (cube, stickerPositions) {
    const color = cube.data[stickerPositions[0]];
    for (let i = 1; i < stickerPositions.length; ++i)
        if (cube.data[stickerPositions[i]] != color)
            return false;
    return true;
}

// ================================================================================================

/**
 * Pattern-matching Solver
 * This finds the solution to a given cube state using an array of predefined pattern 
 * algorithms and an exhaustive list of valid setup move sets.
 * 
 * @note This function modifies the provided cube state in-place and utilizes strict 
 * backtracking. On a successful solve, the cube is left in its solved state. On failure, 
 * the cube is cleanly restored to its pristine starting state.
 * 
 * Rules and limitations:
 * 1. INPUT ARRAY COMPLETENESS (EXHAUSTIVE SEARCH SPACE)
 *    The `setupMoveSets` array must contain every single unique cube orientation reachable 
 *    by the allowed setup moves. 
 *    - If the setup moves commute (AB = BA), you only need to provide a pruned combination list (e.g., 16 states).
 *    - If the setup moves intersect (AB != BA), the caller MUST explicitly include every valid 
 *      permutation (e.g., both [A, B] and [B, A]) to ensure the search space is fully covered.
 * 
 * 2. SHORTEST-PATH FIRST (SPF) REQUIREMENT
 *    The `setupMoveSets` array MUST be strictly ordered from lowest to highest move count. 
 *    Because this algorithm short-circuits on the very first match it finds, it relies entirely 
 *    on this pre-sorted ordering to mathematically guarantee the fastest/shortest solution.
 * 
 * 3. SINGULAR ALGORITHM EXECUTION
 *    This function assumes that exactly ZERO or ONE algorithms are required to solve this specific 
 *    step. It does not natively support algorithm chaining (e.g., Setup -> Alg X -> Setup -> Alg Y).
 * 
 * @param {RubiksCube} cube - The current state of the cube (will be modified).
 * @param {Function} isSolved - A predicate function callback `(cube) => boolean` that checks if the target state is met.
 * @param {Array} setupMoveSets - An exhaustive, pre-sorted array of valid setup move arrays. 
 *                                Should include an empty array `[]` to test if already solved.
 * @param {Array<PatternAlgorithm>} patternAlgorithms - An array of PatternAlgorithm objects to match against.
 * @returns {Array|null} The fastest solution sequence as an array of moves, or null if no solution is found.
 */
function solveWithAlgorithms (cube, isSolved, setupMoveSets, patternAlgorithms) {
    // Try each setup move set to find a solution
    // The move sets should be ordered from lowest to highest move count
    // so that the solver finds the shortest solution first.
    for (const setupMoveSet of setupMoveSets) {

        // Apply setup moves
        for (const move of setupMoveSet)
        {
            const axisMove = cubeMoveNotation.toAxisNotation (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
        }

        // Short-circuit if the setup move set reaches the solved state
        // This can return an empty array if the cube is already solved and the move set was empty
        if (isSolved(cube))
            return [...setupMoveSet];

        // Search for a pattern that matches
        for (const patternAlgorithm of patternAlgorithms) {
            // Check if pattern matches
            if (patternAlgorithm.matches(cube)) {
                // Apply algorithm
                for (const move of patternAlgorithm.getAlgorithm())
                {
                    const axisMove = cubeMoveNotation.toAxisNotation (move);
                    // Perform move on cube
                    cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
                }
                // Check if we solved the cube
                if (isSolved(cube))
                    // Cube is solved so return the setup moves and algorithm used
                    return [...setupMoveSet, ...patternAlgorithm.getAlgorithm()];

                // Otherwise, try setup moves to finish solving
                for (const finishMoveSet of setupMoveSets) {
                    // Apply finish moves
                    for (const move of finishMoveSet) {
                        const axisMove = cubeMoveNotation.toAxisNotation (move);
                        // Perform move on cube
                        cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
                    }
                    // Check if we solved the cube
                    if (isSolved(cube))
                        // Cube is solved so return the setup moves, pattern algorithm, and finish moves
                        return [...setupMoveSet, ...patternAlgorithm.getAlgorithm(), ...finishMoveSet];
                    // Undo finish moves if they did not solve the cube
                    for (let i = finishMoveSet.length-1; i >= 0; --i) {
                        const move = finishMoveSet[i];
                        const axisMove = cubeMoveNotation.toAxisNotation (move);
                        // Do the reverse move to undo (-direction)
                        cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
                    }
                }
                // Reaches here if somehow the pattern matches but there is no way to solve from here
                // Undo pattern algorithm moves if no solution was found
                for (let i = patternAlgorithm.getAlgorithm().length-1; i >= 0; --i) {
                    const move = patternAlgorithm.getAlgorithm()[i];
                    const axisMove = cubeMoveNotation.toAxisNotation (move);
                    // Do the reverse move to undo (-direction)
                    cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
                }
                // At this point, neither the finish moves nor the pattern algorithm led to a solution,
                // so we continue to the next pattern algorithm or setup move set
            }
        }

        // setupMoveSet did not work so
        // Undo setupMoveSet (by doing the reverse moves in reverse order)
        for (let i = setupMoveSet.length-1; i >= 0; --i)
        {
            const move = setupMoveSet[i];
            const axisMove = cubeMoveNotation.toAxisNotation (move);
            // Do the reverse move to undo (-direction)
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
    }
    return null;
}
