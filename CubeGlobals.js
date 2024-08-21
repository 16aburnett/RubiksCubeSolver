// Rubiks Cube Shared Globals
// By Amy Burnett
// August 17 2024
// =======================================================================

// Color Enums 
const ORANGE = 0;
const BLUE   = 1;
const RED    = 2;
const GREEN  = 3;
const YELLOW = 4;
const WHITE  = 5;

// Animation
// the amount of degrees to turn per frame
const TURN_SPEED = 5;

// Global axis enums
const AXIS_X = 0;
const AXIS_Y = 1;
const AXIS_Z = 2;


// =======================================================================

// returns a p5.js color for the given color enum
function getColor(colorId) {
    if (colorId == RED)
        return color(245, 50, 50);
    if (colorId == ORANGE)
        return color(235, 150, 50);
    if (colorId == GREEN)
        return color(50, 230, 50);
    if (colorId == BLUE)
        return color(50, 50, 240);
    if (colorId == YELLOW)
        return color(245, 245, 50);
    // if (colorId == WHITE)
    return color(245, 245, 245);
}

// =======================================================================

class MoveNotation
{
    constructor ()
    {

    }

    // ===================================================================

    toString ()
    {

    }

    // ===================================================================

    toAxisRotation ()
    {

    }
}

// =======================================================================
// 1x1 Specific 
// =======================================================================

// Cube Move Notation enums
// Cube rotation moves
const MOVE_1X1_X          = 0;
const MOVE_1X1_XPRIME     = 1;
const MOVE_1X1_Y          = 2;
const MOVE_1X1_YPRIME     = 3;
const MOVE_1X1_Z          = 4;
const MOVE_1X1_ZPRIME     = 5;
const NUM_VALID_MOVES_1X1 = 6;

// =======================================================================

// returns string representation of the given move enum
function moveToString1x1 (move)
{
    // Cube rotations
    if (move == MOVE_1X1_X     ) return "X";
    if (move == MOVE_1X1_XPRIME) return "X'";
    if (move == MOVE_1X1_Y     ) return "Y";
    if (move == MOVE_1X1_YPRIME) return "Y'";
    if (move == MOVE_1X1_Z     ) return "Z";
    if (move == MOVE_1X1_ZPRIME) return "Z'";
    return "<unknown-move-" + move + ">";
}

// =======================================================================

// Returns the cooresponding 1x1 axis rotation move for the given cube
// move notation enum.
function moveToAxisRotation1x1 (move)
{
    // Cube rotations
    // cube rotations can be done with turning all the layers
    if      (move == MOVE_1X1_X     ) return [AXIS_X, [0],  1];
    else if (move == MOVE_1X1_XPRIME) return [AXIS_X, [0], -1];
    else if (move == MOVE_1X1_Y     ) return [AXIS_Y, [0], -1];
    else if (move == MOVE_1X1_YPRIME) return [AXIS_Y, [0],  1];
    else if (move == MOVE_1X1_Z     ) return [AXIS_Z, [0],  1];
    else if (move == MOVE_1X1_ZPRIME) return [AXIS_Z, [0], -1];
    // Reaches here if unknown move
    console.log ("Unknown move", move);
    return null;
}

// =======================================================================
// 2x2 Specific 
// =======================================================================

// Cube Move Notation enums
// Outer slice moves
const MOVE_2X2_L          = 0;
const MOVE_2X2_LPRIME     = 1;
const MOVE_2X2_F          = 2;
const MOVE_2X2_FPRIME     = 3;
const MOVE_2X2_R          = 4;
const MOVE_2X2_RPRIME     = 5;
const MOVE_2X2_B          = 6;
const MOVE_2X2_BPRIME     = 7;
const MOVE_2X2_U          = 8;
const MOVE_2X2_UPRIME     = 9;
const MOVE_2X2_D          = 10;
const MOVE_2X2_DPRIME     = 11;
// Cube rotation moves
const MOVE_2X2_X          = 12;
const MOVE_2X2_XPRIME     = 13;
const MOVE_2X2_Y          = 14;
const MOVE_2X2_YPRIME     = 15;
const MOVE_2X2_Z          = 16;
const MOVE_2X2_ZPRIME     = 17;
const NUM_VALID_MOVES_2X2 = 18;

