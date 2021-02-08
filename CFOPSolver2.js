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
        if (prevMove != MOVE_LPRIME) {
            cube.l();
            path.push(MOVE_L);
            result = this.solveFirstLayer(cube, path, MOVE_L, limit);
            if (result != null) return result;
            cube.lPrime();
            path.pop();
        }
        // left prime
        if (prevMove != MOVE_L) {
            cube.lPrime();
            path.push(MOVE_LPRIME);
            result = this.solveFirstLayer(cube, path, MOVE_LPRIME, limit);
            if (result != null) return result;
            cube.l();
            path.pop();
        }
        // front
        if (prevMove != MOVE_FPRIME) {
            cube.f();
            path.push(MOVE_F);
            result = this.solveFirstLayer(cube, path, MOVE_F, limit);
            if (result != null) return result;
            cube.fPrime();
            path.pop();
        }
        // front prime
        if (prevMove != MOVE_F) {
            cube.fPrime();
            path.push(MOVE_FPRIME);
            result = this.solveFirstLayer(cube, path, MOVE_FPRIME, limit);
            if (result != null) return result;
            cube.f();
            path.pop();
        }
        // right 
        if (prevMove != MOVE_RPRIME) {
            cube.r();
            path.push(MOVE_R);
            result = this.solveFirstLayer(cube, path, MOVE_R, limit);
            if (result != null) return result;
            cube.rPrime();
            path.pop();
        }
        // right prime
        if (prevMove != MOVE_R) {
            cube.rPrime();
            path.push(MOVE_RPRIME);
            result = this.solveFirstLayer(cube, path, MOVE_RPRIME, limit);
            if (result != null) return result;
            cube.r();
            path.pop();
        }
        // back 
        if (prevMove != MOVE_BPRIME) {
            cube.b();
            path.push(MOVE_B);
            result = this.solveFirstLayer(cube, path, MOVE_B, limit);
            if (result != null) return result;
            cube.bPrime();
            path.pop();
        }
        // back prime
        if (prevMove != MOVE_B) {
            cube.bPrime();
            path.push(MOVE_BPRIME);
            result = this.solveFirstLayer(cube, path, MOVE_BPRIME, limit);
            if (result != null) return result;
            path.pop();
            cube.b();
        }
        // up 
        if (prevMove != MOVE_UPRIME) {
            cube.u();
            path.push(MOVE_U);
            result = this.solveFirstLayer(cube, path, MOVE_U, limit);
            if (result != null) return result;
            cube.uPrime();
            path.pop();
        }
        // up prime
        if (prevMove != MOVE_U) {
            cube.uPrime();
            path.push(MOVE_UPRIME);
            result = this.solveFirstLayer(cube, path, MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.u();
            path.pop();
        }
        // down 
        if (prevMove != MOVE_DPRIME) {
            cube.d();
            path.push(MOVE_D);
            result = this.solveFirstLayer(cube, path, MOVE_D, limit);
            if (result != null) return result;
            cube.dPrime();
            path.pop();
        }
        // down prime
        if (prevMove != MOVE_D) {
            cube.dPrime();
            path.push(MOVE_DPRIME);
            result = this.solveFirstLayer(cube, path, MOVE_DPRIME, limit);
            if (result != null) return result;
            cube.d();
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
            cube.r();
            path.push(MOVE_R);
            cube.u();
            path.push(MOVE_U);
            cube.rPrime();
            path.push(MOVE_RPRIME);
            cube.u();
            path.push(MOVE_U);
            cube.r();
            path.push(MOVE_R);
            cube.u();
            path.push(MOVE_U);
            cube.u();
            path.push(MOVE_U);
            cube.rPrime();
            path.push(MOVE_RPRIME);
            result = this.solveYellowFace(cube, path, -2, limit);
            if (result != null) return result;
            cube.r();
            path.pop();
            cube.uPrime();
            path.pop();
            cube.uPrime();
            path.pop();
            cube.rPrime();
            path.pop();
            cube.uPrime();
            path.pop();
            cube.r();
            path.pop();
            cube.uPrime();
            path.pop();
            cube.rPrime();
            path.pop();
        }
        // up 
        if (prevMove != MOVE_UPRIME) {
            cube.u();
            path.push(MOVE_U);
            result = this.solveYellowFace(cube, path, MOVE_U, limit);
            if (result != null) return result;
            cube.uPrime();
            path.pop();
        }
        // up prime
        if (prevMove != MOVE_U) {
            cube.uPrime();
            path.push(MOVE_UPRIME);
            result = this.solveYellowFace(cube, path, MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.u();
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
            cube.r();
            path.push(MOVE_R);
            cube.u();
            path.push(MOVE_U);
            cube.rPrime();
            path.push(MOVE_RPRIME);
            cube.fPrime();
            path.push(MOVE_FPRIME);
            cube.r();
            path.push(MOVE_R);
            cube.u();
            path.push(MOVE_U);
            cube.rPrime();
            path.push(MOVE_RPRIME);
            cube.uPrime();
            path.push(MOVE_UPRIME);
            cube.rPrime();
            path.push(MOVE_RPRIME);
            cube.f();
            path.push(MOVE_F);
            cube.r();
            path.push(MOVE_R);
            cube.r();
            path.push(MOVE_R);
            cube.uPrime();
            path.push(MOVE_UPRIME);
            cube.rPrime();
            path.push(MOVE_RPRIME);
            cube.uPrime();
            path.push(MOVE_UPRIME);
            result = this.solveLastLayer(cube, path, -2, limit);
            if (result != null) return result;
            //undo alg
            cube.u();
            path.pop();
            cube.r();
            path.pop();
            cube.u();
            path.pop();
            cube.r();
            path.pop();
            cube.r();
            path.pop();
            cube.fPrime();
            path.pop();
            cube.r();
            path.pop();
            cube.u();
            path.pop();
            cube.r();
            path.pop();
            cube.uPrime();
            path.pop();
            cube.rPrime();
            path.pop();
            cube.f();
            path.pop();
            cube.r();
            path.pop();
            cube.uPrime();
            path.pop();
            cube.rPrime();
            path.pop();
        }

        // up 
        if (prevMove != MOVE_UPRIME) {
            cube.u();
            path.push(MOVE_U);
            result = this.solveLastLayer(cube, path, MOVE_U, limit);
            if (result != null) return result;
            cube.uPrime();
            path.pop();
        }
        // up prime
        if (prevMove != MOVE_U) {
            cube.uPrime();
            path.push(MOVE_UPRIME);
            result = this.solveLastLayer(cube, path, MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.u();
            path.pop();
        }

        // no solution found
        return null;
    }

    // =======================================================================

}


// =======================================================================