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
        temp = this.findSolution2LookCMLL (cube);
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

        let temp = findMinSolution (cube, this.MAX_CUBE_ORIENTATION_MOVES, (cube) => {
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

        let temp = findMinSolution (cube, this.MAX_FIRST_BLOCK_BOTTOM_EDGE_MOVES, (cube) => {
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
        let temp = findMinSolution (cube, 4, (cube) => {
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
        temp = findMinSolution (cube, 3, (cube) => {
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
        let temp = findMinSolution (cube, 4, (cube) => {
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
        temp = findMinSolution (cube, 3, (cube) => {
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
        let temp = findMinSolution (cube, 4, (cube) => {
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
        temp = findMinSolution (cube, 3, (cube) => {
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
        let temp = findMinSolution (cube, 4, (cube) => {
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
        temp = findMinSolution (cube, 3, (cube) => {
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

        let temp = findMinSolution (cube, this.MAX_FIRST_BLOCK_BOTTOM_EDGE_MOVES, (cube) => {
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
        let temp = findMinSolution (cube, 4, (cube) => {
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
        temp = findMinSolution (cube, 3, (cube) => {
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
        let temp = findMinSolution (cube, 4, (cube) => {
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
        temp = findMinSolution (cube, 3, (cube) => {
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
        let temp = findMinSolution (cube, 4, (cube) => {
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
        temp = findMinSolution (cube, 3, (cube) => {
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
        let temp = findMinSolution (cube, 6, (cube) => {
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
        temp = findMinSolution (cube, 3, (cube) => {
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

    // CMLL: Corners of Last Layer ignoring M slice
    // 2LookCMLL (2LCMLL): CMLL done in 2 passes: 1st pass to orient corners
    // and 2nd pass to permutate corners. Less algorithms than full CMLL.
    findSolution2LookCMLL (cube) {
        const name = "findSolution2LookCMLL";
        console.log (name);
        console.time (name);

        let solution = [];

        // Using 2-look CMLL for now
        
        // Orient yellow corners
        let temp = this.findSolution2LookCMLLOrientCorners (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        // Permutate yellow corners
        temp = this.findSolution2LookCMLLPermutateCorners (cube);
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

    // 2 Look CMLL from: https://cubingapp.com/algorithms/2-Look-CMLL/
    findSolution2LookCMLLOrientCorners (cube) {
        const name = "findSolution2LookCMLLOrientCorners";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = findMinSolution (cube, 20, (cube) => {
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
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            // Sune
            //    X
            //  + - - - +
            //  |       |X
            //  |       |
            //  | X     |
            //  + - - - +
            //        X
            // R U R' U R U2 R'
            // R U R' U R U U R'
            new PatternAlgorithm (
                "Sune",
                (cube) => {
                    if (cube.data[cube.UP    + 6] != YELLOW) return false;
                    if (cube.data[cube.FRONT + 2] != YELLOW) return false;
                    if (cube.data[cube.RIGHT + 2] != YELLOW) return false;
                    if (cube.data[cube.BACK  + 2] != YELLOW) return false;
                    return true;
                },
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
            ),
            // Antisune
            // 
            //  + - - - +
            // X|     X |
            //  |       |
            //  |       |X
            //  + - - - +
            //    X
            // R U2 R' U' R U' R'
            // R U U R' U' R U' R'
            new PatternAlgorithm (
                "Antisune",
                (cube) => {
                    if (cube.data[cube.UP    + 2] != YELLOW) return false;
                    if (cube.data[cube.FRONT + 0] != YELLOW) return false;
                    if (cube.data[cube.RIGHT + 0] != YELLOW) return false;
                    if (cube.data[cube.LEFT  + 0] != YELLOW) return false;
                    return true;
                },
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
            ),
            // H CMLL
            //    X   X
            //  + - - - +
            //  |       |
            //  |       |
            //  |       |
            //  + - - - +
            //    X   X
            // U R U R' U R U' R' U R U2 R' (double sune with cancel)
            // U R U R' U R U' R' U R U U R'
            new PatternAlgorithm (
                "2LCMLL:H",
                (cube) => {
                    if (cube.data[cube.FRONT + 0] != YELLOW) return false;
                    if (cube.data[cube.FRONT + 2] != YELLOW) return false;
                    if (cube.data[cube.BACK  + 0] != YELLOW) return false;
                    if (cube.data[cube.BACK  + 2] != YELLOW) return false;
                    return true;
                },
                [
                    cubeNotationMove (MOVE_U,  1),
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
            ),
            // T CMLL
            //    X
            //  + - - - +
            //  |     X |
            //  |       |
            //  |     X |
            //  + - - - +
            //    X
            // R U R' U' R' F R F' (sexy sledge)
            new PatternAlgorithm (
                "2LCMLL:T",
                (cube) => {
                    if (cube.data[cube.UP    + 2] != YELLOW) return false;
                    if (cube.data[cube.UP    + 8] != YELLOW) return false;
                    if (cube.data[cube.FRONT + 0] != YELLOW) return false;
                    if (cube.data[cube.BACK  + 2] != YELLOW) return false;
                    return true;
                },
                [
                    cubeNotationMove (MOVE_R,  1),
                    cubeNotationMove (MOVE_U,  1),
                    cubeNotationMove (MOVE_R, -1),
                    cubeNotationMove (MOVE_U, -1),
                    cubeNotationMove (MOVE_R, -1),
                    cubeNotationMove (MOVE_F,  1),
                    cubeNotationMove (MOVE_R,  1),
                    cubeNotationMove (MOVE_F, -1),
                ],
            ),
            // L CMLL
            // 
            //  + - - - +
            //  | X     |X
            //  |       |
            //  |     X |
            //  + - - - +
            //    X
            // F R' F' R U R U' R' (Inverse of T CMLL)
            new PatternAlgorithm (
                "2LCMLL:L",
                (cube) => {
                    if (cube.data[cube.UP    + 0] != YELLOW) return false;
                    if (cube.data[cube.UP    + 8] != YELLOW) return false;
                    if (cube.data[cube.FRONT + 0] != YELLOW) return false;
                    if (cube.data[cube.RIGHT + 2] != YELLOW) return false;
                    return true;
                },
                [
                    cubeNotationMove (MOVE_F,  1),
                    cubeNotationMove (MOVE_R, -1),
                    cubeNotationMove (MOVE_F, -1),
                    cubeNotationMove (MOVE_R,  1),
                    cubeNotationMove (MOVE_U,  1),
                    cubeNotationMove (MOVE_R,  1),
                    cubeNotationMove (MOVE_U, -1),
                    cubeNotationMove (MOVE_R, -1),
                ],
            ),
            // U CMLL
            // 
            //  + - - - +
            // X|     X |
            //  |       |
            // X|     X |
            //  + - - - +
            // 
            //  F (R U R' U') F' (F sexy F')
            //  F R U R' U' F'
            new PatternAlgorithm (
                "2LCMLL:U",
                (cube) => {
                    if (cube.data[cube.UP    + 2] != YELLOW) return false;
                    if (cube.data[cube.UP    + 8] != YELLOW) return false;
                    if (cube.data[cube.LEFT  + 0] != YELLOW) return false;
                    if (cube.data[cube.LEFT  + 2] != YELLOW) return false;
                    return true;
                },
                [
                    cubeNotationMove (MOVE_F,  1),
                    cubeNotationMove (MOVE_R,  1),
                    cubeNotationMove (MOVE_U,  1),
                    cubeNotationMove (MOVE_R, -1),
                    cubeNotationMove (MOVE_U, -1),
                    cubeNotationMove (MOVE_F, -1),
                ],
            ),
            // Pi CMLL
            //        X
            //  + - - - +
            // X|       |
            //  |       |
            // X|       |
            //  + - - - +
            //        X
            //   F (R U R' U') (R U R' U') F' (F double sexy F')
            //   F R U R' U' R U R' U' F'
            new PatternAlgorithm (
                "2LCMLL:Pi",
                (cube) => {
                    if (cube.data[cube.LEFT  + 0] != YELLOW) return false;
                    if (cube.data[cube.LEFT  + 2] != YELLOW) return false;
                    if (cube.data[cube.BACK  + 0] != YELLOW) return false;
                    if (cube.data[cube.FRONT + 2] != YELLOW) return false;
                    return true;
                },
                [
                    cubeNotationMove (MOVE_F,  1),
                    cubeNotationMove (MOVE_R,  1),
                    cubeNotationMove (MOVE_U,  1),
                    cubeNotationMove (MOVE_R, -1),
                    cubeNotationMove (MOVE_U, -1),
                    cubeNotationMove (MOVE_R,  1),
                    cubeNotationMove (MOVE_U,  1),
                    cubeNotationMove (MOVE_R, -1),
                    cubeNotationMove (MOVE_U, -1),
                    cubeNotationMove (MOVE_F, -1),
                ],
            ),
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

    findSolution2LookCMLLPermutateCorners (cube) {
        const name = "findSolution2LookCMLLPermutateCorners";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = findMinSolution (cube, 20, (cube) => {
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
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            // Diagonal corner swap (Y-Perm)
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    B   G
            //  + - - - +
            // R| Y   Y |R
            //  |       |
            // O| Y   Y |O
            //  + - - - +
            //    B   G
            // F R U' R' U' R U R' F' R U R' U' R' F R F'
            new PatternAlgorithm (
                "2LCMLL:Y-Perm",
                (cube) => {
                    if (cube.data[cube.LEFT    + 0] != cube.data[cube.RIGHT   + 2]) return false;
                    if (cube.data[cube.LEFT    + 2] != cube.data[cube.RIGHT   + 0]) return false;
                    if (cube.data[cube.FRONT   + 0] != cube.data[cube.BACK    + 2]) return false;
                    if (cube.data[cube.FRONT   + 2] != cube.data[cube.BACK    + 0]) return false;
                    return true;
                },
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
            ),
            // Headlights - Adjacent corner swap (T-Perm)
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    G   R
            //  + - - - +
            // O| Y   Y |B
            //  |       |
            // O| Y   Y |G
            //  + - - - +
            //    B   R
            // R U R' U' R' F R2 U' R' U' R U R' F'
            new PatternAlgorithm (
                "2LCMLL:T-Perm",
                (cube) => {
                    if (cube.data[cube.LEFT    + 0] != cube.data[cube.LEFT    + 0]) return false;
                    if (cube.data[cube.FRONT   + 0] != cube.data[cube.RIGHT   + 2]) return false;
                    if (cube.data[cube.FRONT   + 2] != cube.data[cube.BACK    + 0]) return false;
                    if (cube.data[cube.RIGHT   + 0] != cube.data[cube.BACK    + 2]) return false;
                    return true;
                },
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
            ),
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

    findSolutionMOrientation (cube) {
        console.log ("finding solution to M orientation");
        console.time ("findSolutionMOrientation");
        let solution = [];

        let temp = findMinSolution (cube, 2, (cube) => {
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
        let temp = findMinSolution (cube, 13, (cube) => {
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

        let temp = findMinSolution (cube, 12, (cube) => {
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

        let temp = findMinSolution (cube, 10, (cube) => {
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