// =======================================================================

// returns string representation of the given move enum
function moveToString2x2 (move)
{
    // Outer slice moves
    if (move == MOVE_2X2_L     ) return "L";
    if (move == MOVE_2X2_LPRIME) return "L'";
    if (move == MOVE_2X2_F     ) return "F";
    if (move == MOVE_2X2_FPRIME) return "F'";
    if (move == MOVE_2X2_R     ) return "R";
    if (move == MOVE_2X2_RPRIME) return "R'";
    if (move == MOVE_2X2_B     ) return "B";
    if (move == MOVE_2X2_BPRIME) return "B'";
    if (move == MOVE_2X2_U     ) return "U";
    if (move == MOVE_2X2_UPRIME) return "U'";
    if (move == MOVE_2X2_D     ) return "D";
    if (move == MOVE_2X2_DPRIME) return "D'";
    // Cube rotations
    if (move == MOVE_2X2_X     ) return "X";
    if (move == MOVE_2X2_XPRIME) return "X'";
    if (move == MOVE_2X2_Y     ) return "Y";
    if (move == MOVE_2X2_YPRIME) return "Y'";
    if (move == MOVE_2X2_Z     ) return "Z";
    if (move == MOVE_2X2_ZPRIME) return "Z'";
    return "<unknown-move-" + move + ">";
}

// =======================================================================

// Returns the cooresponding 2x2 axis rotation move for the given cube
// move notation enum.
function moveToAxisRotation2x2 (move)
{
    if      (move == MOVE_2X2_L     ) return [AXIS_X, [-1], -1];
    else if (move == MOVE_2X2_LPRIME) return [AXIS_X, [-1],  1];
    else if (move == MOVE_2X2_F     ) return [AXIS_Z, [ 1],  1];
    else if (move == MOVE_2X2_FPRIME) return [AXIS_Z, [ 1], -1];
    else if (move == MOVE_2X2_R     ) return [AXIS_X, [ 1],  1];
    else if (move == MOVE_2X2_RPRIME) return [AXIS_X, [ 1], -1];
    else if (move == MOVE_2X2_B     ) return [AXIS_Z, [-1], -1];
    else if (move == MOVE_2X2_BPRIME) return [AXIS_Z, [-1],  1];
    else if (move == MOVE_2X2_U     ) return [AXIS_Y, [-1], -1];
    else if (move == MOVE_2X2_UPRIME) return [AXIS_Y, [-1],  1];
    else if (move == MOVE_2X2_D     ) return [AXIS_Y, [ 1],  1];
    else if (move == MOVE_2X2_DPRIME) return [AXIS_Y, [ 1], -1];
    // Cube rotations
    // cube rotations can be done with turning all the layers
    else if (move == MOVE_2X2_X     ) return [AXIS_X, [-1, 1],  1];
    else if (move == MOVE_2X2_XPRIME) return [AXIS_X, [-1, 1], -1];
    else if (move == MOVE_2X2_Y     ) return [AXIS_Y, [-1, 1], -1];
    else if (move == MOVE_2X2_YPRIME) return [AXIS_Y, [-1, 1],  1];
    else if (move == MOVE_2X2_Z     ) return [AXIS_Z, [-1, 1],  1];
    else if (move == MOVE_2X2_ZPRIME) return [AXIS_Z, [-1, 1], -1];
    // Reaches here if unknown move
    console.log ("Unknown move", move);
    return null;
}

// =======================================================================
// 3x3 Specific 
// =======================================================================

