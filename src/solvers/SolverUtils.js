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
