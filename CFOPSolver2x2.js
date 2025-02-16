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
        // TODO: you should not need 2 jperms, this is inefficient (add y-perm)
        this.MAX_PERMUTATE_LAST_LAYER_MOVES = 32;
    }

    // =======================================================================

    // returns a list of moves to solve the cube from the current state
    // this can fluctuate in time between instant and a few seconds
    findSolution (cube)
    {
        let solution = [];
        // solve first layer
        let temp = this.solveFirstLayer (cube);
        if (temp != null)
            solution = solution.concat(temp);

        // solve yellow face
        temp = this.solveYellowFace (cube);
        if (temp != null)
            solution = solution.concat(temp);

        // permutate last layer
        temp = this.solveLastLayer (cube);
        if (temp != null)
            solution = solution.concat(temp);

        return solution;
    }

    // =======================================================================

    isFirstLayerSolved (cube)
    {
        // Front left cubie
        if (cube.data[cube.DOWN     ] != WHITE ) return false;
        if (cube.data[cube.FRONT + 2] != BLUE  ) return false;
        if (cube.data[cube.LEFT  + 3] != ORANGE) return false;
        // Back left cubie
        if (cube.data[cube.DOWN  + 2] != WHITE ) return false;
        if (cube.data[cube.LEFT  + 2] != ORANGE) return false;
        if (cube.data[cube.BACK  + 3] != GREEN ) return false;
        // Front right cubie
        if (cube.data[cube.DOWN  + 1] != WHITE ) return false;
        if (cube.data[cube.FRONT + 3] != BLUE  ) return false;
        if (cube.data[cube.RIGHT + 2] != RED   ) return false;
        // Back right cubie
        if (cube.data[cube.DOWN  + 3] != WHITE ) return false;
        if (cube.data[cube.BACK  + 2] != GREEN ) return false;
        if (cube.data[cube.RIGHT + 3] != RED   ) return false;
        return true;
    }

    // =======================================================================

    isFirstLayerFLCubieSolved (cube)
    {
        // Front left cubie
        if (cube.data[cube.DOWN     ] != WHITE ) return false;
        if (cube.data[cube.FRONT + 2] != BLUE  ) return false;
        if (cube.data[cube.LEFT  + 3] != ORANGE) return false;
        return true;
    }

    // =======================================================================

    isFirstLayerBLCubieSolved (cube)
    {
        // Back left cubie
        if (cube.data[cube.DOWN  + 2] != WHITE ) return false;
        if (cube.data[cube.LEFT  + 2] != ORANGE) return false;
        if (cube.data[cube.BACK  + 3] != GREEN ) return false;
        return true;
    }

    // =======================================================================

    isFirstLayerFRCubieSolved (cube)
    {
        // Front right cubie
        if (cube.data[cube.DOWN  + 1] != WHITE ) return false;
        if (cube.data[cube.FRONT + 3] != BLUE  ) return false;
        if (cube.data[cube.RIGHT + 2] != RED   ) return false;
        return true;
    }

    // =======================================================================

    isFirstLayerBRCubieSolved (cube)
    {
        // Back right cubie
        if (cube.data[cube.DOWN  + 3] != WHITE ) return false;
        if (cube.data[cube.BACK  + 2] != GREEN ) return false;
        if (cube.data[cube.RIGHT + 3] != RED   ) return false;
        return true;
    }

    // =======================================================================

    solveFirstLayerInMinMoves (cube)
    {
        const name = "solveFirstLayerInMinMoves";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = findMinSolution (cube, this.MAX_WHITE_FACE_MOVES, (cube) => {
            return this.isFirstLayerSolved (cube);
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

    solveFirstLayer (cube)
    {
        const name = "solveFirstLayer";
        console.log (name);
        console.time (name);

        let solution = [];

        // Front Left piece
        let temp = findMinSolution (cube, this.MAX_WHITE_FACE_MOVES, (cube) => {
            return this.isFirstLayerFLCubieSolved (cube);
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
            // [cubeNotationMove (MOVE_D,  1)],
            // [cubeNotationMove (MOVE_D, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        // Back Left piece
        temp = findMinSolution (cube, this.MAX_WHITE_FACE_MOVES, (cube) => {
            return this.isFirstLayerFLCubieSolved (cube)
                && this.isFirstLayerBLCubieSolved (cube);
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
            // [cubeNotationMove (MOVE_D,  1)],
            // [cubeNotationMove (MOVE_D, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        // Front Right piece
        temp = findMinSolution (cube, this.MAX_WHITE_FACE_MOVES, (cube) => {
            return this.isFirstLayerFLCubieSolved (cube)
                && this.isFirstLayerBLCubieSolved (cube)
                && this.isFirstLayerFRCubieSolved (cube);
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
            // [cubeNotationMove (MOVE_D,  1)],
            // [cubeNotationMove (MOVE_D, -1)],
        ]);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        // Back Right piece
        temp = findMinSolution (cube, this.MAX_WHITE_FACE_MOVES, (cube) => {
            return this.isFirstLayerFLCubieSolved (cube)
                && this.isFirstLayerBLCubieSolved (cube)
                && this.isFirstLayerFRCubieSolved (cube)
                && this.isFirstLayerBRCubieSolved (cube);
        }, [
            // Alg to solve piece miss-oriented (white right)
            // This alg was added bc this case is challenging
            // and takes 800 ms
            // F L' U' R' B' L
            [
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_U, -1),
                cubeNotationMove (MOVE_R, -1),
                cubeNotationMove (MOVE_B, -1),
                cubeNotationMove (MOVE_L,  1),
            ],
            // Alg to solve piece miss-oriented (white back)
            // L' F U B R F'
            [
                cubeNotationMove (MOVE_L, -1),
                cubeNotationMove (MOVE_F,  1),
                cubeNotationMove (MOVE_U,  1),
                cubeNotationMove (MOVE_B,  1),
                cubeNotationMove (MOVE_R,  1),
                cubeNotationMove (MOVE_F, -1),
            ],
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
            // [cubeNotationMove (MOVE_D,  1)],
            // [cubeNotationMove (MOVE_D, -1)],
            // F L' U' R' B' L
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

    isYellowFaceSolved (cube) {
        if (cube.data[cube.UP    ] != YELLOW) return false;
        if (cube.data[cube.UP + 1] != YELLOW) return false;
        if (cube.data[cube.UP + 2] != YELLOW) return false;
        if (cube.data[cube.UP + 3] != YELLOW) return false;
        return true;
    }

    // =======================================================================

    solveYellowFace (cube)
    {
        const name = "solveYellowFace";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = findMinSolution (cube, this.MAX_YELLOW_FACE_MOVES, (cube) => {
            return this.isYellowFaceSolved(cube);
        }, [
            // Sune algorithm
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

    // =======================================================================

    solveLastLayer (cube)
    {
        const name = "solveLastLayer";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = findMinSolution (cube, this.MAX_PERMUTATE_LAST_LAYER_MOVES, (cube) => {
            return this.isLastLayerSolved (cube);
        }, [
            // Adjacent corner swap (J-Perm)
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
            // Diagonal corner swap (Y-Perm)
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

}


// =======================================================================