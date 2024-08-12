/*
    Rubiks Cube Solver 2 with CFOP-like algorithm
    By Amy Burnett
    February 7 2020
*/

// =======================================================================
// Globals/constants


// =======================================================================
// goal state checks 


// =======================================================================

class CFOPSolver2 {

    constructor() {
        this.maxWhiteFaceMoves = 10;
        this.maxYellowFaceMoves  = 30;
        // enough for 2 jperms 
        this.maxPermutateLastLayerMoves = 32;
    }

    // =======================================================================

    // returns a list of moves to solve the cube from the current state
    // this can fluctuate in time between instant and a few seconds
    findSolution(cube) {
        let solution = [];
        // solve first layer
        for (var i = 1; i < this.maxWhiteFaceMoves; ++i) {
            let temp = this.solveFirstLayer(cube, [], -1, i);
            if (temp != null) {
                solution = solution.concat(temp);
                break;
            }
        }
        // solve yellow face
        for (var i = 1; i < this.maxYellowFaceMoves; ++i) {
            let temp = this.solveYellowFace(cube, [], -1, i);
            if (temp != null) {
                solution = solution.concat(temp);
                break;
            }
        }
        // permutate last layer
        for (var i = 1; i < this.maxPermutateLastLayerMoves; ++i) {
            let temp = this.solveLastLayer(cube, [], -1, i);
            if (temp != null) {
                solution = solution.concat(temp);
                break;
            }
        }

        return solution;
    }

    // =======================================================================

    isFirstLayerSolved (cube) {
        if (cube.data[cube.DOWN    ] != WHITE) return false;
        if (cube.data[cube.DOWN + 1] != WHITE) return false;
        if (cube.data[cube.DOWN + 2] != WHITE) return false;
        if (cube.data[cube.DOWN + 2] != WHITE) return false;
        if (cube.data[cube.FRONT + 2] != BLUE) return false;
        if (cube.data[cube.FRONT + 3] != BLUE) return false;
        if (cube.data[cube.LEFT + 2] != ORANGE) return false;
        if (cube.data[cube.LEFT + 3] != ORANGE) return false;
        if (cube.data[cube.BACK + 2] != GREEN) return false;
        if (cube.data[cube.BACK + 3] != GREEN) return false;
        if (cube.data[cube.RIGHT + 2] != RED) return false;
        if (cube.data[cube.RIGHT + 3] != RED) return false;
        return true;
    }

