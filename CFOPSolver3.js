/*
    Rubiks Cube Solver
    By Amy Burnett
    January 2 2020
*/

// =======================================================================
// Globals/constants

// max number of moves
const MAX_CUBE_ORIENTATION_MOVES = 4;
const MAX_CROSS_MOVES = 8;
const MAX_F2L_MOVES = 12;
const MAX_YELLOW_CROSS = 20;
const MAX_YELLOW_CORNERS = 40;
const MAX_YELLOW_EDGES = 40;

// =======================================================================
// goal state checks 

function isCentersSolved (cube) {
    if (cube.data[cube.FRONT + 4] != BLUE  ) return false;
    if (cube.data[cube.BACK  + 4] != GREEN ) return false;
    if (cube.data[cube.LEFT  + 4] != ORANGE) return false;
    if (cube.data[cube.RIGHT + 4] != RED   ) return false;
    if (cube.data[cube.UP    + 4] != YELLOW) return false;
    if (cube.data[cube.DOWN  + 4] != WHITE ) return false;
    return true;
}

function isCrossSolved (cube) {
    if (cube.data[cube.DOWN + 1] != WHITE) return false;
    if (cube.data[cube.DOWN + 3] != WHITE) return false;
    if (cube.data[cube.DOWN + 5] != WHITE) return false;
    if (cube.data[cube.DOWN + 7] != WHITE) return false;
    if (cube.data[cube.FRONT + 7] != BLUE) return false;
    if (cube.data[cube.LEFT + 7] != ORANGE) return false;
    if (cube.data[cube.BACK + 7] != GREEN) return false;
    if (cube.data[cube.RIGHT + 7] != RED) return false;
    return true;
}

function isFirstF2LSolved(cube) {
    if (cube.data[cube.DOWN + 0] != WHITE) return false;
    if (cube.data[cube.FRONT + 6] != BLUE) return false;
    if (cube.data[cube.FRONT + 3] != BLUE) return false;
    if (cube.data[cube.LEFT + 8] != ORANGE) return false;
    if (cube.data[cube.LEFT + 5] != ORANGE) return false;
    return true;
}

function isSecondF2LSolved(cube) {
    if (cube.data[cube.DOWN + 2] != WHITE) return false;
    if (cube.data[cube.FRONT + 5] != BLUE) return false;
    if (cube.data[cube.FRONT + 8] != BLUE) return false;
    if (cube.data[cube.RIGHT + 3] != RED) return false;
    if (cube.data[cube.RIGHT + 6] != RED) return false;
    return true;
}

function isThirdF2LSolved(cube) {
    if (cube.data[cube.DOWN + 8] != WHITE) return false;
    if (cube.data[cube.BACK + 3] != GREEN) return false;
    if (cube.data[cube.BACK + 6] != GREEN) return false;
    if (cube.data[cube.RIGHT + 5] != RED) return false;
    if (cube.data[cube.RIGHT + 8] != RED) return false;
    return true;
}

function isFourthF2LSolved(cube) {
    if (cube.data[cube.DOWN + 6] != WHITE) return false;
    if (cube.data[cube.LEFT + 3] != ORANGE) return false;
    if (cube.data[cube.LEFT + 6] != ORANGE) return false;
    if (cube.data[cube.BACK + 5] != GREEN) return false;
    if (cube.data[cube.BACK + 8] != GREEN) return false;
    return true;
}

function isYellowCrossSolved(cube) {
    if (cube.data[cube.UP + 1] != YELLOW) return false;
    if (cube.data[cube.UP + 3] != YELLOW) return false;
    if (cube.data[cube.UP + 5] != YELLOW) return false;
    if (cube.data[cube.UP + 7] != YELLOW) return false;
    return true;
}

function isYellowCornersOrientated(cube) {
    if (cube.data[cube.UP + 0] != YELLOW) return false;
    if (cube.data[cube.UP + 2] != YELLOW) return false;
    if (cube.data[cube.UP + 6] != YELLOW) return false;
    if (cube.data[cube.UP + 8] != YELLOW) return false;
    return true;
}

