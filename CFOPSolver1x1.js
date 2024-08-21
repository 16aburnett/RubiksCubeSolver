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
            let temp = this.findSolutionToOrientTheCube (cube, [], -1, i);
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

        // num moves exceeded
        if (path.length > limit) {
            return null;
        }

        // path not found
        // keep searching
        let result;
        // X rotation
        if (prevMove != MOVE_1X1_XPRIME) {
            let move = MOVE_1X1_X;
            let axisMove = moveToAxisRotation1x1 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.findSolutionToOrientTheCube (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // X prime rotation
        if (prevMove != MOVE_1X1_X) {
            let move = MOVE_1X1_XPRIME;
            let axisMove = moveToAxisRotation1x1 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.findSolutionToOrientTheCube (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // Y rotation
        if (prevMove != MOVE_1X1_YPRIME) {
            let move = MOVE_1X1_Y;
            let axisMove = moveToAxisRotation1x1 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.findSolutionToOrientTheCube (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // Y prime rotation
        if (prevMove != MOVE_1X1_Y) {
            let move = MOVE_1X1_YPRIME;
            let axisMove = moveToAxisRotation1x1 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.findSolutionToOrientTheCube (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // Z rotation
        if (prevMove != MOVE_1X1_ZPRIME) {
            let move = MOVE_1X1_Z;
            let axisMove = moveToAxisRotation1x1 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.findSolutionToOrientTheCube (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // Z rotation
        if (prevMove != MOVE_1X1_Z) {
            let move = MOVE_1X1_ZPRIME;
            let axisMove = moveToAxisRotation1x1 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.findSolutionToOrientTheCube (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }

        // no solution found
        return null;
    }

    // =======================================================================

}


// =======================================================================