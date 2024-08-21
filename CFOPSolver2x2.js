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
        for (var i = 1; i < this.MAX_WHITE_FACE_MOVES; ++i) {
            let temp = this.solveFirstLayer (cube, [], -1, i);
            if (temp != null) {
                solution = solution.concat (temp);
                console.log ("solveFirstLayer");
                console.log (temp);
                break;
            }
        }
        // solve yellow face
        for (var i = 1; i < this.MAX_YELLOW_FACE_MOVES; ++i) {
            let temp = this.solveYellowFace (cube, [], -1, i);
            if (temp != null) {
                solution = solution.concat (temp);
                break;
            }
        }
        // permutate last layer
        for (var i = 1; i < this.MAX_PERMUTATE_LAST_LAYER_MOVES; ++i) {
            let temp = this.solveLastLayer (cube, [], -1, i);
            if (temp != null) {
                solution = solution.concat (temp);
                break;
            }
        }

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

    solveFirstLayer(cube, path, prevMove, limit)
    {
        // solution found
        if (this.isFirstLayerSolved (cube))
        {
            return path;
        }

        // num moves exceeded
        if (path.length > limit) {
            return null;
        }

        // path not found
        // keep searching
        let result;
        
        // left
        if (prevMove != MOVE_2X2_LPRIME) {
            let move = MOVE_2X2_L;
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.solveFirstLayer (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // left prime
        if (prevMove != MOVE_2X2_L) {
            let move = MOVE_2X2_LPRIME;
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.solveFirstLayer (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // front
        if (prevMove != MOVE_2X2_FPRIME) {
            let move = MOVE_2X2_F;
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.solveFirstLayer (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // front prime
        if (prevMove != MOVE_2X2_F) {
            let move = MOVE_2X2_FPRIME;
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.solveFirstLayer (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // right 
        if (prevMove != MOVE_2X2_RPRIME) {
            let move = MOVE_2X2_R;
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.solveFirstLayer (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // right prime
        if (prevMove != MOVE_2X2_R) {
            let move = MOVE_2X2_RPRIME;
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.solveFirstLayer (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // back 
        if (prevMove != MOVE_2X2_BPRIME) {
            let move = MOVE_2X2_B;
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.solveFirstLayer (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // back prime
        if (prevMove != MOVE_2X2_B) {
            let move = MOVE_2X2_BPRIME;
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.solveFirstLayer (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // up 
        if (prevMove != MOVE_2X2_UPRIME) {
            let move = MOVE_2X2_U;
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.solveFirstLayer (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // up prime
        if (prevMove != MOVE_2X2_U) {
            let move = MOVE_2X2_UPRIME;
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.solveFirstLayer (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // down 
        if (prevMove != MOVE_2X2_DPRIME) {
            let move = MOVE_2X2_D;
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.solveFirstLayer (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // down prime
        if (prevMove != MOVE_2X2_D) {
            let move = MOVE_2X2_DPRIME;
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.solveFirstLayer (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
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

    solveYellowFace (cube, path, prevMove, limit) {
        // solution found
        if (this.isYellowFaceSolved(cube)) {
            return path;
        }

        // num moves exceeded
        if (path.length > limit) {
            return null;
        }

        // path not found
        // keep searching
        let result;
        // Fishy alg
        let algorithm = [MOVE_2X2_R, MOVE_2X2_U, MOVE_2X2_RPRIME, MOVE_2X2_U, MOVE_2X2_R, MOVE_2X2_U, MOVE_2X2_U, MOVE_2X2_RPRIME];
        let algorithmReversed = [MOVE_2X2_R, MOVE_2X2_UPRIME, MOVE_2X2_UPRIME, MOVE_2X2_RPRIME, MOVE_2X2_UPRIME, MOVE_2X2_R, MOVE_2X2_UPRIME, MOVE_2X2_RPRIME];
        for (let move of algorithm)
        {
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push (move);
        }
        result = this.solveYellowFace (cube, path, -1, limit);
        if (result != null) return result;
        //undo alg
        for (let move of algorithmReversed)
        {
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.pop ();
        }

        // up 
        if (prevMove != MOVE_2X2_UPRIME) {
            let move = MOVE_2X2_U;
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.solveYellowFace (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // up prime
        if (prevMove != MOVE_2X2_U) {
            let move = MOVE_2X2_UPRIME;
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.solveYellowFace (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
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

    solveLastLayer(cube, path, prevMove, limit) {
        // solution found
        if (this.isLastLayerSolved(cube)) {
            return path;
        }

        // num moves exceeded
        if (path.length > limit) {
            return null;
        }

        // path not found
        // keep searching
        let result;
        // J perm algorithm
        let algorithm = [
            MOVE_2X2_R,
            MOVE_2X2_U,
            MOVE_2X2_RPRIME,
            MOVE_2X2_FPRIME,
            MOVE_2X2_R,
            MOVE_2X2_U,
            MOVE_2X2_RPRIME,
            MOVE_2X2_UPRIME,
            MOVE_2X2_RPRIME,
            MOVE_2X2_F,
            MOVE_2X2_R,
            MOVE_2X2_R,
            MOVE_2X2_UPRIME,
            MOVE_2X2_RPRIME,
            MOVE_2X2_UPRIME
        ];
        let algorithmReversed = [
            MOVE_2X2_U,
            MOVE_2X2_R,
            MOVE_2X2_U,
            MOVE_2X2_RPRIME,
            MOVE_2X2_RPRIME,
            MOVE_2X2_FPRIME,
            MOVE_2X2_R,
            MOVE_2X2_U,
            MOVE_2X2_R,
            MOVE_2X2_UPRIME,
            MOVE_2X2_RPRIME,
            MOVE_2X2_F,
            MOVE_2X2_R,
            MOVE_2X2_UPRIME,
            MOVE_2X2_RPRIME,
        ];
        for (let move of algorithm)
        {
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push (move);
        }
        result = this.solveLastLayer (cube, path, -1, limit);
        if (result != null) return result;
        //undo alg
        for (let move of algorithmReversed)
        {
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.pop ();
        }

        // up 
        if (prevMove != MOVE_2X2_UPRIME) {
            let move = MOVE_2X2_U;
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.solveLastLayer (cube, path, move, limit);
            if (result != null) return result;
            path.pop();
            // undo move by reversing direction
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // up prime
        if (prevMove != MOVE_2X2_U) {
            let move = MOVE_2X2_UPRIME;
            let axisMove = moveToAxisRotation2x2 (move);
            // Perform move on cube
            cube.rotate (axisMove[0], axisMove[1], axisMove[2]);
            path.push(move);
            result = this.solveLastLayer (cube, path, move, limit);
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