// Cube Move Notation enums
// Outer slice moves
const MOVE_3X3_L          = 0;
const MOVE_3X3_LPRIME     = 1;
const MOVE_3X3_F          = 2;
const MOVE_3X3_FPRIME     = 3;
const MOVE_3X3_R          = 4;
const MOVE_3X3_RPRIME     = 5;
const MOVE_3X3_B          = 6;
const MOVE_3X3_BPRIME     = 7;
const MOVE_3X3_U          = 8;
const MOVE_3X3_UPRIME     = 9;
const MOVE_3X3_D          = 10;
const MOVE_3X3_DPRIME     = 11;
// Cube rotation moves
const MOVE_3X3_X          = 12;
const MOVE_3X3_XPRIME     = 13;
const MOVE_3X3_Y          = 14;
const MOVE_3X3_YPRIME     = 15;
const MOVE_3X3_Z          = 16;
const MOVE_3X3_ZPRIME     = 17;
// Middle slice moves
const MOVE_3X3_M          = 18;
const MOVE_3X3_MPRIME     = 19;
const MOVE_3X3_E          = 20;
const MOVE_3X3_EPRIME     = 21;
const MOVE_3X3_S          = 22;
const MOVE_3X3_SPRIME     = 23;
const NUM_VALID_MOVES_3X3 = 24;

// =======================================================================

// returns string representation of the given move enum
function moveToString3x3 (move)
{
    // Outer slice moves
    if (move == MOVE_3X3_L     ) return "L";
    if (move == MOVE_3X3_LPRIME) return "L'";
    if (move == MOVE_3X3_F     ) return "F";
    if (move == MOVE_3X3_FPRIME) return "F'";
    if (move == MOVE_3X3_R     ) return "R";
    if (move == MOVE_3X3_RPRIME) return "R'";
    if (move == MOVE_3X3_B     ) return "B";
    if (move == MOVE_3X3_BPRIME) return "B'";
    if (move == MOVE_3X3_U     ) return "U";
    if (move == MOVE_3X3_UPRIME) return "U'";
    if (move == MOVE_3X3_D     ) return "D";
    if (move == MOVE_3X3_DPRIME) return "D'";
    // Cube rotations
    if (move == MOVE_3X3_X     ) return "X";
    if (move == MOVE_3X3_XPRIME) return "X'";
    if (move == MOVE_3X3_Y     ) return "Y";
    if (move == MOVE_3X3_YPRIME) return "Y'";
    if (move == MOVE_3X3_Z     ) return "Z";
    if (move == MOVE_3X3_ZPRIME) return "Z'";
    // Middle slice moves
    if (move == MOVE_3X3_M     ) return "M";
    if (move == MOVE_3X3_MPRIME) return "M'";
    if (move == MOVE_3X3_E     ) return "E";
    if (move == MOVE_3X3_EPRIME) return "E'";
    if (move == MOVE_3X3_S     ) return "S";
    if (move == MOVE_3X3_SPRIME) return "S'";
    return "<unknown-move-" + move + ">";
}

// =======================================================================

// Returns the cooresponding 3x3 axis rotation move for the given cube
// move notation enum.
function moveToAxisRotation3x3 (move)
{
    if      (move == MOVE_3X3_L     ) return [AXIS_X, [-1], -1];
    else if (move == MOVE_3X3_LPRIME) return [AXIS_X, [-1],  1];
    else if (move == MOVE_3X3_F     ) return [AXIS_Z, [ 1],  1];
    else if (move == MOVE_3X3_FPRIME) return [AXIS_Z, [ 1], -1];
    else if (move == MOVE_3X3_R     ) return [AXIS_X, [ 1],  1];
    else if (move == MOVE_3X3_RPRIME) return [AXIS_X, [ 1], -1];
    else if (move == MOVE_3X3_B     ) return [AXIS_Z, [-1], -1];
    else if (move == MOVE_3X3_BPRIME) return [AXIS_Z, [-1],  1];
    else if (move == MOVE_3X3_U     ) return [AXIS_Y, [-1], -1];
    else if (move == MOVE_3X3_UPRIME) return [AXIS_Y, [-1],  1];
    else if (move == MOVE_3X3_D     ) return [AXIS_Y, [ 1],  1];
    else if (move == MOVE_3X3_DPRIME) return [AXIS_Y, [ 1], -1];
    // Cube rotations
    // cube rotations can be done with 3 layer turns
    else if (move == MOVE_3X3_X     ) return [AXIS_X, [-1, 0, 1],  1];
    else if (move == MOVE_3X3_XPRIME) return [AXIS_X, [-1, 0, 1], -1];
    else if (move == MOVE_3X3_Y     ) return [AXIS_Y, [-1, 0, 1], -1];
    else if (move == MOVE_3X3_YPRIME) return [AXIS_Y, [-1, 0, 1],  1];
    else if (move == MOVE_3X3_Z     ) return [AXIS_Z, [-1, 0, 1],  1];
    else if (move == MOVE_3X3_ZPRIME) return [AXIS_Z, [-1, 0, 1], -1];
    // Middle slice moves
    else if (move == MOVE_3X3_M     ) return [AXIS_X, [ 0],  1];
    else if (move == MOVE_3X3_MPRIME) return [AXIS_X, [ 0], -1];
    else if (move == MOVE_3X3_E     ) return [AXIS_Y, [ 0], -1];
    else if (move == MOVE_3X3_EPRIME) return [AXIS_Y, [ 0],  1];
    else if (move == MOVE_3X3_S     ) return [AXIS_Z, [ 0],  1];
    else if (move == MOVE_3X3_SPRIME) return [AXIS_Z, [ 0], -1];
    // Reaches here if unknown move
    console.log ("Unknown move", move);
    return null;
}

