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

// Move notation moves
// Cube rotations
// Note cannot start with 0 bc 0 == -0 which messes up bitmask
const MOVE_X =  1;
const MOVE_Y =  2;
const MOVE_Z =  3;
// Generic face moves
// These can be used to define a Cube Move Notation for any slice
const MOVE_L =  4;
const MOVE_R =  5;
const MOVE_F =  6;
const MOVE_B =  7;
const MOVE_U =  8;
const MOVE_D =  9;
const MOVE_M = 10;
const MOVE_E = 11;
const MOVE_S = 12;

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
