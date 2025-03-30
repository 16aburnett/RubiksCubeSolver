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

// Represents the standard Rubiks Cube notation for a given cube
// and has functions to convert to an Axis Rotation move that the Rubiks
// cube object accept
class CubeMoveNotation
{
    constructor (dim)
    {
        this.dim = dim;
        // List/map of all the moves
        // Keyed by CubeNotation bitmasks
        this.moves = new Map ();
        // Map for converting move string to move bitmask
        this.stringToMoveMap = new Map ();
        // Generate cube rotations
        let generatedMoves = generateMoves (this.dim);
        for (let [cubeNotationMoveBitmask, moveNotationString, axisNotationMove] of generatedMoves)
        {
            this.moves.set (cubeNotationMoveBitmask, [cubeNotationMoveBitmask, moveNotationString, axisNotationMove]);
            this.stringToMoveMap.set (moveNotationString, [cubeNotationMoveBitmask, moveNotationString, axisNotationMove]);
        }
    }

    // ===================================================================

    // Returns an iterable of the moves in Cube Notation
    getCubeNotationMoves ()
    {
        return this.moves.keys ();
    }

    // ===================================================================

    // Returns an iterable of the moves in Axis Notation
    getAxisNotationMoves ()
    {
        return this.moves.values ();
    }

    // ===================================================================

    getReverseMove (move)
    {
        return -move;
    }

    // ===================================================================

    // Converts the given move to the string representation of the
    // Cube Notation
    toString (move)
    {
        // 1st position is the string representation
        return this.moves.get (move)[1];
    }

    // ===================================================================

    // Converts the given string representation to the bitmask
    // move representation
    stringToMove (moveString)
    {
        // 0th position is the bitmask
        return this.stringToMoveMap.get (moveString)[0];
    }

    // ===================================================================

