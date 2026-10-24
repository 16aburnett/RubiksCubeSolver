// Rubiks Cube - Cube Notation
// this class defines Cube Notation moves
// Cube Notation is the standard move notation that speed solvers use.
// The internal RubiksCube class does not use the same Notation
// so this class defines Cube Notation moves for generic sized cubes and
// provides the Axis Notation translation.
// By Amy Burnett
// August 31 2024
// =======================================================================

// Cube Notation
// layer, direction/amount
// U      [U, U', U2]
// M slice moves only if dim is odd
// outer slices are always low + high
// inner slices are 1-based index from nearest face + nearest face
// [x][ ][ ][ ][ ][ ][ ] L
// [ ][x][ ][ ][ ][ ][ ] l
// [ ][ ][x][ ][ ][ ][ ] 2l
// [ ][ ][ ][x][ ][ ][ ] M
// [ ][ ][ ][ ][x][ ][ ] 2r
// [ ][ ][ ][ ][ ][x][ ] r
// [ ][ ][ ][ ][ ][ ][x] R
// Wide moves - might not have to worry about?
// [x][ ][ ][ ][ ][ ][ ] L
// [x][x][ ][ ][ ][ ][ ] Lw
// [x][x][x][ ][ ][ ][ ] 2Lw
// [ ][ ][ ][ ][ ][ ][ ] ??
// [ ][ ][ ][ ][x][x][x] 2Rw
// [ ][ ][ ][ ][ ][x][x] Rw
// [ ][ ][ ][ ][ ][ ][x] R
// we dont need wide moves?

// ================================================================================================

// Enum for different types of cube moves
const MoveType = Object.freeze({
    // Cube rotation moves (whole cube rotations)
    ROTATION: Symbol('rotation'),
    // Face moves (U, D, L, R, F, B)
    FACE: Symbol('face'),
    // Slice moves (M, E, S, middle layer only)
    SLICE: Symbol('slice'),
    // Inner layer moves (like 2l, 2r, etc.)
    // WCA makes a distinction between inner layer and slice moves
    INNER_LAYER: Symbol('inner_layer'),
    // Wide moves (like Lw, 2Lw, Rw, 2Rw, etc.)
    WIDE: Symbol('wide')
});

// ================================================================================================

// Represents the standard Rubiks Cube notation for a given cube
// and has functions to convert to an Axis Rotation move that the Rubiks
// cube object accept
class CubeMoveNotation
{
    constructor (dim)
    {
        this.dim = dim;
        // List/map of all the moves and their corresponding information
        // Each entry contains the cube notation move bitmask, the move string, the corresponding axis notation move, and the move type
        // Keyed by CubeNotation bitmasks
        this.moves = new Map ();
        // Map for converting move string to move bitmask
        this.stringToMoveMap = new Map ();
        // Generate cube rotations
        let generatedMoves = generateMoves (this.dim);
        for (let [cubeNotationMoveBitmask, moveNotationString, axisNotationMove, moveType] of generatedMoves)
        {
            this.moves.set (cubeNotationMoveBitmask, [cubeNotationMoveBitmask, moveNotationString, axisNotationMove, moveType]);
            this.stringToMoveMap.set (moveNotationString, [cubeNotationMoveBitmask, moveNotationString, axisNotationMove, moveType]);
        }
    }

    // ===================================================================

    // Returns an iterable of the moves in Cube Notation
    getCubeNotationMoves (moveTypes=[])
    {
        if (moveTypes.length === 0) {
            return this.moves.keys ();
        }
        return Array.from(this.moves.values())
                    .filter(([cubeNotationMoveBitmask, moveNotationString, axisNotationMove, type]) => moveTypes.includes(type))
                    .map(([cubeNotationMoveBitmask, moveNotationString, axisNotationMove, type]) => cubeNotationMoveBitmask);
    }

    // ===================================================================

    // Returns an iterable of the moves in Axis Notation
    getAxisNotationMoves (moveTypes=[])
    {
        if (moveTypes.length === 0) {
            return Array.from(this.moves.values()).map(([cubeNotationMoveBitmask, moveNotationString, axisNotationMove, type]) => axisNotationMove);
        }
        return Array.from(this.moves.values())
                    .filter(([cubeNotationMoveBitmask, moveNotationString, axisNotationMove, type]) => moveTypes.includes(type))
                    .map(([cubeNotationMoveBitmask, moveNotationString, axisNotationMove, type]) => axisNotationMove);
    }