// =======================================================================
// 4x4 Specific 
// =======================================================================

// Cube Move Notation enums
// Outer slice moves
const MOVE_4X4_L          = 0;
const MOVE_4X4_LPRIME     = 1;
const MOVE_4X4_F          = 2;
const MOVE_4X4_FPRIME     = 3;
const MOVE_4X4_R          = 4;
const MOVE_4X4_RPRIME     = 5;
const MOVE_4X4_B          = 6;
const MOVE_4X4_BPRIME     = 7;
const MOVE_4X4_U          = 8;
const MOVE_4X4_UPRIME     = 9;
const MOVE_4X4_D          = 10;
const MOVE_4X4_DPRIME     = 11;
// Cube rotation moves
const MOVE_4X4_X          = 12;
const MOVE_4X4_XPRIME     = 13;
const MOVE_4X4_Y          = 14;
const MOVE_4X4_YPRIME     = 15;
const MOVE_4X4_Z          = 16;
const MOVE_4X4_ZPRIME     = 17;
// Middle slice moves
const MOVE_4X4_l          = 18;
const MOVE_4X4_lPRIME     = 19;
const MOVE_4X4_f          = 20;
const MOVE_4X4_fPRIME     = 21;
const MOVE_4X4_r          = 22;
const MOVE_4X4_rPRIME     = 23;
const MOVE_4X4_b          = 24;
const MOVE_4X4_bPRIME     = 25;
const MOVE_4X4_u          = 26;
const MOVE_4X4_uPRIME     = 27;
const MOVE_4X4_d          = 28;
const MOVE_4X4_dPRIME     = 29;
const NUM_VALID_MOVES_4X4 = 30;

// =======================================================================

// returns string representation of the given move enum
function moveToString4x4 (move)
{
    // Outer slice moves
    if (move == MOVE_4X4_L     ) return "L";
    if (move == MOVE_4X4_LPRIME) return "L'";
    if (move == MOVE_4X4_F     ) return "F";
    if (move == MOVE_4X4_FPRIME) return "F'";
    if (move == MOVE_4X4_R     ) return "R";
    if (move == MOVE_4X4_RPRIME) return "R'";
    if (move == MOVE_4X4_B     ) return "B";
    if (move == MOVE_4X4_BPRIME) return "B'";
    if (move == MOVE_4X4_U     ) return "U";
    if (move == MOVE_4X4_UPRIME) return "U'";
    if (move == MOVE_4X4_D     ) return "D";
    if (move == MOVE_4X4_DPRIME) return "D'";
    // Cube rotations
    if (move == MOVE_4X4_X     ) return "X";
    if (move == MOVE_4X4_XPRIME) return "X'";
    if (move == MOVE_4X4_Y     ) return "Y";
    if (move == MOVE_4X4_YPRIME) return "Y'";
    if (move == MOVE_4X4_Z     ) return "Z";
    if (move == MOVE_4X4_ZPRIME) return "Z'";
    // Middle slice moves - this is a unique notation to 4x4 -__-
    if (move == MOVE_4X4_l)      return "l";
    if (move == MOVE_4X4_lPRIME) return "l'";
    if (move == MOVE_4X4_f)      return "f";
    if (move == MOVE_4X4_fPRIME) return "f'";
    if (move == MOVE_4X4_r)      return "r";
    if (move == MOVE_4X4_rPRIME) return "r'";
    if (move == MOVE_4X4_b)      return "b";
    if (move == MOVE_4X4_bPRIME) return "b'";
    if (move == MOVE_4X4_u)      return "u";
    if (move == MOVE_4X4_uPRIME) return "u'";
    if (move == MOVE_4X4_d)      return "d";
    if (move == MOVE_4X4_dPRIME) return "d'";
    return "<unknown-move-" + move + ">";
}

