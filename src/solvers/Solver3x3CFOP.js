// Rubiks Cube Solver: Uses the CFOP method
// By Amy Burnett
// =======================================================================
// Globals/constants

// Denotes F2L slots as constants for easy reference
const F2LSlot = Object.freeze({
    FR: "FR",
    FL: "FL",
    BL: "BL",
    BR: "BR"
});

// =======================================================================

class Solver3x3CFOP
{

    constructor ()
    {
        this.name = "Solver3x3CFOP";
        this.supportedSizes = [3];
        this.MAX_CUBE_ORIENTATION_MOVES = 4;
        this.MAX_CROSS_MOVES = 8;
        this.MAX_F2L_MOVES = 12;
        this.MAX_OLL_CROSS = 20;
        this.MAX_OLL_CORNERS = 40;
        this.MAX_PLL_CORNERS = 22;
        this.MAX_PLL_EDGES = 22;
        this.MAX_PLL = 30;
    }

    // =======================================================================

    // returns a list of moves to solve the cube from the current state
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
        temp = this.solveF2LStandard (cube);
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
        temp = this.solvePLL (cube);
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
        let temp = findMinSolution (cube, this.MAX_CUBE_ORIENTATION_MOVES, (cube) => {
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
        let temp = findMinSolution (cube, maxCrossMoves, (cube) => {
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
        temp = findMinSolution (cube, maxCrossMoves, (cube) => {
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
        temp = findMinSolution (cube, maxCrossMoves, (cube) => {
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
        temp = findMinSolution (cube, maxCrossMoves, (cube) => {
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
        let temp = findMinSolution (cube, this.MAX_CROSS_MOVES, (cube) => {
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

    solveF2LStandard (cube) {
        const name = "solveF2LStandard";
        console.log (name);
        console.time (name);

        let solution = [];
        // FIXME: Implement logic to determine the order of F2L slots to solve for faster solving
        // Currently this just solves the F2L slots in a fixed order
        let slotsToSolve = [F2LSlot.BL, F2LSlot.BR, F2LSlot.FR, F2LSlot.FL];
        for (let slot of slotsToSolve) {
            // Check if the current slot is already solved
            if (this.isF2LSlotSolved(cube, slot)) {
                continue;
            }

            let f2lPairSolution = this.solveF2LPairStandard (cube, slot);
            // Ensure solution for this F2L pair was found
            if (f2lPairSolution == null) {
                console.log (`Failed: Could not solve F2L pair ${JSON.stringify(slot)}`);
                console.timeEnd (name);
                return null;
            }
            solution = solution.concat(f2lPairSolution);
        }

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    // Returns true if the given F2L slot is solved, false otherwise
    isF2LSlotSolved (cube, slot) {
        if (slot == F2LSlot.BL) {
            if (!areSameStickers(cube, [cube.BACK  + 4, cube.BACK  + 5, cube.BACK  + 8])) return false;
            if (!areSameStickers(cube, [cube.LEFT  + 3, cube.LEFT  + 4, cube.LEFT  + 6])) return false;
            if (!areSameStickers(cube, [cube.DOWN  + 4, cube.DOWN  + 6])) return false;
        }
        else if (slot == F2LSlot.BR) {
            if (!areSameStickers(cube, [cube.BACK  + 3, cube.BACK  + 4, cube.BACK  + 6])) return false;
            if (!areSameStickers(cube, [cube.RIGHT + 4, cube.RIGHT + 5, cube.RIGHT + 8])) return false;
            if (!areSameStickers(cube, [cube.DOWN  + 4, cube.DOWN  + 8])) return false;
        }
        else if (slot == F2LSlot.FR) {
            if (!areSameStickers(cube, [cube.FRONT + 4, cube.FRONT + 5, cube.FRONT + 8])) return false;
            if (!areSameStickers(cube, [cube.RIGHT + 3, cube.RIGHT + 4, cube.RIGHT + 6])) return false;
            if (!areSameStickers(cube, [cube.DOWN  + 4, cube.DOWN  + 2])) return false;
        }
        else if (slot == F2LSlot.FL) {
            if (!areSameStickers(cube, [cube.FRONT + 3, cube.FRONT + 4, cube.FRONT + 6])) return false;
            if (!areSameStickers(cube, [cube.LEFT  + 4, cube.LEFT  + 5, cube.LEFT  + 8])) return false;
            if (!areSameStickers(cube, [cube.DOWN  + 4, cube.DOWN  + 0])) return false;
        }
        return true;
    }

    // =======================================================================

    getWrongSlotWithF2LPiece (cube, expectedSlot) {
        // Determine F2L pieces
        // Note: Assuming standard solution
        const mapSlotToPositions = {
            [F2LSlot.BL]: [cube.BACK, cube.LEFT],
            [F2LSlot.BR]: [cube.BACK, cube.RIGHT],
            [F2LSlot.FR]: [cube.FRONT, cube.RIGHT],
            [F2LSlot.FL]: [cube.FRONT, cube.LEFT]
        };
        const positions = mapSlotToPositions[expectedSlot];
        const edgePieceColors   = [cube.data[positions[0] + 4], cube.data[positions[1] + 4]];
        const cornerPieceColors = [cube.data[positions[0] + 4], cube.data[positions[1] + 4], cube.data[cube.DOWN + 4]];

        // Check if one of the F2L pieces is in the wrong slot
        const isEdgePieceInLocation = (location0, location1) => {
            return (edgePieceColors.includes(cube.data[location0]) && edgePieceColors.includes(cube.data[location1]));
        };
        const isCornerPieceInLocation = (location0, location1, location2) => {
            return (cornerPieceColors.includes(cube.data[location0]) && cornerPieceColors.includes(cube.data[location1]) && cornerPieceColors.includes(cube.data[location2]));
        };
        const isEdgeInSlotBL   = isEdgePieceInLocation  (cube.BACK  + 5, cube.LEFT  + 3);
        const isCornerInSlotBL = isCornerPieceInLocation(cube.BACK  + 8, cube.LEFT  + 6, cube.DOWN  + 6);
        const isEdgeInSlotBR   = isEdgePieceInLocation  (cube.BACK  + 3, cube.RIGHT + 5);
        const isCornerInSlotBR = isCornerPieceInLocation(cube.BACK  + 6, cube.RIGHT + 8, cube.DOWN  + 8);
        const isEdgeInSlotFR   = isEdgePieceInLocation  (cube.FRONT + 5, cube.RIGHT + 3);
        const isCornerInSlotFR = isCornerPieceInLocation(cube.FRONT + 8, cube.RIGHT + 6, cube.DOWN  + 2);
        const isEdgeInSlotFL   = isEdgePieceInLocation  (cube.FRONT + 3, cube.LEFT  + 5);
        const isCornerInSlotFL = isCornerPieceInLocation(cube.FRONT + 6, cube.LEFT  + 8, cube.DOWN  + 0);
        const isPieceInSlotBL = isEdgeInSlotBL || isCornerInSlotBL;
        const isPieceInSlotBR = isEdgeInSlotBR || isCornerInSlotBR;
        const isPieceInSlotFR = isEdgeInSlotFR || isCornerInSlotFR;
        const isPieceInSlotFL = isEdgeInSlotFL || isCornerInSlotFL;
        if (expectedSlot != F2LSlot.BL && isPieceInSlotBL) return F2LSlot.BL;
        if (expectedSlot != F2LSlot.BR && isPieceInSlotBR) return F2LSlot.BR;
        if (expectedSlot != F2LSlot.FR && isPieceInSlotFR) return F2LSlot.FR;
        if (expectedSlot != F2LSlot.FL && isPieceInSlotFL) return F2LSlot.FL;
        // Reaches here if no F2L piece is found in the wrong slot
        return null;
    }

    // =======================================================================

    getMoveSetToExtractPieceFromSlot (cube, slot) {
        let moveSet = cubeMoveNotation.stringToMoveSet ("R U R'");
        const slotRotationDegree = {
            [F2LSlot.BL]: 180,
            [F2LSlot.BR]: 90,
            [F2LSlot.FR]: 0,
            [F2LSlot.FL]: 270
        };
        const rotationDegree = slotRotationDegree[slot];
        return rotateAlgorithmY (moveSet, rotationDegree);
    }

    // =======================================================================
    
    solveF2LPairStandard (cube, slot) {
        const name = "solveF2LPairStandard";
        console.log (name);
        console.time (name);
        let solution = [];

        // Extract F2L pieces if they are in the wrong slot
        // We dont have an algorithm for every possible position, so work around piece-in-wrong-slot cases
        let wrongSlotWithF2LPiece = this.getWrongSlotWithF2LPiece(cube, slot);
        while (wrongSlotWithF2LPiece) {
            // Extract the F2L piece from the wrong slot
            // Note that if this is naively extracted, it might put the other F2L piece in this wrong slot
            const extractionMoveSet = this.getMoveSetToExtractPieceFromSlot(cube, wrongSlotWithF2LPiece);
            for (const move of extractionMoveSet) {
                const axisMove = cubeMoveNotation.toAxisNotation(move);
                cube.rotate(axisMove[0], axisMove[1], axisMove[2]);
            }
            console.log ("Evicting F2L piece from wrong slot:", wrongSlotWithF2LPiece, "with extraction moves:", extractionMoveSet);
            solution = solution.concat(extractionMoveSet);
            // Check if there is another F2L piece in the wrong slot
            wrongSlotWithF2LPiece = this.getWrongSlotWithF2LPiece(cube, slot);
        }

        // Temporarily normalize cube rotation with the front-right slot position
        // This allows us to easily match F2L patterns without needing to provide separate algorithms for each slot orientation.
        const slotRotationMoveSet = {
            [F2LSlot.BL]: cubeMoveNotation.stringToMoveSet("Y2"),
            [F2LSlot.BR]: cubeMoveNotation.stringToMoveSet("Y"),
            [F2LSlot.FR]: cubeMoveNotation.stringToMoveSet(""),
            [F2LSlot.FL]: cubeMoveNotation.stringToMoveSet("Y'")
        };
        const rotationMoveSet = slotRotationMoveSet[slot];
        const slotRotationDegree = {
            [F2LSlot.BL]: 180,
            [F2LSlot.BR]: 90,
            [F2LSlot.FR]: 0,
            [F2LSlot.FL]: 270
        };
        const rotationDegree = slotRotationDegree[slot];
        for (const move of rotationMoveSet) {
            const axisMove = cubeMoveNotation.toAxisNotation(move);
            cube.rotate(axisMove[0], axisMove[1], axisMove[2]);
        }

        console.log ("Rotated cube for slot:", slot, "with rotation degree:", rotationDegree);
        for (const move of rotationMoveSet) {
            console.log ("Applied rotation move:", move);
        }

        // Match and find the appropriate F2L algorithm for the given pair
        let normalizedF2LSolution = solveWithAlgorithms (
            cube,
            (cube) => {
                // Use FR since we normalized the rotation
                return this.isF2LSlotSolved (cube, F2LSlot.FR);
            }, [
                // Exhaustive possible U move sets before/after applying an algorithm
                [],
                cubeMoveNotation.stringToMoveSet ("U"),
                cubeMoveNotation.stringToMoveSet ("U'"),
                cubeMoveNotation.stringToMoveSet ("U2"),
            ],
            // F2L Algorithm database
            // Based on the following guide by SpeedCubeDB: https://speedcubedb.com/a/3x3/F2L
            // Note that colors in the diagrams are for reference only to show the pattern,
            // any color can be matched.
            [
                // === Basic Inserts =====================================
                // F2L 1: Basic Inserts - Connected - Right
                //            +---------+
                //            | .  .  . |
                //            | .  .  G |
                //            | .  .  G |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  W | O  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U R U' R'
                new PatternAlgorithm (
                    "F2L:1:BasicInserts:Connected:Right",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.UP    + 5, cube.UP    + 8, cube.FRONT + 4])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 0, cube.RIGHT + 1, cube.RIGHT + 4])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.FRONT + 2, cube.DOWN  + 4])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U R U' R'")
                ),
                // F2L 2: Basic Inserts - Connected - Left
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  O  O |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  G  G | W  .  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // F R' F' R
                new PatternAlgorithm (
                    "F2L:2:BasicInserts:Connected:Left",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 1, cube.FRONT + 2, cube.FRONT + 4])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.UP    + 7, cube.UP    + 8, cube.RIGHT + 4])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.RIGHT + 0, cube.DOWN  + 4])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("F R' F' R")
                ),
                // F2L 3: Basic Inserts - Disconnected - Left
                //            +---------+
                //            | .  .  . |
                //            | O  .  . |
                //            | .  .  G |
                // +----------+---------+----------+----------+
                // | .  G  .  | .  .  W | O  .  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // F' U' F
                new PatternAlgorithm (
                    "F2L:3:BasicInserts:Disconnected:Left",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.LEFT  + 1, cube.UP    + 8])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.RIGHT + 0, cube.UP    + 3])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.FRONT + 2])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("F' U' F")
                ),
                // F2L 4: Basic Inserts - Disconnected - Right
                //            +---------+
                //            | .  G  . |
                //            | .  .  . |
                //            | .  .  O |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  G | W  .  .  | .  O  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // R U R'
                new PatternAlgorithm (
                    "F2L:4:BasicInserts:Disconnected:Right",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.FRONT + 2, cube.UP    + 1])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.BACK  + 1, cube.UP    + 8])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.RIGHT + 0])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R U R'")
                ),
                // === Disconnected Pairs ================================
                // F2L 5: Disconnected Pairs
                //            +---------+
                //            | .  G  . |
                //            | .  .  . |
                //            | .  .  G |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  W | O  .  .  | .  O  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U' R U R' U2 R U' R'
                new PatternAlgorithm (
                    "F2L:5:DisconnectedPairs",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 1, cube.UP    + 8])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.RIGHT + 0, cube.BACK  + 1])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.FRONT + 2])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U' R U R' U2 R U' R'")
                ),
                // F2L 6: Disconnected Pairs
                //            +---------+
                //            | .  .  . |
                //            | O  .  . |
                //            | .  .  O |
                // +----------+---------+----------+----------+
                // | .  G  .  | .  .  G | W  .  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U' Rw U' R' U R U Rw'
                new PatternAlgorithm (
                    "F2L:6:DisconnectedPairs",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.FRONT + 2, cube.LEFT  + 1])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.UP    + 3, cube.UP    + 8])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.RIGHT + 0])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U' Rw U' R' U R U Rw'")
                ),
                // F2L 7: Disconnected Pairs
                //            +---------+
                //            | .  .  . |
                //            | G  .  . |
                //            | .  .  G |
                // +----------+---------+----------+----------+
                // | .  O  .  | .  .  W | O  .  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U' R U2 R' U' R U2 R'
                new PatternAlgorithm (
                    "F2L:7:DisconnectedPairs",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 3, cube.UP    + 8])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.LEFT  + 1, cube.RIGHT + 0])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.FRONT + 2])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U' R U2 R' U' R U2 R'")
                ),
                // F2L 8: Disconnected Pairs
                //            +---------+
                //            | .  O  . |
                //            | .  .  . |
                //            | .  .  O |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  G | W  .  .  | .  G  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // Rw' U2 R2 U R2 U Rw
                new PatternAlgorithm (
                    "F2L:8:DisconnectedPairs",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.FRONT + 2, cube.BACK  + 1])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.UP    + 1, cube.UP    + 8])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.RIGHT + 0])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("Rw' U2 R2 U R2 U Rw")
                ),
                // F2L 9: Disconnected Pairs
                //            +---------+
                //            | .  O  . |
                //            | .  .  . |
                //            | .  .  G |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  W | O  .  .  | .  G  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U' R U' R' U F' U' F
                new PatternAlgorithm (
                    "F2L:9:DisconnectedPairs",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 8, cube.BACK  + 1])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.UP    + 1, cube.RIGHT + 0])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.FRONT + 2])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U' R U' R' U F' U' F")
                ),
                // F2L 10: Disconnected Pairs
                //            +---------+
                //            | .  .  . |
                //            | G  .  . |
                //            | .  .  O |
                // +----------+---------+----------+----------+
                // | .  O  .  | .  .  G | W  .  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U' R U R' U R U R'
                new PatternAlgorithm (
                    "F2L:10:DisconnectedPairs",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 3, cube.FRONT + 2])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.UP    + 8, cube.LEFT  + 1])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.RIGHT + 0])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U' R U R' U R U R'")
                ),
                // F2L 11: Connected Pairs
                //            +---------+
                //            | .  .  . |
                //            | .  .  O |
                //            | .  .  G |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  W | O  G  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U' R U2 R' U F' U' F
                new PatternAlgorithm (
                    "F2L:11:ConnectedPairs",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 8, cube.RIGHT + 1])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.UP    + 5, cube.RIGHT + 0])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.FRONT + 2])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U' R U2 R' U F' U' F")
                ),
                // F2L 12: Connected Pairs
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  G  O |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  O  G | W  .  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // R U' R' U R U' R' U2 R U' R'
                new PatternAlgorithm (
                    "F2L:12:ConnectedPairs",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 7, cube.FRONT + 2])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.UP    + 8, cube.FRONT + 1])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.RIGHT + 0])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R U' R' U R U' R' U2 R U' R'")
                ),
                // F2L 13: Connected Pairs
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  O  G |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  G  W | O  .  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // M' U' R U R' U2 R U' Rw'
                new PatternAlgorithm (
                    "F2L:13:ConnectedPairs",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 8, cube.FRONT + 1])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.UP    + 7, cube.RIGHT + 0])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.FRONT + 2])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("M' U' R U R' U2 R U' Rw'")
                ),
                // F2L 14: Connected Pairs
                //            +---------+
                //            | .  .  . |
                //            | .  .  G |
                //            | .  .  O |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  G | W  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U' R U' R' U R U R'
                new PatternAlgorithm (
                    "F2L:14:ConnectedPairs",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 5, cube.FRONT + 2])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.UP    + 8, cube.RIGHT + 1])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.RIGHT + 0])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U' R U' R' U R U R'")
                ),
                // F2L 15: Connected Pairs
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  G  G |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  O  W | O  .  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // M U Rw U' Rw' U' M'
                new PatternAlgorithm (
                    "F2L:15:ConnectedPairs",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 7, cube.UP    + 8])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.FRONT + 1, cube.RIGHT + 0])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.FRONT + 2])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("M U Rw U' Rw' U' M'")
                ),
                // F2L 16: Connected Pairs
                //            +---------+
                //            | .  .  . |
                //            | .  .  O |
                //            | .  .  O |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  G | W  G  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // R U' R' U2 F' U' F
                new PatternAlgorithm (
                    "F2L:16:ConnectedPairs",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.FRONT + 2, cube.RIGHT + 1])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.UP    + 5, cube.UP    + 8])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.RIGHT + 0])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R U' R' U2 F' U' F")
                ),
                // F2L 17: Connected Pairs
                //            +---------+
                //            | .  .  . |
                //            | .  .  G |
                //            | .  .  W |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  O | G  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // R U2 R' U' R U R'
                new PatternAlgorithm (
                    "F2L:17:ConnectedPairs",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 5, cube.RIGHT + 0])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.FRONT + 2, cube.RIGHT + 1])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.UP    + 8])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R U2 R' U' R U R'")
                ),
                // F2L 18: Connected Pairs
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  O  W |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  G  O | G  .  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // F' U2 F U F' U' F
                new PatternAlgorithm (
                    "F2L:18:ConnectedPairs",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.FRONT + 1, cube.RIGHT + 0])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.UP    + 7, cube.FRONT + 2])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.UP    + 8])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("F' U2 F U F' U' F")
                ),
                // F2L 19: Disconnected Pairs - White Up
                //            +---------+
                //            | .  G  . |
                //            | .  .  . |
                //            | .  .  W |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  O | G  .  .  | .  O  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U R U2 R' U R U' R'
                new PatternAlgorithm (
                    "F2L:19:DisconnectedPairs:WhiteUp",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 1, cube.RIGHT + 0])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.FRONT + 2, cube.BACK  + 1])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.UP    + 8])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U R U2 R' U R U' R'")
                ),
                // F2L 20: Disconnected Pairs - White Up
                //            +---------+
                //            | .  .  . |
                //            | O  .  . |
                //            | .  .  W |
                // +----------+---------+----------+----------+
                // | .  G  .  | .  .  O | G  .  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U' R U' R2 F R F' R U' R'
                new PatternAlgorithm (
                    "F2L:20:DisconnectedPairs:WhiteUp",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.LEFT  + 1, cube.RIGHT + 0])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.UP    + 3, cube.FRONT + 2])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.UP    + 8])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U' R U' R2 F R F' R U' R'")
                ),
                // F2L 21: Disconnected Pairs - White Up
                //            +---------+
                //            | .  .  . |
                //            | G  .  . |
                //            | .  .  W |
                // +----------+---------+----------+----------+
                // | .  O  .  | .  .  O | G  .  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U2 R U R' U R U' R'
                new PatternAlgorithm (
                    "F2L:21:DisconnectedPairs:WhiteUp",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 3, cube.RIGHT + 0])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.LEFT  + 1, cube.FRONT + 2])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.UP    + 8])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U2 R U R' U R U' R'")
                ),
                // F2L 22: Disconnected Pairs - White Up
                //            +---------+
                //            | .  O  . |
                //            | .  .  . |
                //            | .  .  W |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  O | G  .  .  | .  G  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // Rw U' Rw' U2 Rw U Rw'
                new PatternAlgorithm (
                    "F2L:22:DisconnectedPairs:WhiteUp",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.RIGHT + 0, cube.BACK  + 1])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.UP    + 1, cube.FRONT + 2])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.UP    + 8])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("Rw U' Rw' U2 Rw U Rw'")
                ),
                // F2L 23: Connected Pairs - White Up
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  G  W |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  O  O | G  .  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U R U' R' U' R U' R' U R U' R'
                new PatternAlgorithm (
                    "F2L:23:ConnectedPairs:WhiteUp",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 7, cube.RIGHT + 0])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.FRONT + 1, cube.FRONT + 2])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.UP    + 8])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U R U' R' U' R U' R' U R U' R'")
                ),
                // F2L 24: Connected Pairs - White Up
                //            +---------+
                //            | .  .  . |
                //            | .  .  O |
                //            | .  .  W |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  O | G  G  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // F U R U' R' F' R U' R'
                new PatternAlgorithm (
                    "F2L:24:ConnectedPairs:WhiteUp",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.RIGHT + 0, cube.RIGHT + 1])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.UP    + 5, cube.FRONT + 2])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.UP    + 8])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("F U R U' R' F' R U' R'")
                ),
                // F2L 25: Corner in slot
                //            +---------+
                //            | .  .  . |
                //            | .  .  G |
                //            | .  .  . |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  G | O  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  W |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U' R' F R F' R U R'
                new PatternAlgorithm (
                    "F2L:25:CornerInSlot",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 5, cube.FRONT + 8])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.RIGHT + 1, cube.RIGHT + 6])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.DOWN  + 2])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U' R' F R F' R U R'")
                ),
                // F2L 26: Corner in slot
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  O  . |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  G  . | .  .  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  G | O  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  W |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U R U' R' F R' F' R
                new PatternAlgorithm (
                    "F2L:26:CornerInSlot",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.FRONT + 1, cube.FRONT + 8])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.UP    + 7, cube.RIGHT + 6])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.DOWN  + 2])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U R U' R' F R' F' R")
                ),
                // F2L 27: Corner in slot
                //            +---------+
                //            | .  .  . |
                //            | .  .  G |
                //            | .  .  . |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  W | G  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  O |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // R U' R' U R U' R'
                new PatternAlgorithm (
                    "F2L:27:CornerInSlot",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 5, cube.RIGHT + 6])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.RIGHT + 1, cube.DOWN  + 2])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.FRONT + 8])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R U' R' U R U' R'")
                ),
                // F2L 28: Corner in slot
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  O  . |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  G  . | .  .  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  O | W  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  G |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // R U R' U' F R' F' R
                new PatternAlgorithm (
                    "F2L:28:CornerInSlot",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.FRONT + 1, cube.DOWN  + 2])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.UP    + 7, cube.FRONT + 8])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.RIGHT + 6])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R U R' U' F R' F' R")
                ),
                // F2L 29: Corner in slot
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  O  . |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  G  . | .  .  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  W | G  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  O |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // R' F R F' U R U' R'
                new PatternAlgorithm (
                    "F2L:29:CornerInSlot",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.FRONT + 1, cube.RIGHT + 6])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.UP    + 7, cube.DOWN  + 2])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.FRONT + 8])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R' F R F' U R U' R'")
                ),
                // F2L 30: Corner in slot
                //            +---------+
                //            | .  .  . |
                //            | .  .  G |
                //            | .  .  . |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // | .  .  .  | .  G  O | W  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  G |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // R U R' U' R U R'
                new PatternAlgorithm (
                    "F2L:30:CornerInSlot",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 5, cube.DOWN  + 2])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.FRONT + 8, cube.RIGHT + 1])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.RIGHT + 6])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R U R' U' R U R'")
                ),
                // F2L 31: Edge in slot
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  .  W |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  O | G  .  .  | .  .  .  |
                // | .  .  .  | .  G  O | G  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U' R' F R F' R U' R'
                new PatternAlgorithm (
                    "F2L:31:EdgeInSlot",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.RIGHT + 0, cube.RIGHT + 3])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.FRONT + 2, cube.FRONT + 5])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.UP    + 8])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U' R' F R F' R U' R'")
                ),
                // F2L 32: Edge in slot
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  .  W |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  O | G  .  .  | .  .  .  |
                // | .  .  .  | .  G  G | O  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U R U' R' U R U' R' U R U' R'
                new PatternAlgorithm (
                    "F2L:32:EdgeInSlot",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.FRONT + 5, cube.RIGHT + 0])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.FRONT + 2, cube.RIGHT + 3])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.UP    + 8])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U R U' R' U R U' R' U R U' R'")
                ),
                // F2L 33: Edge in slot
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  .  G |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  W | O  .  .  | .  .  .  |
                // | .  .  .  | .  G  G | O  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U' R U' R' U2 R U' R'
                new PatternAlgorithm (
                    "F2L:33:EdgeInSlot",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 8, cube.FRONT + 5])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.RIGHT + 0, cube.RIGHT + 3])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.FRONT + 2])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U' R U' R' U2 R U' R'")
                ),
                // F2L 34: Edge in slot
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  .  O |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  G | W  .  .  | .  .  .  |
                // | .  .  .  | .  G  G | O  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U R U R' U2 R U R'
                new PatternAlgorithm (
                    "F2L:34:EdgeInSlot",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.FRONT + 2, cube.FRONT + 5])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.UP    + 8, cube.RIGHT + 3])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.RIGHT + 0])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U R U R' U2 R U R'")
                ),
                // F2L 35: Edge in slot
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  .  G |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  W | O  .  .  | .  .  .  |
                // | .  .  .  | .  G  O | G  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U' R U R' U F' U' F
                new PatternAlgorithm (
                    "F2L:35:EdgeInSlot",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.UP    + 8, cube.RIGHT + 3])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.FRONT + 5, cube.RIGHT + 0])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.FRONT + 2])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U' R U R' U F' U' F")
                ),
                // F2L 36: Edge in slot
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  .  O |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  G | W  .  .  | .  .  .  |
                // | .  .  .  | .  G  O | G  O  .  | .  .  .  |
                // | .  .  .  | .  G  . | .  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  . |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // U F' U' F U' R U R'
                new PatternAlgorithm (
                    "F2L:36:EdgeInSlot",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.FRONT + 2, cube.RIGHT + 3])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.FRONT + 5, cube.UP    + 8])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.RIGHT + 0])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("U F' U' F U' R U R'")
                ),
                // F2L 37: Pieces in slot
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  .  . |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  . | .  .  .  | .  .  .  |
                // | .  .  .  | .  G  O | G  O  .  | .  .  .  |
                // | .  .  .  | .  G  G | O  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  W |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // R2 U2 F R2 F' U2 R' U R'
                new PatternAlgorithm (
                    "F2L:37:PiecesInSlot",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.FRONT + 8, cube.RIGHT + 3])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.FRONT + 5, cube.RIGHT + 6])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.DOWN  + 2])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R2 U2 F R2 F' U2 R' U R'")
                ),
                // F2L 38: Pieces in slot
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  .  . |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  . | .  .  .  | .  .  .  |
                // | .  .  .  | .  G  G | O  O  .  | .  .  .  |
                // | .  .  .  | .  G  W | G  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  O |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // R U' R' U' R U R' U2 R U' R'
                new PatternAlgorithm (
                    "F2L:38:PiecesInSlot",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.FRONT + 5, cube.RIGHT + 6])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.DOWN  + 2, cube.RIGHT + 3])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.FRONT + 8])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R U' R' U' R U R' U2 R U' R'")
                ),
                // F2L 39: Pieces in slot
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  .  . |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  . | .  .  .  | .  .  .  |
                // | .  .  .  | .  G  G | O  O  .  | .  .  .  |
                // | .  .  .  | .  G  O | W  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  G |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // R U' R' U R U2 R' U R U' R'
                new PatternAlgorithm (
                    "F2L:39:PiecesInSlot",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.FRONT + 5, cube.DOWN  + 2])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.FRONT + 8, cube.RIGHT + 3])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.RIGHT + 6])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R U' R' U R U2 R' U R U' R'")
                ),
                // F2L 40: Pieces in slot
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  .  . |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  . | .  .  .  | .  .  .  |
                // | .  .  .  | .  G  O | G  O  .  | .  .  .  |
                // | .  .  .  | .  G  W | G  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  O |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // Rw U' Rw' U2 Rw U Rw' R U R'
                new PatternAlgorithm (
                    "F2L:40:PiecesInSlot",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.RIGHT + 3, cube.RIGHT + 6])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.FRONT + 5, cube.DOWN  + 2])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.FRONT + 8])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("Rw U' Rw' U2 Rw U Rw' R U R'")
                ),
                // F2L 41: Pieces in slot
                //            +---------+
                //            | .  .  . |
                //            | .  .  . |
                //            | .  .  . |
                // +----------+---------+----------+----------+
                // | .  .  .  | .  .  . | .  .  .  | .  .  .  |
                // | .  .  .  | .  G  O | G  O  .  | .  .  .  |
                // | .  .  .  | .  G  O | W  O  .  | .  .  .  |
                // +----------+---------+----------+----------+
                //            | .  W  G |
                //            | W  W  W |
                //            | .  W  . |
                //            +---------+
                // R U' R' Rw U' Rw' U2 Rw U Rw'
                new PatternAlgorithm (
                    "F2L:41:PiecesInSlot",
                    (cube) => {
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 4, cube.DOWN  + 2, cube.RIGHT + 3])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.RIGHT + 4, cube.FRONT + 5, cube.FRONT + 8])) return false;
                        // White
                        if (!areSameStickers(cube, [cube.DOWN  + 4, cube.RIGHT + 6])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R U' R' Rw U' Rw' U2 Rw U Rw'")
                ),
            ]
        );

        // Ensure solution was found
        if (normalizedF2LSolution == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }

        // Undo the temporary rotation to restore the original cube orientation
        for (let i = rotationMoveSet.length-1; i >= 0; --i) {
            const move = rotationMoveSet[i];
            const axisMove = cubeMoveNotation.toAxisNotation (move);
            // Do the reverse move to undo (-direction)
            cube.rotate (axisMove[0], axisMove[1], -axisMove[2]);
        }
        // Rotate the normalized algorithm to match the original cube orientation
        let unnormalizedF2LSolution = rotateAlgorithmY (normalizedF2LSolution, rotationDegree);
        solution = solution.concat(unnormalizedF2LSolution);

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    solveF2LNaive (cube) {
        const name = "solveF2LNaive";
        console.log (name);
        console.time (name);

        let solution = [];
        // F2L: First
        let temp = this.solveFirstF2L (cube);
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

        console.timeEnd (name);
        return solution;
    }

    // =======================================================================

    solveFirstF2LMin (cube) {
        const name = "solveFirstF2LMin";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = findMinSolution (cube, this.MAX_F2L_MOVES, (cube) => {
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
        let temp = findMinSolution (cube, 4, (cube) => {
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
        let temp = findMinSolution (cube, 4, (cube) => {
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
        let temp = findMinSolution (cube, this.MAX_F2L_MOVES, (cube) => {
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
        let temp = findMinSolution (cube, 4, (cube) => {
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
        let temp = findMinSolution (cube, 4, (cube) => {
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
        let temp = findMinSolution (cube, this.MAX_F2L_MOVES, (cube) => {
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
        let temp = findMinSolution (cube, 4, (cube) => {
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
        let temp = findMinSolution (cube, 4, (cube) => {
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
        let temp = findMinSolution (cube, this.MAX_F2L_MOVES, (cube) => {
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
        let temp = findMinSolution (cube, 4, (cube) => {
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
        let temp = findMinSolution (cube, 6, (cube) => {
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
        let temp = findMinSolution (cube, this.MAX_OLL_CROSS, (cube) => {
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
            // F R U R' U' F' Fw R U R' U' Fw'
            new PatternAlgorithm (
                "2LOLL:Dot",
                (cube) => {
                    if (cube.data[cube.UP    + 4] != YELLOW) return false;
                    if (cube.data[cube.LEFT  + 1] != YELLOW) return false;
                    if (cube.data[cube.FRONT + 1] != YELLOW) return false;
                    if (cube.data[cube.RIGHT + 1] != YELLOW) return false;
                    if (cube.data[cube.BACK  + 1] != YELLOW) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("F R U R' U' F' Fw R U R' U' Fw'")
            ),
            // Bar (2 opposite edges solved)
            //    x
            //  +---+
            //  |   |
            //  |xxx|
            //  |   |
            //  +---+
            //    x
            // F R U R' U' F'
            new PatternAlgorithm (
                "2LOLL:Bar",
                (cube) => {
                    if (cube.data[cube.UP    + 3] != YELLOW) return false;
                    if (cube.data[cube.UP    + 4] != YELLOW) return false;
                    if (cube.data[cube.UP    + 5] != YELLOW) return false;
                    if (cube.data[cube.FRONT + 1] != YELLOW) return false;
                    if (cube.data[cube.BACK  + 1] != YELLOW) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("F R U R' U' F'")
            ),
            // L-shape (2 adjacent edges solved)
            //    x
            //  +---+
            //  |   |
            // x| xx|
            //  | x |
            //  +---+
            // Fw R U R' U' Fw'
            new PatternAlgorithm (
                "2LOLL:L-Shape",
                (cube) => {
                    if (cube.data[cube.UP    + 4] != YELLOW) return false;
                    if (cube.data[cube.UP    + 5] != YELLOW) return false;
                    if (cube.data[cube.UP    + 7] != YELLOW) return false;
                    if (cube.data[cube.LEFT  + 1] != YELLOW) return false;
                    if (cube.data[cube.BACK  + 1] != YELLOW) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("Fw R U R' U' Fw'")
            ),
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
        let temp = findMinSolution (cube, this.MAX_OLL_CORNERS, (cube) => {
            return this.isYellowCornersOrientated (cube);
        }, [
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            // Antisune
            // 
            //  + - - - +
            // X|   X X |
            //  | X X X |
            //  |   X   |X
            //  + - - - +
            //    X
            // R U2 R' U' R U' R'
            new PatternAlgorithm (
                "Antisune",
                (cube) => {
                    if (cube.data[cube.UP    + 1] != YELLOW) return false;
                    if (cube.data[cube.UP    + 2] != YELLOW) return false;
                    if (cube.data[cube.UP    + 3] != YELLOW) return false;
                    if (cube.data[cube.UP    + 4] != YELLOW) return false;
                    if (cube.data[cube.UP    + 5] != YELLOW) return false;
                    if (cube.data[cube.UP    + 7] != YELLOW) return false;
                    if (cube.data[cube.LEFT  + 0] != YELLOW) return false;
                    if (cube.data[cube.FRONT + 0] != YELLOW) return false;
                    if (cube.data[cube.RIGHT + 0] != YELLOW) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R U2 R' U' R U' R'")
            ),
            // H
            //  + - - - +
            // X|   X   |X
            //  | X X X |
            // X|   X   |X
            //  + - - - +
            // R U R' U R U' R' U R U2 R'
            new PatternAlgorithm (
                "H",
                (cube) => {
                    if (cube.data[cube.UP    + 1] != YELLOW) return false;
                    if (cube.data[cube.UP    + 3] != YELLOW) return false;
                    if (cube.data[cube.UP    + 4] != YELLOW) return false;
                    if (cube.data[cube.UP    + 5] != YELLOW) return false;
                    if (cube.data[cube.UP    + 7] != YELLOW) return false;
                    if (cube.data[cube.LEFT  + 0] != YELLOW) return false;
                    if (cube.data[cube.LEFT  + 2] != YELLOW) return false;
                    if (cube.data[cube.RIGHT + 0] != YELLOW) return false;
                    if (cube.data[cube.RIGHT + 2] != YELLOW) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R U R' U R U' R' U R U2 R'")
            ),
            // L
            //  + - - - +
            //  | X X   |X
            //  | X X X |
            //  |   X X |
            //  + - - - +
            //    X
            // F R' F' Rw U R U' Rw'
            new PatternAlgorithm (
                "L",
                (cube) => {
                    if (cube.data[cube.UP    + 0] != YELLOW) return false;
                    if (cube.data[cube.UP    + 1] != YELLOW) return false;
                    if (cube.data[cube.UP    + 3] != YELLOW) return false;
                    if (cube.data[cube.UP    + 4] != YELLOW) return false;
                    if (cube.data[cube.UP    + 5] != YELLOW) return false;
                    if (cube.data[cube.UP    + 7] != YELLOW) return false;
                    if (cube.data[cube.UP    + 8] != YELLOW) return false;
                    if (cube.data[cube.FRONT + 0] != YELLOW) return false;
                    if (cube.data[cube.RIGHT + 2] != YELLOW) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("F R' F' Rw U R U' Rw'")
            ),
            // Pi
            //        X
            //  + - - - +
            // X|   X   |
            //  | X X X |
            // X|   X   |
            //  + - - - +
            //        X
            // R U2 R2 U' R2 U' R2 U2 R
            new PatternAlgorithm (
                "Pi",
                (cube) => {
                    if (cube.data[cube.UP    + 1] != YELLOW) return false;
                    if (cube.data[cube.UP    + 3] != YELLOW) return false;
                    if (cube.data[cube.UP    + 4] != YELLOW) return false;
                    if (cube.data[cube.UP    + 5] != YELLOW) return false;
                    if (cube.data[cube.UP    + 7] != YELLOW) return false;
                    if (cube.data[cube.LEFT  + 0] != YELLOW) return false;
                    if (cube.data[cube.LEFT  + 2] != YELLOW) return false;
                    if (cube.data[cube.FRONT + 2] != YELLOW) return false;
                    if (cube.data[cube.BACK  + 0] != YELLOW) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R U2 R2 U' R2 U' R2 U2 R")
            ),
            // Sune (aka fishy alg)
            //    X
            //  + - - - +
            //  |   X   |X
            //  | X X X |
            //  | X X   |
            //  + - - - +
            //        X
            // R U R' U R U2 R'
            new PatternAlgorithm (
                "Sune",
                (cube) => {
                    if (cube.data[cube.UP    + 1] != YELLOW) return false;
                    if (cube.data[cube.UP    + 3] != YELLOW) return false;
                    if (cube.data[cube.UP    + 4] != YELLOW) return false;
                    if (cube.data[cube.UP    + 5] != YELLOW) return false;
                    if (cube.data[cube.UP    + 6] != YELLOW) return false;
                    if (cube.data[cube.UP    + 7] != YELLOW) return false;
                    if (cube.data[cube.FRONT + 2] != YELLOW) return false;
                    if (cube.data[cube.RIGHT + 2] != YELLOW) return false;
                    if (cube.data[cube.BACK  + 2] != YELLOW) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R U R' U R U2 R'")
            ),
            // T
            //    X
            //  + - - - +
            //  |   X X |
            //  | X X X |
            //  |   X X |
            //  + - - - +
            //    X
            // Rw U R' U' Rw' F R F'
            new PatternAlgorithm (
                "T",
                (cube) => {
                    if (cube.data[cube.UP    + 1] != YELLOW) return false;
                    if (cube.data[cube.UP    + 2] != YELLOW) return false;
                    if (cube.data[cube.UP    + 3] != YELLOW) return false;
                    if (cube.data[cube.UP    + 4] != YELLOW) return false;
                    if (cube.data[cube.UP    + 5] != YELLOW) return false;
                    if (cube.data[cube.UP    + 7] != YELLOW) return false;
                    if (cube.data[cube.UP    + 8] != YELLOW) return false;
                    if (cube.data[cube.FRONT + 0] != YELLOW) return false;
                    if (cube.data[cube.BACK  + 2] != YELLOW) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("Rw U R' U' Rw' F R F'")
            ),
            // U
            //  + - - - +
            //  | X X X |
            //  | X X X |
            //  |   X   |
            //  + - - - +
            //    X   X
            // R2 D R' U2 R D' R' U2 R'
            new PatternAlgorithm (
                "U",
                (cube) => {
                    if (cube.data[cube.UP    + 0] != YELLOW) return false;
                    if (cube.data[cube.UP    + 1] != YELLOW) return false;
                    if (cube.data[cube.UP    + 2] != YELLOW) return false;
                    if (cube.data[cube.UP    + 3] != YELLOW) return false;
                    if (cube.data[cube.UP    + 4] != YELLOW) return false;
                    if (cube.data[cube.UP    + 5] != YELLOW) return false;
                    if (cube.data[cube.UP    + 7] != YELLOW) return false;
                    if (cube.data[cube.FRONT + 0] != YELLOW) return false;
                    if (cube.data[cube.FRONT + 2] != YELLOW) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R2 D R' U2 R D' R' U2 R'")
            ),
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
        let temp = findMinSolution (cube, this.MAX_PLL_CORNERS, (cube) => {
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
            new PatternAlgorithm (
                "2LPLL:Y-Perm",
                (cube) => {
                    if (cube.data[cube.LEFT    + 0] != cube.data[cube.RIGHT   + 2]) return false;
                    if (cube.data[cube.LEFT    + 2] != cube.data[cube.RIGHT   + 0]) return false;
                    if (cube.data[cube.FRONT   + 0] != cube.data[cube.BACK    + 2]) return false;
                    if (cube.data[cube.FRONT   + 2] != cube.data[cube.BACK    + 0]) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("F R U' R' U' R U R' F' R U R' U' R' F R F'")
            ),
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
            new PatternAlgorithm (
                "2LPLL:T-Perm",
                (cube) => {
                    if (cube.data[cube.LEFT    + 0] != cube.data[cube.LEFT    + 0]) return false;
                    if (cube.data[cube.FRONT   + 0] != cube.data[cube.RIGHT   + 2]) return false;
                    if (cube.data[cube.FRONT   + 2] != cube.data[cube.BACK    + 0]) return false;
                    if (cube.data[cube.RIGHT   + 0] != cube.data[cube.BACK    + 2]) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R U R' U' R' F R2 U' R' U' R U R' F'")
            ),
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
        let temp = findMinSolution (cube, this.MAX_PLL_EDGES, (cube) => {
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
            new PatternAlgorithm (
                "2LPLL:H-Perm",
                (cube) => {
                    if (cube.data[cube.FRONT   + 1] != cube.data[cube.BACK   + 0]) return false;
                    if (cube.data[cube.LEFT    + 1] != cube.data[cube.RIGHT  + 0]) return false;
                    if (cube.data[cube.RIGHT   + 1] != cube.data[cube.LEFT   + 0]) return false;
                    if (cube.data[cube.BACK    + 1] != cube.data[cube.FRONT  + 0]) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("M2 U M2 U2 M2 U M2")
            ),
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
            new PatternAlgorithm (
                "2LPLL:Ua-Perm",
                (cube) => {
                    if (cube.data[cube.FRONT   + 1] != cube.data[cube.RIGHT  + 0]) return false;
                    if (cube.data[cube.LEFT    + 1] != cube.data[cube.FRONT  + 0]) return false;
                    if (cube.data[cube.RIGHT   + 1] != cube.data[cube.LEFT   + 0]) return false;
                    if (cube.data[cube.BACK    + 1] != cube.data[cube.BACK   + 0]) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R U' R U R U R U' R' U' R2")
            ),
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
            new PatternAlgorithm (
                "2LPLL:Ub-Perm",
                (cube) => {
                    if (cube.data[cube.FRONT   + 1] != cube.data[cube.LEFT   + 0]) return false;
                    if (cube.data[cube.LEFT    + 1] != cube.data[cube.RIGHT  + 0]) return false;
                    if (cube.data[cube.RIGHT   + 1] != cube.data[cube.FRONT  + 0]) return false;
                    if (cube.data[cube.BACK    + 1] != cube.data[cube.BACK   + 0]) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R2 U R U R' U' R' U' R' U R'")
            ),
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
            new PatternAlgorithm (
                "2LPLL:Z-Perm",
                (cube) => {
                    if (cube.data[cube.FRONT   + 1] != cube.data[cube.LEFT   + 0]) return false;
                    if (cube.data[cube.LEFT    + 1] != cube.data[cube.FRONT  + 0]) return false;
                    if (cube.data[cube.RIGHT   + 1] != cube.data[cube.BACK   + 0]) return false;
                    if (cube.data[cube.BACK    + 1] != cube.data[cube.RIGHT  + 0]) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("M' U M2 U M2 U M' U2 M2")
            ),
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

    // This is one-look PLL (permute last layer)
    solvePLL (cube) {
        const name = "solvePLL";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = findMinSolution (cube, this.MAX_PLL, (cube) => {
            return this.isYellowCornersSolved (cube)
                && this.isYellowEdgesSolved (cube);
        }, [
            [cubeNotationMove (MOVE_U,  1)],
            [cubeNotationMove (MOVE_U, -1)],
            // PLL Aa-Perm
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    R G B
            //  + - - - +
            // G| Y Y Y |O
            // O| Y Y Y |R
            // G| Y Y Y |R
            //  + - - - +
            //    O B B
            // x L2 D2 L' U' L D2 L' U L' x'
            new PatternAlgorithm (
                "PLL:Aa-Perm",
                (cube) => {
                    // Orange
                    if (!areSameStickers(cube, [cube.FRONT + 0, cube.RIGHT + 2, cube.LEFT  + 1])) return false;
                    // Blue
                    if (!areSameStickers(cube, [cube.FRONT + 1, cube.FRONT + 2, cube.BACK  + 0])) return false;
                    // Red
                    if (!areSameStickers(cube, [cube.RIGHT + 0, cube.RIGHT + 1, cube.BACK  + 2])) return false;
                    // Green
                    if (!areSameStickers(cube, [cube.BACK  + 1, cube.LEFT  + 2, cube.LEFT  + 0])) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("X L2 D2 L' U' L D2 L' U L' X'")
            ),
            // PLL Ab-Perm
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    O G G
            //  + - - - +
            // B| Y Y Y |R
            // O| Y Y Y |R
            // B| Y Y Y |O
            //  + - - - +
            //    R B G
            // x' L2 D2 L U L' D2 L U' L x
            new PatternAlgorithm (
                "PLL:Ab-Perm",
                (cube) => {
                    // Orange
                    if (!areSameStickers(cube, [cube.LEFT  + 1, cube.BACK  + 2, cube.RIGHT + 0])) return false;
                    // Blue
                    if (!areSameStickers(cube, [cube.LEFT  + 2, cube.LEFT  + 0, cube.FRONT + 1])) return false;
                    // Red
                    if (!areSameStickers(cube, [cube.FRONT + 0, cube.RIGHT + 1, cube.RIGHT + 2])) return false;
                    // Green
                    if (!areSameStickers(cube, [cube.FRONT + 2, cube.BACK  + 0, cube.BACK  + 1])) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("X' L2 D2 L U L' D2 L U' L X")
            ),
            // PLL F-Perm
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    G B R
            //  + - - - +
            // O| Y Y Y |B
            // O| Y Y Y |R
            // O| Y Y Y |G
            //  + - - - +
            //    B G R
            // R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R
            new PatternAlgorithm (
                "PLL:F-Perm",
                (cube) => {
                    // Orange
                    if (!areSameStickers(cube, [cube.LEFT  + 2, cube.LEFT  + 1, cube.LEFT  + 0])) return false;
                    // Blue
                    if (!areSameStickers(cube, [cube.FRONT + 0, cube.RIGHT + 2, cube.BACK  + 1])) return false;
                    // Red
                    if (!areSameStickers(cube, [cube.FRONT + 2, cube.RIGHT + 1, cube.BACK  + 0])) return false;
                    // Green
                    if (!areSameStickers(cube, [cube.FRONT + 1, cube.RIGHT + 0, cube.BACK  + 2])) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R")
            ),
            // PLL Ga-Perm
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    G B R
            //  + - - - +
            // O| Y Y Y |B
            // G| Y Y Y |O
            // O| Y Y Y |G
            //  + - - - +
            //    B R R
            // R2 U R' U R' U' R U' R2 U' D R' U R D'
            new PatternAlgorithm (
                "PLL:Ga-Perm",
                (cube) => {
                    // Orange
                    if (!areSameStickers(cube, [cube.LEFT  + 2, cube.RIGHT + 1, cube.LEFT  + 0])) return false;
                    // Blue
                    if (!areSameStickers(cube, [cube.FRONT + 0, cube.RIGHT + 2, cube.BACK  + 1])) return false;
                    // Red
                    if (!areSameStickers(cube, [cube.FRONT + 1, cube.FRONT + 2, cube.BACK  + 0])) return false;
                    // Green
                    if (!areSameStickers(cube, [cube.LEFT  + 1, cube.RIGHT + 0, cube.BACK  + 2])) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R2 U R' U R' U' R U' R2 U' D R' U R D'")
            ),
            // PLL Gb-Perm
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    G O R
            //  + - - - +
            // O| Y Y Y |B
            // R| Y Y Y |B
            // O| Y Y Y |G
            //  + - - - +
            //    B G R
            // R' U' R U D' R2 U R' U R U' R U' R2 D
            new PatternAlgorithm (
                "PLL:Gb-Perm",
                (cube) => {
                    // Orange
                    if (!areSameStickers(cube, [cube.LEFT  + 2, cube.BACK  + 1, cube.LEFT  + 0])) return false;
                    // Blue
                    if (!areSameStickers(cube, [cube.FRONT + 0, cube.RIGHT + 1, cube.RIGHT + 2])) return false;
                    // Red
                    if (!areSameStickers(cube, [cube.LEFT  + 1, cube.FRONT + 2, cube.BACK  + 0])) return false;
                    // Green
                    if (!areSameStickers(cube, [cube.FRONT + 1, cube.RIGHT + 0, cube.BACK  + 2])) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R' U' R U D' R2 U R' U R U' R U' R2 D")
            ),
            // PLL Gc-Perm
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    G R R
            //  + - - - +
            // O| Y Y Y |B
            // B| Y Y Y |O
            // O| Y Y Y |G
            //  + - - - +
            //    B G R
            // R2 U' R U' R U R' U R2 U D' R U' R' D
            new PatternAlgorithm (
                "PLL:Gc-Perm",
                (cube) => {
                    // Orange
                    if (!areSameStickers(cube, [cube.LEFT  + 2, cube.RIGHT + 1, cube.LEFT  + 0])) return false;
                    // Blue
                    if (!areSameStickers(cube, [cube.FRONT + 0, cube.RIGHT + 2, cube.LEFT  + 1])) return false;
                    // Red
                    if (!areSameStickers(cube, [cube.FRONT + 2, cube.BACK  + 0, cube.BACK  + 1])) return false;
                    // Green
                    if (!areSameStickers(cube, [cube.FRONT + 1, cube.RIGHT + 0, cube.BACK  + 2])) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R2 U' R U' R U R' U R2 U D' R U' R' D")
            ),
            // PLL Gd-Perm
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    G B R
            //  + - - - +
            // O| Y Y Y |B
            // R| Y Y Y |G
            // O| Y Y Y |G
            //  + - - - +
            //    B O R
            // R U R' U' D R2 U' R U' R' U R' U R2 D'
            new PatternAlgorithm (
                "PLL:Gd-Perm",
                (cube) => {
                    // Orange
                    if (!areSameStickers(cube, [cube.LEFT  + 2, cube.FRONT + 1, cube.LEFT  + 0])) return false;
                    // Blue
                    if (!areSameStickers(cube, [cube.FRONT + 0, cube.RIGHT + 2, cube.BACK  + 1])) return false;
                    // Red
                    if (!areSameStickers(cube, [cube.FRONT + 2, cube.BACK  + 0, cube.LEFT  + 1])) return false;
                    // Green
                    if (!areSameStickers(cube, [cube.RIGHT + 0, cube.RIGHT + 1, cube.BACK  + 2])) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R U R' U' D R2 U' R U' R' U R' U R2 D'")
            ),
            // PLL Ja-Perm
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    G R R
            //  + - - - +
            // O| Y Y Y |B
            // O| Y Y Y |G
            // O| Y Y Y |G
            //  + - - - +
            //    B B R
            // X R2 F R F' R U2 Rw' U Rw U2 X'
            new PatternAlgorithm (
                "PLL:Ja-Perm",
                (cube) => {
                    // Orange
                    if (!areSameStickers(cube, [cube.LEFT  + 2, cube.LEFT  + 1, cube.LEFT  + 0])) return false;
                    // Blue
                    if (!areSameStickers(cube, [cube.FRONT + 0, cube.FRONT + 1, cube.RIGHT + 2])) return false;
                    // Red
                    if (!areSameStickers(cube, [cube.FRONT + 2, cube.BACK  + 0, cube.BACK  + 1])) return false;
                    // Green
                    if (!areSameStickers(cube, [cube.RIGHT + 0, cube.RIGHT + 1, cube.BACK  + 2])) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("X R2 F R F' R U2 Rw' U Rw U2 X'")
            ),
            // PLL Jb-Perm
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    R R B
            //  + - - - +
            // G| Y Y Y |O
            // G| Y Y Y |O
            // G| Y Y Y |R
            //  + - - - +
            //    O B B
            // R U R' F' R U R' U' R' F R2 U' R'
            new PatternAlgorithm (
                "PLL:Jb-Perm",
                (cube) => {
                    // Orange
                    if (!areSameStickers(cube, [cube.FRONT + 0, cube.RIGHT + 1, cube.RIGHT + 2])) return false;
                    // Blue
                    if (!areSameStickers(cube, [cube.FRONT + 1, cube.FRONT + 2, cube.BACK  + 0])) return false;
                    // Red
                    if (!areSameStickers(cube, [cube.RIGHT + 0, cube.BACK  + 1, cube.BACK  + 2])) return false;
                    // Green
                    if (!areSameStickers(cube, [cube.LEFT  + 2, cube.LEFT  + 1, cube.LEFT  + 0])) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R U R' F' R U R' U' R' F R2 U' R'")
            ),
            // PLL Ra-Perm
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    R G B
            //  + - - - +
            // G| Y Y Y |O
            // R| Y Y Y |B
            // G| Y Y Y |R
            //  + - - - +
            //    O O B
            // R U' R' U' R U R D R' U' R D' R' U2 R'
            new PatternAlgorithm (
                "PLL:Ra-Perm",
                (cube) => {
                    // Orange
                    if (!areSameStickers(cube, [cube.FRONT + 0, cube.FRONT + 1, cube.RIGHT + 2])) return false;
                    // Blue
                    if (!areSameStickers(cube, [cube.FRONT + 2, cube.RIGHT + 1, cube.BACK  + 0])) return false;
                    // Red
                    if (!areSameStickers(cube, [cube.LEFT  + 1, cube.RIGHT + 0, cube.BACK  + 2])) return false;
                    // Green
                    if (!areSameStickers(cube, [cube.LEFT  + 2, cube.BACK  + 1, cube.LEFT  + 0])) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R U' R' U' R U R D R' U' R D' R' U2 R'")
            ),
            // PLL Rb-Perm
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    O O G
            //  + - - - +
            // B| Y Y Y |R
            // R| Y Y Y |G
            // B| Y Y Y |O
            //  + - - - +
            //    R B G
            // R2 F R U R U' R' F' R U2 R' U2 R
            new PatternAlgorithm (
                "PLL:Rb-Perm",
                (cube) => {
                    // Orange
                    if (!areSameStickers(cube, [cube.RIGHT + 0, cube.BACK  + 1, cube.BACK  + 2])) return false;
                    // Blue
                    if (!areSameStickers(cube, [cube.LEFT  + 2, cube.FRONT + 1, cube.LEFT  + 0])) return false;
                    // Red
                    if (!areSameStickers(cube, [cube.LEFT  + 1, cube.FRONT + 0, cube.RIGHT + 2])) return false;
                    // Green
                    if (!areSameStickers(cube, [cube.FRONT + 2, cube.RIGHT + 1, cube.BACK  + 0])) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R2 F R U R U' R' F' R U2 R' U2 R")
            ),
            // PLL T-Perm
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    G G R
            //  + - - - +
            // O| Y Y Y |B
            // R| Y Y Y |O
            // O| Y Y Y |G
            //  + - - - +
            //    B B R
            // R U R' U' R' F R2 U' R' U' R U R' F'
            new PatternAlgorithm (
                "PLL:T-Perm",
                (cube) => {
                    // Orange
                    if (!areSameStickers(cube, [cube.LEFT  + 2, cube.RIGHT + 1, cube.LEFT  + 0])) return false;
                    // Blue
                    if (!areSameStickers(cube, [cube.FRONT + 0, cube.FRONT + 1, cube.RIGHT + 2])) return false;
                    // Red
                    if (!areSameStickers(cube, [cube.LEFT  + 1, cube.FRONT + 2, cube.BACK  + 0])) return false;
                    // Green
                    if (!areSameStickers(cube, [cube.RIGHT + 0, cube.BACK  + 1, cube.BACK  + 2])) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R U R' U' R' F R2 U' R' U' R U R' F'")
            ),
            // PLL E-Perm
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    O G R
            //  + - - - +
            // B| Y Y Y |B
            // O| Y Y Y |R
            // G| Y Y Y |G
            //  + - - - +
            //    O B R
            // x' L' U L D' L' U' L D L' U' L D' L' U L D x
            new PatternAlgorithm (
                "PLL:E-Perm",
                (cube) => {
                    // Orange
                    if (!areSameStickers(cube, [cube.LEFT  + 1, cube.FRONT + 0, cube.BACK  + 2])) return false;
                    // Blue
                    if (!areSameStickers(cube, [cube.LEFT  + 0, cube.FRONT + 1, cube.RIGHT + 2])) return false;
                    // Red
                    if (!areSameStickers(cube, [cube.FRONT + 2, cube.RIGHT + 1, cube.BACK  + 0])) return false;
                    // Green
                    if (!areSameStickers(cube, [cube.LEFT  + 2, cube.RIGHT + 0, cube.BACK  + 1])) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("X' L' U L D' L' U' L D L' U' L D' L' U L D X")
            ),
            // PLL Na-Perm
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    G G B
            //  + - - - +
            // O| Y Y Y |O
            // R| Y Y Y |O
            // R| Y Y Y |R
            //  + - - - +
            //    G B B
            // R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'
            new PatternAlgorithm (
                "PLL:Na-Perm",
                (cube) => {
                    // Orange
                    if (!areSameStickers(cube, [cube.LEFT  + 0, cube.RIGHT + 1, cube.RIGHT + 2])) return false;
                    // Blue
                    if (!areSameStickers(cube, [cube.FRONT + 1, cube.FRONT + 2, cube.BACK  + 0])) return false;
                    // Red
                    if (!areSameStickers(cube, [cube.LEFT  + 2, cube.LEFT  + 1, cube.RIGHT + 0])) return false;
                    // Green
                    if (!areSameStickers(cube, [cube.FRONT + 0, cube.BACK  + 1, cube.BACK  + 2])) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'")
            ),
            // PLL Nb-Perm
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    B G G
            //  + - - - +
            // R| Y Y Y |R
            // R| Y Y Y |O
            // O| Y Y Y |O
            //  + - - - +
            //    B B G
            // R' U R U' R' F' U' F R U R' F R' F' R U' R
            new PatternAlgorithm (
                "PLL:Nb-Perm",
                (cube) => {
                    // Orange
                    if (!areSameStickers(cube, [cube.LEFT  + 2, cube.RIGHT + 0, cube.RIGHT + 1])) return false;
                    // Blue
                    if (!areSameStickers(cube, [cube.FRONT + 0, cube.FRONT + 1, cube.BACK  + 2])) return false;
                    // Red
                    if (!areSameStickers(cube, [cube.LEFT  + 1, cube.LEFT  + 0, cube.RIGHT + 2])) return false;
                    // Green
                    if (!areSameStickers(cube, [cube.FRONT + 2, cube.BACK  + 0, cube.BACK  + 1])) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R' U R U' R' F' U' F R U R' F R' F' R U' R")
            ),
            // PLL V-Perm
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    B R G
            //  + - - - +
            // R| Y Y Y |R
            // O| Y Y Y |G
            // O| Y Y Y |O
            //  + - - - +
            //    B B G
            // R' U R' U' y R' F' R2 U' R' U R' F R F
            // **need to reset y bc solver assumes blue in front
            // R' U R' U' y R' F' R2 U' R' U R' F R F y'
            new PatternAlgorithm (
                "PLL:V-Perm",
                (cube) => {
                    // Orange
                    if (!areSameStickers(cube, [cube.LEFT  + 2, cube.LEFT  + 1, cube.RIGHT + 0])) return false;
                    // Blue
                    if (!areSameStickers(cube, [cube.FRONT + 0, cube.FRONT + 1, cube.BACK  + 2])) return false;
                    // Red
                    if (!areSameStickers(cube, [cube.LEFT  + 0, cube.RIGHT + 2, cube.BACK  + 1])) return false;
                    // Green
                    if (!areSameStickers(cube, [cube.FRONT + 2, cube.RIGHT + 1, cube.BACK  + 0])) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R' U R' U' Y R' F' R2 U' R' U R' F R F Y'")
            ),
            // PLL Y-Perm
            // Note: letters only show pairing - not exact colors
            // i.e. B could be red, but if it is, then both Bs are red - etc
            //    B O G
            //  + - - - +
            // R| Y Y Y |R
            // G| Y Y Y |R
            // O| Y Y Y |O
            //  + - - - +
            //    B B G
            // F R U' R' U' R U R' F' R U R' U' R' F R F'
            new PatternAlgorithm (
                "PLL:Y-Perm",
                (cube) => {
                    // Orange
                    if (!areSameStickers(cube, [cube.LEFT  + 2, cube.RIGHT + 0, cube.BACK  + 1])) return false;
                    // Blue
                    if (!areSameStickers(cube, [cube.FRONT + 0, cube.FRONT + 1, cube.BACK  + 2])) return false;
                    // Red
                    if (!areSameStickers(cube, [cube.LEFT  + 0, cube.RIGHT + 1, cube.RIGHT + 2])) return false;
                    // Green
                    if (!areSameStickers(cube, [cube.LEFT  + 1, cube.FRONT + 2, cube.BACK  + 0])) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("F R U' R' U' R U R' F' R U R' U' R' F R F'")
            ),
            // PLL H-Perm (swap opposite edges vertically and horizontally)
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
            new PatternAlgorithm (
                "PLL:H-Perm",
                (cube) => {
                    if (cube.data[cube.FRONT   + 1] != cube.data[cube.BACK   + 0]) return false;
                    if (cube.data[cube.LEFT    + 1] != cube.data[cube.RIGHT  + 0]) return false;
                    if (cube.data[cube.RIGHT   + 1] != cube.data[cube.LEFT   + 0]) return false;
                    if (cube.data[cube.BACK    + 1] != cube.data[cube.FRONT  + 0]) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("M2 U M2 U2 M2 U M2")
            ),
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
            new PatternAlgorithm (
                "PLL:Ua-Perm",
                (cube) => {
                    if (cube.data[cube.FRONT   + 1] != cube.data[cube.RIGHT  + 0]) return false;
                    if (cube.data[cube.LEFT    + 1] != cube.data[cube.FRONT  + 0]) return false;
                    if (cube.data[cube.RIGHT   + 1] != cube.data[cube.LEFT   + 0]) return false;
                    if (cube.data[cube.BACK    + 1] != cube.data[cube.BACK   + 0]) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R U' R U R U R U' R' U' R2")
            ),
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
            new PatternAlgorithm (
                "PLL:Ub-Perm",
                (cube) => {
                    if (cube.data[cube.FRONT   + 1] != cube.data[cube.LEFT   + 0]) return false;
                    if (cube.data[cube.LEFT    + 1] != cube.data[cube.RIGHT  + 0]) return false;
                    if (cube.data[cube.RIGHT   + 1] != cube.data[cube.FRONT  + 0]) return false;
                    if (cube.data[cube.BACK    + 1] != cube.data[cube.BACK   + 0]) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("R2 U R U R' U' R' U' R' U R'")
            ),
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
            new PatternAlgorithm (
                "PLL:Z-Perm",
                (cube) => {
                    if (cube.data[cube.FRONT   + 1] != cube.data[cube.LEFT   + 0]) return false;
                    if (cube.data[cube.LEFT    + 1] != cube.data[cube.FRONT  + 0]) return false;
                    if (cube.data[cube.RIGHT   + 1] != cube.data[cube.BACK   + 0]) return false;
                    if (cube.data[cube.BACK    + 1] != cube.data[cube.RIGHT  + 0]) return false;
                    return true;
                },
                cubeMoveNotation.stringToMoveSet ("M' U M2 U M2 U M' U2 M2")
            ),
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

    // ===================================================================

    renderUI () {
        const CFOPSolverSection = new UICollapsibleSection (
            "CFOP Solver",
            "Cross, F2L, OLL, PLL - the most popular speedsolving method. Solves layer-by-layer: a bottom cross, " +
            "the first two layers as paired corner+edge pieces, then the last layer's orientation and positions."
        );
        CFOPSolverSection.addSteps ([
            {
                label: "Full Solve",
                primary: true,
                description: "Runs every stage below in order: orient, cross, F2L, OLL, then PLL.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3CFOP ().findSolution (cube);
                    });
                }
            },
            {
                label: "Orient Cube",
                description: "Rotates the whole cube (no face turns) so white is down and blue is in front, " +
                    "the standard starting orientation for the rest of CFOP.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3CFOP ().findSolutionToOrientTheCube (cube);
                    });
                }
            },
            {
                label: "Solve White Cross",
                description: "Solves the four white edges into a cross on the bottom, aligned with their adjacent center colors.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3CFOP ().findSolutionToCross (cube);
                    });
                }
            },
            {
                label: "Solve F2L Standard",
                description: "Solves the first two layers by finding and inserting each of the four corner+edge pairs using standard F2L algorithms. Expand to run one pair at a time",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3CFOP ().solveF2LStandard (cube);
                    });
                },
                children: [
                    {
                        label: "Back-Left Pair",
                        description: "Finds and inserts the back-left corner-edge pair.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solveF2LPairStandard (cube, F2LSlot.BL);
                            });
                        }
                    },
                    {
                        label: "Back-Right Pair",
                        description: "Finds and inserts the back-right corner-edge pair.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solveF2LPairStandard (cube, F2LSlot.BR);
                            });
                        }
                    },
                    {
                        label: "Front-Left Pair",
                        description: "Finds and inserts the front-left corner-edge pair.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solveF2LPairStandard (cube, F2LSlot.FL);
                            });
                        }
                    },
                    {
                        label: "Front-Right Pair",
                        description: "Finds and inserts the front-right corner-edge pair, completing the first two layers.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solveF2LPairStandard (cube, F2LSlot.FR);
                            });
                        }
                    },
                ]
            },
            {
                label: "Solve F2L Naive",
                description: "Solves the first two layers by solving the edge, then corner. This is technically not F2L since it solves pieces individually rather than together as a pair.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3CFOP ().solveF2LNaive (cube);
                    });
                },
                children: [
                    {
                        label: "First Pair",
                        description: "Finds and inserts the first corner-edge pair.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solveFirstF2L (cube);
                            });
                        }
                    },
                    {
                        label: "Second Pair",
                        description: "Finds and inserts the second corner-edge pair.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solveSecondF2L (cube);
                            });
                        }
                    },
                    {
                        label: "Third Pair",
                        description: "Finds and inserts the third corner-edge pair.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solveThirdF2L (cube);
                            });
                        }
                    },
                    {
                        label: "Fourth Pair",
                        description: "Finds and inserts the fourth and final corner-edge pair, completing the first two layers.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solveFourthF2L (cube);
                            });
                        }
                    },
                ]
            },
            {
                label: "Solve 2-Look OLL",
                description: "Orients the last layer in two passes (edges, then corners) so the whole top face is yellow. " +
                    "Uses fewer algorithms than full OLL, but may require more moves.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3CFOP ().solve2LookOLL (cube);
                    });
                },
                children: [
                    {
                        label: "Edges",
                        description: "Orients the top edges into a yellow cross.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solve2LookOLLEdges (cube);
                            });
                        }
                    },
                    {
                        label: "Corners",
                        description: "Orients the top corners, assuming the yellow cross is already solved.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solve2LookOLLCorners (cube);
                            });
                        }
                    },
                ]
            },
            {
                label: "Solve 2-Look PLL",
                description: "Permutes the last layer in two passes (corners, then edges). " +
                    "Uses fewer algorithms than full PLL, but may require more moves." +
                    "Alternative: Full PLL.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3CFOP ().solve2LookPLL (cube);
                    });
                },
                children: [
                    {
                        label: "Corners",
                        description: "Positions the top corners into their correct spots (edges are handled next).",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solve2LookPLLCorners (cube);
                            });
                        }
                    },
                    {
                        label: "Edges",
                        description: "Cycles the top edges into their correct spots, assuming corners are already placed.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solve2LookPLLEdges (cube);
                            });
                        }
                    },
                ]
            },
            {
                label: "Solve PLL",
                description: "One-look PLL: permutes both corners and edges directly using the full PLL algorithm set " +
                    "(more algorithms to memorize, but fewer moves than 2-Look PLL).",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3CFOP ().solvePLL (cube);
                    });
                }
            },
        ]);
    }

}

// =======================================================================

// Register solver
solverRegistry.register (new Solver3x3CFOP());