function isYellowCornersSolved(cube) {
    if (cube.data[cube.FRONT + 0] != BLUE) return false;
    if (cube.data[cube.FRONT + 2] != BLUE) return false;
    if (cube.data[cube.LEFT + 0] != ORANGE) return false;
    if (cube.data[cube.LEFT + 2] != ORANGE) return false;
    if (cube.data[cube.RIGHT + 0] != RED) return false;
    if (cube.data[cube.RIGHT + 2] != RED) return false;
    if (cube.data[cube.BACK + 0] != GREEN) return false;
    if (cube.data[cube.BACK + 2] != GREEN) return false;
    return true;
}

function isYellowEdgesSolved(cube) {
    if (cube.data[cube.FRONT + 1] != BLUE) return false;
    if (cube.data[cube.LEFT + 1] != ORANGE) return false;
    if (cube.data[cube.RIGHT + 1] != RED) return false;
    if (cube.data[cube.BACK + 1] != GREEN) return false;
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
        // orient the cube so white is down and blue is front
        for (var i = 1; i < MAX_CUBE_ORIENTATION_MOVES; ++i) {
            let temp = this.findSolutionToOrientTheCube (cube, [], -1, i);
            if (temp != null) {
                solution = solution.concat (temp);
                break;
            }
        }
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

    findSolutionToOrientTheCube (cube, path, prevMove, limit) {
        // solution found
        if (isCentersSolved (cube)) {
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
        if (prevMove != cube.MOVE_XPRIME) {
            cube.X();
            path.push(cube.MOVE_X);
            result = this.findSolutionToOrientTheCube (cube, path, cube.MOVE_X, limit);
            if (result != null) return result;
            cube.XPrime();
            path.pop();
        }
        // X prime rotation
        if (prevMove != cube.MOVE_X) {
            cube.XPrime();
            path.push(cube.MOVE_XPRIME);
            result = this.findSolutionToOrientTheCube (cube, path, cube.MOVE_XPRIME, limit);
            if (result != null) return result;
            cube.X();
            path.pop();
        }
        // Y rotation
        if (prevMove != cube.MOVE_YPRIME) {
            cube.Y();
            path.push(cube.MOVE_Y);
            result = this.findSolutionToOrientTheCube (cube, path, cube.MOVE_Y, limit);
            if (result != null) return result;
            cube.YPrime();
            path.pop();
        }
        // Y prime rotation
        if (prevMove != cube.MOVE_Y) {
            cube.YPrime();
            path.push(cube.MOVE_YPRIME);
            result = this.findSolutionToOrientTheCube (cube, path, cube.MOVE_YPRIME, limit);
            if (result != null) return result;
            cube.Y();
            path.pop();
        }
        // Z rotation
        if (prevMove != cube.MOVE_ZPRIME) {
            cube.Z();
            path.push(cube.MOVE_Z);
            result = this.findSolutionToOrientTheCube (cube, path, cube.MOVE_Z, limit);
            if (result != null) return result;
            cube.ZPrime();
            path.pop();
        }
        // Z rotation
        if (prevMove != cube.MOVE_Z) {
            cube.ZPrime();
            path.push(cube.MOVE_ZPRIME);
            result = this.findSolutionToOrientTheCube (cube, path, cube.MOVE_ZPRIME, limit);
            if (result != null) return result;
            cube.Z();
            path.pop();
        }

        // no solution found
        return null;
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
        if (prevMove != cube.MOVE_LPRIME) {
            cube.L();
            path.push(cube.MOVE_L);
            result = this.findSolutionToCross(cube, path, cube.MOVE_L, limit);
            if (result != null) return result;
            cube.LPrime();
            path.pop();
        }
        // left prime
        if (prevMove != cube.MOVE_L) {
            cube.LPrime();
            path.push(cube.MOVE_LPRIME);
            result = this.findSolutionToCross(cube, path, cube.MOVE_LPRIME, limit);
            if (result != null) return result;
            cube.L();
            path.pop();
        }
        // front
        if (prevMove != cube.MOVE_FPRIME) {
            cube.F();
            path.push(cube.MOVE_F);
            result = this.findSolutionToCross(cube, path, cube.MOVE_F, limit);
            if (result != null) return result;
            cube.FPrime();
            path.pop();
        }
        // front prime
        if (prevMove != cube.MOVE_F) {
            cube.FPrime();
            path.push(cube.MOVE_FPRIME);
            result = this.findSolutionToCross(cube, path, cube.MOVE_FPRIME, limit);
            if (result != null) return result;
            cube.F();
            path.pop();
        }
        // right 
        if (prevMove != cube.MOVE_RPRIME) {
            cube.R();
            path.push(cube.MOVE_R);
            result = this.findSolutionToCross(cube, path, cube.MOVE_R, limit);
            if (result != null) return result;
            cube.RPrime();
            path.pop();
        }
        // right prime
        if (prevMove != cube.MOVE_R) {
            cube.RPrime();
            path.push(cube.MOVE_RPRIME);
            result = this.findSolutionToCross(cube, path, cube.MOVE_RPRIME, limit);
            if (result != null) return result;
            cube.R();
            path.pop();
        }
        // back 
        if (prevMove != cube.MOVE_BPRIME) {
            cube.B();
            path.push(cube.MOVE_B);
            result = this.findSolutionToCross(cube, path, cube.MOVE_B, limit);
            if (result != null) return result;
            cube.BPrime();
            path.pop();
        }
        // back prime
        if (prevMove != cube.MOVE_B) {
            cube.BPrime();
            path.push(cube.MOVE_BPRIME);
            result = this.findSolutionToCross(cube, path, cube.MOVE_BPRIME, limit);
            if (result != null) return result;
            path.pop();
            cube.B();
        }
        // up 
        if (prevMove != cube.MOVE_UPRIME) {
            cube.U();
            path.push(cube.MOVE_U);
            result = this.findSolutionToCross(cube, path, cube.MOVE_U, limit);
            if (result != null) return result;
            cube.UPrime();
            path.pop();
        }
        // up prime
        if (prevMove != cube.MOVE_U) {
            cube.UPrime();
            path.push(cube.MOVE_UPRIME);
            result = this.findSolutionToCross(cube, path, cube.MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.U();
            path.pop();
        }
        // down 
        if (prevMove != cube.MOVE_DPRIME) {
            cube.D();
            path.push(cube.MOVE_D);
            result = this.findSolutionToCross(cube, path, cube.MOVE_D, limit);
            if (result != null) return result;
            cube.DPrime();
            path.pop();
        }
        // down prime
        if (prevMove != cube.MOVE_D) {
            cube.DPrime();
            path.push(cube.MOVE_DPRIME);
            result = this.findSolutionToCross(cube, path, cube.MOVE_DPRIME, limit);
            if (result != null) return result;
            cube.D();
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
        if (prevMove != cube.MOVE_LPRIME) {
            cube.L();
            path.push(cube.MOVE_L);
            result = this.solveFirstF2L(cube, path, cube.MOVE_L, limit);
            if (result != null) return result;
            cube.LPrime();
            path.pop();
        }
        // left prime
        if (prevMove != cube.MOVE_L) {
            cube.LPrime();
            path.push(cube.MOVE_LPRIME);
            result = this.solveFirstF2L(cube, path, cube.MOVE_LPRIME, limit);
            if (result != null) return result;
            cube.L();
            path.pop();
        }
        // front
        if (prevMove != cube.MOVE_FPRIME) {
            cube.F();
            path.push(cube.MOVE_F);
            result = this.solveFirstF2L(cube, path, cube.MOVE_F, limit);
            if (result != null) return result;
            cube.FPrime();
            path.pop();
        }
        // front prime
        if (prevMove != cube.MOVE_F) {
            cube.FPrime();
            path.push(cube.MOVE_FPRIME);
            result = this.solveFirstF2L(cube, path, cube.MOVE_FPRIME, limit);
            if (result != null) return result;
            cube.F();
            path.pop();
        }
        // right 
        if (prevMove != cube.MOVE_RPRIME) {
            cube.R();
            path.push(cube.MOVE_R);
            result = this.solveFirstF2L(cube, path, cube.MOVE_R, limit);
            if (result != null) return result;
            cube.RPrime();
            path.pop();
        }
        // right prime
        if (prevMove != cube.MOVE_R) {
            cube.RPrime();
            path.push(cube.MOVE_RPRIME);
            result = this.solveFirstF2L(cube, path, cube.MOVE_RPRIME, limit);
            if (result != null) return result;
            cube.R();
            path.pop();
        }
        // back 
        if (prevMove != cube.MOVE_BPRIME) {
            cube.B();
            path.push(cube.MOVE_B);
            result = this.solveFirstF2L(cube, path, cube.MOVE_B, limit);
            if (result != null) return result;
            cube.BPrime();
            path.pop();
        }
        // back prime
        if (prevMove != cube.MOVE_B) {
            cube.BPrime();
            path.push(cube.MOVE_BPRIME);
            result = this.solveFirstF2L(cube, path, cube.MOVE_BPRIME, limit);
            if (result != null) return result;
            path.pop();
            cube.B();
        }
        // up 
        if (prevMove != cube.MOVE_UPRIME) {
            cube.U();
            path.push(cube.MOVE_U);
            result = this.solveFirstF2L(cube, path, cube.MOVE_U, limit);
            if (result != null) return result;
            cube.UPrime();
            path.pop();
        }
        // up prime
        if (prevMove != cube.MOVE_U) {
            cube.UPrime();
            path.push(cube.MOVE_UPRIME);
            result = this.solveFirstF2L(cube, path, cube.MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.U();
            path.pop();
        }
        // down 
        if (prevMove != cube.MOVE_DPRIME) {
            cube.D();
            path.push(cube.MOVE_D);
            result = this.solveFirstF2L(cube, path, cube.MOVE_D, limit);
            if (result != null) return result;
            cube.DPrime();
            path.pop();
        }
        // down prime
        if (prevMove != cube.MOVE_D) {
            cube.DPrime();
            path.push(cube.MOVE_DPRIME);
            result = this.solveFirstF2L(cube, path, cube.MOVE_DPRIME, limit);
            if (result != null) return result;
            cube.D();
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
        if (prevMove != cube.MOVE_FPRIME) {
            cube.F();
            path.push(cube.MOVE_F);
            result = this.solveSecondF2L(cube, path, cube.MOVE_F, limit);
            if (result != null) return result;
            cube.FPrime();
            path.pop();
        }
        // front prime
        if (prevMove != cube.MOVE_F) {
            cube.FPrime();
            path.push(cube.MOVE_FPRIME);
            result = this.solveSecondF2L(cube, path, cube.MOVE_FPRIME, limit);
            if (result != null) return result;
            cube.F();
            path.pop();
        }
        // right 
        if (prevMove != cube.MOVE_RPRIME) {
            cube.R();
            path.push(cube.MOVE_R);
            result = this.solveSecondF2L(cube, path, cube.MOVE_R, limit);
            if (result != null) return result;
            cube.RPrime();
            path.pop();
        }
        // right prime
        if (prevMove != cube.MOVE_R) {
            cube.RPrime();
            path.push(cube.MOVE_RPRIME);
            result = this.solveSecondF2L(cube, path, cube.MOVE_RPRIME, limit);
            if (result != null) return result;
            cube.R();
            path.pop();
        }
        // back 
        if (prevMove != cube.MOVE_BPRIME) {
            cube.B();
            path.push(cube.MOVE_B);
            result = this.solveSecondF2L(cube, path, cube.MOVE_B, limit);
            if (result != null) return result;
            cube.BPrime();
            path.pop();
        }
        // back prime
        if (prevMove != cube.MOVE_B) {
            cube.BPrime();
            path.push(cube.MOVE_BPRIME);
            result = this.solveSecondF2L(cube, path, cube.MOVE_BPRIME, limit);
            if (result != null) return result;
            path.pop();
            cube.B();
        }
        // up 
        if (prevMove != cube.MOVE_UPRIME) {
            cube.U();
            path.push(cube.MOVE_U);
            result = this.solveSecondF2L(cube, path, cube.MOVE_U, limit);
            if (result != null) return result;
            cube.UPrime();
            path.pop();
        }
        // up prime
        if (prevMove != cube.MOVE_U) {
            cube.UPrime();
            path.push(cube.MOVE_UPRIME);
            result = this.solveSecondF2L(cube, path, cube.MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.U();
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
        if (prevMove != cube.MOVE_FPRIME) {
            cube.F();
            path.push(cube.MOVE_F);
            result = this.solveThirdF2L(cube, path, cube.MOVE_F, limit);
            if (result != null) return result;
            cube.FPrime();
            path.pop();
        }
        // front prime
        if (prevMove != cube.MOVE_F) {
            cube.FPrime();
            path.push(cube.MOVE_FPRIME);
            result = this.solveThirdF2L(cube, path, cube.MOVE_FPRIME, limit);
            if (result != null) return result;
            cube.F();
            path.pop();
        }
        // right 
        if (prevMove != cube.MOVE_RPRIME) {
            cube.R();
            path.push(cube.MOVE_R);
            result = this.solveThirdF2L(cube, path, cube.MOVE_R, limit);
            if (result != null) return result;
            cube.RPrime();
            path.pop();
        }
        // right prime
        if (prevMove != cube.MOVE_R) {
            cube.RPrime();
            path.push(cube.MOVE_RPRIME);
            result = this.solveThirdF2L(cube, path, cube.MOVE_RPRIME, limit);
            if (result != null) return result;
            cube.R();
            path.pop();
        }
        // back 
        if (prevMove != cube.MOVE_BPRIME) {
            cube.B();
            path.push(cube.MOVE_B);
            result = this.solveThirdF2L(cube, path, cube.MOVE_B, limit);
            if (result != null) return result;
            cube.BPrime();
            path.pop();
        }
        // back prime
        if (prevMove != cube.MOVE_B) {
            cube.BPrime();
            path.push(cube.MOVE_BPRIME);
            result = this.solveThirdF2L(cube, path, cube.MOVE_BPRIME, limit);
            if (result != null) return result;
            path.pop();
            cube.B();
        }
        // up 
        if (prevMove != cube.MOVE_UPRIME) {
            cube.U();
            path.push(cube.MOVE_U);
            result = this.solveThirdF2L(cube, path, cube.MOVE_U, limit);
            if (result != null) return result;
            cube.UPrime();
            path.pop();
        }
        // up prime
        if (prevMove != cube.MOVE_U) {
            cube.UPrime();
            path.push(cube.MOVE_UPRIME);
            result = this.solveThirdF2L(cube, path, cube.MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.U();
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
        if (prevMove != cube.MOVE_L && prevMove != cube.MOVE_LPRIME) {
            cube.L();
            path.push(cube.MOVE_L);
            result = this.solveFourthF2L(cube, path, cube.MOVE_L, limit);
            if (result != null) return result;
            cube.LPrime();
            path.pop();
            // left prime
            cube.LPrime();
            path.push(cube.MOVE_LPRIME);
            result = this.solveFourthF2L(cube, path, cube.MOVE_LPRIME, limit);
            if (result != null) return result;
            cube.L();
            path.pop();
        }
        // back 
        if (prevMove != cube.MOVE_B && prevMove != cube.MOVE_BPRIME) {
            cube.B();
            path.push(cube.MOVE_B);
            result = this.solveFourthF2L(cube, path,cube.MOVE_B, limit);
            if (result != null) return result;
            cube.BPrime();
            path.pop();
            // back prime
            cube.BPrime();
            path.push(cube.MOVE_BPRIME);
            result = this.solveFourthF2L(cube, path,cube.MOVE_BPRIME, limit);
            if (result != null) return result;
            path.pop();
            cube.B();
        }
        // up 
        if (prevMove != cube.MOVE_U && prevMove != cube.MOVE_UPRIME) {
            cube.U();
            path.push(cube.MOVE_U);
            result = this.solveFourthF2L(cube, path, cube.MOVE_U, limit);
            if (result != null) return result;
            cube.UPrime();
            path.pop();
            // up prime
            cube.UPrime();
            path.push(cube.MOVE_UPRIME);
            result = this.solveFourthF2L(cube, path, cube.MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.U();
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
        if (prevMove != cube.MOVE_U && prevMove != cube.MOVE_UPRIME) {
            cube.U();
            path.push(cube.MOVE_U);
            result = this.solveYellowCross(cube, path, cube.MOVE_U, limit);
            if (result != null) return result;
            cube.UPrime();
            path.pop();
        }
        // up prime
        if (prevMove != cube.MOVE_U && prevMove != cube.MOVE_UPRIME) {
            cube.UPrime();
            path.push(cube.MOVE_UPRIME);
            result = this.solveYellowCross(cube, path, cube.MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.U();
            path.pop();
        }
        // Yellow Cross alg
        cube.F();
        path.push(cube.MOVE_F);
        cube.R();
        path.push(cube.MOVE_R);
        cube.U();
        path.push(cube.MOVE_U);
        cube.RPrime();
        path.push(cube.MOVE_RPRIME);
        cube.UPrime();
        path.push(cube.MOVE_UPRIME);
        cube.FPrime();
        path.push(cube.MOVE_FPRIME);
        result = this.solveYellowCross(cube, path, -1, limit);
        if (result != null) return result;
        //undo alg
        cube.F();
        path.pop();
        cube.U();
        path.pop();
        cube.R();
        path.pop();
        cube.UPrime();
        path.pop();
        cube.RPrime();
        path.pop();
        cube.FPrime();
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
        result = this.solveYellowFace(cube, path, -1, limit);
        if (result != null) return result;
        //undo alg
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

        // up 
        if (prevMove != cube.MOVE_U && prevMove != cube.MOVE_UPRIME) {
            cube.U();
            path.push(cube.MOVE_U);
            result = this.solveYellowFace(cube, path, cube.MOVE_U, limit);
            if (result != null) return result;
            cube.UPrime();
            path.pop();
        }
        // up prime
        if (prevMove != cube.MOVE_U && prevMove != cube.MOVE_UPRIME) {
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
        result = this.solveYellowCorners(cube, path, -1, limit);
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

        // up 
        if (prevMove != cube.MOVE_UPRIME) {
            cube.U();
            path.push(cube.MOVE_U);
            result = this.solveYellowCorners(cube, path, cube.MOVE_U, limit);
            if (result != null) return result;
            cube.UPrime();
            path.pop();
        }
        // up prime
        if (prevMove != cube.MOVE_U) {
            cube.UPrime();
            path.push(cube.MOVE_UPRIME);
            result = this.solveYellowCorners(cube, path, cube.MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.U();
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
        cube.R();
        path.push(cube.MOVE_R);
        cube.R();
        path.push(cube.MOVE_R);
        cube.U();
        path.push(cube.MOVE_U);
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
        cube.UPrime();
        path.push(cube.MOVE_UPRIME);
        cube.RPrime();
        path.push(cube.MOVE_RPRIME);
        cube.U();
        path.push(cube.MOVE_U);
        cube.RPrime();
        path.push(cube.MOVE_RPRIME);
        result = this.solveYellowEdges(cube, path, -1, limit);
        if (result != null) return result;
        //undo alg
        cube.R();
        path.pop();
        cube.UPrime();
        path.pop();
        cube.R();
        path.pop();
        cube.U();
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
        cube.UPrime();
        path.pop();
        cube.R();
        path.pop();
        cube.R();
        path.pop();

        // up 
        if (prevMove != cube.MOVE_UPRIME) {
            cube.U();
            path.push(cube.MOVE_U);
            result = this.solveYellowEdges(cube, path, cube.MOVE_U, limit);
            if (result != null) return result;
            cube.UPrime();
            path.pop();
        }
        // up prime
        if (prevMove != cube.MOVE_U) {
            cube.UPrime();
            path.push(cube.MOVE_UPRIME);
            result = this.solveYellowEdges(cube, path, cube.MOVE_UPRIME, limit);
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