    // ===================================================================

    // Returns an iterable of the moves in Axis Notation
    is180DegreeMove (move)
    {
        const moveInfo = this.moves.get(move);
        return moveInfo && moveInfo[1].endsWith("2");
    }
    // ===================================================================

    getReverseMove (move)
    {
        // Handle 180 degree moves which are their own reverse
        if (this.is180DegreeMove(move)) {
            return move;
        }
        return -move;
    }

    // ===================================================================

    // Converts the given move to the string representation of the
    // Cube Notation
    toString (move)
    {
        // Ensure move is valid
        if (!this.moves.has(move)) {
            throw new Error(`Invalid move: ${move}`);
        }
        // 1st position is the string representation
        return this.moves.get (move)[1];
    }

    // ===================================================================

    // Converts the given string representation to the bitmask
    // move representation
    stringToMove (moveString)
    {
        // Ensure moveString is a valid string representation of a move
        if (!this.stringToMoveMap.has(moveString)) {
            throw new Error(`Invalid move string: ${moveString}`);
        }
        // 0th position is the bitmask
        return this.stringToMoveMap.get (moveString)[0];
    }

    // ===================================================================

    // Converts the given string representation of an algorithm to a
    // set of moves.
    stringToMoveSet (moveSetString)
    {
        // Convert the move set string into individual move tokens
        // If the move set string is empty, return an empty array of moves
        const moveSetTokens = moveSetString === "" ? [] : moveSetString.split (" ");
        const moveSet = [];
        for (const moveToken of moveSetTokens)
            moveSet.push (this.stringToMove (moveToken));
        return moveSet;
    }

    // ===================================================================

    toAxisNotation (move)
    {
        // axisNotation is the third element
        return this.moves.get (move)[2];
    }
}

// =======================================================================

// Cube Notation bitmask (32 bits)
// D0000000 WWWWRRRR SSSSSSSS SSSSFFFF
// D - signed bit, denotes direction
//     +M = clockwise
//     -M = counter clockwise
//     reverse(move) = -move
// F - denotes face (L R F B U D X Y Z)
// S - denotes slice
//     (example: 2f, S would be 2 and F would be f's enum value)
//     0 = outermost slice
//     1 = slice in one layer from face
//     2 = 2 slices in from the face
//     12 bits so max cube size can be 4096*2
// R - denotes how much to rotate
//     (0 for 90 degress or 1 for 180 degrees)
// W - denotes wide move - ignore
//     (0 for no wide move, 1 for wide move)
// This method is SO MUCH FASTER than just using strings to denote moves
// seconds vs milliseconds
function cubeNotationMove (face, direction=1, slice=0, rotationAmount=0, isWide=0)
{
    return direction * (((((((0 + isWide) << 4) + rotationAmount) << 12) + slice) << 4) + face);
}

// =======================================================================

function getCubeNotationFace (move)
{
    return move & 0b1111;
}

// =======================================================================

function getCubeNotationSlice (move)
{
    return (move >> 4) & 0b111111111111;
}

// =======================================================================

function getCubeNotationRotation (move)
{
    return (move >> 16) & 0b1111;
}

// =======================================================================