    // Converts the given string representation of an algorithm to a
    // set of moves.
    stringToMoveSet (moveSetString)
    {
        const moveSetTokens = moveSetString.split (" ");
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
//     not really using this yet
// W - denotes wide move - ignore
//     (0 for no wide move, 1 for wide move)
//     not really using this yet - ignore
// This method is SO MUCH FASTER than just using strings to denote moves
// seconds vs milliseconds
function cubeNotationMove (F, D=1, S=0, R=0, W=0)
{
    return D * (((((((0 + W) << 4) + R) << 12) + S) << 4) + F);
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
    moves.push ([cubeNotationMove (MOVE_X,  1), "X" , [AXIS_X, [...allSliceIndices],  1]]);
    moves.push ([cubeNotationMove (MOVE_X, -1), "X'", [AXIS_X, [...allSliceIndices], -1]]);
    moves.push ([cubeNotationMove (MOVE_Y,  1), "Y" , [AXIS_Y, [...allSliceIndices], -1]]);
    moves.push ([cubeNotationMove (MOVE_Y, -1), "Y'", [AXIS_Y, [...allSliceIndices],  1]]);
    moves.push ([cubeNotationMove (MOVE_Z,  1), "Z" , [AXIS_Z, [...allSliceIndices],  1]]);
    moves.push ([cubeNotationMove (MOVE_Z, -1), "Z'", [AXIS_Z, [...allSliceIndices], -1]]);
    if (dim < 2) return moves;
    // Outer face rotations (2x2 and larger)
    moves.push ([cubeNotationMove (MOVE_L,  1), "L" , [AXIS_X, [low ], -1]]);
    moves.push ([cubeNotationMove (MOVE_L, -1), "L'", [AXIS_X, [low ],  1]]);
    moves.push ([cubeNotationMove (MOVE_R,  1), "R" , [AXIS_X, [high],  1]]);
    moves.push ([cubeNotationMove (MOVE_R, -1), "R'", [AXIS_X, [high], -1]]);
    moves.push ([cubeNotationMove (MOVE_F,  1), "F" , [AXIS_Z, [high],  1]]);
    moves.push ([cubeNotationMove (MOVE_F, -1), "F'", [AXIS_Z, [high], -1]]);
    moves.push ([cubeNotationMove (MOVE_B,  1), "B" , [AXIS_Z, [low ], -1]]);
    moves.push ([cubeNotationMove (MOVE_B, -1), "B'", [AXIS_Z, [low ],  1]]);
    moves.push ([cubeNotationMove (MOVE_U,  1), "U" , [AXIS_Y, [low ], -1]]);
    moves.push ([cubeNotationMove (MOVE_U, -1), "U'", [AXIS_Y, [low ],  1]]);
    moves.push ([cubeNotationMove (MOVE_D,  1), "D" , [AXIS_Y, [high],  1]]);
    moves.push ([cubeNotationMove (MOVE_D, -1), "D'", [AXIS_Y, [high], -1]]);
    if (dim < 3) return moves;
    // Middle slice rotations (odd dim, 3x3 and larger)
    if (dim % 2 != 0)
    {
        // middle slice moves follow these rules:
        // M follows the L direction, E follows the D direction, S follows the F direction.
        // https://jperm.net/3x3/moves#:~:text=instead%20of%20B).-,Slice%20Moves,-Slice%20moves%20are
        moves.push ([cubeNotationMove (MOVE_M,  1), "M" , [AXIS_X, [0], -1]]);
        moves.push ([cubeNotationMove (MOVE_M, -1), "M'", [AXIS_X, [0],  1]]);
        moves.push ([cubeNotationMove (MOVE_E,  1), "E" , [AXIS_Y, [0],  1]]);
        moves.push ([cubeNotationMove (MOVE_E, -1), "E'", [AXIS_Y, [0], -1]]);
        moves.push ([cubeNotationMove (MOVE_S,  1), "S" , [AXIS_Z, [0],  1]]);
        moves.push ([cubeNotationMove (MOVE_S, -1), "S'", [AXIS_Z, [0], -1]]);
    }
    if (dim < 4) return moves;
    // Inner slice rotations (4x4 and larger)
    moves.push ([cubeNotationMove (MOVE_L,  1, 1), "l" , [AXIS_X, [low  + 1], -1]]);
    moves.push ([cubeNotationMove (MOVE_L, -1, 1), "l'", [AXIS_X, [low  + 1],  1]]);
    moves.push ([cubeNotationMove (MOVE_R,  1, 1), "r" , [AXIS_X, [high - 1],  1]]);
    moves.push ([cubeNotationMove (MOVE_R, -1, 1), "r'", [AXIS_X, [high - 1], -1]]);
    moves.push ([cubeNotationMove (MOVE_F,  1, 1), "f" , [AXIS_Z, [high - 1],  1]]);
    moves.push ([cubeNotationMove (MOVE_F, -1, 1), "f'", [AXIS_Z, [high - 1], -1]]);
    moves.push ([cubeNotationMove (MOVE_B,  1, 1), "b" , [AXIS_Z, [low  + 1], -1]]);
    moves.push ([cubeNotationMove (MOVE_B, -1, 1), "b'", [AXIS_Z, [low  + 1],  1]]);
    moves.push ([cubeNotationMove (MOVE_U,  1, 1), "u" , [AXIS_Y, [low  + 1], -1]]);
    moves.push ([cubeNotationMove (MOVE_U, -1, 1), "u'", [AXIS_Y, [low  + 1],  1]]);
    moves.push ([cubeNotationMove (MOVE_D,  1, 1), "d" , [AXIS_Y, [high - 1],  1]]);
    moves.push ([cubeNotationMove (MOVE_D, -1, 1), "d'", [AXIS_Y, [high - 1], -1]]);
    if (dim < 6) return moves;
    // Further inner slice rotations (6x6 and larger)
    // [-3][-2][-1][ 0][ 1][ 2][ 3]
    // we need slices 1, 2, .. high-1 and low+1 ... -2, -1
    let i = 2;
    while (low + i < 0)
    {
        moves.push ([cubeNotationMove (MOVE_L,  1, i), i+"l" , [AXIS_X, [low  + i], -1]]);
        moves.push ([cubeNotationMove (MOVE_L, -1, i), i+"l'", [AXIS_X, [low  + i],  1]]);
        moves.push ([cubeNotationMove (MOVE_R,  1, i), i+"r" , [AXIS_X, [high - i],  1]]);
        moves.push ([cubeNotationMove (MOVE_R, -1, i), i+"r'", [AXIS_X, [high - i], -1]]);
        moves.push ([cubeNotationMove (MOVE_F,  1, i), i+"f" , [AXIS_Z, [high - i],  1]]);
        moves.push ([cubeNotationMove (MOVE_F, -1, i), i+"f'", [AXIS_Z, [high - i], -1]]);
        moves.push ([cubeNotationMove (MOVE_B,  1, i), i+"b" , [AXIS_Z, [low  + i], -1]]);
        moves.push ([cubeNotationMove (MOVE_B, -1, i), i+"b'", [AXIS_Z, [low  + i],  1]]);
        moves.push ([cubeNotationMove (MOVE_U,  1, i), i+"u" , [AXIS_Y, [low  + i], -1]]);
        moves.push ([cubeNotationMove (MOVE_U, -1, i), i+"u'", [AXIS_Y, [low  + i],  1]]);
        moves.push ([cubeNotationMove (MOVE_D,  1, i), i+"d" , [AXIS_Y, [high - i],  1]]);
        moves.push ([cubeNotationMove (MOVE_D, -1, i), i+"d'", [AXIS_Y, [high - i], -1]]);
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
