/*
    Rubiks Cube Solver
    By Amy Burnett
    January 2 2020
*/

// =======================================================================
// Globals/constants

// max number of moves
const MAX_CROSS_MOVES = 8;
const MAX_F2L_MOVES = 12;
const MAX_YELLOW_CROSS = 20;
const MAX_YELLOW_CORNERS = 40;
const MAX_YELLOW_EDGES = 40;

// =======================================================================
// goal state checks 

function isCrossSolved (cube) {
    if (cube.data[DOWN + 1] != WHITE) return false;
    if (cube.data[DOWN + 3] != WHITE) return false;
    if (cube.data[DOWN + 5] != WHITE) return false;
    if (cube.data[DOWN + 7] != WHITE) return false;
    if (cube.data[FRONT + 7] != BLUE) return false;
    if (cube.data[LEFT + 7] != ORANGE) return false;
    if (cube.data[BACK + 7] != GREEN) return false;
    if (cube.data[RIGHT + 7] != RED) return false;
    return true;
}
function isFirstF2LSolved(cube) {
    if (cube.data[DOWN + 0] != WHITE) return false;
    if (cube.data[FRONT + 6] != BLUE) return false;
    if (cube.data[FRONT + 3] != BLUE) return false;
    if (cube.data[LEFT + 8] != ORANGE) return false;
    if (cube.data[LEFT + 5] != ORANGE) return false;
    return true;
}
function isSecondF2LSolved(cube) {
    if (cube.data[DOWN + 2] != WHITE) return false;
    if (cube.data[FRONT + 5] != BLUE) return false;
    if (cube.data[FRONT + 8] != BLUE) return false;
    if (cube.data[RIGHT + 3] != RED) return false;
    if (cube.data[RIGHT + 6] != RED) return false;
    return true;
}
function isThirdF2LSolved(cube) {
    if (cube.data[DOWN + 8] != WHITE) return false;
    if (cube.data[BACK + 3] != GREEN) return false;
    if (cube.data[BACK + 6] != GREEN) return false;
    if (cube.data[RIGHT + 5] != RED) return false;
    if (cube.data[RIGHT + 8] != RED) return false;
    return true;
}
function isFourthF2LSolved(cube) {
    if (cube.data[DOWN + 6] != WHITE) return false;
    if (cube.data[LEFT + 3] != ORANGE) return false;
    if (cube.data[LEFT + 6] != ORANGE) return false;
    if (cube.data[BACK + 5] != GREEN) return false;
    if (cube.data[BACK + 8] != GREEN) return false;
    return true;
}

function isYellowCrossSolved(cube) {
    if (cube.data[UP + 1] != YELLOW) return false;
    if (cube.data[UP + 3] != YELLOW) return false;
    if (cube.data[UP + 5] != YELLOW) return false;
    if (cube.data[UP + 7] != YELLOW) return false;
    return true;
}

function isYellowCornersOrientated(cube) {
    if (cube.data[UP + 0] != YELLOW) return false;
    if (cube.data[UP + 2] != YELLOW) return false;
    if (cube.data[UP + 6] != YELLOW) return false;
    if (cube.data[UP + 8] != YELLOW) return false;
    return true;
}
function isYellowCornersSolved(cube) {
    if (cube.data[FRONT + 0] != BLUE) return false;
    if (cube.data[FRONT + 2] != BLUE) return false;
    if (cube.data[LEFT + 0] != ORANGE) return false;
    if (cube.data[LEFT + 2] != ORANGE) return false;
    if (cube.data[RIGHT + 0] != RED) return false;
    if (cube.data[RIGHT + 2] != RED) return false;
    if (cube.data[BACK + 0] != GREEN) return false;
    if (cube.data[BACK + 2] != GREEN) return false;
    return true;
}

function isYellowEdgesSolved(cube) {
    if (cube.data[FRONT + 1] != BLUE) return false;
    if (cube.data[LEFT + 1] != ORANGE) return false;
    if (cube.data[RIGHT + 1] != RED) return false;
    if (cube.data[BACK + 1] != GREEN) return false;
    return true;
}

// =======================================================================

class CFOPSolver3 {

    constructor() {
    }

