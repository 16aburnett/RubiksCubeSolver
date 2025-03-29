/*
    Rubiks Cube Solver 2 with the minimum number of moves
    By Amy Burnett
    February 7 2020

    2x2x2 Rubik's Cube only has 3,674,160 different possible positions.
    The theory and hope is that it shouldn't take too long to 
    fully solve the 2x2x2 in one iterative DFS run. 
    Minimum number of moves to solve from any state is 14 moves.
    However, My cube enforces position so the cube needs to be solved
    so that blue is in the front which might take more moves that usual

*/

// =======================================================================
// Globals/constants


// =======================================================================
// goal state checks 


// =======================================================================

class FullSolver2 {

    constructor() {
        this.maxMoves = 8;
    }

    // =======================================================================

    // returns a list of moves to solve the cube from the current state
    // this can fluctuate in time between instant and a few seconds
    findSolution(cube) {
        let solution = [];
        // solve first layer
        for (var i = 1; i < this.maxMoves; ++i) {
            let temp = this.solve(cube, [], -1, i);
            if (temp != null) {
                solution = solution.concat(temp);
                break;
            }
        }
        if (solution == []) {
            console.log("Sorry, the solution takes longer than 8 moves");
        }
        return solution;
    }

    // =======================================================================

    solve(cube, path, prevMove, limit) {
        // solution found
        if (cube.isSolved()) {
            return path;
        }

        // num moves exceeded
        if (path.length > limit) {
            return null;
        }

        // make sure a move wasn't repeated 3+ times
        // a shorter solution could be found
        // checking further down this path would not 
        // result in a solve
        if (path.length >= 3 && (path[path.length-3] == path[path.length-2] && path[path.length-2] == path[path.length-1])) {
            return null;
        }

        // path not found
        // keep searching
        let result;
        
        // left
        if (prevMove != MOVE_LPRIME) {
            cube.l();
            path.push(MOVE_L);
            result = this.solve(cube, path, MOVE_L, limit);
            if (result != null) return result;
            cube.lPrime();
            path.pop();
        }
        // left prime
        if (prevMove != MOVE_L) {
            cube.lPrime();
            path.push(MOVE_LPRIME);
            result = this.solve(cube, path, MOVE_LPRIME, limit);
            if (result != null) return result;
            cube.l();
            path.pop();
        }
        // front
        if (prevMove != MOVE_FPRIME) {
            cube.f();
            path.push(MOVE_F);
            result = this.solve(cube, path, MOVE_F, limit);
            if (result != null) return result;
            cube.fPrime();
            path.pop();
        }
        // front prime
        if (prevMove != MOVE_F) {
            cube.fPrime();
            path.push(MOVE_FPRIME);
            result = this.solve(cube, path, MOVE_FPRIME, limit);
            if (result != null) return result;
            cube.f();
            path.pop();
        }
        // right 
        if (prevMove != MOVE_RPRIME) {
            cube.r();
            path.push(MOVE_R);
            result = this.solve(cube, path, MOVE_R, limit);
            if (result != null) return result;
            cube.rPrime();
            path.pop();
        }
        // right prime
        if (prevMove != MOVE_R) {
            cube.rPrime();
            path.push(MOVE_RPRIME);
            result = this.solve(cube, path, MOVE_RPRIME, limit);
            if (result != null) return result;
            cube.r();
            path.pop();
        }
        // back 
        if (prevMove != MOVE_BPRIME) {
            cube.b();
            path.push(MOVE_B);
            result = this.solve(cube, path, MOVE_B, limit);
            if (result != null) return result;
            cube.bPrime();
            path.pop();
        }
        // back prime
        if (prevMove != MOVE_B) {
            cube.bPrime();
            path.push(MOVE_BPRIME);
            result = this.solve(cube, path, MOVE_BPRIME, limit);
            if (result != null) return result;
            path.pop();
            cube.b();
        }
        // up 
        if (prevMove != MOVE_UPRIME) {
            cube.u();
            path.push(MOVE_U);
            result = this.solve(cube, path, MOVE_U, limit);
            if (result != null) return result;
            cube.uPrime();
            path.pop();
        }
        // up prime
        if (prevMove != MOVE_U) {
            cube.uPrime();
            path.push(MOVE_UPRIME);
            result = this.solve(cube, path, MOVE_UPRIME, limit);
            if (result != null) return result;
            cube.u();
            path.pop();
        }
        // down 
        if (prevMove != MOVE_DPRIME) {
            cube.d();
            path.push(MOVE_D);
            result = this.solve(cube, path, MOVE_D, limit);
            if (result != null) return result;
            cube.dPrime();
            path.pop();
        }
        // down prime
        if (prevMove != MOVE_D) {
            cube.dPrime();
            path.push(MOVE_DPRIME);
            result = this.solve(cube, path, MOVE_DPRIME, limit);
            if (result != null) return result;
            cube.d();
            path.pop();
        }

        // no solution found
        return null;
    }

    // =======================================================================

}


// =======================================================================