// =======================================================================

// Returns the cooresponding 4x4 axis rotation move for the given cube
// move notation enum.
function moveToAxisRotation4x4 (move)
{
    if      (move == MOVE_4X4_L     ) return [AXIS_X, [-2], -1];
    else if (move == MOVE_4X4_LPRIME) return [AXIS_X, [-2],  1];
    else if (move == MOVE_4X4_F     ) return [AXIS_Z, [ 2],  1];
    else if (move == MOVE_4X4_FPRIME) return [AXIS_Z, [ 2], -1];
    else if (move == MOVE_4X4_R     ) return [AXIS_X, [ 2],  1];
    else if (move == MOVE_4X4_RPRIME) return [AXIS_X, [ 2], -1];
    else if (move == MOVE_4X4_B     ) return [AXIS_Z, [-2], -1];
    else if (move == MOVE_4X4_BPRIME) return [AXIS_Z, [-2],  1];
    else if (move == MOVE_4X4_U     ) return [AXIS_Y, [-2], -1];
    else if (move == MOVE_4X4_UPRIME) return [AXIS_Y, [-2],  1];
    else if (move == MOVE_4X4_D     ) return [AXIS_Y, [ 2],  1];
    else if (move == MOVE_4X4_DPRIME) return [AXIS_Y, [ 2], -1];
    // Cube rotations
    // cube rotations can be done with turning all the layers
    else if (move == MOVE_4X4_X     ) return [AXIS_X, [-2, -1, 1, 2],  1];
    else if (move == MOVE_4X4_XPRIME) return [AXIS_X, [-2, -1, 1, 2], -1];
    else if (move == MOVE_4X4_Y     ) return [AXIS_Y, [-2, -1, 1, 2], -1];
    else if (move == MOVE_4X4_YPRIME) return [AXIS_Y, [-2, -1, 1, 2],  1];
    else if (move == MOVE_4X4_Z     ) return [AXIS_Z, [-2, -1, 1, 2],  1];
    else if (move == MOVE_4X4_ZPRIME) return [AXIS_Z, [-2, -1, 1, 2], -1];
    // Middle slice moves - this is a unique notation to 4x4 -__-
    else if (move == MOVE_4X4_l     ) return [AXIS_X, [-1], -1];
    else if (move == MOVE_4X4_lPRIME) return [AXIS_X, [-1],  1];
    else if (move == MOVE_4X4_f     ) return [AXIS_Z, [ 1],  1];
    else if (move == MOVE_4X4_fPRIME) return [AXIS_Z, [ 1], -1];
    else if (move == MOVE_4X4_r     ) return [AXIS_X, [ 1],  1];
    else if (move == MOVE_4X4_rPRIME) return [AXIS_X, [ 1], -1];
    else if (move == MOVE_4X4_b     ) return [AXIS_Z, [-1], -1];
    else if (move == MOVE_4X4_bPRIME) return [AXIS_Z, [-1],  1];
    else if (move == MOVE_4X4_u     ) return [AXIS_Y, [-1], -1];
    else if (move == MOVE_4X4_uPRIME) return [AXIS_Y, [-1],  1];
    else if (move == MOVE_4X4_d     ) return [AXIS_Y, [ 1],  1];
    else if (move == MOVE_4X4_dPRIME) return [AXIS_Y, [ 1], -1];
    // Reaches here if unknown move
    console.log ("Unknown move", move);
    return null;
}

// =======================================================================
// 5x5 Specific 
// =======================================================================

