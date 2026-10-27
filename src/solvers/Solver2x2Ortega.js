// 2x2 Rubiks Cube Solver using Ortega method
// Ortega method follows this sequence:
// 1. Solve the first layer (any color)
// 2. OLL - Orient the last layer (7 algorithms)
// 3. PBL - Permutate both layers (5 algorithms)
// Based on J-Perm's 2x2 Ortega method guide: https://jperm.net/2x2/faster
// By Amy Burnett
// 
// =======================================================================

class Solver2x2Ortega
{
    constructor ()
    {
        this.name = "Solver2x2Ortega";
        this.supportedSizes = [2];
        this.MAX_WHITE_FACE_MOVES = 10;
        this.MAX_OLL_MOVES  = 20;
        this.MAX_PLL_MOVES = 24;
    }

    // =======================================================================

    // returns a list of moves to solve the cube from the current state
    findSolution (cube)
    {
        let solution = [];
        // solve first face
        let temp = this.solveFirstFace (cube);
        if (temp != null) solution = solution.concat(temp);
        if (temp == null) return null;

        // OLL - Orient the last layer
        temp = this.solveOLL (cube);
        if (temp != null) solution = solution.concat(temp);
        if (temp == null) return null;

        // PBL - Permutate both layers
        temp = this.solvePBL (cube);
        if (temp != null) solution = solution.concat(temp);
        if (temp == null) return null;

        return solution;
    }

    // =======================================================================

    isFirstFaceSolved (cube)
    {
        if (cube.data[cube.DOWN     ] != WHITE ) return false;
        if (cube.data[cube.DOWN  + 2] != WHITE ) return false;
        if (cube.data[cube.DOWN  + 1] != WHITE ) return false;
        if (cube.data[cube.DOWN  + 3] != WHITE ) return false;
        return true;
    }

    // =======================================================================