    // =======================================================================

    // returns a list of moves to solve the cube from the current state
    // this can fluctuate in time between instant and a few seconds
    findSolution(cube) {
        let solution = [];
        // solve cross
        for (var i = 1; i < MAX_CROSS_MOVES; ++i) {
            let temp = this.findSolutionToCross(cube, [], -1, i);
            if (temp != null) {
                solution = solution.concat(temp);
                break;
            }
        }
        // solve f2l 
        for (var i = 1; i < MAX_F2L_MOVES; ++i) {
            let temp = this.solveFirstF2L(cube, [], -1, i);
            if (temp != null) {
                solution = solution.concat(temp);
                break;
            }
        }
        for (var i = 1; i < MAX_F2L_MOVES; ++i) {
            let temp = this.solveSecondF2L(cube, [], -1, i);
            if (temp != null) {
                solution = solution.concat(temp);
                break;
            }
        }
        for (var i = 1; i < MAX_F2L_MOVES; ++i) {
            let temp = this.solveThirdF2L(cube, [], -1, i);
            if (temp != null) {
                solution = solution.concat(temp);
                break;
            }
        }
        for (var i = 1; i < MAX_F2L_MOVES; ++i) {
            let temp = this.solveFourthF2L(cube, [], -1, i);
            if (temp != null) {
                solution = solution.concat(temp);
                break;
            }
        }
        // OLL: yellow cross
        for (var i = 1; i < MAX_YELLOW_CROSS; ++i) {
            let temp = this.solveYellowCross(cube, [], -1, i);
            if (temp != null) {
                solution = solution.concat(temp);
                break;
            }
        }
        // OLL: yellow face
        for (var i = 1; i < MAX_YELLOW_CORNERS; ++i) {
            let temp = this.solveYellowFace(cube, [], -1, i);
            if (temp != null) {
                solution = solution.concat(temp);
                break;
            }
        }
        // PLL: yellow corners
        for (var i = 1; i < MAX_YELLOW_CORNERS; ++i) {
            let temp = this.solveYellowCorners(cube, [], -1, i);
            if (temp != null) {
                solution = solution.concat(temp);
                break;
            }
        }
        // PLL: yellow edges
        for (var i = 1; i < MAX_YELLOW_EDGES; ++i) {
            let temp = this.solveYellowEdges(cube, [], -1, i);
            if (temp != null) {
                solution = solution.concat(temp);
                break;
            }
        }

        return solution;
    }

    // =======================================================================