// Cube Move Notation enums
// Outer slice moves
const MOVE_5X5_L          = 0;
const MOVE_5X5_LPRIME     = 1;
const MOVE_5X5_F          = 2;
const MOVE_5X5_FPRIME     = 3;
const MOVE_5X5_R          = 4;
const MOVE_5X5_RPRIME     = 5;
const MOVE_5X5_B          = 6;
const MOVE_5X5_BPRIME     = 7;
const MOVE_5X5_U          = 8;
const MOVE_5X5_UPRIME     = 9;
const MOVE_5X5_D          = 10;
const MOVE_5X5_DPRIME     = 11;
// Cube rotation moves
const MOVE_5X5_X          = 12;
const MOVE_5X5_XPRIME     = 13;
const MOVE_5X5_Y          = 14;
const MOVE_5X5_YPRIME     = 15;
const MOVE_5X5_Z          = 16;
const MOVE_5X5_ZPRIME     = 17;
// Middle slice moves
const MOVE_5X5_l          = 18;
const MOVE_5X5_lPRIME     = 19;
const MOVE_5X5_f          = 20;
const MOVE_5X5_fPRIME     = 21;
const MOVE_5X5_r          = 22;
const MOVE_5X5_rPRIME     = 23;
const MOVE_5X5_b          = 24;
const MOVE_5X5_bPRIME     = 25;
const MOVE_5X5_u          = 26;
const MOVE_5X5_uPRIME     = 27;
const MOVE_5X5_d          = 28;
const MOVE_5X5_dPRIME     = 29;
// Middle slice moves cont
const MOVE_5X5_M          = 30;
const MOVE_5X5_MPRIME     = 31;
const MOVE_5X5_E          = 32;
const MOVE_5X5_EPRIME     = 33;
const MOVE_5X5_S          = 34;
const MOVE_5X5_SPRIME     = 35;
const NUM_VALID_MOVES_5X5 = 36;

// =======================================================================

// returns string representation of the given move enum
function moveToString5x5 (move)
{
    // Outer slice moves
    if (move == MOVE_5X5_L     ) return "L";
    if (move == MOVE_5X5_LPRIME) return "L'";
    if (move == MOVE_5X5_F     ) return "F";
    if (move == MOVE_5X5_FPRIME) return "F'";
    if (move == MOVE_5X5_R     ) return "R";
    if (move == MOVE_5X5_RPRIME) return "R'";
    if (move == MOVE_5X5_B     ) return "B";
    if (move == MOVE_5X5_BPRIME) return "B'";
    if (move == MOVE_5X5_U     ) return "U";
    if (move == MOVE_5X5_UPRIME) return "U'";
    if (move == MOVE_5X5_D     ) return "D";
    if (move == MOVE_5X5_DPRIME) return "D'";
    // Cube rotations
    if (move == MOVE_5X5_X     ) return "X";
    if (move == MOVE_5X5_XPRIME) return "X'";
    if (move == MOVE_5X5_Y     ) return "Y";
    if (move == MOVE_5X5_YPRIME) return "Y'";
    if (move == MOVE_5X5_Z     ) return "Z";
    if (move == MOVE_5X5_ZPRIME) return "Z'";
    // Middle slice moves - this is a unique notation to 4x4 -__-
    if (move == MOVE_5X5_l)      return "l";
    if (move == MOVE_5X5_lPRIME) return "l'";
    if (move == MOVE_5X5_f)      return "f";
    if (move == MOVE_5X5_fPRIME) return "f'";
    if (move == MOVE_5X5_r)      return "r";
    if (move == MOVE_5X5_rPRIME) return "r'";
    if (move == MOVE_5X5_b)      return "b";
    if (move == MOVE_5X5_bPRIME) return "b'";
    if (move == MOVE_5X5_u)      return "u";
    if (move == MOVE_5X5_uPRIME) return "u'";
    if (move == MOVE_5X5_d)      return "d";
    if (move == MOVE_5X5_dPRIME) return "d'";
    // Middle slice moves - cont
    if (move == MOVE_5X5_M     ) return "M";
    if (move == MOVE_5X5_MPRIME) return "M'";
    if (move == MOVE_5X5_E     ) return "E";
    if (move == MOVE_5X5_EPRIME) return "E'";
    if (move == MOVE_5X5_S     ) return "S";
    if (move == MOVE_5X5_SPRIME) return "S'";
    return "<unknown-move-" + move + ">";
}