// Generates and returns a list of the possible moves for the given dim
// dimensional cube
function generateMoves (dim)
{
    let low = Math.round (dim / 2) - dim;
    let high = -low;
    let moves = [];
    // Cube rotations (all cubes)
    let allSliceIndices = [];
    for (let slicei = low; slicei <= high; ++slicei)
        allSliceIndices.push (slicei);
    moves.push ([cubeNotationMove (MOVE_X,  1, 0, 0), "X" , [AXIS_X, [...allSliceIndices],  1], MoveType.ROTATION]);
    moves.push ([cubeNotationMove (MOVE_X, -1, 0, 0), "X'", [AXIS_X, [...allSliceIndices], -1], MoveType.ROTATION]);
    moves.push ([cubeNotationMove (MOVE_X,  1, 0, 1), "X2", [AXIS_X, [...allSliceIndices],  2], MoveType.ROTATION]);
    moves.push ([cubeNotationMove (MOVE_Y,  1, 0, 0), "Y" , [AXIS_Y, [...allSliceIndices], -1], MoveType.ROTATION]);
    moves.push ([cubeNotationMove (MOVE_Y, -1, 0, 0), "Y'", [AXIS_Y, [...allSliceIndices],  1], MoveType.ROTATION]);
    moves.push ([cubeNotationMove (MOVE_Y,  1, 0, 1), "Y2", [AXIS_Y, [...allSliceIndices],  2], MoveType.ROTATION]);
    moves.push ([cubeNotationMove (MOVE_Z,  1, 0, 0), "Z" , [AXIS_Z, [...allSliceIndices],  1], MoveType.ROTATION]);
    moves.push ([cubeNotationMove (MOVE_Z, -1, 0, 0), "Z'", [AXIS_Z, [...allSliceIndices], -1], MoveType.ROTATION]);
    moves.push ([cubeNotationMove (MOVE_Z, -1, 0, 1), "Z2", [AXIS_Z, [...allSliceIndices],  2], MoveType.ROTATION]);
    if (dim < 2) return moves;
    // Outer face rotations (2x2 and larger)
    moves.push ([cubeNotationMove (MOVE_L,  1, 0, 0), "L" , [AXIS_X, [low ], -1], MoveType.FACE]);
    moves.push ([cubeNotationMove (MOVE_L, -1, 0, 0), "L'", [AXIS_X, [low ],  1], MoveType.FACE]);
    moves.push ([cubeNotationMove (MOVE_L,  1, 0, 1), "L2", [AXIS_X, [low ], -2], MoveType.FACE]);
    moves.push ([cubeNotationMove (MOVE_R,  1, 0, 0), "R" , [AXIS_X, [high],  1], MoveType.FACE]);
    moves.push ([cubeNotationMove (MOVE_R, -1, 0, 0), "R'", [AXIS_X, [high], -1], MoveType.FACE]);
    moves.push ([cubeNotationMove (MOVE_R,  1, 0, 1), "R2", [AXIS_X, [high],  2], MoveType.FACE]);
    moves.push ([cubeNotationMove (MOVE_F,  1, 0, 0), "F" , [AXIS_Z, [high],  1], MoveType.FACE]);
    moves.push ([cubeNotationMove (MOVE_F, -1, 0, 0), "F'", [AXIS_Z, [high], -1], MoveType.FACE]);
    moves.push ([cubeNotationMove (MOVE_F,  1, 0, 1), "F2", [AXIS_Z, [high],  2], MoveType.FACE]);
    moves.push ([cubeNotationMove (MOVE_B,  1, 0, 0), "B" , [AXIS_Z, [low ], -1], MoveType.FACE]);
    moves.push ([cubeNotationMove (MOVE_B, -1, 0, 0), "B'", [AXIS_Z, [low ],  1], MoveType.FACE]);
    moves.push ([cubeNotationMove (MOVE_B,  1, 0, 1), "B2", [AXIS_Z, [low ], -2], MoveType.FACE]);
    moves.push ([cubeNotationMove (MOVE_U,  1, 0, 0), "U" , [AXIS_Y, [low ], -1], MoveType.FACE]);
    moves.push ([cubeNotationMove (MOVE_U, -1, 0, 0), "U'", [AXIS_Y, [low ],  1], MoveType.FACE]);
    moves.push ([cubeNotationMove (MOVE_U,  1, 0, 1), "U2", [AXIS_Y, [low ], -2], MoveType.FACE]);
    moves.push ([cubeNotationMove (MOVE_D,  1, 0, 0), "D" , [AXIS_Y, [high],  1], MoveType.FACE]);
    moves.push ([cubeNotationMove (MOVE_D, -1, 0, 0), "D'", [AXIS_Y, [high], -1], MoveType.FACE]);
    moves.push ([cubeNotationMove (MOVE_D,  1, 0, 1), "D2", [AXIS_Y, [high],  2], MoveType.FACE]);
    if (dim < 3) return moves;
    // Middle slice rotations (odd dim, 3x3 and larger)
    if (dim % 2 != 0)
    {
        // middle slice moves follow these rules:
        // M follows the L direction, E follows the D direction, S follows the F direction.
        // https://jperm.net/3x3/moves#:~:text=instead%20of%20B).-,Slice%20Moves,-Slice%20moves%20are
        moves.push ([cubeNotationMove (MOVE_M,  1, 0, 0), "M" , [AXIS_X, [0], -1], MoveType.SLICE]);
        moves.push ([cubeNotationMove (MOVE_M, -1, 0, 0), "M'", [AXIS_X, [0],  1], MoveType.SLICE]);
        moves.push ([cubeNotationMove (MOVE_M,  1, 0, 1), "M2", [AXIS_X, [0], -2], MoveType.SLICE]);
        moves.push ([cubeNotationMove (MOVE_E,  1, 0, 0), "E" , [AXIS_Y, [0],  1], MoveType.SLICE]);
        moves.push ([cubeNotationMove (MOVE_E, -1, 0, 0), "E'", [AXIS_Y, [0], -1], MoveType.SLICE]);
        moves.push ([cubeNotationMove (MOVE_E,  1, 0, 1), "E2", [AXIS_Y, [0],  2], MoveType.SLICE]);
        moves.push ([cubeNotationMove (MOVE_S,  1, 0, 0), "S" , [AXIS_Z, [0],  1], MoveType.SLICE]);
        moves.push ([cubeNotationMove (MOVE_S, -1, 0, 0), "S'", [AXIS_Z, [0], -1], MoveType.SLICE]);
        moves.push ([cubeNotationMove (MOVE_S,  1, 0, 1), "S2", [AXIS_Z, [0],  2], MoveType.SLICE]);
    }
    // Inner slice rotations (4x4 and larger)
    // [-3][-2][-1][ 0][ 1][ 2][ 3]
    // we need slices 1, 2, .. high-1 and low+1 ... -2, -1
    let i = 1;
    while (low + i < 0)
    {
        let prefix = i.toString();
        // Second to outermost slice doesnt get a prefix
        if (i == 1)
            prefix = "";
        moves.push ([cubeNotationMove (MOVE_L,  1, i, 0), prefix+"l" , [AXIS_X, [low  + i], -1], MoveType.INNER_LAYER]);
        moves.push ([cubeNotationMove (MOVE_L, -1, i, 0), prefix+"l'", [AXIS_X, [low  + i],  1], MoveType.INNER_LAYER]);
        moves.push ([cubeNotationMove (MOVE_L,  1, i, 1), prefix+"l2", [AXIS_X, [low  + i], -2], MoveType.INNER_LAYER]);
        moves.push ([cubeNotationMove (MOVE_R,  1, i, 0), prefix+"r" , [AXIS_X, [high - i],  1], MoveType.INNER_LAYER]);
        moves.push ([cubeNotationMove (MOVE_R, -1, i, 0), prefix+"r'", [AXIS_X, [high - i], -1], MoveType.INNER_LAYER]);
        moves.push ([cubeNotationMove (MOVE_R,  1, i, 1), prefix+"r2", [AXIS_X, [high - i],  2], MoveType.INNER_LAYER]);
        moves.push ([cubeNotationMove (MOVE_F,  1, i, 0), prefix+"f" , [AXIS_Z, [high - i],  1], MoveType.INNER_LAYER]);
        moves.push ([cubeNotationMove (MOVE_F, -1, i, 0), prefix+"f'", [AXIS_Z, [high - i], -1], MoveType.INNER_LAYER]);
        moves.push ([cubeNotationMove (MOVE_F,  1, i, 1), prefix+"f2", [AXIS_Z, [high - i],  2], MoveType.INNER_LAYER]);
        moves.push ([cubeNotationMove (MOVE_B,  1, i, 0), prefix+"b" , [AXIS_Z, [low  + i], -1], MoveType.INNER_LAYER]);
        moves.push ([cubeNotationMove (MOVE_B, -1, i, 0), prefix+"b'", [AXIS_Z, [low  + i],  1], MoveType.INNER_LAYER]);
        moves.push ([cubeNotationMove (MOVE_B,  1, i, 1), prefix+"b2", [AXIS_Z, [low  + i], -2], MoveType.INNER_LAYER]);
        moves.push ([cubeNotationMove (MOVE_U,  1, i, 0), prefix+"u" , [AXIS_Y, [low  + i], -1], MoveType.INNER_LAYER]);
        moves.push ([cubeNotationMove (MOVE_U, -1, i, 0), prefix+"u'", [AXIS_Y, [low  + i],  1], MoveType.INNER_LAYER]);
        moves.push ([cubeNotationMove (MOVE_U,  1, i, 1), prefix+"u2", [AXIS_Y, [low  + i], -2], MoveType.INNER_LAYER]);
        moves.push ([cubeNotationMove (MOVE_D,  1, i, 0), prefix+"d" , [AXIS_Y, [high - i],  1], MoveType.INNER_LAYER]);
        moves.push ([cubeNotationMove (MOVE_D, -1, i, 0), prefix+"d'", [AXIS_Y, [high - i], -1], MoveType.INNER_LAYER]);
        moves.push ([cubeNotationMove (MOVE_D,  1, i, 1), prefix+"d2", [AXIS_Y, [high - i],  2], MoveType.INNER_LAYER]);
        ++i;
    }
    // Wide moves (Moves multiple layers simultaneously, 3x3 and up)
    i = 1;
    const createRange = (start, end) => 
        Array.from({ length: end - start + 1 }, (_, index) => start + index);
    while (low + i <= 0)
    {
        let prefix = i.toString();
        // Second to outermost slice doesnt get a prefix
        if (i == 1)
            prefix = "";
        const lowSlices = createRange(low, low + i);
        const highSlices = createRange(high - i, high);
        moves.push ([cubeNotationMove (MOVE_L,  1, i, 0, 1), prefix+"Lw" , [AXIS_X, lowSlices , -1], MoveType.WIDE]);
        moves.push ([cubeNotationMove (MOVE_L, -1, i, 0, 1), prefix+"Lw'", [AXIS_X, lowSlices ,  1], MoveType.WIDE]);
        moves.push ([cubeNotationMove (MOVE_L,  1, i, 1, 1), prefix+"Lw2", [AXIS_X, lowSlices , -2], MoveType.WIDE]);
        moves.push ([cubeNotationMove (MOVE_R,  1, i, 0, 1), prefix+"Rw" , [AXIS_X, highSlices,  1], MoveType.WIDE]);
        moves.push ([cubeNotationMove (MOVE_R, -1, i, 0, 1), prefix+"Rw'", [AXIS_X, highSlices, -1], MoveType.WIDE]);
        moves.push ([cubeNotationMove (MOVE_R,  1, i, 1, 1), prefix+"Rw2", [AXIS_X, highSlices,  2], MoveType.WIDE]);
        moves.push ([cubeNotationMove (MOVE_F,  1, i, 0, 1), prefix+"Fw" , [AXIS_Z, highSlices,  1], MoveType.WIDE]);
        moves.push ([cubeNotationMove (MOVE_F, -1, i, 0, 1), prefix+"Fw'", [AXIS_Z, highSlices, -1], MoveType.WIDE]);
        moves.push ([cubeNotationMove (MOVE_F,  1, i, 1, 1), prefix+"Fw2", [AXIS_Z, highSlices,  2], MoveType.WIDE]);
        moves.push ([cubeNotationMove (MOVE_B,  1, i, 0, 1), prefix+"Bw" , [AXIS_Z, lowSlices , -1], MoveType.WIDE]);
        moves.push ([cubeNotationMove (MOVE_B, -1, i, 0, 1), prefix+"Bw'", [AXIS_Z, lowSlices ,  1], MoveType.WIDE]);
        moves.push ([cubeNotationMove (MOVE_B,  1, i, 1, 1), prefix+"Bw2", [AXIS_Z, lowSlices , -2], MoveType.WIDE]);
        moves.push ([cubeNotationMove (MOVE_U,  1, i, 0, 1), prefix+"Uw" , [AXIS_Y, lowSlices , -1], MoveType.WIDE]);
        moves.push ([cubeNotationMove (MOVE_U, -1, i, 0, 1), prefix+"Uw'", [AXIS_Y, lowSlices ,  1], MoveType.WIDE]);
        moves.push ([cubeNotationMove (MOVE_U,  1, i, 1, 1), prefix+"Uw2", [AXIS_Y, lowSlices , -2], MoveType.WIDE]);
        moves.push ([cubeNotationMove (MOVE_D,  1, i, 0, 1), prefix+"Dw" , [AXIS_Y, highSlices,  1], MoveType.WIDE]);
        moves.push ([cubeNotationMove (MOVE_D, -1, i, 0, 1), prefix+"Dw'", [AXIS_Y, highSlices, -1], MoveType.WIDE]);
        moves.push ([cubeNotationMove (MOVE_D,  1, i, 1, 1), prefix+"Dw2", [AXIS_Y, highSlices,  2], MoveType.WIDE]);
        ++i;
    }
    return moves;
}

// =======================================================================

function moveSetToString (moveSet)
{
    const moveSetStrings = moveSet.map (
        (value) => cubeMoveNotation.toString (value)
    );
    return moveSetStrings.join (" ");
}
