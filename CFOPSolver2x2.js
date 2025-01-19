// Rubiks Cube Solver 2 with CFOP-like algorithm
// By Amy Burnett
// August 21 2024
// =======================================================================
// Globals/constants

// =======================================================================

class CFOPSolver2x2
{

    constructor ()
    {
        this.MAX_WHITE_FACE_MOVES = 10;
        this.MAX_YELLOW_FACE_MOVES  = 30;
        // enough for 2 jperms 
        this.MAX_PERMUTATE_LAST_LAYER_MOVES = 32;
    }

    // =======================================================================

    // returns a list of moves to solve the cube from the current state
    // this can fluctuate in time between instant and a few seconds
    findSolution (cube)
    {
        let solution = [];
        // solve first layer
        let temp = this.solveFirstLayer (cube);
        if (temp != null)
            solution = solution.concat(temp);

        // solve yellow face
        temp = this.solveYellowFace (cube);
        if (temp != null)
            solution = solution.concat(temp);

        // permutate last layer
        temp = this.solveLastLayer (cube);
        if (temp != null)
            solution = solution.concat(temp);

        return solution;
    }

    // =======================================================================

    isFirstLayerSolved (cube)
    {
        if (cube.data[cube.DOWN    ] != WHITE ) return false;
        if (cube.data[cube.DOWN + 1] != WHITE ) return false;
        if (cube.data[cube.DOWN + 2] != WHITE ) return false;
        if (cube.data[cube.DOWN + 3] != WHITE ) return false;
        if (cube.data[cube.FRONT + 2] != BLUE ) return false;
        if (cube.data[cube.FRONT + 3] != BLUE ) return false;
        if (cube.data[cube.LEFT + 2] != ORANGE) return false;
        if (cube.data[cube.LEFT + 3] != ORANGE) return false;
        if (cube.data[cube.BACK + 2] != GREEN ) return false;
        if (cube.data[cube.BACK + 3] != GREEN ) return false;
        if (cube.data[cube.RIGHT + 2] != RED  ) return false;
        if (cube.data[cube.RIGHT + 3] != RED  ) return false;
        return true;
    }

    // =======================================================================

    solveFirstLayer (cube)
    {
        console.time ("solveFirstLayer");
        let solution = null;
        for (var i = 1; i < this.MAX_WHITE_FACE_MOVES; ++i) {
            solution = this.solveFirstLayer_ (cube, [], 0, i);
            if (solution != null) {
                console.log ("solveFirstLayer", solution);
                break;
            }
        }
        console.timeEnd ("solveFirstLayer");
        return solution;
    }

    // =======================================================================

    solveFirstLayer_ (cube, path, prevMove, limit)
    {
        // solution found
        if (this.isFirstLayerSolved (cube))
        {
            return path;
        }

        // Ensure we aren't going to exceed the max number of moves
        if (path.length >= limit)
            return null;

        // path not found
        // keep searching
        let result;
        let movesToTry = [
            cubeNotationMove (MOVE_L,  1),
            cubeNotationMove (MOVE_L, -1),
            cubeNotationMove (MOVE_R,  1),
            cubeNotationMove (MOVE_R, -1),
            cubeNotationMove (MOVE_F,  1),
            cubeNotationMove (MOVE_F, -1),
            cubeNotationMove (MOVE_B,  1),
            cubeNotationMove (MOVE_B, -1),
            cubeNotationMove (MOVE_U,  1),
            cubeNotationMove (MOVE_U, -1),
            cubeNotationMove (MOVE_D,  1), 
            cubeNotationMove (MOVE_D, -1)
        ];
        for (let move of movesToTry)
        {
            // Ensure this move isnt the reverse of the previous move
            // since that would undo progress
            if (prevMove == cubeMoveNotation.getReverseMove (move))
                // skip trying move
                continue;
            // Perform move on cube
            let axisNotationMove = cubeMoveNotation.toAxisNotation (move);
            cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
            path.push (move);
            result = this.solveFirstLayer_ (cube, path, move, limit);
            if (result != null) return result;
            path.pop ();
            // undo move by reversing direction
            cube.rotate (axisNotationMove[0], axisNotationMove[1], -axisNotationMove[2]);
        }
        // no solution found
        return null;
    }

    // =======================================================================

    isYellowFaceSolved (cube) {
        if (cube.data[cube.UP    ] != YELLOW) return false;
        if (cube.data[cube.UP + 1] != YELLOW) return false;
        if (cube.data[cube.UP + 2] != YELLOW) return false;
        if (cube.data[cube.UP + 3] != YELLOW) return false;
        return true;
    }

    // =======================================================================

