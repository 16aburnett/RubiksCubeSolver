// Rubiks Cube Solver: CFOP for 1x1
// By Amy Burnett
// August 18 2024
// =======================================================================
// Globals/constants

// =======================================================================

class CFOPSolver1x1
{

    constructor ()
    {
        this.MAX_CUBE_ORIENTATION_MOVES = 4;
    }

    // =======================================================================

    // returns a list of moves to solve the cube from the current state
    // this can fluctuate in time between instant and a few seconds
    findSolution (cube)
    {
        let solution = [];
        // orient the cube so white is down and blue is front
        console.time ("findSolutionToOrientTheCube");
        for (var i = 1; i < this.MAX_CUBE_ORIENTATION_MOVES; ++i) {
            let temp = this.findSolutionToOrientTheCube (cube, [], 0, i);
            if (temp != null) {
                console.log ("findSolutionToOrientTheCube", temp);
                solution = solution.concat (temp);
                break;
            }
        }
        console.timeEnd ("findSolutionToOrientTheCube");
        return solution;
    }

    // =======================================================================

    isCentersSolved (cube) {
        if (cube.data[cube.FRONT] != BLUE  ) return false;
        if (cube.data[cube.BACK ] != GREEN ) return false;
        if (cube.data[cube.LEFT ] != ORANGE) return false;
        if (cube.data[cube.RIGHT] != RED   ) return false;
        if (cube.data[cube.UP   ] != YELLOW) return false;
        if (cube.data[cube.DOWN ] != WHITE ) return false;
        return true;
    }

    // =======================================================================

    findSolutionToOrientTheCube (cube, path, prevMove, limit) {
        // solution found
        if (this.isCentersSolved (cube)) {
            return path;
        }

        // Ensure we aren't going to exceed the max number of moves
        if (path.length >= limit)
            return null;

        // path not found
        // keep searching
        let result;
        let movesToTry = [
            
            cubeNotationMove (MOVE_X,  1),
            cubeNotationMove (MOVE_X, -1),
            cubeNotationMove (MOVE_Y,  1),
            cubeNotationMove (MOVE_Y, -1),
            cubeNotationMove (MOVE_Z,  1),
            cubeNotationMove (MOVE_Z, -1),
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
            result = this.findSolutionToOrientTheCube (cube, path, move, limit);
            if (result != null) return result;
            path.pop ();
            // undo move by reversing direction
            cube.rotate (axisNotationMove[0], axisNotationMove[1], -axisNotationMove[2]);
        }

        // no solution found
        return null;
    }

    // =======================================================================

}


// =======================================================================