    solveFirstLayer(cube, path, prevMove, limit) {
        // solution found
        if (this.isFirstLayerSolved(cube)) {
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
        if (prevMove != cube.MOVE_LPRIME) {
            cube.L();
            path.push(cube.MOVE_L);
            result = this.solveFirstLayer(cube, path, cube.MOVE_L, limit);
            if (result != null) return result;
            cube.LPrime();
            path.pop();
        }
        // left prime
        if (prevMove != cube.MOVE_L) {
            cube.LPrime();
            path.push(cube.MOVE_LPRIME);
            result = this.solveFirstLayer(cube, path, cube.MOVE_LPRIME, limit);
            if (result != null) return result;
            cube.L();
            path.pop();
        }
        // front
        if (prevMove != cube.MOVE_FPRIME) {
            cube.F();
            path.push(cube.MOVE_F);
            result = this.solveFirstLayer(cube, path, cube.MOVE_F, limit);
            if (result != null) return result;
            cube.FPrime();
            path.pop();
        }
        // front prime
        if (prevMove != cube.MOVE_F) {
            cube.FPrime();
            path.push(cube.MOVE_FPRIME);
            result = this.solveFirstLayer(cube, path, cube.MOVE_FPRIME, limit);
            if (result != null) return result;
            cube.F();
            path.pop();
        }
        // right 
        if (prevMove != cube.MOVE_RPRIME) {
            cube.R();
            path.push(cube.MOVE_R);
            result = this.solveFirstLayer(cube, path, cube.MOVE_R, limit);
            if (result != null) return result;
            cube.RPrime();
            path.pop();
        }
        // right prime
        if (prevMove != cube.MOVE_R) {
            cube.RPrime();
            path.push(cube.MOVE_RPRIME);
            result = this.solveFirstLayer(cube, path, cube.MOVE_RPRIME, limit);
            if (result != null) return result;
            cube.R();
            path.pop();
        }
        // back 
        if (prevMove != cube.MOVE_BPRIME) {
            cube.B();
            path.push(cube.MOVE_B);
            result = this.solveFirstLayer(cube, path, cube.MOVE_B, limit);
            if (result != null) return result;
            cube.BPrime();
            path.pop();
        }
        // back prime
        if (prevMove != cube.MOVE_B) {
            cube.BPrime();
            path.push(cube.MOVE_BPRIME);
            result = this.solveFirstLayer(cube, path, cube.MOVE_BPRIME, limit);
            if (result != null) return result;
            path.pop();
            cube.B();
        }
        // up 
        if (prevMove != cube.MOVE_UPRIME) {
            cube.U();
            path.push(cube.MOVE_U);
            result = this.solveFirstLayer(cube, path, cube.MOVE_U, limit);
            if (result != null) return result;
            cube.UPrime();
            path.pop();
        }
        // up prime
        if (prevMove != cube.MOVE_U) {
            cube.UPrime();
            path.push(cube.MOVE_UPRIME);
            result = this.solveFirstLayer(cube, path, cube.MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.U();
            path.pop();
        }
        // down 
        if (prevMove != cube.MOVE_DPRIME) {
            cube.D();
            path.push(cube.MOVE_D);
            result = this.solveFirstLayer(cube, path, cube.MOVE_D, limit);
            if (result != null) return result;
            cube.DPrime();
            path.pop();
        }
        // down prime
        if (prevMove != cube.MOVE_D) {
            cube.DPrime();
            path.push(cube.MOVE_DPRIME);
            result = this.solveFirstLayer(cube, path, cube.MOVE_DPRIME, limit);
            if (result != null) return result;
            cube.D();
            path.pop();
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

    solveYellowFace(cube, path, prevMove, limit) {
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
        // fishy move 
        if (prevMove != -2) {
            cube.R();
            path.push(cube.MOVE_R);
            cube.U();
            path.push(cube.MOVE_U);
            cube.RPrime();
            path.push(cube.MOVE_RPRIME);
            cube.U();
            path.push(cube.MOVE_U);
            cube.R();
            path.push(cube.MOVE_R);
            cube.U();
            path.push(cube.MOVE_U);
            cube.U();
            path.push(cube.MOVE_U);
            cube.RPrime();
            path.push(cube.MOVE_RPRIME);
            result = this.solveYellowFace(cube, path, -2, limit);
            if (result != null) return result;
            cube.R();
            path.pop();
            cube.UPrime();
            path.pop();
            cube.UPrime();
            path.pop();
            cube.RPrime();
            path.pop();
            cube.UPrime();
            path.pop();
            cube.R();
            path.pop();
            cube.UPrime();
            path.pop();
            cube.RPrime();
            path.pop();
        }
        // up 
        if (prevMove != cube.MOVE_UPRIME) {
            cube.U();
            path.push(cube.MOVE_U);
            result = this.solveYellowFace(cube, path, cube.MOVE_U, limit);
            if (result != null) return result;
            cube.UPrime();
            path.pop();
        }
        // up prime
        if (prevMove != cube.MOVE_U) {
            cube.UPrime();
            path.push(cube.MOVE_UPRIME);
            result = this.solveYellowFace(cube, path, cube.MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.U();
            path.pop();
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
        // ensure last move wasnt a jperm
        if (prevMove != -2) {
            // J perm
            cube.R();
            path.push(cube.MOVE_R);
            cube.U();
            path.push(cube.MOVE_U);
            cube.RPrime();
            path.push(cube.MOVE_RPRIME);
            cube.FPrime();
            path.push(cube.MOVE_FPRIME);
            cube.R();
            path.push(cube.MOVE_R);
            cube.U();
            path.push(cube.MOVE_U);
            cube.RPrime();
            path.push(cube.MOVE_RPRIME);
            cube.UPrime();
            path.push(cube.MOVE_UPRIME);
            cube.RPrime();
            path.push(cube.MOVE_RPRIME);
            cube.F();
            path.push(cube.MOVE_F);
            cube.R();
            path.push(cube.MOVE_R);
            cube.R();
            path.push(cube.MOVE_R);
            cube.UPrime();
            path.push(cube.MOVE_UPRIME);
            cube.RPrime();
            path.push(cube.MOVE_RPRIME);
            cube.UPrime();
            path.push(cube.MOVE_UPRIME);
            result = this.solveLastLayer(cube, path, -2, limit);
            if (result != null) return result;
            //undo alg
            cube.U();
            path.pop();
            cube.R();
            path.pop();
            cube.U();
            path.pop();
            cube.R();
            path.pop();
            cube.R();
            path.pop();
            cube.FPrime();
            path.pop();
            cube.R();
            path.pop();
            cube.U();
            path.pop();
            cube.R();
            path.pop();
            cube.UPrime();
            path.pop();
            cube.RPrime();
            path.pop();
            cube.F();
            path.pop();
            cube.R();
            path.pop();
            cube.UPrime();
            path.pop();
            cube.RPrime();
            path.pop();
        }

        // up 
        if (prevMove != cube.MOVE_UPRIME) {
            cube.U();
            path.push(cube.MOVE_U);
            result = this.solveLastLayer(cube, path, cube.MOVE_U, limit);
            if (result != null) return result;
            cube.UPrime();
            path.pop();
        }
        // up prime
        if (prevMove != cube.MOVE_U) {
            cube.UPrime();
            path.push(cube.MOVE_UPRIME);
            result = this.solveLastLayer(cube, path, cube.MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.U();
            path.pop();
        }

        // no solution found
        return null;
    }

    // =======================================================================

}


// =======================================================================