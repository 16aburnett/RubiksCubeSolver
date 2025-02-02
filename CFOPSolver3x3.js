// Rubiks Cube Solver: Uses the CFOP method
// By Amy Burnett
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
        this.MAX_OLL_CROSS = 20;
        this.MAX_OLL_CORNERS = 40;
        this.MAX_PLL_CORNERS = 22;
        this.MAX_PLL_EDGES = 22;
    }

    // =======================================================================

    // returns a list of moves to solve the cube from the current state
    // this can fluctuate in time between instant and a few seconds
    findSolution (cube)
    {
        let solution = [];
        // orient the cube so white is down and blue is front
        let temp = this.findSolutionToOrientTheCube (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // solve cross
        temp = this.findSolutionToCross (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // solve f2l
        // F2L: First
        temp = this.solveFirstF2L (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // F2L: Second
        temp = this.solveSecondF2L (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // F2L: Third
        temp = this.solveThirdF2L (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // F2L: Fourth
        temp = this.solveFourthF2L (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // OLL
        temp = this.solve2LookOLL (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // PLL
        temp = this.solve2LookPLL (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        return solution;
    }

    // =======================================================================

    findSolutionToOrientTheCube (cube) {
        const name = "findSolutionToOrientTheCube";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = this.findMinSolution (cube, this.MAX_CUBE_ORIENTATION_MOVES, (cube) => {
            return this.isCentersSolved (cube);
        }, [
            [cubeNotationMove (MOVE_X,  1)],
            [cubeNotationMove (MOVE_X, -1)],
            [cubeNotationMove (MOVE_Y,  1)],
            [cubeNotationMove (MOVE_Y, -1)],
            [cubeNotationMove (MOVE_Z,  1)],
            [cubeNotationMove (MOVE_Z, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    findSolutionToCross (cube) {
        const name = "findSolutionToCross";
        console.log (name);
        console.time (name);

        let solution = [];

        const maxCrossMoves = 7;

        // Solve front cross piece
        let temp = this.findMinSolution (cube, maxCrossMoves, (cube) => {
            return cube.data[cube.FRONT + 7] == BLUE && cube.data[cube.DOWN + 1] == WHITE;
        }, [
            [cubeNotationMove (MOVE_L,  1)],
            [cubeNotationMove (MOVE_L, -1)],
            [cubeNotationMove (MOVE_R,  1)],
            [cubeNotationMove (MOVE_R, -1)],
            [cubeNotationMove (MOVE_F,  1)],
            [cubeNotationMove (MOVE_F, -1)],
            [cubeNotationMove (MOVE_B,  1)],
            [cubeNotationMove (MOVE_B, -1)],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            [cubeNotationMove (MOVE_D,  1)],
            [cubeNotationMove (MOVE_D, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}: front cross piece`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        // Solve right cross piece
        temp = this.findMinSolution (cube, maxCrossMoves, (cube) => {
            return cube.data[cube.FRONT + 7] == BLUE && cube.data[cube.DOWN + 1] == WHITE
                && cube.data[cube.RIGHT + 7] == RED  && cube.data[cube.DOWN + 5] == WHITE;
        }, [
            [cubeNotationMove (MOVE_L,  1)],
            [cubeNotationMove (MOVE_L, -1)],
            [cubeNotationMove (MOVE_R,  1)],
            [cubeNotationMove (MOVE_R, -1)],
            [cubeNotationMove (MOVE_F,  1)],
            [cubeNotationMove (MOVE_F, -1)],
            [cubeNotationMove (MOVE_B,  1)],
            [cubeNotationMove (MOVE_B, -1)],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            [cubeNotationMove (MOVE_D,  1)],
            [cubeNotationMove (MOVE_D, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}: right cross piece`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        // Solve back cross piece
        temp = this.findMinSolution (cube, maxCrossMoves, (cube) => {
            return cube.data[cube.FRONT + 7] == BLUE  && cube.data[cube.DOWN + 1] == WHITE
                && cube.data[cube.RIGHT + 7] == RED   && cube.data[cube.DOWN + 5] == WHITE
                && cube.data[cube.BACK  + 7] == GREEN && cube.data[cube.DOWN + 7] == WHITE;
        }, [
            [cubeNotationMove (MOVE_L,  1)],
            [cubeNotationMove (MOVE_L, -1)],
            [cubeNotationMove (MOVE_R,  1)],
            [cubeNotationMove (MOVE_R, -1)],
            [cubeNotationMove (MOVE_F,  1)],
            [cubeNotationMove (MOVE_F, -1)],
            [cubeNotationMove (MOVE_B,  1)],
            [cubeNotationMove (MOVE_B, -1)],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            [cubeNotationMove (MOVE_D,  1)],
            [cubeNotationMove (MOVE_D, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}: back cross piece`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        // Solve left cross piece
        temp = this.findMinSolution (cube, maxCrossMoves, (cube) => {
            return this.isCrossSolved (cube);
        }, [
            [cubeNotationMove (MOVE_L,  1)],
            [cubeNotationMove (MOVE_L, -1)],
            [cubeNotationMove (MOVE_R,  1)],
            [cubeNotationMove (MOVE_R, -1)],
            [cubeNotationMove (MOVE_F,  1)],
            [cubeNotationMove (MOVE_F, -1)],
            [cubeNotationMove (MOVE_B,  1)],
            [cubeNotationMove (MOVE_B, -1)],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            [cubeNotationMove (MOVE_D,  1)],
            [cubeNotationMove (MOVE_D, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}: left cross piece`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    findMinSolutionToCross (cube) {
        const name = "findMinSolutionToCross";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = this.findMinSolution (cube, this.MAX_CROSS_MOVES, (cube) => {
            return this.isCrossSolved (cube);
        }, [
            [cubeNotationMove (MOVE_L,  1)],
            [cubeNotationMove (MOVE_L, -1)],
            [cubeNotationMove (MOVE_R,  1)],
            [cubeNotationMove (MOVE_R, -1)],
            [cubeNotationMove (MOVE_F,  1)],
            [cubeNotationMove (MOVE_F, -1)],
            [cubeNotationMove (MOVE_B,  1)],
            [cubeNotationMove (MOVE_B, -1)],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            [cubeNotationMove (MOVE_D,  1)],
            [cubeNotationMove (MOVE_D, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    solveFirstF2LMin (cube) {
        const name = "solveFirstF2LMin";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = this.findMinSolution (cube, this.MAX_F2L_MOVES, (cube) => {
            return this.isCrossSolved (cube) && this.isFirstF2LSolved (cube);
        }, [
            [cubeNotationMove (MOVE_L,  1)],
            [cubeNotationMove (MOVE_L, -1)],
            [cubeNotationMove (MOVE_R,  1)],
            [cubeNotationMove (MOVE_R, -1)],
            [cubeNotationMove (MOVE_F,  1)],
            [cubeNotationMove (MOVE_F, -1)],
            [cubeNotationMove (MOVE_B,  1)],
            [cubeNotationMove (MOVE_B, -1)],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            [cubeNotationMove (MOVE_D,  1)],
            [cubeNotationMove (MOVE_D, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    solveFirstF2L (cube) {
        const name = "solveFirstF2L";
        console.log (name);
        console.time (name);
        let solution = [];
        
        // Solve Edge Piece
        let temp = this.solveFirstF2LEdge (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        // Solve Corner Piece
        temp = this.solveFirstF2LCorner (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    solveFirstF2LEdge (cube) {
        let solution = [];

        // 1. check if it is already solved
        if (this.isFirstF2LEdgeSolved (cube))
            return [];

        // 2. move edge piece to top layer anywhere
        let temp = this.findMinSolution (cube, 4, (cube) => {
            const color0 = ORANGE;
            const color1 = BLUE;
            // Ensure progress wasnt broken
            if (!(this.isCrossSolved (cube)))
                return false;
            // Edge piece is in top layer
            return (cube.data[cube.UP + 1] == color0 && cube.data[cube.BACK + 1] == color1)
                || (cube.data[cube.UP + 1] == color1 && cube.data[cube.BACK + 1] == color0)
                || (cube.data[cube.UP + 5] == color0 && cube.data[cube.RIGHT + 1] == color1)
                || (cube.data[cube.UP + 5] == color1 && cube.data[cube.RIGHT + 1] == color0)
                || (cube.data[cube.UP + 7] == color0 && cube.data[cube.FRONT + 1] == color1)
                || (cube.data[cube.UP + 7] == color1 && cube.data[cube.FRONT + 1] == color0)
                || (cube.data[cube.UP + 3] == color0 && cube.data[cube.LEFT + 1] == color1)
                || (cube.data[cube.UP + 3] == color1 && cube.data[cube.LEFT + 1] == color0);
        }, [
            [cubeNotationMove (MOVE_L,  1)],
            [cubeNotationMove (MOVE_L, -1)],
            [cubeNotationMove (MOVE_R,  1)],
            [cubeNotationMove (MOVE_R, -1)],
            [cubeNotationMove (MOVE_F,  1)],
            [cubeNotationMove (MOVE_F, -1)],
            [cubeNotationMove (MOVE_B,  1)],
            [cubeNotationMove (MOVE_B, -1)],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            [cubeNotationMove (MOVE_D,  1)],
            [cubeNotationMove (MOVE_D, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to solveFirstF2LEdge: move edge to top layer");
            return null;
        }
        solution = solution.concat(temp);

        // 3. move edge piece above orange center
        temp = this.findMinSolution (cube, 3, (cube) => {
            const color0 = ORANGE;
            const color1 = BLUE;
            return (cube.data[cube.UP + 3] == color0 && cube.data[cube.LEFT + 1] == color1)
                || (cube.data[cube.UP + 3] == color1 && cube.data[cube.LEFT + 1] == color0);
        }, [
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to solveFirstF2LEdge: move edge above orange center");
            return null;
        }
        solution = solution.concat(temp);
        
        // 4. solve edge piece (2 algorithms)
        let moveset;
        if (cube.data[cube.UP + 3] == BLUE)
        {
            moveset = [
                cubeNotationMove (MOVE_L,  1),
                cubeNotationMove (MOVE_F, -1),
                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_F,  1),
            ];
        }
        else
        {
            moveset = [
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_F, -1),
                cubeNotationMove (MOVE_L,  1),
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_L, -1),
            ];
        }
        for (const move of moveset)
        {
            const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
            cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
            solution.push (move);
        }

        return solution;
    }

    // =======================================================================

    solveFirstF2LCorner (cube) {
        let solution = [];

        // 1. check if it is already solved
        if (this.isFirstF2LCornerSolved (cube))
            return [];

        // 2. move corner to top layer
        let temp = this.findMinSolution (cube, 4, (cube) => {
            const color0 = ORANGE;
            const color1 = BLUE;
            const color2 = WHITE;
            const colors = [color0, color1, color2];
            // Ensure progress wasnt broken
            if (!(this.isCrossSolved (cube) && this.isFirstF2LEdgeSolved (cube)))
                return false;
            return (colors.includes (cube.data[cube.UP + 0]) && colors.includes(cube.data[cube.BACK  + 2]) && colors.includes (cube.data[cube.LEFT  + 0]))
                || (colors.includes (cube.data[cube.UP + 2]) && colors.includes(cube.data[cube.BACK  + 0]) && colors.includes (cube.data[cube.RIGHT + 2]))
                || (colors.includes (cube.data[cube.UP + 6]) && colors.includes(cube.data[cube.FRONT + 0]) && colors.includes (cube.data[cube.LEFT  + 2]))
                || (colors.includes (cube.data[cube.UP + 8]) && colors.includes(cube.data[cube.FRONT + 2]) && colors.includes (cube.data[cube.RIGHT + 0]));
        }, [
            [cubeNotationMove (MOVE_L,  1)],
            [cubeNotationMove (MOVE_L, -1)],
            [cubeNotationMove (MOVE_R,  1)],
            [cubeNotationMove (MOVE_R, -1)],
            [cubeNotationMove (MOVE_F,  1)],
            [cubeNotationMove (MOVE_F, -1)],
            [cubeNotationMove (MOVE_B,  1)],
            [cubeNotationMove (MOVE_B, -1)],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            [cubeNotationMove (MOVE_D,  1)],
            [cubeNotationMove (MOVE_D, -1)],
            // Algorithm to handle case when corner is 
            // in correct position but wrong orientation
            [
                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_L,  1),
                cubeNotationMove (MOVE_U, -1),

                cubeNotationMove (MOVE_L,  1),
                cubeNotationMove (MOVE_F, -1),
                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_F,  1),
            ]
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to solveFirstF2LCorner: move corner to top layer");
            return null;
        }
        solution = solution.concat(temp);

        // 3. move corner to above edge
        temp = this.findMinSolution (cube, 3, (cube) => {
            const color0 = ORANGE;
            const color1 = BLUE;
            const color2 = WHITE;
            const colors = [color0, color1, color2];
            return (colors.includes (cube.data[cube.UP + 6]) && colors.includes(cube.data[cube.FRONT + 0]) && colors.includes (cube.data[cube.LEFT + 2]));
        }, [
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to solveFirstF2LCorner: move corner above edge");
            return null;
        }
        solution = solution.concat(temp);

        // 4. solve corner piece (3 algorithms)
        // white on top
        let moveset;
        if (cube.data[cube.UP + 6] == WHITE)
        {
            moveset = [
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_F, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_F, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_F, -1),
                cubeNotationMove (MOVE_U, -1),
            ];
        }
        // white left
        else if (cube.data[cube.LEFT + 2] == WHITE)
        {
            moveset = [
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_F, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_F, -1),
            ];
        }
        // white front
        else
        {
            moveset = [
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_L,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_L,  1),
            ];
        }
        for (const move of moveset)
        {
            const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
            cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
            solution.push (move);
        }
        return solution;
    }

    // =======================================================================

    solveSecondF2LMin (cube) {
        const name = "solveSecondF2LMin";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = this.findMinSolution (cube, this.MAX_F2L_MOVES, (cube) => {
            return this.isCrossSolved (cube) 
                && this.isFirstF2LSolved (cube) 
                && this.isSecondF2LSolved (cube);
        }, [
            [cubeNotationMove (MOVE_L,  1)],
            [cubeNotationMove (MOVE_L, -1)],
            [cubeNotationMove (MOVE_R,  1)],
            [cubeNotationMove (MOVE_R, -1)],
            [cubeNotationMove (MOVE_F,  1)],
            [cubeNotationMove (MOVE_F, -1)],
            [cubeNotationMove (MOVE_B,  1)],
            [cubeNotationMove (MOVE_B, -1)],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    solveSecondF2L (cube) {
        const name = "solveSecondF2L";
        console.log (name);
        console.time (name);
        let solution = [];
        
        // Solve Edge Piece
        let temp = this.solveSecondF2LEdge (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        // Solve Corner Piece
        temp = this.solveSecondF2LCorner (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    solveSecondF2LEdge (cube) {
        let solution = [];

        // 1. check if it is already solved
        if (this.isSecondF2LEdgeSolved (cube))
            return [];

        // 2. move edge piece to top layer anywhere
        let temp = this.findMinSolution (cube, 4, (cube) => {
            const color0 = ORANGE;
            const color1 = GREEN;
            // Ensure progress wasnt broken
            if (!(this.isCrossSolved (cube)
                && this.isFirstF2LSolved (cube)))
                return false;
            // Edge piece is in top layer
            return (cube.data[cube.UP + 1] == color0 && cube.data[cube.BACK + 1] == color1)
                || (cube.data[cube.UP + 1] == color1 && cube.data[cube.BACK + 1] == color0)
                || (cube.data[cube.UP + 5] == color0 && cube.data[cube.RIGHT + 1] == color1)
                || (cube.data[cube.UP + 5] == color1 && cube.data[cube.RIGHT + 1] == color0)
                || (cube.data[cube.UP + 7] == color0 && cube.data[cube.FRONT + 1] == color1)
                || (cube.data[cube.UP + 7] == color1 && cube.data[cube.FRONT + 1] == color0)
                || (cube.data[cube.UP + 3] == color0 && cube.data[cube.LEFT + 1] == color1)
                || (cube.data[cube.UP + 3] == color1 && cube.data[cube.LEFT + 1] == color0);
        }, [
            [cubeNotationMove (MOVE_L,  1)],
            [cubeNotationMove (MOVE_L, -1)],
            [cubeNotationMove (MOVE_R,  1)],
            [cubeNotationMove (MOVE_R, -1)],
            [cubeNotationMove (MOVE_F,  1)],
            [cubeNotationMove (MOVE_F, -1)],
            [cubeNotationMove (MOVE_B,  1)],
            [cubeNotationMove (MOVE_B, -1)],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            [cubeNotationMove (MOVE_D,  1)],
            [cubeNotationMove (MOVE_D, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to solveSecondF2LEdge: move edge to top layer");
            return null;
        }
        solution = solution.concat(temp);

        // 3. move edge piece above orange center
        temp = this.findMinSolution (cube, 3, (cube) => {
            const color0 = ORANGE;
            const color1 = GREEN;
            return (cube.data[cube.UP + 3] == color0 && cube.data[cube.LEFT + 1] == color1)
                || (cube.data[cube.UP + 3] == color1 && cube.data[cube.LEFT + 1] == color0);
        }, [
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to solveSecondF2LEdge: move edge above center");
            return null;
        }
        solution = solution.concat(temp);
        
        // 4. solve edge piece (2 algorithms)
        let moveset;
        if (cube.data[cube.UP + 3] == GREEN)
        {
            moveset = [
                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_B,  1),
                cubeNotationMove (MOVE_L,  1),
                cubeNotationMove (MOVE_B, -1),
            ];
        }
        else
        {
            moveset = [
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_B,  1),
                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_B, -1),
                cubeNotationMove (MOVE_L,  1),
            ];
        }
        for (const move of moveset)
        {
            const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
            cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
            solution.push (move);
        }

        return solution;
    }

    // =======================================================================

    solveSecondF2LCorner (cube) {
        let solution = [];

        // 1. check if it is already solved
        if (this.isSecondF2LCornerSolved (cube))
            return [];

        // 2. move corner to top layer
        let temp = this.findMinSolution (cube, 4, (cube) => {
            const color0 = ORANGE;
            const color1 = GREEN;
            const color2 = WHITE;
            const colors = [color0, color1, color2];
            // Ensure progress wasnt broken
            if (!(this.isCrossSolved (cube)
                && this.isFirstF2LSolved (cube)
                && this.isSecondF2LEdgeSolved (cube)))
                return false;
            return (colors.includes (cube.data[cube.UP + 0]) && colors.includes(cube.data[cube.BACK + 2]) && colors.includes (cube.data[cube.LEFT + 0]))
                || (colors.includes (cube.data[cube.UP + 2]) && colors.includes(cube.data[cube.BACK + 0]) && colors.includes (cube.data[cube.RIGHT + 2]))
                || (colors.includes (cube.data[cube.UP + 6]) && colors.includes(cube.data[cube.FRONT + 0]) && colors.includes (cube.data[cube.LEFT + 2]))
                || (colors.includes (cube.data[cube.UP + 8]) && colors.includes(cube.data[cube.FRONT + 2]) && colors.includes (cube.data[cube.RIGHT + 0]));
        }, [
            [cubeNotationMove (MOVE_L,  1)],
            [cubeNotationMove (MOVE_L, -1)],
            [cubeNotationMove (MOVE_R,  1)],
            [cubeNotationMove (MOVE_R, -1)],
            [cubeNotationMove (MOVE_F,  1)],
            [cubeNotationMove (MOVE_F, -1)],
            [cubeNotationMove (MOVE_B,  1)],
            [cubeNotationMove (MOVE_B, -1)],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            [cubeNotationMove (MOVE_D,  1)],
            [cubeNotationMove (MOVE_D, -1)],
            // Algorithm to handle case when corner is 
            // in correct position but wrong orientation
            [
                cubeNotationMove (MOVE_L,  1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_U,  1),

                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_B,  1),
                cubeNotationMove (MOVE_L,  1),
                cubeNotationMove (MOVE_B, -1),
            ]
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to solveSecondF2LCorner: move corner to top layer");
            return null;
        }
        solution = solution.concat(temp);

        // 3. move corner to above edge
        temp = this.findMinSolution (cube, 3, (cube) => {
            const color0 = ORANGE;
            const color1 = GREEN;
            const color2 = WHITE;
            const colors = [color0, color1, color2];
            return (colors.includes (cube.data[cube.UP + 0]) && colors.includes(cube.data[cube.BACK + 2]) && colors.includes (cube.data[cube.LEFT + 0]));
        }, [
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to solveSecondF2LCorner: move corner above edge");
            return null;
        }
        solution = solution.concat(temp);

        // 4. solve corner piece (3 algorithms)
        // white on top
        let moveset;
        if (cube.data[cube.UP + 0] == WHITE)
        {
            moveset = [
                cubeNotationMove (MOVE_L,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_L,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_L,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_U, -1),
            ];
        }
        // white left
        else if (cube.data[cube.LEFT + 0] == WHITE)
        {
            moveset = [
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_B, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_B,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_B, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_B,  1),
            ];
        }
        // white back
        else
        {
            moveset = [
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_L,  1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_L,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_L, -1),
            ];
        }
        for (const move of moveset)
        {
            const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
            cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
            solution.push (move);
        }
        return solution;
    }

    // =======================================================================

    solveThirdF2LMin (cube) {
        const name = "solveThirdF2LMin";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = this.findMinSolution (cube, this.MAX_F2L_MOVES, (cube) => {
            return this.isCrossSolved (cube) 
                && this.isFirstF2LSolved (cube) 
                && this.isSecondF2LSolved (cube)
                && this.isThirdF2LSolved (cube);
        }, [
            [cubeNotationMove (MOVE_R,  1)],
            [cubeNotationMove (MOVE_R, -1)],
            [cubeNotationMove (MOVE_F,  1)],
            [cubeNotationMove (MOVE_F, -1)],
            [cubeNotationMove (MOVE_B,  1)],
            [cubeNotationMove (MOVE_B, -1)],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    solveThirdF2L (cube) {
        const name = "solveThirdF2L";
        console.log (name);
        console.time (name);
        let solution = [];
        
        // Solve Edge Piece
        let temp = this.solveThirdF2LEdge (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        // Solve Corner Piece
        temp = this.solveThirdF2LCorner (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    solveThirdF2LEdge (cube) {
        let solution = [];

        // 1. check if it is already solved
        if (this.isThirdF2LEdgeSolved (cube))
            return [];

        // 2. move edge piece to top layer anywhere
        let temp = this.findMinSolution (cube, 4, (cube) => {
            const color0 = RED;
            const color1 = BLUE;
            // Ensure progress wasnt broken
            if (!(this.isCrossSolved (cube)
                && this.isFirstF2LSolved (cube)
                && this.isSecondF2LSolved (cube)))
                return false;
            // Edge piece is in top layer
            return (cube.data[cube.UP + 1] == color0 && cube.data[cube.BACK + 1] == color1)
                || (cube.data[cube.UP + 1] == color1 && cube.data[cube.BACK + 1] == color0)
                || (cube.data[cube.UP + 5] == color0 && cube.data[cube.RIGHT + 1] == color1)
                || (cube.data[cube.UP + 5] == color1 && cube.data[cube.RIGHT + 1] == color0)
                || (cube.data[cube.UP + 7] == color0 && cube.data[cube.FRONT + 1] == color1)
                || (cube.data[cube.UP + 7] == color1 && cube.data[cube.FRONT + 1] == color0)
                || (cube.data[cube.UP + 3] == color0 && cube.data[cube.LEFT + 1] == color1)
                || (cube.data[cube.UP + 3] == color1 && cube.data[cube.LEFT + 1] == color0);
        }, [
            [cubeNotationMove (MOVE_R,  1)],
            [cubeNotationMove (MOVE_R, -1)],
            [cubeNotationMove (MOVE_F,  1)],
            [cubeNotationMove (MOVE_F, -1)],
            [cubeNotationMove (MOVE_B,  1)],
            [cubeNotationMove (MOVE_B, -1)],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to solveThirdF2LEdge: move edge to top layer");
            return null;
        }
        solution = solution.concat(temp);

        // 3. move edge piece above red center
        temp = this.findMinSolution (cube, 3, (cube) => {
            const color0 = RED;
            const color1 = BLUE;
            return (cube.data[cube.UP + 5] == color0 && cube.data[cube.RIGHT + 1] == color1)
                || (cube.data[cube.UP + 5] == color1 && cube.data[cube.RIGHT + 1] == color0);
        }, [
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to solveThirdF2LEdge: move edge above center");
            return null;
        }
        solution = solution.concat(temp);
        
        // 4. solve edge piece (2 algorithms)
        let moveset;
        if (cube.data[cube.UP + 5] == BLUE)
        {
            moveset = [
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_F, -1),
            ];
        }
        else
        {
            moveset = [
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_F, -1),
                cubeNotationMove (MOVE_R,  1),
            ];
        }
        for (const move of moveset)
        {
            const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
            cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
            solution.push (move);
        }

        return solution;
    }

    // =======================================================================

    solveThirdF2LCorner (cube) {
        let solution = [];

        // 1. check if it is already solved
        if (this.isThirdF2LCornerSolved (cube))
            return [];

        // 2. move corner to top layer
        let temp = this.findMinSolution (cube, 4, (cube) => {
            const color0 = RED;
            const color1 = BLUE;
            const color2 = WHITE;
            const colors = [color0, color1, color2];
            // Ensure progress wasnt broken
            if (!(this.isCrossSolved (cube)
                && this.isFirstF2LSolved (cube)
                && this.isSecondF2LSolved (cube)
                && this.isThirdF2LEdgeSolved (cube)))
                return false;
            return (colors.includes (cube.data[cube.UP + 0]) && colors.includes(cube.data[cube.BACK + 2]) && colors.includes (cube.data[cube.LEFT + 0]))
                || (colors.includes (cube.data[cube.UP + 2]) && colors.includes(cube.data[cube.BACK + 0]) && colors.includes (cube.data[cube.RIGHT + 2]))
                || (colors.includes (cube.data[cube.UP + 6]) && colors.includes(cube.data[cube.FRONT + 0]) && colors.includes (cube.data[cube.LEFT + 2]))
                || (colors.includes (cube.data[cube.UP + 8]) && colors.includes(cube.data[cube.FRONT + 2]) && colors.includes (cube.data[cube.RIGHT + 0]));
        }, [
            [cubeNotationMove (MOVE_R,  1)],
            [cubeNotationMove (MOVE_R, -1)],
            [cubeNotationMove (MOVE_F,  1)],
            [cubeNotationMove (MOVE_F, -1)],
            [cubeNotationMove (MOVE_B,  1)],
            [cubeNotationMove (MOVE_B, -1)],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            [cubeNotationMove (MOVE_D,  1)],
            [cubeNotationMove (MOVE_D, -1)],
            // Algorithm to handle case when corner is 
            // in correct position but wrong orientation
            [
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_F, -1),
            ]
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to solveThirdF2LCorner: move corner to top layer");
            return null;
        }
        solution = solution.concat(temp);

        // 3. move corner to above edge
        temp = this.findMinSolution (cube, 3, (cube) => {
            const color0 = RED;
            const color1 = BLUE;
            const color2 = WHITE;
            const colors = [color0, color1, color2];
            return (colors.includes (cube.data[cube.UP + 8]) && colors.includes(cube.data[cube.FRONT + 2]) && colors.includes (cube.data[cube.RIGHT + 0]));
        }, [
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to solveThirdF2LCorner: move corner above edge");
            return null;
        }
        solution = solution.concat(temp);

        // 4. solve corner piece (3 algorithms)
        // white on top
        let moveset;
        if (cube.data[cube.UP + 8] == WHITE)
        {
            moveset = [
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
            ];
        }
        // white right
        else if (cube.data[cube.RIGHT + 0] == WHITE)
        {
            moveset = [
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_F, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_F, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_F,  1),
            ];
        }
        // white front
        else
        {
            moveset = [
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
            ];
        }
        for (const move of moveset)
        {
            const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
            cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
            solution.push (move);
        }

        return solution;
    }

    // =======================================================================

    solveFourthF2LMin (cube) {
        const name = "solveFourthF2LMin";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = this.findMinSolution (cube, this.MAX_F2L_MOVES, (cube) => {
            return this.isCrossSolved (cube) 
                && this.isFirstF2LSolved (cube) 
                && this.isSecondF2LSolved (cube)
                && this.isThirdF2LSolved (cube)
                && this.isFourthF2LSolved (cube);
        }, [
            [cubeNotationMove (MOVE_L,  1)],
            [cubeNotationMove (MOVE_L, -1)],
            [cubeNotationMove (MOVE_R,  1)],
            [cubeNotationMove (MOVE_R, -1)],
            [cubeNotationMove (MOVE_F,  1)],
            [cubeNotationMove (MOVE_F, -1)],
            [cubeNotationMove (MOVE_B,  1)],
            [cubeNotationMove (MOVE_B, -1)],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    solveFourthF2L (cube) {
        const name = "solveFourthF2L";
        console.log (name);
        console.time (name);
        let solution = [];
        
        // Solve Edge Piece
        let temp = this.solveFourthF2LEdge (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        // Solve Corner Piece
        temp = this.solveFourthF2LCorner (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    solveFourthF2LEdge (cube) {
        let solution = [];

        // 1. check if it is already solved
        if (this.isFourthF2LEdgeSolved (cube))
            return [];

        // 2. move edge piece to top layer anywhere
        let temp = this.findMinSolution (cube, 4, (cube) => {
            const color0 = RED;
            const color1 = GREEN;
            // Ensure progress wasnt broken
            if (!(this.isCrossSolved (cube)
                && this.isFirstF2LSolved (cube)
                && this.isSecondF2LSolved (cube)
                && this.isThirdF2LSolved (cube)))
                return false;
            // Edge piece is in top layer
            return (cube.data[cube.UP + 1] == color0 && cube.data[cube.BACK + 1] == color1)
                || (cube.data[cube.UP + 1] == color1 && cube.data[cube.BACK + 1] == color0)
                || (cube.data[cube.UP + 5] == color0 && cube.data[cube.RIGHT + 1] == color1)
                || (cube.data[cube.UP + 5] == color1 && cube.data[cube.RIGHT + 1] == color0)
                || (cube.data[cube.UP + 7] == color0 && cube.data[cube.FRONT + 1] == color1)
                || (cube.data[cube.UP + 7] == color1 && cube.data[cube.FRONT + 1] == color0)
                || (cube.data[cube.UP + 3] == color0 && cube.data[cube.LEFT + 1] == color1)
                || (cube.data[cube.UP + 3] == color1 && cube.data[cube.LEFT + 1] == color0);
        }, [
            [cubeNotationMove (MOVE_R,  1)],
            [cubeNotationMove (MOVE_R, -1)],
            [cubeNotationMove (MOVE_F,  1)],
            [cubeNotationMove (MOVE_F, -1)],
            [cubeNotationMove (MOVE_B,  1)],
            [cubeNotationMove (MOVE_B, -1)],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            [cubeNotationMove (MOVE_D,  1)],
            [cubeNotationMove (MOVE_D, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to solveFourthF2LEdge: move edge to top layer");
            return null;
        }
        solution = solution.concat(temp);

        // 3. move edge piece above red center
        temp = this.findMinSolution (cube, 3, (cube) => {
            const color0 = RED;
            const color1 = GREEN;
            return (cube.data[cube.UP + 5] == color0 && cube.data[cube.RIGHT + 1] == color1)
                || (cube.data[cube.UP + 5] == color1 && cube.data[cube.RIGHT + 1] == color0);
        }, [
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to solveFourthF2LEdge: move edge above center");
            return null;
        }
        solution = solution.concat(temp);
        
        // 4. solve edge piece (2 algorithms)
        let moveset;
        if (cube.data[cube.UP + 5] == GREEN)
        {
            moveset = [
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_B, -1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_B,  1),
            ];
        }
        else
        {
            moveset = [
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_B, -1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_B,  1),
                cubeNotationMove (MOVE_R, -1),
            ];
        }
        for (const move of moveset)
        {
            const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
            cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
            solution.push (move);
        }

        return solution;
    }

    // =======================================================================

    solveFourthF2LCorner (cube) {
        let solution = [];

        // 1. check if it is already solved
        if (this.isFourthF2LCornerSolved (cube))
            return [];

        // 2. move corner to top layer
        let temp = this.findMinSolution (cube, 6, (cube) => {
            const color0 = RED;
            const color1 = GREEN;
            const color2 = WHITE;
            const colors = [color0, color1, color2];
            // Ensure progress wasnt broken
            if (!(this.isCrossSolved (cube)
                && this.isFirstF2LSolved (cube)
                && this.isSecondF2LSolved (cube)
                && this.isThirdF2LSolved (cube)
                && this.isFourthF2LEdgeSolved (cube)))
                return false;
            return (colors.includes (cube.data[cube.UP + 0]) && colors.includes(cube.data[cube.BACK + 2]) && colors.includes (cube.data[cube.LEFT + 0]))
                || (colors.includes (cube.data[cube.UP + 2]) && colors.includes(cube.data[cube.BACK + 0]) && colors.includes (cube.data[cube.RIGHT + 2]))
                || (colors.includes (cube.data[cube.UP + 6]) && colors.includes(cube.data[cube.FRONT + 0]) && colors.includes (cube.data[cube.LEFT + 2]))
                || (colors.includes (cube.data[cube.UP + 8]) && colors.includes(cube.data[cube.FRONT + 2]) && colors.includes (cube.data[cube.RIGHT + 0]));
        }, [
            [cubeNotationMove (MOVE_R,  1)],
            [cubeNotationMove (MOVE_R, -1)],
            [cubeNotationMove (MOVE_F,  1)],
            [cubeNotationMove (MOVE_F, -1)],
            [cubeNotationMove (MOVE_B,  1)],
            [cubeNotationMove (MOVE_B, -1)],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            [cubeNotationMove (MOVE_D,  1)],
            [cubeNotationMove (MOVE_D, -1)],
            // Algorithm to handle case when corner is 
            // in correct position but wrong orientation
            [
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U, -1),

                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_B, -1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_B,  1),
            ]
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to solveFourthF2LCorner: move corner to top layer");
            return null;
        }
        solution = solution.concat(temp);

        // 3. move corner to above edge
        temp = this.findMinSolution (cube, 3, (cube) => {
            const color0 = RED;
            const color1 = GREEN;
            const color2 = WHITE;
            const colors = [color0, color1, color2];
            return (colors.includes (cube.data[cube.UP + 2]) && colors.includes(cube.data[cube.BACK + 0]) && colors.includes (cube.data[cube.RIGHT + 2]));
        }, [
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to solveFourthF2LCorner: move corner above edge");
            return null;
        }
        solution = solution.concat(temp);

        // 4. solve corner piece (3 algorithms)
        // white on top
        let moveset;
        if (cube.data[cube.UP + 2] == WHITE)
        {
            moveset = [
                cubeNotationMove (MOVE_B,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_B, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_B,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_B, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_B,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_B, -1),
                cubeNotationMove (MOVE_U, -1),
            ];
        }
        // white left
        else if (cube.data[cube.RIGHT + 2] == WHITE)
        {
            moveset = [
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_B,  1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_B, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_B,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_B, -1),
            ];
        }
        // white back
        else
        {
            moveset = [
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R,  1),
            ];
        }
        for (const move of moveset)
        {
            const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
            cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
            solution.push (move);
        }

        return solution;
    }

    // =======================================================================

    solve2LookOLL (cube) {
        const name = "solve2LookOLL";
        console.log (name);
        console.time (name);

        let solution = [];
        // Edges
        let temp = this.solve2LookOLLEdges (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // Corners
        temp = this.solve2LookOLLCorners (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    solve2LookOLLEdges (cube) {
        const name = "solve2LookOLLEdges";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = this.findMinSolution (cube, this.MAX_OLL_CROSS, (cube) => {
            return this.isYellowCrossSolved (cube);
        }, [
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            // Dot (0 edges solved)
            //    x
            //  +---+
            //  |   |
            // x| x |x
            //  |   |
            //  +---+
            //    x
            // F R U R' U' F' f R U R' U' f'
            // F R U R' U' F' (F S) R U R' U' (F' S')
            [
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_F, -1),
                // F S == f
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_S,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
                // F' S' == f'
                cubeNotationMove (MOVE_F, -1),
                cubeNotationMove (MOVE_S, -1),
            ],
            // Bar (2 opposite edges solved)
            //    x
            //  +---+
            //  |   |
            //  |xxx|
            //  |   |
            //  +---+
            //    x
            // F R U R' U' F'
            [
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_F, -1),
            ],
            // L-shape (2 adjacent edges solved)
            //    x
            //  +---+
            //  |   |
            // x| xx|
            //  | x |
            //  +---+
            // f R U R' U' f'
            // (F S) R U R' U' (F' S')
            [
                // F S == f
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_S,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
                // F' S' == f'
                cubeNotationMove (MOVE_F, -1),
                cubeNotationMove (MOVE_S, -1),
            ]
        ], true);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    solve2LookOLLCorners (cube) {
        const name = "solve2LookOLLCorners";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = this.findMinSolution (cube, this.MAX_OLL_CORNERS, (cube) => {
            return this.isYellowCornersOrientated (cube);
        }, [
            // Antisune
            // 
            //  + - - - +
            // X|   X X |
            //  | X X X |
            //  |   X   |X
            //  + - - - +
            //    X
            // R U2 R' U' R U' R'
            [
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R, -1),
            ],
            // H
            //  + - - - +
            // X|   X   |X
            //  | X X X |
            // X|   X   |X
            //  + - - - +
            // R U R' U R U' R' U R U2 R'
            [
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
            ],
            // L
            //  + - - - +
            //  | X X   |X
            //  | X X X |
            //  |   X X |
            //  + - - - +
            //    X
            // F R' F' r U R U' r'
            // F R' F' (R M') U R U' (R' M)
            [
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_F, -1),
                // r = R M'
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_M, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U, -1),
                // r' = R' M
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_M,  1),
            ],
            // Pi
            //        X
            //  + - - - +
            // X|   X   |
            //  | X X X |
            // X|   X   |
            //  + - - - +
            //        X
            // R U2 R2 U' R2 U' R2 U2 R
            // R (U U) (R R) U' (R R) U' (R R) (U U) R
            [
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R,  1),
            ],
            // Sune (aka fishy alg)
            //    X
            //  + - - - +
            //  |   X   |X
            //  | X X X |
            //  | X X   |
            //  + - - - +
            //        X
            // R U R' U R U2 R'
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
            // T
            //    X
            //  + - - - +
            //  |   X X |
            //  | X X X |
            //  |   X X |
            //  + - - - +
            //    X
            // r U R' U' r' F R F'
            // (R M') U R' U' (R' M) F R F'
            [
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_M, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_M,  1),
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_F, -1),
            ],
            // U
            //  + - - - +
            //  | X X X |
            //  | X X X |
            //  |   X   |
            //  + - - - +
            //    X   X
            // R2 D R' U2 R D' R' U2 R'
            [
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_D,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_D, -1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
            ],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)]
        ], true);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    solve2LookPLL (cube) {
        const name = "solve2LookPLL";
        console.log (name);
        console.time (name);

        let solution = [];
        // Edges
        let temp = this.solve2LookPLLCorners (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // Corners
        temp = this.solve2LookPLLEdges (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    solve2LookPLLCorners (cube) {
        const name = "solve2LookPLLCorners";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = this.findMinSolution (cube, this.MAX_PLL_CORNERS, (cube) => {
            return this.isYellowCornersSolved (cube);
        }, [
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            // Diagonal corner swap (Y-Perm)
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    B   G
            //  + - - - +
            // R| Y Y Y |R
            //  | Y Y Y |
            // O| Y Y Y |O
            //  + - - - +
            //    B   G
            // F R U' R' U' R U R' F' R U R' U' R' F R F'
            [
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
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
                cubeNotationMove (MOVE_F, -1),
            ],
            // Headlights - Adjacent corner swap (T-Perm)
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    G   R
            //  + - - - +
            // O| Y Y Y |B
            //  | Y Y Y |
            // O| Y Y Y |G
            //  + - - - +
            //    B   R
            // R U R' U' R' F R2 U' R' U' R U R' F'
            [
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
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_F, -1),
            ],
            // J-perm algorithm
            // [
            //     cubeNotationMove (MOVE_R,  1),
            //     cubeNotationMove (MOVE_U,  1),
            //     cubeNotationMove (MOVE_R, -1),
            //     cubeNotationMove (MOVE_F, -1),
            //     cubeNotationMove (MOVE_R,  1),
            //     cubeNotationMove (MOVE_U,  1),
            //     cubeNotationMove (MOVE_R, -1),
            //     cubeNotationMove (MOVE_U, -1),
            //     cubeNotationMove (MOVE_R, -1),
            //     cubeNotationMove (MOVE_F,  1),
            //     cubeNotationMove (MOVE_R,  1),
            //     cubeNotationMove (MOVE_R,  1),
            //     cubeNotationMove (MOVE_U, -1),
            //     cubeNotationMove (MOVE_R, -1),
            //     cubeNotationMove (MOVE_U, -1),
            // ],
        ], true);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    solve2LookPLLEdges (cube) {
        const name = "solve2LookPLLEdges";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = this.findMinSolution (cube, this.MAX_PLL_EDGES, (cube) => {
            return this.isYellowCornersSolved (cube)
                && this.isYellowEdgesSolved (cube);
        }, [
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            // PLL H-perm (swap opposite edges vertically and horizontally)
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    G B G
            //  + - - - +
            // O| Y Y Y |R
            // R| Y Y Y |O
            // O| Y Y Y |R
            //  + - - - +
            //    B G B
            // M2 U M2 U2 M2 U M2
            [
                cubeNotationMove (MOVE_M,  1),
                cubeNotationMove (MOVE_M,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_M,  1),
                cubeNotationMove (MOVE_M,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_M,  1),
                cubeNotationMove (MOVE_M,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_M,  1),
                cubeNotationMove (MOVE_M,  1),
            ],
            // PLL Ua-perm (cycle 3 edges counterclockwise)
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    G G G
            //  + - - - +
            // O| Y Y Y |R
            // B| Y Y Y |O
            // O| Y Y Y |R
            //  + - - - +
            //    B R B
            // R U' R U R U R U' R' U' R2
            [
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_R,  1),
            ],
            // PLL Ub-perm (cycle 3 edges clockwise)
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    G G G
            //  + - - - +
            // O| Y Y Y |R
            // R| Y Y Y |B
            // O| Y Y Y |R
            //  + - - - +
            //    B O B
            // R2 U R U R' U' R' U' R' U R'
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
            // PLL Z-perm (swap adjacent edges F<-->L R<-->B)
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    R B R
            //  + - - - +
            // G| Y Y Y |B
            // O| Y Y Y |R
            // G| Y Y Y |B
            //  + - - - +
            //    O G O
            // M' U M2 U M2 U M' U2 M2
            [
                cubeNotationMove (MOVE_M, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_M,  1),
                cubeNotationMove (MOVE_M,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_M,  1),
                cubeNotationMove (MOVE_M,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_M, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_M,  1),
                cubeNotationMove (MOVE_M,  1),
            ],
        ], true);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    findMinSolution (cube, maxMoves, isSolved, moveSetsToTry, shouldCheckLengthBeforeSolved)
    {
        let solution = null;
        for (var i = 1; i < maxMoves; ++i) {
            solution = this.findMinSolution_ (cube, [], 0, i, isSolved, moveSetsToTry, shouldCheckLengthBeforeSolved);
            if (solution != null) {
                // Found the solution!
                console.log ("min solution:", moveSetToString (solution));
                break;
            }
        }
        return solution;
    }

    // =======================================================================

    findMinSolution_ (cube, path, prevMove, limit, isSolved, moveSetsToTry, shouldCheckLengthBeforeSolved = false) {
        // Ensure max moves are not exceeded before checking solution
        if (shouldCheckLengthBeforeSolved && path.length >= limit)
            return null;

        // solution found
        if (isSolved (cube)) {
            return path;
        }

        // Ensure we aren't going to exceed the max number of moves
        if (path.length >= limit)
            return null;

        // path not found
        // keep searching
        let result;
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
            result = this.findMinSolution_ (cube, path, moveSet.length == 1 ? moveSet[0] : 0, limit, isSolved, moveSetsToTry, shouldCheckLengthBeforeSolved);
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
        return this.isFirstF2LEdgeSolved (cube)
            && this.isFirstF2LCornerSolved (cube);
    }

    // =======================================================================

    isFirstF2LEdgeSolved (cube) {
        if (cube.data[cube.FRONT + 3] != BLUE  ) return false;
        if (cube.data[cube.LEFT  + 5] != ORANGE) return false;
        return true;
    }

    // =======================================================================

    isFirstF2LCornerSolved (cube) {
        if (cube.data[cube.DOWN  + 0] != WHITE ) return false;
        if (cube.data[cube.FRONT + 6] != BLUE  ) return false;
        if (cube.data[cube.LEFT  + 8] != ORANGE) return false;
        return true;
    }

    // =======================================================================

    isSecondF2LSolved (cube) {
        return this.isSecondF2LEdgeSolved (cube)
            && this.isSecondF2LCornerSolved (cube);
    }

    // =======================================================================

    isSecondF2LEdgeSolved (cube) {
        if (cube.data[cube.LEFT  + 3] != ORANGE) return false;
        if (cube.data[cube.BACK  + 5] != GREEN ) return false;
        return true;
    }

    // =======================================================================

    isSecondF2LCornerSolved (cube) {
        if (cube.data[cube.LEFT  + 6] != ORANGE) return false;
        if (cube.data[cube.BACK  + 8] != GREEN ) return false;
        if (cube.data[cube.DOWN  + 6] != WHITE ) return false;
        return true;
    }

    // =======================================================================
    
    isThirdF2LSolved (cube) {
        return this.isThirdF2LEdgeSolved (cube)
            && this.isThirdF2LCornerSolved (cube);
    }

    // =======================================================================
    
    isThirdF2LEdgeSolved (cube) {
        // Edge piece
        if (cube.data[cube.RIGHT + 3] != RED ) return false;
        if (cube.data[cube.FRONT + 5] != BLUE) return false;
        return true;
    }

    // =======================================================================
    
    isThirdF2LCornerSolved (cube) {
        // Corner piece
        if (cube.data[cube.RIGHT + 6] != RED   ) return false;
        if (cube.data[cube.FRONT + 8] != BLUE  ) return false;
        if (cube.data[cube.DOWN  + 2] != WHITE ) return false;
        return true;
    }

    // =======================================================================
    
    isFourthF2LSolved (cube) {
        return this.isFourthF2LEdgeSolved (cube)
            && this.isFourthF2LCornerSolved (cube);
    }

    // =======================================================================
    
    isFourthF2LEdgeSolved (cube) {
        // Edge piece
        if (cube.data[cube.RIGHT + 5] != RED   ) return false;
        if (cube.data[cube.BACK  + 3] != GREEN ) return false;
        return true;
    }

    // =======================================================================
    
    isFourthF2LCornerSolved (cube) {
        // Corner piece
        if (cube.data[cube.RIGHT + 8] != RED   ) return false;
        if (cube.data[cube.BACK  + 6] != GREEN ) return false;
        if (cube.data[cube.DOWN  + 8] != WHITE ) return false;
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