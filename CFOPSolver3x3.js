// Rubiks Cube Solver: CFOP for Animated 3x3
// By Amy Burnett
// August 18 2024
// =======================================================================
// Globals/constants

// =======================================================================

class CFOPSolver3x3
{

    constructor ()
    {
        this.MAX_CUBE_ORIENTATION_MOVES = 4;
        this.MAX_CROSS_MOVES = 8;
        this.MAX_F2L_MOVES = 12;
        this.MAX_YELLOW_CROSS = 20;
        this.MAX_YELLOW_CORNERS = 40;
        this.MAX_YELLOW_EDGES = 40;
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
        console.time ("findSolutionToCross");
        // solve cross
        for (var i = 1; i < this.MAX_CROSS_MOVES; ++i) {
            let temp = this.findSolutionToCross(cube, [], 0, i);
            if (temp != null) {
                console.log ("findSolutionToCross", temp);
                solution = solution.concat(temp);
                break;
            }
        }
        console.timeEnd ("findSolutionToCross");
        // solve f2l 
        console.time ("solveFirstF2L");
        for (var i = 1; i < this.MAX_F2L_MOVES; ++i) {
            let temp = this.solveFirstF2L(cube, [], 0, i);
            if (temp != null) {
                console.log ("solveFirstF2L", temp);
                solution = solution.concat(temp);
                break;
            }
        }
        console.timeEnd ("solveFirstF2L");
        console.time ("solveSecondF2L");
        for (var i = 1; i < this.MAX_F2L_MOVES; ++i) {
            let temp = this.solveSecondF2L(cube, [], 0, i);
            if (temp != null) {
                console.log ("solveSecondF2L", temp);
                solution = solution.concat(temp);
                break;
            }
        }
        console.timeEnd ("solveSecondF2L");
        console.time ("solveThirdF2L");
        for (var i = 1; i < this.MAX_F2L_MOVES; ++i) {
            let temp = this.solveThirdF2L(cube, [], 0, i);
            if (temp != null) {
                console.log ("solveThirdF2L", temp);
                solution = solution.concat(temp);
                break;
            }
        }
        console.timeEnd ("solveThirdF2L");
        console.time ("solveFourthF2L");
        for (var i = 1; i < this.MAX_F2L_MOVES; ++i) {
            let temp = this.solveFourthF2L(cube, [], 0, i);
            if (temp != null) {
                console.log ("solveFourthF2L", temp);
                solution = solution.concat(temp);
                break;
            }
        }
        console.timeEnd ("solveFourthF2L");
        console.time ("solveYellowCross");
        // OLL: yellow cross
        for (var i = 1; i < this.MAX_YELLOW_CROSS; ++i) {
            let temp = this.solveYellowCross(cube, [], 0, i);
            if (temp != null) {
                console.log ("solveYellowCross", temp);
                solution = solution.concat(temp);
                break;
            }
        }
        console.timeEnd ("solveYellowCross");
        console.time ("solveYellowFace");
        // OLL: yellow face
        for (var i = 1; i < this.MAX_YELLOW_CORNERS; ++i) {
            let temp = this.solveYellowFace(cube, [], 0, i);
            if (temp != null) {
                console.log ("solveYellowFace", temp);
                solution = solution.concat(temp);
                break;
            }
        }
        console.timeEnd ("solveYellowFace");
        // PLL: yellow corners
        console.time ("solveYellowCorners");
        for (var i = 1; i < this.MAX_YELLOW_CORNERS; ++i) {
            let temp = this.solveYellowCorners(cube, [], 0, i);
            if (temp != null) {
                console.log ("solveYellowCorners", temp);
                solution = solution.concat(temp);
                break;
            }
        }
        console.timeEnd ("solveYellowCorners");
        // PLL: yellow edges
        console.time ("solveYellowEdges");
        for (var i = 1; i < this.MAX_YELLOW_EDGES; ++i) {
            let temp = this.solveYellowEdges(cube, [], 0, i);
            if (temp != null) {
                console.log ("solveYellowEdges", temp);
                solution = solution.concat(temp);
                break;
            }
        }
        console.timeEnd ("solveYellowEdges");

        return solution;
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

    findSolutionToCross (cube, path, prevMove, limit) {
        // solution found
        if (this.isCrossSolved (cube)) {
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
            cubeNotationMove (MOVE_D, -1),
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
            result = this.findSolutionToCross (cube, path, move, limit);
            if (result != null) return result;
            path.pop ();
            // undo move by reversing direction
            cube.rotate (axisNotationMove[0], axisNotationMove[1], -axisNotationMove[2]);
        }
        // no solution found
        return null;
    }

    // =======================================================================

    solveFirstF2L (cube, path, prevMove, limit) {
        // solution found
        if (this.isCrossSolved (cube) && this.isFirstF2LSolved (cube)) {
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
            cubeNotationMove (MOVE_D, -1),
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
            result = this.solveFirstF2L (cube, path, move, limit);
            if (result != null) return result;
            path.pop ();
            // undo move by reversing direction
            cube.rotate (axisNotationMove[0], axisNotationMove[1], -axisNotationMove[2]);
        }
        // no solution found
        return null;
    }

    // =======================================================================

    solveSecondF2L (cube, path, prevMove, limit) {
        // solution found
        if (this.isCrossSolved (cube) 
            && this.isFirstF2LSolved (cube) 
            && this.isSecondF2LSolved (cube)) {
            return path;
        }

        // Ensure we aren't going to exceed the max number of moves
        if (path.length >= limit)
            return null;

        // path not found
        // keep searching
        let result;
        // We can limit the number of moves here (no L or D)
        // Technically this would disallow keyhole (need D for keyhole),
        // but I assume it might be faster to have less combinations
        // to check.
        let movesToTry = [
            cubeNotationMove (MOVE_R,  1),
            cubeNotationMove (MOVE_R, -1),
            cubeNotationMove (MOVE_F,  1),
            cubeNotationMove (MOVE_F, -1),
            cubeNotationMove (MOVE_B,  1),
            cubeNotationMove (MOVE_B, -1),
            cubeNotationMove (MOVE_U,  1),
            cubeNotationMove (MOVE_U, -1),
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
            result = this.solveSecondF2L (cube, path, move, limit);
            if (result != null) return result;
            path.pop ();
            // undo move by reversing direction
            cube.rotate (axisNotationMove[0], axisNotationMove[1], -axisNotationMove[2]);
        }
        // no solution found
        return null;
    }

    // =======================================================================

    solveThirdF2L (cube, path, prevMove, limit) {
        // solution found
        if (this.isCrossSolved (cube) 
            && this.isFirstF2LSolved (cube) 
            && this.isSecondF2LSolved (cube)
            && this.isThirdF2LSolved (cube)) {
            return path;
        }

        // Ensure we aren't going to exceed the max number of moves
        if (path.length >= limit)
            return null;

        // path not found
        // keep searching
        let result;
        let movesToTry = [
            cubeNotationMove (MOVE_R,  1),
            cubeNotationMove (MOVE_R, -1),
            cubeNotationMove (MOVE_F,  1),
            cubeNotationMove (MOVE_F, -1),
            cubeNotationMove (MOVE_B,  1),
            cubeNotationMove (MOVE_B, -1),
            cubeNotationMove (MOVE_U,  1),
            cubeNotationMove (MOVE_U, -1),
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
            result = this.solveThirdF2L (cube, path, move, limit);
            if (result != null) return result;
            path.pop ();
            // undo move by reversing direction
            cube.rotate (axisNotationMove[0], axisNotationMove[1], -axisNotationMove[2]);
        }
        // no solution found
        return null;
    }

    // =======================================================================

    solveFourthF2L (cube, path, prevMove, limit) {
        // solution found
        if (this.isCrossSolved (cube) 
            && this.isFirstF2LSolved (cube) 
            && this.isSecondF2LSolved (cube)
            && this.isThirdF2LSolved (cube)
            && this.isFourthF2LSolved (cube)) {
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
            cubeNotationMove (MOVE_B,  1),
            cubeNotationMove (MOVE_B, -1),
            cubeNotationMove (MOVE_U,  1),
            cubeNotationMove (MOVE_U, -1),
        ];
        for (let move of movesToTry)
        {
            // Ensure this move isnt the reverse of the previous move
            // since that would undo progress
            if (prevMove == cubeMoveNotation.getReverseMove (move))
                // skip trying move
                continue;
            // Ensure it isnt the same move
            // We're disallowing 180 degree turns here to be faster
            // We should not need 180 degree turns to solve the
            // last F2L pair
            if (prevMove == move)
                // skip trying move
                continue;
            // Perform move on cube
            let axisNotationMove = cubeMoveNotation.toAxisNotation (move);
            cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
            path.push (move);
            result = this.solveFourthF2L (cube, path, move, limit);
            if (result != null) return result;
            path.pop ();
            // undo move by reversing direction
            cube.rotate (axisNotationMove[0], axisNotationMove[1], -axisNotationMove[2]);
        }
        // no solution found
        return null;
    }

    // =======================================================================

    solveYellowCross (cube, path, prevMove, limit) {
        // solution found
        if (this.isYellowCrossSolved (cube)) {
            return path;
        }

        // Ensure we aren't going to exceed the max number of moves
        if (path.length >= limit)
            return null;

        // path not found
        // keep searching
        let result;
        let moveSetsToTry = [
            [
                cubeNotationMove (MOVE_U,  1)
            ],
            [
                cubeNotationMove (MOVE_U, -1)
            ],
            // Yellow cross algorithm
            [
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_F, -1),
            ],
            // Reverse yellow cross alg
            // this can go from L-shape directly to cross solved
            [
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_F, -1),
            ],
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
            result = this.solveYellowCross (cube, path, moveSet.length == 1 ? moveSet[0] : 0, limit);
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

    solveYellowFace (cube, path, prevMove, limit) {
        // solution found
        if (this.isYellowCornersOrientated (cube)) {
            return path;
        }

        // Ensure we aren't going to exceed the max number of moves
        if (path.length >= limit)
            return null;

        // path not found
        // keep searching
        let result;
        let moveSetsToTry = [
            // Fishy alg
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
            result = this.solveYellowFace (cube, path, moveSet.length == 1 ? moveSet[0] : 0, limit);
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

    solveYellowCorners (cube, path, prevMove, limit) {
        // solution found
        if (this.isYellowCornersSolved (cube)) {
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
            result = this.solveYellowCorners (cube, path, moveSet.length == 1 ? moveSet[0] : 0, limit);
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

    solveYellowEdges (cube, path, prevMove, limit) {
        // solution found
        if (this.isYellowCornersSolved (cube) && this.isYellowEdgesSolved (cube)) {
            return path;
        }

        // Ensure we aren't going to exceed the max number of moves
        if (path.length >= limit)
            return null;

        // path not found
        // keep searching
        let result;
        let moveSetsToTry = [
            // 3 edge cycle
            [
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
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
            result = this.solveYellowEdges (cube, path, moveSet.length == 1 ? moveSet[0] : 0, limit);
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
    
    isCentersSolved (cube) {
        if (cube.data[cube.FRONT + 4] != BLUE  ) return false;
        if (cube.data[cube.BACK  + 4] != GREEN ) return false;
        if (cube.data[cube.LEFT  + 4] != ORANGE) return false;
        if (cube.data[cube.RIGHT + 4] != RED   ) return false;
        if (cube.data[cube.UP    + 4] != YELLOW) return false;
        if (cube.data[cube.DOWN  + 4] != WHITE ) return false;
        return true;
    }

    // =======================================================================

    isCrossSolved (cube) {
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

    // =======================================================================

    isFirstF2LSolved (cube) {
        if (cube.data[cube.DOWN + 0] != WHITE) return false;
        if (cube.data[cube.FRONT + 6] != BLUE) return false;
        if (cube.data[cube.FRONT + 3] != BLUE) return false;
        if (cube.data[cube.LEFT + 8] != ORANGE) return false;
        if (cube.data[cube.LEFT + 5] != ORANGE) return false;
        return true;
    }

    // =======================================================================

    isSecondF2LSolved (cube) {
        if (cube.data[cube.DOWN + 2] != WHITE) return false;
        if (cube.data[cube.FRONT + 5] != BLUE) return false;
        if (cube.data[cube.FRONT + 8] != BLUE) return false;
        if (cube.data[cube.RIGHT + 3] != RED) return false;
        if (cube.data[cube.RIGHT + 6] != RED) return false;
        return true;
    }

    // =======================================================================

    isThirdF2LSolved (cube) {
        if (cube.data[cube.DOWN + 8] != WHITE) return false;
        if (cube.data[cube.BACK + 3] != GREEN) return false;
        if (cube.data[cube.BACK + 6] != GREEN) return false;
        if (cube.data[cube.RIGHT + 5] != RED) return false;
        if (cube.data[cube.RIGHT + 8] != RED) return false;
        return true;
    }

    // =======================================================================

    isFourthF2LSolved (cube) {
        if (cube.data[cube.DOWN + 6] != WHITE) return false;
        if (cube.data[cube.LEFT + 3] != ORANGE) return false;
        if (cube.data[cube.LEFT + 6] != ORANGE) return false;
        if (cube.data[cube.BACK + 5] != GREEN) return false;
        if (cube.data[cube.BACK + 8] != GREEN) return false;
        return true;
    }

    // =======================================================================

    isYellowCrossSolved (cube) {
        if (cube.data[cube.UP + 1] != YELLOW) return false;
        if (cube.data[cube.UP + 3] != YELLOW) return false;
        if (cube.data[cube.UP + 5] != YELLOW) return false;
        if (cube.data[cube.UP + 7] != YELLOW) return false;
        return true;
    }

    // =======================================================================

    isYellowCornersOrientated (cube) {
        if (cube.data[cube.UP + 0] != YELLOW) return false;
        if (cube.data[cube.UP + 2] != YELLOW) return false;
        if (cube.data[cube.UP + 6] != YELLOW) return false;
        if (cube.data[cube.UP + 8] != YELLOW) return false;
        return true;
    }

    // =======================================================================

    isYellowCornersSolved (cube) {
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

    // =======================================================================

    isYellowEdgesSolved (cube) {
        if (cube.data[cube.FRONT + 1] != BLUE) return false;
        if (cube.data[cube.LEFT + 1] != ORANGE) return false;
        if (cube.data[cube.RIGHT + 1] != RED) return false;
        if (cube.data[cube.BACK + 1] != GREEN) return false;
        return true;
    }

}


// =======================================================================