    solveYellowFace (cube)
    {
        console.time ("solveYellowFace");
        let solution = null;
        for (var i = 1; i < this.MAX_YELLOW_FACE_MOVES; ++i)
        {
            solution = this.solveYellowFace_ (cube, [], 0, i);
            if (solution != null)
            {
                console.log ("solveYellowFace", solution);
                break;
            }
        }
        console.timeEnd ("solveYellowFace");
        return solution;
    }

    // =======================================================================

    solveYellowFace_ (cube, path, prevMove, limit) {
        // solution found
        if (this.isYellowFaceSolved(cube)) {
            return path;
        }

        // Ensure we aren't going to exceed the max number of moves
        if (path.length >= limit)
            return null;

        // path not found
        // keep searching
        let result;
        // Fishy alg
        let moveSetsToTry = [
            [
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1)
            ],
            [
                cubeNotationMove (MOVE_U,  1)
            ],
            [
                cubeNotationMove (MOVE_U, -1)
            ]
        ];
        for (let moveSet of moveSetsToTry)
        {
            // Ensure this move isnt the reverse of the previous move
            // since that would undo progress - only applies to moveSets
            // with a single move
            if (moveSet.length == 1 && prevMove == cubeMoveNotation.getReverseMove (moveSet[0]))
                // skip trying move
                continue;
            // Apply moveSet to cube
            for (let move of moveSet)
            {
                let axisMove = cubeMoveNotation.toAxisNotation (move);
                // Perform move on cube
                cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
                path.push (move);
            }
            // Try to solve from this state
            result = this.solveYellowFace_ (cube, path, moveSet.length == 1 ? moveSet[0] : 0, limit);
            if (result != null) return result;
            // MoveSet did not work so
            // Undo moveSet (by doing the reverse moves in reverse order)
            for (let i = moveSet.length-1; i >= 0; --i)
            {
                let move = moveSet[i];
                let axisMove = cubeMoveNotation.toAxisNotation (move);
                // Do the reverse move to undo (-direction)
                cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
                path.pop ();
            }
        }

        // no solution found
        return null;
    }

    // =======================================================================

    isLastLayerSolved (cube) {
        if (cube.data[cube.FRONT    ] != BLUE) return false;
        if (cube.data[cube.FRONT + 1] != BLUE) return false;
        if (cube.data[cube.LEFT    ] != ORANGE) return false;
        if (cube.data[cube.LEFT + 1] != ORANGE) return false;
        if (cube.data[cube.RIGHT    ] != RED) return false;
        if (cube.data[cube.RIGHT + 1] != RED) return false;
        if (cube.data[cube.BACK    ] != GREEN) return false;
        if (cube.data[cube.BACK + 1] != GREEN) return false;
        return true;
    }

    // =======================================================================

    solveLastLayer (cube)
    {
        console.time ("solveLastLayer");
        let solution = null;
        for (var i = 1; i < this.MAX_PERMUTATE_LAST_LAYER_MOVES; ++i)
        {
            solution = this.solveLastLayer_ (cube, [], 0, i);
            if (solution != null)
            {
                console.log ("solveLastLayer", solution);
                break;
            }
        }
        console.timeEnd ("solveLastLayer");
        return solution;
    }

    // =======================================================================

    solveLastLayer_ (cube, path, prevMove, limit) {
        // solution found
        if (this.isLastLayerSolved(cube)) {
            return path;
        }

        // Ensure we aren't going to exceed the max number of moves
        if (path.length >= limit)
            return null;

        // path not found
        // keep searching
        let result;
        let moveSetsToTry = [
            // J-perm algorithm
            [
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_F, -1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
            ],
            [
                cubeNotationMove (MOVE_U,  1)
            ],
            [
                cubeNotationMove (MOVE_U, -1),
            ]
        ];
        for (let moveSet of moveSetsToTry)
        {
            // Ensure this move isnt the reverse of the previous move
            // since that would undo progress - only applies to moveSets
            // with a single move
            if (moveSet.length == 1 && prevMove == cubeMoveNotation.getReverseMove (moveSet[0]))
                // skip trying move
                continue;
            // Apply moveSet to cube
            for (let move of moveSet)
            {
                let axisMove = cubeMoveNotation.toAxisNotation (move);
                // Perform move on cube
                cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
                path.push (move);
            }
            // Try to solve from this state
            result = this.solveLastLayer_ (cube, path, moveSet.length == 1 ? moveSet[0] : 0, limit);
            if (result != null) return result;
            // MoveSet did not work so
            // Undo moveSet (by doing the reverse moves in reverse order)
            for (let i = moveSet.length-1; i >= 0; --i)
            {
                let move = moveSet[i];
                let axisMove = cubeMoveNotation.toAxisNotation (move);
                // Do the reverse move to undo (-direction)
                cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
                path.pop ();
            }
        }

        // no solution found
        return null;
    }

    // =======================================================================

}


// =======================================================================