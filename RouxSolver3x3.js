// Rubiks Cube Solver: Roux method for 3x3
// By Amy Burnett
// =======================================================================
// Globals/constants

// =======================================================================

class RouxSolver3x3
{

    constructor ()
    {
        this.MAX_CUBE_ORIENTATION_MOVES = 4;
        this.MAX_FIRST_BLOCK_BOTTOM_EDGE_MOVES = 7;
        this.MAX_FIRST_BLOCK_FIRST_PAIR_MOVES = 12;
        this.MAX_FIRST_BLOCK_SECOND_PAIR_MOVES = 12;
    }

    // =======================================================================

    // returns a list of moves to solve the cube from the current state
    // this can fluctuate in time between instant and a few seconds
    findSolution (cube)
    {
        let solution = [];

        // Orient cube
        let temp = this.findSolutionToOrientTheCube (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // First block - bottom edge
        temp = this.findSolutionToFirstBlocksBottomEdge (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // First block - first F2L pair
        temp = this.findSolutionToFirstBlockFirstPair (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // First block - second F2L pair
        temp = this.findSolutionToFirstBlockSecondPair (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // Second block - bottom edge
        temp = this.findSolutionToSecondBlocksBottomEdge (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // Second block - first F2L pair
        temp = this.findSolutionToSecondBlockFirstPair (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // Second block - second F2L pair
        temp = this.findSolutionToSecondBlockSecondPair (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // CMLL - corners last layer (allows middle slice turns)
        temp = this.findSolutionCMLL (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);
        
        // M layer orientation
        temp = this.findSolutionMOrientation (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);
        
        // Edge orientation
        temp = this.findSolutionEdgeOrientation (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // L/R Edges
        temp = this.findSolutionLREdges (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);

        // Last edges
        temp = this.findSolutionLastEdges (cube);
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
        console.log ("Finding solution to orient the cube");
        console.time ("findSolutionToOrientTheCube");
        let solution = [];

        let temp = this.findMinSolution (cube, this.MAX_CUBE_ORIENTATION_MOVES, (cube) => {
            return this.isRouxCentersSolved (cube);
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
            console.log ("Could not find solution to orient the cube");
            console.timeEnd ("findSolutionToOrientTheCube");
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd ("findSolutionToOrientTheCube");
        return solution;
    }

    // =======================================================================

    findSolutionToFirstBlocksBottomEdge (cube) {
        console.log ("Finding solution to first Roux block's bottom edge");
        console.time ("findSolutionToFirstBlocksBottomEdge");
        let solution = [];

        let temp = this.findMinSolution (cube, this.MAX_FIRST_BLOCK_BOTTOM_EDGE_MOVES, (cube) => {
            return this.isRouxCentersSolved (cube)
                && this.isFirstBlockBottomEdgeSolved (cube);
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
            console.log ("Could not find solution to first Roux block's bottom edge");
            console.timeEnd ("findSolutionToFirstBlocksBottomEdge");
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd ("findSolutionToFirstBlocksBottomEdge");
        return solution;
    }

    // =======================================================================

    findSolutionToFirstBlockFirstPair (cube) {
        console.log ("Finding solution to first Roux block's first pair");
        console.time ("findSolutionToFirstBlockFirstPair");
        let solution = [];
        
        // Solve Edge Piece
        let temp = this.findSolutionToFirstBlockFirstPairEdge (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("could not find solution to findSolutionToFirstBlockFirstPair")
            console.timeEnd ("findSolutionToFirstBlockFirstPair");
            return null;
        }
        solution = solution.concat(temp);

        // Solve Corner Piece
        temp = this.findSolutionToFirstBlockFirstPairCorner (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("could not find solution to findSolutionToFirstBlockFirstPair")
            console.timeEnd ("findSolutionToFirstBlockFirstPair");
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd ("findSolutionToFirstBlockFirstPair");
        return solution;
    }

    // =======================================================================

    findSolutionToFirstBlockFirstPairEdge (cube) {
        let solution = [];

        // 1. check if it is already solved
        if (this.isFirstBlockFirstPairEdgeSolved (cube))
            return [];

        // 2. move edge piece to top layer anywhere
        let temp = this.findMinSolution (cube, 4, (cube) => {
            const color0 = ORANGE;
            const color1 = BLUE;
            // Ensure progress wasnt broken
            if (!(this.isRouxCentersSolved (cube) && this.isFirstBlockBottomEdgeSolved (cube)))
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
            console.log ("Could not find solution to findSolutionToFirstBlockFirstPairEdge: move edge to top layer");
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
            console.log ("Could not find solution to findSolutionToFirstBlockFirstPairEdge: move edge above orange center");
            return null;
        }
        solution = solution.concat(temp);
        
        // 4. solve edge piece (2 algorithms)
        if (cube.data[cube.UP + 3] == BLUE)
        {
            const moveset = [
                cubeNotationMove (MOVE_L,  1),
                cubeNotationMove (MOVE_F, -1),
                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_F,  1),
            ];
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }
        else
        {
            const moveset = [
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_F, -1),
                cubeNotationMove (MOVE_L,  1),
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_L, -1),
            ];
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }

        return solution;
    }

    // =======================================================================

    findSolutionToFirstBlockFirstPairCorner (cube) {
        let solution = [];

        // 1. check if it is already solved
        if (this.isFirstBlockFirstPairCornerSolved (cube))
            return [];

        // 2. move corner to top layer
        let temp = this.findMinSolution (cube, 4, (cube) => {
            const color0 = ORANGE;
            const color1 = BLUE;
            const color2 = WHITE;
            const colors = [color0, color1, color2];
            // Ensure progress wasnt broken
            if (!(this.isRouxCentersSolved (cube) && this.isFirstBlockBottomEdgeSolved (cube)
                && cube.data[cube.LEFT + 5] == ORANGE && cube.data[cube.FRONT + 3] == BLUE))
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
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to findSolutionToFirstBlockFirstPairCorner: move corner to top layer");
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
            console.log ("Could not find solution to findSolutionToFirstBlockFirstPairCorner: move corner above edge");
            return null;
        }
        solution = solution.concat(temp);

        // 4. solve corner piece (3 algorithms)
        // white on top
        if (cube.data[cube.UP + 6] == WHITE)
        {
            const moveset = [
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
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }
        // white left
        else if (cube.data[cube.LEFT + 2] == WHITE)
        {
            const moveset = [
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
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }
        // white front
        else
        {
            const moveset = [
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
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }
        return solution;
    }

    // =======================================================================

    findSolutionToFirstBlockSecondPair (cube) {
        console.log ("Finding solution to first Roux block's second pair");
        console.time ("findSolutionToFirstBlockSecondPair");
        let solution = [];
        
        // Solve Edge Piece
        let temp = this.findSolutionToFirstBlockSecondPairEdge (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("could not find solution to findSolutionToFirstBlockSecondPair")
            console.timeEnd ("findSolutionToFirstBlockSecondPair");
            return null;
        }
        solution = solution.concat(temp);
        console.log ("edge", moveSetToString (temp));

        // Solve Corner Piece
        temp = this.findSolutionToFirstBlockSecondPairCorner (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("could not find solution to findSolutionToFirstBlockSecondPair")
            console.timeEnd ("findSolutionToFirstBlockSecondPair");
            return null;
        }
        solution = solution.concat(temp);
        console.log ("corner", moveSetToString (temp));

        console.timeEnd ("findSolutionToFirstBlockSecondPair");
        return solution;
    }

    // =======================================================================

    findSolutionToFirstBlockSecondPairEdge (cube) {
        let solution = [];

        // 1. check if it is already solved
        if (this.isFirstBlockSecondPairEdgeSolved (cube))
            return [];

        // 2. move edge piece to top layer anywhere
        let temp = this.findMinSolution (cube, 4, (cube) => {
            const color0 = ORANGE;
            const color1 = GREEN;
            // Ensure progress wasnt broken
            if (!(this.isRouxCentersSolved (cube)
                && this.isFirstBlockBottomEdgeSolved (cube)
                && this.isFirstBlockFirstPairSolved (cube)))
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
            console.log ("Could not find solution to findSolutionToFirstBlockSecondPairEdge: move edge to top layer");
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
            console.log ("Could not find solution to findSolutionToFirstBlockSecondPairEdge: move edge above center");
            return null;
        }
        solution = solution.concat(temp);
        
        // 4. solve edge piece (2 algorithms)
        if (cube.data[cube.UP + 3] == GREEN)
        {
            const moveset = [
                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_B,  1),
                cubeNotationMove (MOVE_L,  1),
                cubeNotationMove (MOVE_B, -1),
            ];
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }
        else
        {
            const moveset = [
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_B,  1),
                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_B, -1),
                cubeNotationMove (MOVE_L,  1),
            ];
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }

        return solution;
    }

    // =======================================================================

    findSolutionToFirstBlockSecondPairCorner (cube) {
        let solution = [];

        // 1. check if it is already solved
        if (this.isFirstBlockSecondPairCornerSolved (cube))
            return [];

        // 2. move corner to top layer
        let temp = this.findMinSolution (cube, 4, (cube) => {
            const color0 = ORANGE;
            const color1 = GREEN;
            const color2 = WHITE;
            const colors = [color0, color1, color2];
            // Ensure progress wasnt broken
            if (!(this.isRouxCentersSolved (cube)
                && this.isFirstBlockBottomEdgeSolved (cube)
                && this.isFirstBlockFirstPairSolved (cube)
                && cube.data[cube.LEFT + 3] == ORANGE && cube.data[cube.BACK + 5] == GREEN))
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
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to findSolutionToFirstBlockSecondPairCorner: move corner to top layer");
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
            console.log ("Could not find solution to findSolutionToFirstBlockSecondPairCorner: move corner above edge");
            return null;
        }
        solution = solution.concat(temp);

        // 4. solve corner piece (3 algorithms)
        // white on top
        if (cube.data[cube.UP + 0] == WHITE)
        {
            const moveset = [
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
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }
        // white left
        else if (cube.data[cube.LEFT + 0] == WHITE)
        {
            const moveset = [
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
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }
        // white back
        else
        {
            const moveset = [
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
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }
        return solution;
    }

    // =======================================================================

    findSolutionToSecondBlocksBottomEdge (cube) {
        console.log ("Finding solution to second Roux block's bottom edge");
        console.time ("findSolutionToSecondBlocksBottomEdge");
        let solution = [];

        let temp = this.findMinSolution (cube, this.MAX_FIRST_BLOCK_BOTTOM_EDGE_MOVES, (cube) => {
            return this.isRouxCentersSolved (cube)
                && this.isFirstBlockSolved (cube)
                && this.isSecondBlockBottomEdgeSolved (cube);
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
            [cubeNotationMove (MOVE_M,  1)],
            [cubeNotationMove (MOVE_M, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to second Roux block's bottom edge");
            console.timeEnd ("findSolutionToSecondBlocksBottomEdge");
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd ("findSolutionToSecondBlocksBottomEdge");
        return solution;
    }

    // =======================================================================

    findSolutionToSecondBlockFirstPair (cube) {
        console.log ("Finding solution to second Roux block's first pair");
        console.time ("findSolutionToSecondBlockFirstPair");
        let solution = [];
        
        // Solve Edge Piece
        let temp = this.findSolutionToSecondBlockFirstPairEdge (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("could not find solution to findSolutionToSecondBlockFirstPair")
            console.timeEnd ("findSolutionToSecondBlockFirstPair");
            return null;
        }
        solution = solution.concat(temp);
        console.log ("edge", moveSetToString (temp));

        // Solve Corner Piece
        temp = this.findSolutionToSecondBlockFirstPairCorner (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("could not find solution to findSolutionToSecondBlockFirstPair")
            console.timeEnd ("findSolutionToSecondBlockFirstPair");
            return null;
        }
        solution = solution.concat(temp);
        console.log ("corner", moveSetToString (temp));

        console.timeEnd ("findSolutionToSecondBlockFirstPair");
        return solution;
    }

    // =======================================================================

    findSolutionToSecondBlockFirstPairEdge (cube) {
        let solution = [];

        // 1. check if it is already solved
        if (this.isSecondBlockFirstPairEdgeSolved (cube))
            return [];

        // 2. move edge piece to top layer anywhere
        let temp = this.findMinSolution (cube, 4, (cube) => {
            const color0 = RED;
            const color1 = BLUE;
            // Ensure progress wasnt broken
            if (!(this.isRouxCentersSolved (cube)
                && this.isFirstBlockSolved (cube)
                && this.isSecondBlockBottomEdgeSolved (cube)))
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
            [cubeNotationMove (MOVE_M,  1)],
            [cubeNotationMove (MOVE_M, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to findSolutionToSecondBlockFirstPairEdge: move edge to top layer");
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
            console.log ("Could not find solution to findSolutionToSecondBlockFirstPairEdge: move edge above center");
            return null;
        }
        solution = solution.concat(temp);
        
        // 4. solve edge piece (2 algorithms)
        if (cube.data[cube.UP + 5] == BLUE)
        {
            const moveset = [
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_F, -1),
            ];
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }
        else
        {
            const moveset = [
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_F, -1),
                cubeNotationMove (MOVE_R,  1),
            ];
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }

        return solution;
    }

    // =======================================================================

    findSolutionToSecondBlockFirstPairCorner (cube) {
        let solution = [];

        // 1. check if it is already solved
        if (this.isSecondBlockFirstPairCornerSolved (cube))
            return [];

        // 2. move corner to top layer
        let temp = this.findMinSolution (cube, 4, (cube) => {
            const color0 = RED;
            const color1 = BLUE;
            const color2 = WHITE;
            const colors = [color0, color1, color2];
            // Ensure progress wasnt broken
            if (!(this.isRouxCentersSolved (cube)
                && this.isFirstBlockSolved (cube)
                && this.isSecondBlockBottomEdgeSolved (cube)
                && this.isSecondBlockFirstPairEdgeSolved (cube)))
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
            [cubeNotationMove (MOVE_M,  1)],
            [cubeNotationMove (MOVE_M, -1)],
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
            console.log ("Could not find solution to findSolutionToSecondBlockFirstPairCorner: move corner to top layer");
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
            console.log ("Could not find solution to findSolutionToSecondBlockFirstPairCorner: move corner above edge");
            return null;
        }
        solution = solution.concat(temp);

        // 4. solve corner piece (3 algorithms)
        // white on top
        if (cube.data[cube.UP + 8] == WHITE)
        {
            const moveset = [
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
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }
        // white right
        else if (cube.data[cube.RIGHT + 0] == WHITE)
        {
            const moveset = [
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
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }
        // white front
        else
        {
            const moveset = [
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
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }
        return solution;
    }

    // =======================================================================

    findSolutionToSecondBlockSecondPair (cube) {
        console.log ("Finding solution to second Roux block's second pair");
        console.time ("findSolutionToSecondBlockSecondPair");
        let solution = [];
        
        // Solve Edge Piece
        let temp = this.findSolutionToSecondBlockSecondPairEdge (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("could not find solution to findSolutionToSecondBlockSecondPair")
            console.timeEnd ("findSolutionToSecondBlockSecondPair");
            return null;
        }
        solution = solution.concat(temp);
        console.log ("edge", moveSetToString (temp));

        // Solve Corner Piece
        temp = this.findSolutionToSecondBlockSecondPairCorner (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("could not find solution to findSolutionToSecondBlockSecondPair")
            console.timeEnd ("findSolutionToSecondBlockSecondPair");
            return null;
        }
        solution = solution.concat(temp);
        console.log ("corner", moveSetToString (temp));

        console.timeEnd ("findSolutionToSecondBlockSecondPair");
        return solution;
    }

    // =======================================================================

    findSolutionToSecondBlockSecondPairEdge (cube) {
        let solution = [];

        // 1. check if it is already solved
        if (this.isSecondBlockSecondPairEdgeSolved (cube))
            return [];

        // 2. move edge piece to top layer anywhere
        let temp = this.findMinSolution (cube, 4, (cube) => {
            const color0 = RED;
            const color1 = GREEN;
            // Ensure progress wasnt broken
            if (!(this.isRouxCentersSolved (cube)
                && this.isFirstBlockSolved (cube)
                && this.isSecondBlockBottomEdgeSolved (cube)
                && this.isSecondBlockFirstPairSolved (cube)))
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
            [cubeNotationMove (MOVE_M,  1)],
            [cubeNotationMove (MOVE_M, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to findSolutionToSecondBlockSecondPairEdge: move edge to top layer");
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
            console.log ("Could not find solution to findSolutionToSecondBlockSecondPairEdge: move edge above center");
            return null;
        }
        solution = solution.concat(temp);
        
        // 4. solve edge piece (2 algorithms)
        if (cube.data[cube.UP + 5] == GREEN)
        {
            const moveset = [
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_B, -1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_B,  1),
            ];
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }
        else
        {
            const moveset = [
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_B, -1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_B,  1),
                cubeNotationMove (MOVE_R, -1),
            ];
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }

        return solution;
    }

    // =======================================================================

    findSolutionToSecondBlockSecondPairCorner (cube) {
        let solution = [];

        // 1. check if it is already solved
        if (this.isSecondBlockSecondPairCornerSolved (cube))
            return [];

        // 2. move corner to top layer
        let temp = this.findMinSolution (cube, 6, (cube) => {
            const color0 = RED;
            const color1 = GREEN;
            const color2 = WHITE;
            const colors = [color0, color1, color2];
            // Ensure progress wasnt broken
            if (!(this.isRouxCentersSolved (cube)
                && this.isFirstBlockSolved (cube)
                && this.isSecondBlockBottomEdgeSolved (cube)
                && this.isSecondBlockFirstPairSolved (cube)
                && this.isSecondBlockSecondPairEdgeSolved (cube)))
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
            [cubeNotationMove (MOVE_M,  1)],
            [cubeNotationMove (MOVE_M, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to findSolutionToSecondBlockSecondPairCorner: move corner to top layer");
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
            console.log ("Could not find solution to findSolutionToSecondBlockSecondPairCorner: move corner above edge");
            return null;
        }
        solution = solution.concat(temp);

        // 4. solve corner piece (3 algorithms)
        // white on top
        if (cube.data[cube.UP + 2] == WHITE)
        {
            const moveset = [
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
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }
        // white left
        else if (cube.data[cube.RIGHT + 2] == WHITE)
        {
            const moveset = [
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
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }
        // white back
        else
        {
            const moveset = [
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
            for (const move of moveset)
            {
                const axisNotationMove = cubeMoveNotation.toAxisNotation (move);
                cube.rotate (axisNotationMove[0], axisNotationMove[1], axisNotationMove[2]);
                solution.push (move);
            }
        }
        return solution;
    }

    // =======================================================================

    findSolutionCMLL (cube) {
        console.log ("Finding solution to CMLL");
        console.time ("findSolutionCMLL");
        let solution = [];

        // Using 2-look CMLL for now
        
        // Orient yellow corners
        let temp = this.findSolutionCMLLOrientYellowCorners (cube);
        // Ensure solution was found
        if (temp == null)
            {
                console.log ("Could not find solution to CMLL");
                console.timeEnd ("findSolutionCMLL");
                return null;
            }
        solution = solution.concat(temp);
        console.log ("orient", moveSetToString (temp));

        // Permutate yellow corners
        temp = this.findSolutionCMLLPermutateYellowCorners (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to CMLL");
            console.timeEnd ("findSolutionCMLL");
            return null;
        }
        solution = solution.concat(temp);
        console.log ("permutate", moveSetToString (temp));

        console.timeEnd ("findSolutionCMLL");
        return solution;
    }

    // =======================================================================

    findSolutionCMLLOrientYellowCorners (cube) {
        let solution = [];

        let temp = this.findMinSolution (cube, 40, (cube) => {
            // Ensure progress wasnt broken
            if (!(this.isRouxCentersSolved (cube)
                && this.isFirstBlockSolved (cube)
                && this.isSecondBlockSolved (cube)))
                return false;
            return cube.data[cube.UP + 0] == YELLOW
                && cube.data[cube.UP + 2] == YELLOW
                && cube.data[cube.UP + 6] == YELLOW
                && cube.data[cube.UP + 8] == YELLOW;
        }, [
            // Fishy alg - sune
            [
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_R, -1),
            ],
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to CMLL: Orient yellow corners");
            return null;
        }
        solution = solution.concat(temp);
        
        return solution;
    }

    // =======================================================================

    findSolutionCMLLPermutateYellowCorners (cube) {
        let solution = [];

        let temp = this.findMinSolution (cube, 40, (cube) => {
            // Ensure progress wasnt broken
            if (!(this.isRouxCentersSolved (cube)
                && this.isFirstBlockSolved (cube)
                && this.isSecondBlockSolved (cube)))
                return false;
            return cube.data[cube.UP    + 0] == YELLOW
                && cube.data[cube.UP    + 2] == YELLOW
                && cube.data[cube.UP    + 6] == YELLOW
                && cube.data[cube.UP    + 8] == YELLOW
                && cube.data[cube.FRONT + 0] == BLUE
                && cube.data[cube.FRONT + 2] == BLUE
                && cube.data[cube.RIGHT + 0] == RED
                && cube.data[cube.RIGHT + 2] == RED
                && cube.data[cube.BACK  + 0] == GREEN
                && cube.data[cube.BACK  + 2] == GREEN
                && cube.data[cube.LEFT  + 0] == ORANGE
                && cube.data[cube.LEFT  + 2] == ORANGE;
        }, [
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
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to CMLL: Permutate Yellow Corners");
            return null;
        }
        solution = solution.concat(temp);
        
        return solution;
    }

    // =======================================================================

    findSolutionMOrientation (cube) {
        console.log ("finding solution to M orientation");
        console.time ("findSolutionMOrientation");
        let solution = [];

        let temp = this.findMinSolution (cube, 2, (cube) => {
            // Ensure progress wasnt broken
            if (!(this.isRouxCentersSolved (cube)
                && this.isFirstBlockSolved (cube)
                && this.isSecondBlockSolved (cube)
                && this.isYellowCornersSolved (cube)))
                return false;
            // This step is solved when yellow/white centers are on top and bottom
            const allowedColors = [WHITE, YELLOW];
            return allowedColors.includes (cube.data[cube.UP + 4])
                && allowedColors.includes (cube.data[cube.DOWN + 4]);
        }, [
            [cubeNotationMove (MOVE_M,  1)],
            [cubeNotationMove (MOVE_M, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to M orientation!");
            console.timeEnd ("findSolutionMOrientation");
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd ("findSolutionMOrientation");
        return solution;
    }

    // =======================================================================

    findSolutionEdgeOrientation (cube) {
        console.log ("finding solution to Edge Orientation");
        console.time ("findSolutionEdgeOrientation");
        let solution = [];

        // According to https://www.youtube.com/watch?v=ImBWkk-7teA
        // we can solve this in a max of 12 moves, but might need U moves
        // to set up for cases
        let temp = this.findMinSolution (cube, 13, (cube) => {
            // Ensure progress wasnt broken
            if (!(this.isRouxCentersSolved (cube)
                && this.isFirstBlockSolved (cube)
                && this.isSecondBlockSolved (cube)
                && this.isYellowCornersSolved (cube)))
                return false;
            // This step is solved when all top and bottom stickers
            // are either yellow or white
            const allowedColors = [WHITE, YELLOW];
            return allowedColors.includes (cube.data[cube.UP + 1])
                && allowedColors.includes (cube.data[cube.UP + 3])
                && allowedColors.includes (cube.data[cube.UP + 4])
                && allowedColors.includes (cube.data[cube.UP + 5])
                && allowedColors.includes (cube.data[cube.UP + 7])
                && allowedColors.includes (cube.data[cube.DOWN + 1])
                && allowedColors.includes (cube.data[cube.DOWN + 4])
                && allowedColors.includes (cube.data[cube.DOWN + 7]);
        }, [
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            [cubeNotationMove (MOVE_M,  1)],
            [cubeNotationMove (MOVE_M, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("Could not find solution to edge orientation!");
            console.timeEnd ("findSolutionEdgeOrientation");
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd ("findSolutionEdgeOrientation");
        return solution;
    }

    // =======================================================================

    findSolutionLREdges (cube) {
        console.log ("finding solution to L/R edges");
        console.time ("findSolutionLREdges");
        let solution = [];

        let temp = this.findMinSolution (cube, 12, (cube) => {
            // Ensure progress wasnt broken
            if (!(this.isRouxCentersSolved (cube)
                && this.isFirstBlockSolved (cube)
                && this.isSecondBlockSolved (cube)
                && this.isYellowCornersSolved (cube)))
                return false;
            // Ensure EO is not broken
            const allowedColors = [WHITE, YELLOW];
            if (!(allowedColors.includes (cube.data[cube.UP + 1])
                && allowedColors.includes (cube.data[cube.UP + 3])
                && allowedColors.includes (cube.data[cube.UP + 4])
                && allowedColors.includes (cube.data[cube.UP + 5])
                && allowedColors.includes (cube.data[cube.UP + 7])
                && allowedColors.includes (cube.data[cube.DOWN + 1])
                && allowedColors.includes (cube.data[cube.DOWN + 4])
                && allowedColors.includes (cube.data[cube.DOWN + 7])))
                return false;
            // left and right edges should be solved
            return cube.data[cube.UP    + 3] == YELLOW
                && cube.data[cube.LEFT  + 1] == ORANGE
                && cube.data[cube.UP    + 5] == YELLOW
                && cube.data[cube.RIGHT + 1] == RED;
        }, [
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            [cubeNotationMove (MOVE_M,  1)],
            [cubeNotationMove (MOVE_M, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
            {
                console.log ("Could not find solution to L/R edges!");
                console.timeEnd ("findSolutionLREdges");
                return null;
            }
        solution = solution.concat(temp);

        console.timeEnd ("findSolutionLREdges");
        return solution;
    }

    // =======================================================================

    findSolutionLastEdges (cube) {
        console.log ("finding solution to last edges");
        console.time ("findSolutionLastEdges");
        let solution = [];

        let temp = this.findMinSolution (cube, 10, (cube) => {
            return cube.isSolved ();
        }, [
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            [cubeNotationMove (MOVE_M,  1)],
            [cubeNotationMove (MOVE_M, -1)],
            // Algorithm for case where centers solved and edges unsolved
            [
                cubeNotationMove (MOVE_E,  1),
                cubeNotationMove (MOVE_E,  1),
                cubeNotationMove (MOVE_M,  1),
                cubeNotationMove (MOVE_E,  1),
                cubeNotationMove (MOVE_E,  1),
                cubeNotationMove (MOVE_M,  1),
            ],
            // Algorithm for case where centers unsolved and edges solved
            [
                cubeNotationMove (MOVE_M,  1),
                cubeNotationMove (MOVE_M,  1),
                cubeNotationMove (MOVE_E,  1),
                cubeNotationMove (MOVE_E,  1),
                cubeNotationMove (MOVE_M,  1),
                cubeNotationMove (MOVE_E,  1),
                cubeNotationMove (MOVE_E,  1),
                cubeNotationMove (MOVE_M,  1),
            ]
        ]);
        // Ensure solution was found
        if (temp == null)
            {
                console.log ("Could not find solution to last edges");
                console.timeEnd ("findSolutionLastEdges");
                return null;
            }
        solution = solution.concat(temp);

        console.timeEnd ("findSolutionLastEdges");
        return solution;
    }

    // =======================================================================

    findMinSolution (cube, maxMoves, isSolved, moveSetsToTry)
    {
        let solution = null;
        for (var i = 1; i < maxMoves; ++i) {
            solution = this.findMinSolution_ (cube, [], 0, i, isSolved, moveSetsToTry);
            if (solution != null) {
                // Found the solution!
                console.log ("min solution:", moveSetToString (solution));
                break;
            }
        }
        return solution;
    }

    // =======================================================================

    findMinSolution_ (cube, path, prevMove, limit, isSolved, moveSetsToTry) {
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
            result = this.findMinSolution_ (cube, path, moveSet.length == 1 ? moveSet[0] : 0, limit, isSolved, moveSetsToTry);
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
    
    isRouxCentersSolved (cube) {
        if (cube.data[cube.LEFT  + 4] != ORANGE) return false;
        if (cube.data[cube.RIGHT + 4] != RED   ) return false;
        return true;
    }

    // =======================================================================
    
    isFirstBlockSolved (cube) {
        return this.isFirstBlockBottomEdgeSolved (cube)
            && this.isFirstBlockFirstPairSolved (cube)
            && this.isFirstBlockSecondPairSolved (cube);
    }

    // =======================================================================
    
    isFirstBlockBottomEdgeSolved (cube) {
        if (cube.data[cube.LEFT + 7] != ORANGE) return false;
        if (cube.data[cube.DOWN + 3] != WHITE ) return false;
        return true;
    }

    // =======================================================================
    
    isFirstBlockFirstPairSolved (cube) {
        return this.isFirstBlockFirstPairEdgeSolved (cube)
            && this.isFirstBlockFirstPairCornerSolved (cube);
    }

    // =======================================================================
    
    isFirstBlockFirstPairEdgeSolved (cube) {
        // Edge piece
        if (cube.data[cube.LEFT  + 5] != ORANGE) return false;
        if (cube.data[cube.FRONT + 3] != BLUE  ) return false;
        return true;
    }

    // =======================================================================
    
    isFirstBlockFirstPairCornerSolved (cube) {
        // Corner piece
        if (cube.data[cube.LEFT  + 8] != ORANGE) return false;
        if (cube.data[cube.FRONT + 6] != BLUE  ) return false;
        if (cube.data[cube.DOWN  + 0] != WHITE ) return false;
        return true;
    }

    // =======================================================================
    
    isFirstBlockSecondPairSolved (cube) {
        return this.isFirstBlockSecondPairEdgeSolved (cube)
            && this.isFirstBlockSecondPairCornerSolved (cube);
    }

    // =======================================================================
    
    isFirstBlockSecondPairEdgeSolved (cube) {
        // Edge piece
        if (cube.data[cube.LEFT  + 3] != ORANGE) return false;
        if (cube.data[cube.BACK  + 5] != GREEN ) return false;
        return true;
    }

    // =======================================================================
    
    isFirstBlockSecondPairCornerSolved (cube) {
        // Corner piece
        if (cube.data[cube.LEFT  + 6] != ORANGE) return false;
        if (cube.data[cube.BACK  + 8] != GREEN ) return false;
        if (cube.data[cube.DOWN  + 6] != WHITE ) return false;
        return true;
    }

    // =======================================================================
    
    isSecondBlockSolved (cube) {
        return this.isSecondBlockBottomEdgeSolved (cube)
            && this.isSecondBlockFirstPairSolved (cube)
            && this.isSecondBlockSecondPairSolved (cube);
    }

    // =======================================================================
    
    isSecondBlockBottomEdgeSolved (cube) {
        if (cube.data[cube.RIGHT + 7] != RED  ) return false;
        if (cube.data[cube.DOWN  + 5] != WHITE) return false;
        return true;
    }

    // =======================================================================
    
    isSecondBlockFirstPairSolved (cube) {
        return this.isSecondBlockFirstPairEdgeSolved (cube)
            && this.isSecondBlockFirstPairCornerSolved (cube);
    }

    // =======================================================================
    
    isSecondBlockFirstPairEdgeSolved (cube) {
        // Edge piece
        if (cube.data[cube.RIGHT + 3] != RED ) return false;
        if (cube.data[cube.FRONT + 5] != BLUE) return false;
        return true;
    }

    // =======================================================================
    
    isSecondBlockFirstPairCornerSolved (cube) {
        // Corner piece
        if (cube.data[cube.RIGHT + 6] != RED   ) return false;
        if (cube.data[cube.FRONT + 8] != BLUE  ) return false;
        if (cube.data[cube.DOWN  + 2] != WHITE ) return false;
        return true;
    }

    // =======================================================================
    
    isSecondBlockSecondPairSolved (cube) {
        return this.isSecondBlockSecondPairEdgeSolved (cube)
            && this.isSecondBlockSecondPairCornerSolved (cube);
    }

    // =======================================================================
    
    isSecondBlockSecondPairEdgeSolved (cube) {
        // Edge piece
        if (cube.data[cube.RIGHT + 5] != RED   ) return false;
        if (cube.data[cube.BACK  + 3] != GREEN ) return false;
        return true;
    }

    // =======================================================================
    
    isSecondBlockSecondPairCornerSolved (cube) {
        // Corner piece
        if (cube.data[cube.RIGHT + 8] != RED   ) return false;
        if (cube.data[cube.BACK  + 6] != GREEN ) return false;
        if (cube.data[cube.DOWN  + 8] != WHITE ) return false;
        return true;
    }

    // =======================================================================
    
    isYellowCornersSolved (cube) {
        return cube.data[cube.UP    + 0] == YELLOW
            && cube.data[cube.UP    + 2] == YELLOW
            && cube.data[cube.UP    + 6] == YELLOW
            && cube.data[cube.UP    + 8] == YELLOW
            && cube.data[cube.FRONT + 0] == BLUE
            && cube.data[cube.FRONT + 2] == BLUE
            && cube.data[cube.RIGHT + 0] == RED
            && cube.data[cube.RIGHT + 2] == RED
            && cube.data[cube.BACK  + 0] == GREEN
            && cube.data[cube.BACK  + 2] == GREEN
            && cube.data[cube.LEFT  + 0] == ORANGE
            && cube.data[cube.LEFT  + 2] == ORANGE;
    }

}

// =======================================================================