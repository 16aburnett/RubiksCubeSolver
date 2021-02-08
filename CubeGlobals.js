/*
    Rubiks Cube Shared Globals
    By Amy Burnett
    February 7 2020
*/

// =======================================================================

// Color Enums 
const ORANGE = 0; 
const BLUE   = 1;
const RED    = 2;
const GREEN  = 3;
const YELLOW = 4;
const WHITE  = 5;

// Face Offsets
const LEFT   = 0;
const FRONT  = 9;
const RIGHT  = 18;
const BACK   = 27;
const UP     = 36;
const DOWN   = 45;

// Moves 
const MOVE_L      = 0;
const MOVE_LPRIME = 1;
const MOVE_F      = 2;
const MOVE_FPRIME = 3;
const MOVE_R      = 4;
const MOVE_RPRIME = 5;
const MOVE_B      = 6;
const MOVE_BPRIME = 7;
const MOVE_U      = 8;
const MOVE_UPRIME = 9;
const MOVE_D      = 10;
const MOVE_DPRIME = 11;
const NUM_VALID_MOVES = 12;

// converts move to string representation
function intToMoveString (move) {
    if (move == MOVE_L)      return "L";
    if (move == MOVE_LPRIME) return "L'";
    if (move == MOVE_F)      return "F";
    if (move == MOVE_FPRIME) return "F'";
    if (move == MOVE_R)      return "R";
    if (move == MOVE_RPRIME) return "R'";
    if (move == MOVE_B)      return "B";
    if (move == MOVE_BPRIME) return "B'";
    if (move == MOVE_U)      return "U";
    if (move == MOVE_UPRIME) return "U'";
    if (move == MOVE_D)      return "D";
    if (move == MOVE_DPRIME) return "D'";
}