// =======================================================================

// Returns the cooresponding 5x5 axis rotation move for the given cube
// move notation enum.
function moveToAxisRotation5x5 (move)
{
    if      (move == MOVE_5X5_L     ) return [AXIS_X, [-2], -1];
    else if (move == MOVE_5X5_LPRIME) return [AXIS_X, [-2],  1];
    else if (move == MOVE_5X5_F     ) return [AXIS_Z, [ 2],  1];
    else if (move == MOVE_5X5_FPRIME) return [AXIS_Z, [ 2], -1];
    else if (move == MOVE_5X5_R     ) return [AXIS_X, [ 2],  1];
    else if (move == MOVE_5X5_RPRIME) return [AXIS_X, [ 2], -1];
    else if (move == MOVE_5X5_B     ) return [AXIS_Z, [-2], -1];
    else if (move == MOVE_5X5_BPRIME) return [AXIS_Z, [-2],  1];
    else if (move == MOVE_5X5_U     ) return [AXIS_Y, [-2], -1];
    else if (move == MOVE_5X5_UPRIME) return [AXIS_Y, [-2],  1];
    else if (move == MOVE_5X5_D     ) return [AXIS_Y, [ 2],  1];
    else if (move == MOVE_5X5_DPRIME) return [AXIS_Y, [ 2], -1];
    // Cube rotations
    // cube rotations can be done with turning all the layers
    else if (move == MOVE_5X5_X     ) return [AXIS_X, [-2, -1, 0, 1, 2],  1];
    else if (move == MOVE_5X5_XPRIME) return [AXIS_X, [-2, -1, 0, 1, 2], -1];
    else if (move == MOVE_5X5_Y     ) return [AXIS_Y, [-2, -1, 0, 1, 2], -1];
    else if (move == MOVE_5X5_YPRIME) return [AXIS_Y, [-2, -1, 0, 1, 2],  1];
    else if (move == MOVE_5X5_Z     ) return [AXIS_Z, [-2, -1, 0, 1, 2],  1];
    else if (move == MOVE_5X5_ZPRIME) return [AXIS_Z, [-2, -1, 0, 1, 2], -1];
    // Middle slice moves - this is a unique notation to 4x4 -__-
    else if (move == MOVE_5X5_l     ) return [AXIS_X, [-1], -1];
    else if (move == MOVE_5X5_lPRIME) return [AXIS_X, [-1],  1];
    else if (move == MOVE_5X5_f     ) return [AXIS_Z, [ 1],  1];
    else if (move == MOVE_5X5_fPRIME) return [AXIS_Z, [ 1], -1];
    else if (move == MOVE_5X5_r     ) return [AXIS_X, [ 1],  1];
    else if (move == MOVE_5X5_rPRIME) return [AXIS_X, [ 1], -1];
    else if (move == MOVE_5X5_b     ) return [AXIS_Z, [-1], -1];
    else if (move == MOVE_5X5_bPRIME) return [AXIS_Z, [-1],  1];
    else if (move == MOVE_5X5_u     ) return [AXIS_Y, [-1], -1];
    else if (move == MOVE_5X5_uPRIME) return [AXIS_Y, [-1],  1];
    else if (move == MOVE_5X5_d     ) return [AXIS_Y, [ 1],  1];
    else if (move == MOVE_5X5_dPRIME) return [AXIS_Y, [ 1], -1];
    // Middle slice moves
    else if (move == MOVE_5X5_M     ) return [AXIS_X, [ 0],  1];
    else if (move == MOVE_5X5_MPRIME) return [AXIS_X, [ 0], -1];
    else if (move == MOVE_5X5_E     ) return [AXIS_Y, [ 0], -1];
    else if (move == MOVE_5X5_EPRIME) return [AXIS_Y, [ 0],  1];
    else if (move == MOVE_5X5_S     ) return [AXIS_Z, [ 0],  1];
    else if (move == MOVE_5X5_SPRIME) return [AXIS_Z, [ 0], -1];
    // Reaches here if unknown move
    console.log ("Unknown move", move);
    return null;
}