    // This scramble takes 3.8 sec for first face solution
    // D2 F2 R D' F' D U R B' R B'
    // This probably needs to be improved
    solveFirstFace (cube)
    {
        const name = "solveFirstFace";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = findMinSolution (cube, this.MAX_WHITE_FACE_MOVES, (cube) => {
            return this.isFirstFaceSolved (cube);
        }, [
            cubeMoveNotation.stringToMoveSet ("L"),
            cubeMoveNotation.stringToMoveSet ("L'"),
            cubeMoveNotation.stringToMoveSet ("L2"),
            cubeMoveNotation.stringToMoveSet ("R"),
            cubeMoveNotation.stringToMoveSet ("R'"),
            cubeMoveNotation.stringToMoveSet ("R2"),
            cubeMoveNotation.stringToMoveSet ("F"),
            cubeMoveNotation.stringToMoveSet ("F'"),
            cubeMoveNotation.stringToMoveSet ("F2"),
            cubeMoveNotation.stringToMoveSet ("B"),
            cubeMoveNotation.stringToMoveSet ("B'"),
            cubeMoveNotation.stringToMoveSet ("B2"),
            cubeMoveNotation.stringToMoveSet ("U"),
            cubeMoveNotation.stringToMoveSet ("U'"),
            cubeMoveNotation.stringToMoveSet ("U2"),
            cubeMoveNotation.stringToMoveSet ("D"),
            cubeMoveNotation.stringToMoveSet ("D'"),
            cubeMoveNotation.stringToMoveSet ("D2"),
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

    solveOLL (cube)
    {
        const name = "solveOLL";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = solveWithAlgorithms (
            cube,
            (cube) => {
                return this.isYellowFaceSolved(cube);
            }, [
                // Exhaustive possible U move sets before/after applying an algorithm
                [],
                cubeMoveNotation.stringToMoveSet ("U"),
                cubeMoveNotation.stringToMoveSet ("U'"),
                cubeMoveNotation.stringToMoveSet ("U2"),
            ], [
                // OLL H (0 corners)
                // X - top color
                //    X X
                //  + - - +
                // .| . . |.
                // .| . . |.
                //  + - - +
                //    X X
                // R2 U2 R U2 R2
                new PatternAlgorithm (
                    "OLL:H",
                    (cube) => {
                        const COLOR_UP = YELLOW;
                        if (cube.data[cube.FRONT + 0] != COLOR_UP) return false;
                        if (cube.data[cube.FRONT + 1] != COLOR_UP) return false;
                        if (cube.data[cube.BACK  + 0] != COLOR_UP) return false;
                        if (cube.data[cube.BACK  + 1] != COLOR_UP) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R2 U2 R U2 R2")
                ),
                // OLL Pi (0 corners)
                // X - top color
                //    . X
                //  + - - +
                // X| . . |.
                // X| . . |.
                //  + - - +
                //    . X
                // R U2 R2 U' R2 U' R2 U2 R
                new PatternAlgorithm (
                    "OLL:Pi",
                    (cube) => {
                        const COLOR_UP = YELLOW;
                        if (cube.data[cube.LEFT  + 0] != COLOR_UP) return false;
                        if (cube.data[cube.LEFT  + 1] != COLOR_UP) return false;
                        if (cube.data[cube.FRONT + 1] != COLOR_UP) return false;
                        if (cube.data[cube.BACK  + 0] != COLOR_UP) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R U2 R2 U' R2 U' R2 U2 R")
                ),
                // OLL Antisune (1 corner)
                // X - top color
                //    . .
                //  + - - +
                // X| . X |.
                // .| . . |X
                //  + - - +
                //    X .
                // R U2 R' U' R U' R'
                new PatternAlgorithm (
                    "OLL:Antisune",
                    (cube) => {
                        const COLOR_UP = YELLOW;
                        if (cube.data[cube.LEFT  + 0] != COLOR_UP) return false;
                        if (cube.data[cube.FRONT + 0] != COLOR_UP) return false;
                        if (cube.data[cube.RIGHT + 0] != COLOR_UP) return false;
                        if (cube.data[cube.UP    + 1] != COLOR_UP) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R U2 R' U' R U' R'")
                ),
                // OLL Sune (1 corner)
                // X - top color
                //    X .
                //  + - - +
                // .| . . |X
                // .| X . |.
                //  + - - +
                //    . X
                // R U R' U R U2 R'
                new PatternAlgorithm (
                    "OLL:Sune",
                    (cube) => {
                        const COLOR_UP = YELLOW;
                        if (cube.data[cube.FRONT + 1] != COLOR_UP) return false;
                        if (cube.data[cube.RIGHT + 1] != COLOR_UP) return false;
                        if (cube.data[cube.BACK  + 1] != COLOR_UP) return false;
                        if (cube.data[cube.UP    + 2] != COLOR_UP) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R U R' U R U2 R'")
                ),
                // OLL L (2 corners)
                // X - top color
                //    . .
                //  + - - +
                // .| X . |X
                // .| . X |.
                //  + - - +
                //    X .
                // F R' F' R U R U' R'
                new PatternAlgorithm (
                    "OLL:L",
                    (cube) => {
                        const COLOR_UP = YELLOW;
                        if (cube.data[cube.FRONT + 0] != COLOR_UP) return false;
                        if (cube.data[cube.RIGHT + 1] != COLOR_UP) return false;
                        if (cube.data[cube.UP    + 0] != COLOR_UP) return false;
                        if (cube.data[cube.UP    + 3] != COLOR_UP) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("F R' F' R U R U' R'")
                ),
                // OLL T (2 corners)
                // X - top color
                //    X .
                //  + - - +
                // .| . X |.
                // .| . X |.
                //  + - - +
                //    X .
                // R U R' U' R' F R F'
                new PatternAlgorithm (
                    "OLL:T",
                    (cube) => {
                        const COLOR_UP = YELLOW;
                        if (cube.data[cube.FRONT + 0] != COLOR_UP) return false;
                        if (cube.data[cube.BACK  + 1] != COLOR_UP) return false;
                        if (cube.data[cube.UP    + 1] != COLOR_UP) return false;
                        if (cube.data[cube.UP    + 3] != COLOR_UP) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R U R' U' R' F R F'")
                ),
                // OLL U (2 corners)
                // X - top color
                //    . .
                //  + - - +
                // X| . X |.
                // X| . X |.
                //  + - - +
                //    . .
                // F R U R' U' F'
                new PatternAlgorithm (
                    "OLL:U",
                    (cube) => {
                        const COLOR_UP = YELLOW;
                        if (cube.data[cube.LEFT  + 0] != COLOR_UP) return false;
                        if (cube.data[cube.LEFT  + 1] != COLOR_UP) return false;
                        if (cube.data[cube.UP    + 1] != COLOR_UP) return false;
                        if (cube.data[cube.UP    + 3] != COLOR_UP) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("F R U R' U' F'")
                ),
            ],
        );
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

    isLayersSolved (cube)
    {
        // Color agnostic check for solved layers
        // Assume up and down faces are already solved
        if (!(areSameStickers(cube, [cube.FRONT + 0, cube.FRONT + 1, cube.FRONT + 2, cube.FRONT + 3]))) return false;
        if (!(areSameStickers(cube, [cube.LEFT  + 0, cube.LEFT  + 1, cube.LEFT  + 2, cube.LEFT  + 3]))) return false;
        if (!(areSameStickers(cube, [cube.RIGHT + 0, cube.RIGHT + 1, cube.RIGHT + 2, cube.RIGHT + 3]))) return false;
        if (!(areSameStickers(cube, [cube.BACK  + 0, cube.BACK  + 1, cube.BACK  + 2, cube.BACK  + 3]))) return false;
        return true;
    }

    // =======================================================================

    solvePBL (cube)
    {
        const name = "solvePBL";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = solveWithAlgorithms (
            cube,
            (cube) => {
                return this.isLayersSolved (cube);
            }, [
                // Exhaustive possible U and D move sets before/after applying an algorithm
                [],
                cubeMoveNotation.stringToMoveSet ("U"),
                cubeMoveNotation.stringToMoveSet ("U'"),
                cubeMoveNotation.stringToMoveSet ("U2"),
                cubeMoveNotation.stringToMoveSet ("D"),
                cubeMoveNotation.stringToMoveSet ("D'"),
                cubeMoveNotation.stringToMoveSet ("D2"),
                cubeMoveNotation.stringToMoveSet ("U D"),
                cubeMoveNotation.stringToMoveSet ("U D'"),
                cubeMoveNotation.stringToMoveSet ("U D2"),
                cubeMoveNotation.stringToMoveSet ("U' D"),
                cubeMoveNotation.stringToMoveSet ("U' D'"),
                cubeMoveNotation.stringToMoveSet ("U' D2"),
                cubeMoveNotation.stringToMoveSet ("U2 D"),
                cubeMoveNotation.stringToMoveSet ("U2 D'"),
                cubeMoveNotation.stringToMoveSet ("U2 D2"),
            ], [
                // PBL Adj/Adj (Adjacent D)
                // Note: letters only show pairing - not exact colors
                // i.e. B could be red, but if it is, then both Bs are red - etc
                // Colors between top and bottom do not have to match
                // TOP VIEW  | BOTTOM VIEW
                //    R O          O R  
                //  + - - +      + - - + 
                // G| Y Y |G    G| W W |G
                // O| Y Y |R    R| W W |O
                //  + - - +      + - - + 
                //    B B          B B   
                // R2 U' B2 U2 R2 U' R2
                new PatternAlgorithm (
                    "PBL:Adj/Adj",
                    (cube) => {
                        // Top
                        // Blue
                        if (!areSameStickers(cube, [cube.FRONT + 0, cube.FRONT + 1])) return false;
                        // Green
                        if (!areSameStickers(cube, [cube.LEFT  + 0, cube.RIGHT + 1])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.LEFT  + 1, cube.BACK  + 0])) return false;
                        // Red
                        if (!areSameStickers(cube, [cube.RIGHT + 0, cube.BACK  + 1])) return false;
                        // Bottom
                        // Blue
                        if (!areSameStickers(cube, [cube.FRONT + 2, cube.FRONT + 3])) return false;
                        // Green
                        if (!areSameStickers(cube, [cube.LEFT  + 2, cube.RIGHT + 3])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.LEFT  + 3, cube.BACK  + 2])) return false;
                        // Red
                        if (!areSameStickers(cube, [cube.RIGHT + 2, cube.BACK  + 3])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R2 U' B2 U2 R2 U' R2")
                ),
                // PBL Diag/Adj (Adjacent D)
                // Note: J-Perm did not include this case for some reason.
                // Note: letters only show pairing - not exact colors
                // i.e. B could be red, but if it is, then both Bs are red - etc
                // Colors between top and bottom do not have to match
                // TOP VIEW  | BOTTOM VIEW
                //    B G          R G  
                //  + - - +      + - - + 
                // R| Y Y |R    B| W W |O
                // O| Y Y |O    G| W W |O
                //  + - - +      + - - + 
                //    B G          R B   
                // R2 U R2 U' R2 U R2 U' R2
                new PatternAlgorithm (
                    "PBL:Diag/Adj",
                    (cube) => {
                        // Top
                        // Blue
                        if (!areSameStickers(cube, [cube.FRONT + 0, cube.BACK  + 1])) return false;
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 1, cube.BACK  + 0])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.LEFT  + 1, cube.RIGHT + 0])) return false;
                        // Red
                        if (!areSameStickers(cube, [cube.LEFT  + 0, cube.RIGHT + 1])) return false;
                        // Bottom
                        // Blue
                        if (!areSameStickers(cube, [cube.FRONT + 2, cube.RIGHT + 3])) return false;
                        // Green
                        if (!areSameStickers(cube, [cube.RIGHT + 2, cube.BACK  + 3])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.LEFT  + 2, cube.LEFT  + 3])) return false;
                        // Red
                        if (!areSameStickers(cube, [cube.FRONT + 3, cube.BACK  + 2])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R2 U R2 U' R2 U R2 U' R2")
                ),
                // PBL Adj/Diag (Diagonal D)
                // Note: letters only show pairing - not exact colors
                // i.e. B could be red, but if it is, then both Bs are red - etc
                // Colors between top and bottom do not have to match
                // TOP VIEW  | BOTTOM VIEW
                //    R O          B G
                //  + - - +      + - - + 
                // G| Y Y |G    O| W W |O
                // O| Y Y |R    R| W W |R
                //  + - - +      + - - + 
                //    B B          B G
                // R U' R F2 R' U R'
                new PatternAlgorithm (
                    "PBL:Adj/Diag",
                    (cube) => {
                        // Top
                        // Blue
                        if (!areSameStickers(cube, [cube.FRONT + 0, cube.FRONT + 1])) return false;
                        // Green
                        if (!areSameStickers(cube, [cube.LEFT  + 0, cube.RIGHT + 1])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.LEFT  + 1, cube.BACK  + 0])) return false;
                        // Red
                        if (!areSameStickers(cube, [cube.RIGHT + 0, cube.BACK  + 1])) return false;
                        // Bottom
                        // Blue
                        if (!areSameStickers(cube, [cube.FRONT + 3, cube.BACK  + 2])) return false;
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 2, cube.BACK  + 3])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.LEFT  + 2, cube.RIGHT + 3])) return false;
                        // Red
                        if (!areSameStickers(cube, [cube.LEFT  + 3, cube.RIGHT + 2])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R U' R F2 R' U R'")
                ),
                // PBL Diag/Diag (Diagonal D)
                // Note: letters only show pairing - not exact colors
                // i.e. B could be red, but if it is, then both Bs are red - etc
                // Colors between top and bottom do not have to match
                // TOP VIEW  | BOTTOM VIEW
                //    G B          B G
                //  + - - +      + - - + 
                // O| Y Y |O    O| W W |O
                // R| Y Y |R    R| W W |R
                //  + - - +      + - - + 
                //    G B          B G
                // R2 F2 R2
                new PatternAlgorithm (
                    "PBL:Diag/Diag",
                    (cube) => {
                        // Top
                        // Blue
                        if (!areSameStickers(cube, [cube.FRONT + 1, cube.BACK  + 0])) return false;
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 0, cube.BACK  + 1])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.LEFT  + 0, cube.RIGHT + 1])) return false;
                        // Red
                        if (!areSameStickers(cube, [cube.LEFT  + 1, cube.RIGHT + 0])) return false;
                        // Bottom
                        // Blue
                        if (!areSameStickers(cube, [cube.FRONT + 3, cube.BACK  + 2])) return false;
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 2, cube.BACK  + 3])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.LEFT  + 2, cube.RIGHT + 3])) return false;
                        // Red
                        if (!areSameStickers(cube, [cube.LEFT  + 3, cube.RIGHT + 2])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R2 F2 R2")
                ),
                // PBL Adj U (Solved D)
                // Note: letters only show pairing - not exact colors
                // i.e. B could be red, but if it is, then both Bs are red - etc
                // Colors between top and bottom do not have to match
                // TOP VIEW  | BOTTOM VIEW
                //    R G          G G
                //  + - - +      + - - + 
                // O| Y Y |B    O| W W |R
                // O| Y Y |G    O| W W |R
                //  + - - +      + - - + 
                //    B R          B B
                // R U R' U' R' F R2 U' R' U' R U R' F'
                new PatternAlgorithm (
                    "PBL:Adj U",
                    (cube) => {
                        // Top
                        // Blue
                        if (!areSameStickers(cube, [cube.FRONT + 0, cube.RIGHT + 1])) return false;
                        // Green
                        if (!areSameStickers(cube, [cube.RIGHT + 0, cube.BACK  + 1])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.LEFT  + 0, cube.LEFT  + 1])) return false;
                        // Red
                        if (!areSameStickers(cube, [cube.FRONT + 1, cube.BACK  + 0])) return false;
                        // Bottom
                        // Blue
                        if (!areSameStickers(cube, [cube.FRONT + 2, cube.FRONT + 3])) return false;
                        // Green
                        if (!areSameStickers(cube, [cube.BACK  + 2, cube.BACK  + 3])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.LEFT  + 2, cube.LEFT  + 3])) return false;
                        // Red
                        if (!areSameStickers(cube, [cube.RIGHT + 2, cube.RIGHT + 3])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("R U R' U' R' F R2 U' R' U' R U R' F'")
                ),
                // PBL Diag U (Solved D)
                // Note: letters only show pairing - not exact colors
                // i.e. B could be red, but if it is, then both Bs are red - etc
                // Colors between top and bottom do not have to match
                // TOP VIEW  | BOTTOM VIEW
                //    B G          G G
                //  + - - +      + - - + 
                // R| Y Y |R    O| W W |R
                // O| Y Y |O    O| W W |R
                //  + - - +      + - - + 
                //    B G          B B
                // F R U' R' U' R U R' F' R U R' U' R' F R F'
                new PatternAlgorithm (
                    "PBL:Diag U",
                    (cube) => {
                        // Top
                        // Blue
                        if (!areSameStickers(cube, [cube.FRONT + 0, cube.BACK  + 1])) return false;
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 1, cube.BACK  + 0])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.LEFT  + 1, cube.RIGHT + 0])) return false;
                        // Red
                        if (!areSameStickers(cube, [cube.LEFT  + 0, cube.RIGHT + 1])) return false;
                        // Bottom
                        // Blue
                        if (!areSameStickers(cube, [cube.FRONT + 2, cube.FRONT + 3])) return false;
                        // Green
                        if (!areSameStickers(cube, [cube.BACK  + 2, cube.BACK  + 3])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.LEFT  + 2, cube.LEFT  + 3])) return false;
                        // Red
                        if (!areSameStickers(cube, [cube.RIGHT + 2, cube.RIGHT + 3])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("F R U' R' U' R U R' F' R U R' U' R' F R F'")
                ),
                // PBL Adj D (Solved U) [Not mentioned in guides]
                // Note: letters only show pairing - not exact colors
                // i.e. B could be red, but if it is, then both Bs are red - etc
                // Colors between top and bottom do not have to match
                // TOP VIEW  | BOTTOM VIEW
                //    G G          B R
                //  + - - +      + - - + 
                // O| Y Y |R    O| W W |G
                // O| Y Y |R    O| W W |B
                //  + - - +      + - - + 
                //    B B          G R
                // X2 R U R' U' R' F R2 U' R' U' R U R' F'
                new PatternAlgorithm (
                    "PBL:Adj D",
                    (cube) => {
                        // Top
                        // Blue
                        if (!areSameStickers(cube, [cube.FRONT + 0, cube.FRONT + 1])) return false;
                        // Green
                        if (!areSameStickers(cube, [cube.BACK  + 0, cube.BACK  + 1])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.LEFT  + 0, cube.LEFT  + 1])) return false;
                        // Red
                        if (!areSameStickers(cube, [cube.RIGHT + 0, cube.RIGHT + 1])) return false;
                        // Bottom
                        // Blue
                        if (!areSameStickers(cube, [cube.FRONT + 2, cube.RIGHT + 3])) return false;
                        // Green
                        if (!areSameStickers(cube, [cube.RIGHT + 2, cube.BACK  + 3])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.LEFT  + 2, cube.LEFT  + 3])) return false;
                        // Red
                        if (!areSameStickers(cube, [cube.FRONT + 3, cube.BACK  + 2])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("X2 R U R' U' R' F R2 U' R' U' R U R' F'")
                ),
                // PBL Diag D (Solved U) [Not mentioned in guides]
                // Note: letters only show pairing - not exact colors
                // i.e. B could be red, but if it is, then both Bs are red - etc
                // Colors between top and bottom do not have to match
                // TOP VIEW  | BOTTOM VIEW
                //    G G          G B
                //  + - - +      + - - + 
                // O| Y Y |R    R| W W |R
                // O| Y Y |R    O| W W |O
                //  + - - +      + - - + 
                //    B B          G B
                // X2 F R U' R' U' R U R' F' R U R' U' R' F R F'
                new PatternAlgorithm (
                    "PBL:Diag D",
                    (cube) => {
                        // Top
                        // Blue
                        if (!areSameStickers(cube, [cube.FRONT + 0, cube.FRONT + 1])) return false;
                        // Green
                        if (!areSameStickers(cube, [cube.BACK  + 0, cube.BACK  + 1])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.LEFT  + 0, cube.LEFT  + 1])) return false;
                        // Red
                        if (!areSameStickers(cube, [cube.RIGHT + 0, cube.RIGHT + 1])) return false;
                        // Bottom
                        // Blue
                        if (!areSameStickers(cube, [cube.FRONT + 3, cube.BACK  + 2])) return false;
                        // Green
                        if (!areSameStickers(cube, [cube.FRONT + 2, cube.BACK  + 3])) return false;
                        // Orange
                        if (!areSameStickers(cube, [cube.LEFT  + 2, cube.RIGHT + 3])) return false;
                        // Red
                        if (!areSameStickers(cube, [cube.LEFT  + 3, cube.RIGHT + 2])) return false;
                        return true;
                    },
                    cubeMoveNotation.stringToMoveSet ("X2 F R U' R' U' R U R' F' R U R' U' R' F R F'")
                ),
            ]
        );
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

    // ===================================================================

    renderUI () {
        const SolverSection = new UICollapsibleSection (
            "Ortega Solver",
            "An intermediate 2x2 solving method. Solves one face (not necessarily a solved layer), then orients the last layer (OLL), and finally permutes both layers (PBL)."
        );
        SolverSection.addSteps ([
            {
                label: "Full Solve",
                primary: true,
                description: "Runs every stage below in order: first face, OLL, then PBL.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver2x2Ortega ().findSolution (cube);
                    });
                }
            },
            {
                label: "Solve First Face",
                description: "Solves one full face of corners.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver2x2Ortega ().solveFirstFace (cube);
                    });
                }
            },
            {
                label: "Solve OLL",
                description: "Orients the last layer so its face is a single color.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver2x2Ortega ().solveOLL (cube);
                    });
                }
            },
            {
                label: "Solve PBL",
                description: "Permutes both layers into their correct positions, finishing the cube.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver2x2Ortega ().solvePBL (cube);
                    });
                }
            },
        ]);
    }
}

// =======================================================================

// Register solver
solverRegistry.register (new Solver2x2Ortega());