    findSolutionToCross(cube, path, prevMove, limit) {
        // solution found
        if (isCrossSolved(cube)) {
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
            result = this.findSolutionToCross(cube, path, MOVE_L, limit);
            if (result != null) return result;
            cube.lPrime();
            path.pop();
        }
        // left prime
        if (prevMove != MOVE_L) {
            cube.lPrime();
            path.push(MOVE_LPRIME);
            result = this.findSolutionToCross(cube, path, MOVE_LPRIME, limit);
            if (result != null) return result;
            cube.l();
            path.pop();
        }
        // front
        if (prevMove != MOVE_FPRIME) {
            cube.f();
            path.push(MOVE_F);
            result = this.findSolutionToCross(cube, path, MOVE_F, limit);
            if (result != null) return result;
            cube.fPrime();
            path.pop();
        }
        // front prime
        if (prevMove != MOVE_F) {
            cube.fPrime();
            path.push(MOVE_FPRIME);
            result = this.findSolutionToCross(cube, path, MOVE_FPRIME, limit);
            if (result != null) return result;
            cube.f();
            path.pop();
        }
        // right 
        if (prevMove != MOVE_RPRIME) {
            cube.r();
            path.push(MOVE_R);
            result = this.findSolutionToCross(cube, path, MOVE_R, limit);
            if (result != null) return result;
            cube.rPrime();
            path.pop();
        }
        // right prime
        if (prevMove != MOVE_R) {
            cube.rPrime();
            path.push(MOVE_RPRIME);
            result = this.findSolutionToCross(cube, path, MOVE_RPRIME, limit);
            if (result != null) return result;
            cube.r();
            path.pop();
        }
        // back 
        if (prevMove != MOVE_BPRIME) {
            cube.b();
            path.push(MOVE_B);
            result = this.findSolutionToCross(cube, path, MOVE_B, limit);
            if (result != null) return result;
            cube.bPrime();
            path.pop();
        }
        // back prime
        if (prevMove != MOVE_B) {
            cube.bPrime();
            path.push(MOVE_BPRIME);
            result = this.findSolutionToCross(cube, path, MOVE_BPRIME, limit);
            if (result != null) return result;
            path.pop();
            cube.b();
        }
        // up 
        if (prevMove != MOVE_UPRIME) {
            cube.u();
            path.push(MOVE_U);
            result = this.findSolutionToCross(cube, path, MOVE_U, limit);
            if (result != null) return result;
            cube.uPrime();
            path.pop();
        }
        // up prime
        if (prevMove != MOVE_U) {
            cube.uPrime();
            path.push(MOVE_UPRIME);
            result = this.findSolutionToCross(cube, path, MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.u();
            path.pop();
        }
        // down 
        if (prevMove != MOVE_DPRIME) {
            cube.d();
            path.push(MOVE_D);
            result = this.findSolutionToCross(cube, path, MOVE_D, limit);
            if (result != null) return result;
            cube.dPrime();
            path.pop();
        }
        // down prime
        if (prevMove != MOVE_D) {
            cube.dPrime();
            path.push(MOVE_DPRIME);
            result = this.findSolutionToCross(cube, path, MOVE_DPRIME, limit);
            if (result != null) return result;
            cube.d();
            path.pop();
        }

        // no solution found
        return null;
    }

    // =======================================================================

    solveFirstF2L(cube, path, prevMove, limit) {
        // solution found
        if (isCrossSolved(cube) && isFirstF2LSolved(cube)) {
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
            result = this.solveFirstF2L(cube, path, MOVE_L, limit);
            if (result != null) return result;
            cube.lPrime();
            path.pop();
        }
        // left prime
        if (prevMove != MOVE_L) {
            cube.lPrime();
            path.push(MOVE_LPRIME);
            result = this.solveFirstF2L(cube, path, MOVE_LPRIME, limit);
            if (result != null) return result;
            cube.l();
            path.pop();
        }
        // front
        if (prevMove != MOVE_FPRIME) {
            cube.f();
            path.push(MOVE_F);
            result = this.solveFirstF2L(cube, path, MOVE_F, limit);
            if (result != null) return result;
            cube.fPrime();
            path.pop();
        }
        // front prime
        if (prevMove != MOVE_F) {
            cube.fPrime();
            path.push(MOVE_FPRIME);
            result = this.solveFirstF2L(cube, path, MOVE_FPRIME, limit);
            if (result != null) return result;
            cube.f();
            path.pop();
        }
        // right 
        if (prevMove != MOVE_RPRIME) {
            cube.r();
            path.push(MOVE_R);
            result = this.solveFirstF2L(cube, path, MOVE_R, limit);
            if (result != null) return result;
            cube.rPrime();
            path.pop();
        }
        // right prime
        if (prevMove != MOVE_R) {
            cube.rPrime();
            path.push(MOVE_RPRIME);
            result = this.solveFirstF2L(cube, path, MOVE_RPRIME, limit);
            if (result != null) return result;
            cube.r();
            path.pop();
        }
        // back 
        if (prevMove != MOVE_BPRIME) {
            cube.b();
            path.push(MOVE_B);
            result = this.solveFirstF2L(cube, path, MOVE_B, limit);
            if (result != null) return result;
            cube.bPrime();
            path.pop();
        }
        // back prime
        if (prevMove != MOVE_B) {
            cube.bPrime();
            path.push(MOVE_BPRIME);
            result = this.solveFirstF2L(cube, path, MOVE_BPRIME, limit);
            if (result != null) return result;
            path.pop();
            cube.b();
        }
        // up 
        if (prevMove != MOVE_UPRIME) {
            cube.u();
            path.push(MOVE_U);
            result = this.solveFirstF2L(cube, path, MOVE_U, limit);
            if (result != null) return result;
            cube.uPrime();
            path.pop();
        }
        // up prime
        if (prevMove != MOVE_U) {
            cube.uPrime();
            path.push(MOVE_UPRIME);
            result = this.solveFirstF2L(cube, path, MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.u();
            path.pop();
        }
        // down 
        if (prevMove != MOVE_DPRIME) {
            cube.d();
            path.push(MOVE_D);
            result = this.solveFirstF2L(cube, path, MOVE_D, limit);
            if (result != null) return result;
            cube.dPrime();
            path.pop();
        }
        // down prime
        if (prevMove != MOVE_D) {
            cube.dPrime();
            path.push(MOVE_DPRIME);
            result = this.solveFirstF2L(cube, path, MOVE_DPRIME, limit);
            if (result != null) return result;
            cube.d();
            path.pop();
        }

        // no solution found
        return null;
    }

    // =======================================================================

    solveSecondF2L(cube, path, prevMove, limit) {
        // solution found
        if (isCrossSolved(cube) 
            && isFirstF2LSolved(cube) 
            && isSecondF2LSolved(cube)) {
            return path;
        }

        // num moves exceeded
        if (path.length > limit) {
            return null;
        }

        // path not found
        // keep searching
        let result;
        // front
        if (prevMove != MOVE_FPRIME) {
            cube.f();
            path.push(MOVE_F);
            result = this.solveSecondF2L(cube, path, MOVE_F, limit);
            if (result != null) return result;
            cube.fPrime();
            path.pop();
        }
        // front prime
        if (prevMove != MOVE_F) {
            cube.fPrime();
            path.push(MOVE_FPRIME);
            result = this.solveSecondF2L(cube, path, MOVE_FPRIME, limit);
            if (result != null) return result;
            cube.f();
            path.pop();
        }
        // right 
        if (prevMove != MOVE_RPRIME) {
            cube.r();
            path.push(MOVE_R);
            result = this.solveSecondF2L(cube, path, MOVE_R, limit);
            if (result != null) return result;
            cube.rPrime();
            path.pop();
        }
        // right prime
        if (prevMove != MOVE_R) {
            cube.rPrime();
            path.push(MOVE_RPRIME);
            result = this.solveSecondF2L(cube, path, MOVE_RPRIME, limit);
            if (result != null) return result;
            cube.r();
            path.pop();
        }
        // back 
        if (prevMove != MOVE_BPRIME) {
            cube.b();
            path.push(MOVE_B);
            result = this.solveSecondF2L(cube, path, MOVE_B, limit);
            if (result != null) return result;
            cube.bPrime();
            path.pop();
        }
        // back prime
        if (prevMove != MOVE_B) {
            cube.bPrime();
            path.push(MOVE_BPRIME);
            result = this.solveSecondF2L(cube, path, MOVE_BPRIME, limit);
            if (result != null) return result;
            path.pop();
            cube.b();
        }
        // up 
        if (prevMove != MOVE_UPRIME) {
            cube.u();
            path.push(MOVE_U);
            result = this.solveSecondF2L(cube, path, MOVE_U, limit);
            if (result != null) return result;
            cube.uPrime();
            path.pop();
        }
        // up prime
        if (prevMove != MOVE_U) {
            cube.uPrime();
            path.push(MOVE_UPRIME);
            result = this.solveSecondF2L(cube, path, MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.u();
            path.pop();
        }

        // no solution found
        return null;
    }

    // =======================================================================

    solveThirdF2L(cube, path, prevMove, limit) {
        // solution found
        if (isCrossSolved(cube) 
            && isFirstF2LSolved(cube) 
            && isSecondF2LSolved(cube)
            && isThirdF2LSolved(cube)) {
            return path;
        }

        // num moves exceeded
        if (path.length > limit) {
            return null;
        }

        // path not found
        // keep searching
        let result;
        // front
        if (prevMove != MOVE_FPRIME) {
            cube.f();
            path.push(MOVE_F);
            result = this.solveThirdF2L(cube, path, MOVE_F, limit);
            if (result != null) return result;
            cube.fPrime();
            path.pop();
        }
        // front prime
        if (prevMove != MOVE_F) {
            cube.fPrime();
            path.push(MOVE_FPRIME);
            result = this.solveThirdF2L(cube, path, MOVE_FPRIME, limit);
            if (result != null) return result;
            cube.f();
            path.pop();
        }
        // right 
        if (prevMove != MOVE_RPRIME) {
            cube.r();
            path.push(MOVE_R);
            result = this.solveThirdF2L(cube, path, MOVE_R, limit);
            if (result != null) return result;
            cube.rPrime();
            path.pop();
        }
        // right prime
        if (prevMove != MOVE_R) {
            cube.rPrime();
            path.push(MOVE_RPRIME);
            result = this.solveThirdF2L(cube, path, MOVE_RPRIME, limit);
            if (result != null) return result;
            cube.r();
            path.pop();
        }
        // back 
        if (prevMove != MOVE_BPRIME) {
            cube.b();
            path.push(MOVE_B);
            result = this.solveThirdF2L(cube, path, MOVE_B, limit);
            if (result != null) return result;
            cube.bPrime();
            path.pop();
        }
        // back prime
        if (prevMove != MOVE_B) {
            cube.bPrime();
            path.push(MOVE_BPRIME);
            result = this.solveThirdF2L(cube, path, MOVE_BPRIME, limit);
            if (result != null) return result;
            path.pop();
            cube.b();
        }
        // up 
        if (prevMove != MOVE_UPRIME) {
            cube.u();
            path.push(MOVE_U);
            result = this.solveThirdF2L(cube, path, MOVE_U, limit);
            if (result != null) return result;
            cube.uPrime();
            path.pop();
        }
        // up prime
        if (prevMove != MOVE_U) {
            cube.uPrime();
            path.push(MOVE_UPRIME);
            result = this.solveThirdF2L(cube, path, MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.u();
            path.pop();
        }

        // no solution found
        return null;
    }

    // =======================================================================

    solveFourthF2L(cube, path, prevMove, limit) {
        // solution found
        if (isCrossSolved(cube) 
            && isFirstF2LSolved(cube) 
            && isSecondF2LSolved(cube)
            && isThirdF2LSolved(cube)
            && isFourthF2LSolved(cube)) {
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
        if (prevMove != MOVE_L && prevMove != MOVE_LPRIME) {
            cube.l();
            path.push(MOVE_L);
            result = this.solveFourthF2L(cube, path, MOVE_L, limit);
            if (result != null) return result;
            cube.lPrime();
            path.pop();
            // left prime
            cube.lPrime();
            path.push(MOVE_LPRIME);
            result = this.solveFourthF2L(cube, path, MOVE_LPRIME, limit);
            if (result != null) return result;
            cube.l();
            path.pop();
        }
        // back 
        if (prevMove != MOVE_B && prevMove != MOVE_BPRIME) {
            cube.b();
            path.push(MOVE_B);
            result = this.solveFourthF2L(cube, path,MOVE_B, limit);
            if (result != null) return result;
            cube.bPrime();
            path.pop();
            // back prime
            cube.bPrime();
            path.push(MOVE_BPRIME);
            result = this.solveFourthF2L(cube, path,MOVE_BPRIME, limit);
            if (result != null) return result;
            path.pop();
            cube.b();
        }
        // up 
        if (prevMove != MOVE_U && prevMove != MOVE_UPRIME) {
            cube.u();
            path.push(MOVE_U);
            result = this.solveFourthF2L(cube, path, MOVE_U, limit);
            if (result != null) return result;
            cube.uPrime();
            path.pop();
            // up prime
            cube.uPrime();
            path.push(MOVE_UPRIME);
            result = this.solveFourthF2L(cube, path, MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.u();
            path.pop();
        }

        // no solution found
        return null;
    }

    // =======================================================================

    solveYellowCross(cube, path, prevMove, limit) {
        // solution found
        if (isYellowCrossSolved(cube)) {
            return path;
        }

        // num moves exceeded
        if (path.length > limit) {
            return null;
        }

        // path not found
        // keep searching
        let result;
        // up 
        if (prevMove != MOVE_U && prevMove != MOVE_UPRIME) {
            cube.u();
            path.push(MOVE_U);
            result = this.solveYellowCross(cube, path, MOVE_U, limit);
            if (result != null) return result;
            cube.uPrime();
            path.pop();
        }
        // up prime
        if (prevMove != MOVE_U && prevMove != MOVE_UPRIME) {
            cube.uPrime();
            path.push(MOVE_UPRIME);
            result = this.solveYellowCross(cube, path, MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.u();
            path.pop();
        }
        // Yellow Cross alg
        cube.f();
        path.push(MOVE_F);
        cube.r();
        path.push(MOVE_R);
        cube.u();
        path.push(MOVE_U);
        cube.rPrime();
        path.push(MOVE_RPRIME);
        cube.uPrime();
        path.push(MOVE_UPRIME);
        cube.fPrime();
        path.push(MOVE_FPRIME);
        result = this.solveYellowCross(cube, path, -1, limit);
        if (result != null) return result;
        //undo alg
        cube.f();
        path.pop();
        cube.u();
        path.pop();
        cube.r();
        path.pop();
        cube.uPrime();
        path.pop();
        cube.rPrime();
        path.pop();
        cube.fPrime();
        path.pop();

        // no solution found
        return null;
    }

    // =======================================================================

    solveYellowFace(cube, path, prevMove, limit) {
        // solution found
        if (isYellowCornersOrientated(cube)) {
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
        result = this.solveYellowFace(cube, path, -1, limit);
        if (result != null) return result;
        //undo alg
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

        // up 
        if (prevMove != MOVE_U && prevMove != MOVE_UPRIME) {
            cube.u();
            path.push(MOVE_U);
            result = this.solveYellowFace(cube, path, MOVE_U, limit);
            if (result != null) return result;
            cube.uPrime();
            path.pop();
        }
        // up prime
        if (prevMove != MOVE_U && prevMove != MOVE_UPRIME) {
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

    solveYellowCorners(cube, path, prevMove, limit) {
        // solution found
        if (isYellowCornersSolved(cube)) {
            return path;
        }

        // num moves exceeded
        if (path.length > limit) {
            return null;
        }

        // path not found
        // keep searching
        let result;
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
        result = this.solveYellowCorners(cube, path, -1, limit);
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

        // up 
        if (prevMove != MOVE_UPRIME) {
            cube.u();
            path.push(MOVE_U);
            result = this.solveYellowCorners(cube, path, MOVE_U, limit);
            if (result != null) return result;
            cube.uPrime();
            path.pop();
        }
        // up prime
        if (prevMove != MOVE_U) {
            cube.uPrime();
            path.push(MOVE_UPRIME);
            result = this.solveYellowCorners(cube, path, MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.u();
            path.pop();
        }

        // no solution found
        return null;
    }

    // =======================================================================

    solveYellowEdges(cube, path, prevMove, limit) {
        // solution found
        if (isYellowCornersSolved(cube) && isYellowEdgesSolved(cube)) {
            return path;
        }

        // num moves exceeded
        if (path.length > limit) {
            return null;
        }

        // path not found
        // keep searching
        let result;
        // center cycle
        cube.r();
        path.push(MOVE_R);
        cube.r();
        path.push(MOVE_R);
        cube.u();
        path.push(MOVE_U);
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
        cube.uPrime();
        path.push(MOVE_UPRIME);
        cube.rPrime();
        path.push(MOVE_RPRIME);
        cube.u();
        path.push(MOVE_U);
        cube.rPrime();
        path.push(MOVE_RPRIME);
        result = this.solveYellowEdges(cube, path, -1, limit);
        if (result != null) return result;
        //undo alg
        cube.r();
        path.pop();
        cube.uPrime();
        path.pop();
        cube.r();
        path.pop();
        cube.u();
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
        cube.uPrime();
        path.pop();
        cube.r();
        path.pop();
        cube.r();
        path.pop();

        // up 
        if (prevMove != MOVE_UPRIME) {
            cube.u();
            path.push(MOVE_U);
            result = this.solveYellowEdges(cube, path, MOVE_U, limit);
            if (result != null) return result;
            cube.uPrime();
            path.pop();
        }
        // up prime
        if (prevMove != MOVE_U) {
            cube.uPrime();
            path.push(MOVE_UPRIME);
            result = this.solveYellowEdges(cube, path, MOVE_UPRIME, limit);
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