/*
    Rubiks Cube 4x4x4 Representation
    By Amy Burnett
    August 13 2024
*/

// =======================================================================

class RubiksCube4 {

    constructor() {
        this.reset ();
        // Face Offsets
        this.dim = 4;
        this.LEFT   = 0 * this.dim * this.dim; // 0
        this.FRONT  = 1 * this.dim * this.dim; // 16
        this.RIGHT  = 2 * this.dim * this.dim; // 32
        this.BACK   = 3 * this.dim * this.dim; // 48
        this.UP     = 4 * this.dim * this.dim; // 64
        this.DOWN   = 5 * this.dim * this.dim; // 80
        // Moves
        this.MOVE_L          = 0;
        this.MOVE_LPRIME     = 1;
        this.MOVE_F          = 2;
        this.MOVE_FPRIME     = 3;
        this.MOVE_R          = 4;
        this.MOVE_RPRIME     = 5;
        this.MOVE_B          = 6;
        this.MOVE_BPRIME     = 7;
        this.MOVE_U          = 8;
        this.MOVE_UPRIME     = 9;
        this.MOVE_D          = 10;
        this.MOVE_DPRIME     = 11;
        // Middle slice moves
        this.MOVE_l          = 12;
        this.MOVE_lPRIME     = 13;
        this.MOVE_f          = 14;
        this.MOVE_fPRIME     = 15;
        this.MOVE_r          = 16;
        this.MOVE_rPRIME     = 17;
        this.MOVE_b          = 18;
        this.MOVE_bPRIME     = 19;
        this.MOVE_u          = 20;
        this.MOVE_uPRIME     = 21;
        this.MOVE_d          = 22;
        this.MOVE_dPRIME     = 23;
        // Cube rotation moves
        this.MOVE_X          = 24;
        this.MOVE_XPRIME     = 25;
        this.MOVE_Y          = 26;
        this.MOVE_YPRIME     = 27;
        this.MOVE_Z          = 28;
        this.MOVE_ZPRIME     = 29;
        this.NUM_VALID_MOVES = 30;
        // drawing
        this.minimapSizeFactor = 40;
    }
    
    // =======================================================================

    isSolved() {
        let solution = [
            // left
            ORANGE, ORANGE, ORANGE, ORANGE,
            ORANGE, ORANGE, ORANGE, ORANGE,
            ORANGE, ORANGE, ORANGE, ORANGE,
            ORANGE, ORANGE, ORANGE, ORANGE,
            // front
            BLUE, BLUE, BLUE, BLUE,
            BLUE, BLUE, BLUE, BLUE,
            BLUE, BLUE, BLUE, BLUE,
            BLUE, BLUE, BLUE, BLUE,
            // right
            RED, RED, RED, RED,
            RED, RED, RED, RED,
            RED, RED, RED, RED,
            RED, RED, RED, RED,
            // back
            GREEN, GREEN, GREEN, GREEN,
            GREEN, GREEN, GREEN, GREEN,
            GREEN, GREEN, GREEN, GREEN,
            GREEN, GREEN, GREEN, GREEN,
            // up
            YELLOW, YELLOW, YELLOW, YELLOW,
            YELLOW, YELLOW, YELLOW, YELLOW,
            YELLOW, YELLOW, YELLOW, YELLOW,
            YELLOW, YELLOW, YELLOW, YELLOW,
            // down
            WHITE, WHITE, WHITE, WHITE,
            WHITE, WHITE, WHITE, WHITE,
            WHITE, WHITE, WHITE, WHITE,
            WHITE, WHITE, WHITE, WHITE,
        ];
        // search for non matching piece
        // if found, then we know it is not solved
        for (var i = 0; i < this.data.length; ++i) {
            if (this.data[i] != solution[i]) {
                return false;
            }
        }
        return true;
    }

    // =======================================================================

    // restores cube to solved state
    reset() {
        this.data = [
            // left
            ORANGE, ORANGE, ORANGE, ORANGE,
            ORANGE, ORANGE, ORANGE, ORANGE,
            ORANGE, ORANGE, ORANGE, ORANGE,
            ORANGE, ORANGE, ORANGE, ORANGE,
            // front
            BLUE, BLUE, BLUE, BLUE,
            BLUE, BLUE, BLUE, BLUE,
            BLUE, BLUE, BLUE, BLUE,
            BLUE, BLUE, BLUE, BLUE,
            // right
            RED, RED, RED, RED,
            RED, RED, RED, RED,
            RED, RED, RED, RED,
            RED, RED, RED, RED,
            // back
            GREEN, GREEN, GREEN, GREEN,
            GREEN, GREEN, GREEN, GREEN,
            GREEN, GREEN, GREEN, GREEN,
            GREEN, GREEN, GREEN, GREEN,
            // up
            YELLOW, YELLOW, YELLOW, YELLOW,
            YELLOW, YELLOW, YELLOW, YELLOW,
            YELLOW, YELLOW, YELLOW, YELLOW,
            YELLOW, YELLOW, YELLOW, YELLOW,
            // down
            WHITE, WHITE, WHITE, WHITE,
            WHITE, WHITE, WHITE, WHITE,
            WHITE, WHITE, WHITE, WHITE,
            WHITE, WHITE, WHITE, WHITE,
        ];
    }

    // =======================================================================
    // Moves

    move (move) {
        if (move == this.MOVE_L) this.L();
        if (move == this.MOVE_LPRIME) this.LPrime();
        if (move == this.MOVE_F) this.F();
        if (move == this.MOVE_FPRIME) this.FPrime();
        if (move == this.MOVE_R) this.R();
        if (move == this.MOVE_RPRIME) this.RPrime();
        if (move == this.MOVE_B) this.B();
        if (move == this.MOVE_BPRIME) this.BPrime();
        if (move == this.MOVE_U) this.U();
        if (move == this.MOVE_UPRIME) this.UPrime();
        if (move == this.MOVE_D) this.D();
        if (move == this.MOVE_DPRIME) this.DPrime();
        // Middle slice moves
        if (move == this.MOVE_l) this.l();
        if (move == this.MOVE_lPRIME) this.lPrime();
        if (move == this.MOVE_f) this.f();
        if (move == this.MOVE_fPRIME) this.fPrime();
        if (move == this.MOVE_r) this.r();
        if (move == this.MOVE_rPRIME) this.rPrime();
        if (move == this.MOVE_b) this.b();
        if (move == this.MOVE_bPRIME) this.bPrime();
        if (move == this.MOVE_u) this.u();
        if (move == this.MOVE_uPRIME) this.uPrime();
        if (move == this.MOVE_d) this.d();
        if (move == this.MOVE_dPRIME) this.dPrime();
        // Cube rotations
        if (move == this.MOVE_X) this.X();
        if (move == this.MOVE_XPRIME) this.XPrime();
        if (move == this.MOVE_Y) this.Y();
        if (move == this.MOVE_YPRIME) this.YPrime();
        if (move == this.MOVE_Z) this.Z();
        if (move == this.MOVE_ZPRIME) this.ZPrime();
    }

    // =======================================================================

    rotateFaceClockwise (face)
    {
        // rotate corners
        let corner           = this.data[face + 12];
        this.data[face + 12] = this.data[face + 15];
        this.data[face + 15] = this.data[face +  3];
        this.data[face +  3] = this.data[face +  0];
        this.data[face +  0] = corner;
        // rotate edge0
        let edge0            = this.data[face + 13];
        this.data[face + 13] = this.data[face + 11];
        this.data[face + 11] = this.data[face +  2];
        this.data[face +  2] = this.data[face +  4];
        this.data[face +  4] = edge0;
        // rotate edge1
        let edge1            = this.data[face + 14];
        this.data[face + 14] = this.data[face +  7];
        this.data[face +  7] = this.data[face +  1];
        this.data[face +  1] = this.data[face +  8];
        this.data[face +  8] = edge1;
        // rotate middle corners
        let middle_corner    = this.data[face +  9];
        this.data[face +  9] = this.data[face + 10];
        this.data[face + 10] = this.data[face +  6];
        this.data[face +  6] = this.data[face +  5];
        this.data[face +  5] = middle_corner;
    }

    rotateFaceCounterClockwise (face)
    {
        // rotate corners
        let corner           = this.data[face + 12];
        this.data[face + 12] = this.data[face +  0];
        this.data[face +  0] = this.data[face +  3];
        this.data[face +  3] = this.data[face + 15];
        this.data[face + 15] = corner;
        // rotate edge0
        let edge0            = this.data[face + 13];
        this.data[face + 13] = this.data[face +  4];
        this.data[face +  4] = this.data[face +  2];
        this.data[face +  2] = this.data[face + 11];
        this.data[face + 11] = edge0;
        // rotate edge1
        let edge1            = this.data[face + 14];
        this.data[face + 14] = this.data[face +  8];
        this.data[face +  8] = this.data[face +  1];
        this.data[face +  1] = this.data[face +  7];
        this.data[face +  7] = edge1;
        // rotate middle corners
        let middle_corner    = this.data[face +  9];
        this.data[face +  9] = this.data[face +  5];
        this.data[face +  5] = this.data[face +  6];
        this.data[face +  6] = this.data[face + 10];
        this.data[face + 10] = middle_corner;
    }

    // =======================================================================
    // MOVES : OUTER SLICES
    // =======================================================================

    // Left face
    // Clockwise (from facing left face)
    L () {
        // Rotate slice
        // cycle top left corners
        let down_0  = this.data[this.DOWN + 0];
        this.data[this.DOWN  +  0] = this.data[this.FRONT +  0];
        this.data[this.FRONT +  0] = this.data[this.UP    +  0];
        this.data[this.UP    +  0] = this.data[this.BACK  + 15];
        this.data[this.BACK  + 15] = down_0 ;
        // cycle top edges
        let down_4  = this.data[this.DOWN + 4];
        this.data[this.DOWN  +  4] = this.data[this.FRONT +  4];
        this.data[this.FRONT +  4] = this.data[this.UP    +  4];
        this.data[this.UP    +  4] = this.data[this.BACK  + 11];
        this.data[this.BACK  + 11] = down_4 ;
        // cycle bottom edges
        let down_8  = this.data[this.DOWN + 8];
        this.data[this.DOWN  +  8] = this.data[this.FRONT +  8];
        this.data[this.FRONT +  8] = this.data[this.UP    +  8];
        this.data[this.UP    +  8] = this.data[this.BACK  +  7];
        this.data[this.BACK  +  7] = down_8 ;
        // cycle bottom corners
        let down_12 = this.data[this.DOWN + 12];
        this.data[this.DOWN  + 12] = this.data[this.FRONT + 12];
        this.data[this.FRONT + 12] = this.data[this.UP    + 12];
        this.data[this.UP    + 12] = this.data[this.BACK  +  3];
        this.data[this.BACK  +  3] = down_12;

        // rotate face
        this.rotateFaceClockwise (this.LEFT);
    }

    // =======================================================================

    // Left face
    // Counter-clockwise (from facing left face)
    LPrime () {
        // Rotate slice
        // cycle top left corners
        let down_0  = this.data[this.DOWN + 0];
        this.data[this.DOWN  +  0] = this.data[this.BACK  + 15];
        this.data[this.BACK  + 15] = this.data[this.UP    +  0];
        this.data[this.UP    +  0] = this.data[this.FRONT +  0];
        this.data[this.FRONT +  0] = down_0 ;
        // cycle top edges
        let down_4  = this.data[this.DOWN + 4];
        this.data[this.DOWN  +  4] = this.data[this.BACK  + 11];
        this.data[this.BACK  + 11] = this.data[this.UP    +  4];
        this.data[this.UP    +  4] = this.data[this.FRONT +  4];
        this.data[this.FRONT +  4] = down_4 ;
        // cycle bottom edges
        let down_8  = this.data[this.DOWN + 8];
        this.data[this.DOWN  +  8] = this.data[this.BACK  +  7];
        this.data[this.BACK  +  7] = this.data[this.UP    +  8];
        this.data[this.UP    +  8] = this.data[this.FRONT +  8];
        this.data[this.FRONT +  8] = down_8 ;
        // cycle bottom corners
        let down_12 = this.data[this.DOWN + 12];
        this.data[this.DOWN  + 12] = this.data[this.BACK  +  3];
        this.data[this.BACK  +  3] = this.data[this.UP    + 12];
        this.data[this.UP    + 12] = this.data[this.FRONT + 12];
        this.data[this.FRONT + 12] = down_12;

        // rotate face
        this.rotateFaceCounterClockwise (this.LEFT);
    }

    // =======================================================================

    F () {
        // Rotate slice
        // move top corners
        let corner1 = this.data[this.UP + 12];
        this.data[this.UP    + 12] = this.data[this.LEFT  + 15];
        this.data[this.LEFT  + 15] = this.data[this.DOWN  +  3];
        this.data[this.DOWN  +  3] = this.data[this.RIGHT +  0];
        this.data[this.RIGHT +  0] = corner1;
        // move edge1
        let edge0 = this.data[this.UP + 13];
        this.data[this.UP    + 13] = this.data[this.LEFT  + 11];
        this.data[this.LEFT  + 11] = this.data[this.DOWN  +  2];
        this.data[this.DOWN  +  2] = this.data[this.RIGHT +  4];
        this.data[this.RIGHT +  4] = edge0;
        // move edge1
        let edge1 = this.data[this.UP + 14];
        this.data[this.UP    + 14] = this.data[this.LEFT  +  7];
        this.data[this.LEFT  +  7] = this.data[this.DOWN  +  1];
        this.data[this.DOWN  +  1] = this.data[this.RIGHT +  8];
        this.data[this.RIGHT +  8] = edge1;
        // move bottom corners
        let corner2 = this.data[this.UP + 15];
        this.data[this.UP    + 15] = this.data[this.LEFT  +  3];
        this.data[this.LEFT  +  3] = this.data[this.DOWN  +  0];
        this.data[this.DOWN  +  0] = this.data[this.RIGHT + 12];
        this.data[this.RIGHT + 12] = corner2;
        // rotate face
        this.rotateFaceClockwise (this.FRONT);
    }

    // =======================================================================

    FPrime () {
        // Rotate slice
        // move top corners
        let corner1 = this.data[this.UP + 12];
        this.data[this.UP    + 12] = this.data[this.RIGHT +  0];
        this.data[this.RIGHT +  0] = this.data[this.DOWN  +  3];
        this.data[this.DOWN  +  3] = this.data[this.LEFT  + 15];
        this.data[this.LEFT  + 15] = corner1;
        // move edge1
        let edge0 = this.data[this.UP + 13];
        this.data[this.UP    + 13] = this.data[this.RIGHT +  4];
        this.data[this.RIGHT +  4] = this.data[this.DOWN  +  2];
        this.data[this.DOWN  +  2] = this.data[this.LEFT  + 11];
        this.data[this.LEFT  + 11] = edge0;
        // move edge1
        let edge1 = this.data[this.UP + 14];
        this.data[this.UP    + 14] = this.data[this.RIGHT +  8];
        this.data[this.RIGHT +  8] = this.data[this.DOWN  +  1];
        this.data[this.DOWN  +  1] = this.data[this.LEFT  +  7];
        this.data[this.LEFT  +  7] = edge1;
        // move bottom corners
        let corner2 = this.data[this.UP + 15];
        this.data[this.UP    + 15] = this.data[this.RIGHT + 12];
        this.data[this.RIGHT + 12] = this.data[this.DOWN  +  0];
        this.data[this.DOWN  +  0] = this.data[this.LEFT  +  3];
        this.data[this.LEFT  +  3] = corner2;
        // rotate face
        this.rotateFaceCounterClockwise (this.FRONT);
    }

    // =======================================================================

    R () {
        // Rotate slice
        // cycle top corners
        let corner0  = this.data[this.DOWN + 3];
        this.data[this.DOWN  +  3] = this.data[this.BACK  + 12];
        this.data[this.BACK  + 12] = this.data[this.UP    +  3];
        this.data[this.UP    +  3] = this.data[this.FRONT +  3];
        this.data[this.FRONT +  3] = corner0 ;
        // cycle top edges
        let edge0  = this.data[this.DOWN + 7];
        this.data[this.DOWN  +  7] = this.data[this.BACK  +  8];
        this.data[this.BACK  +  8] = this.data[this.UP    +  7];
        this.data[this.UP    +  7] = this.data[this.FRONT +  7];
        this.data[this.FRONT +  7] = edge0 ;
        // cycle bottom edges
        let edge1  = this.data[this.DOWN + 11];
        this.data[this.DOWN  + 11] = this.data[this.BACK  +  4];
        this.data[this.BACK  +  4] = this.data[this.UP    + 11];
        this.data[this.UP    + 11] = this.data[this.FRONT + 11];
        this.data[this.FRONT + 11] = edge1 ;
        // cycle bottom corners
        let corner1 = this.data[this.DOWN + 15];
        this.data[this.DOWN  + 15] = this.data[this.BACK  +  0];
        this.data[this.BACK  +  0] = this.data[this.UP    + 15];
        this.data[this.UP    + 15] = this.data[this.FRONT + 15];
        this.data[this.FRONT + 15] = corner1;

        // rotate face clockwise
        this.rotateFaceClockwise (this.RIGHT);
    }

    // =======================================================================

    RPrime () {
        // Rotate slice
        // cycle top corners
        let corner0  = this.data[this.DOWN + 3];
        this.data[this.DOWN  +  3] = this.data[this.FRONT +  3];
        this.data[this.FRONT +  3] = this.data[this.UP    +  3];
        this.data[this.UP    +  3] = this.data[this.BACK  + 12];
        this.data[this.BACK  + 12] = corner0 ;
        // cycle top edges
        let edge0  = this.data[this.DOWN + 7];
        this.data[this.DOWN  +  7] = this.data[this.FRONT +  7];
        this.data[this.FRONT +  7] = this.data[this.UP    +  7];
        this.data[this.UP    +  7] = this.data[this.BACK  +  8];
        this.data[this.BACK  +  8] = edge0 ;
        // cycle bottom edges
        let edge1  = this.data[this.DOWN + 11];
        this.data[this.DOWN  + 11] = this.data[this.FRONT + 11];
        this.data[this.FRONT + 11] = this.data[this.UP    + 11];
        this.data[this.UP    + 11] = this.data[this.BACK  +  4];
        this.data[this.BACK  +  4] = edge1 ;
        // cycle bottom corners
        let corner1 = this.data[this.DOWN + 15];
        this.data[this.DOWN  + 15] = this.data[this.FRONT + 15];
        this.data[this.FRONT + 15] = this.data[this.UP    + 15];
        this.data[this.UP    + 15] = this.data[this.BACK  +  0];
        this.data[this.BACK  +  0] = corner1;

        // rotate face clockwise
        this.rotateFaceCounterClockwise (this.RIGHT);
    }

    // =======================================================================

    // Back face
    // Clockwise (from looking at back face)
    B () {
        // Rotate slice
        // move top corners
        let corner1 = this.data[this.UP +  0];
        this.data[this.UP    +  0] = this.data[this.RIGHT +  3];
        this.data[this.RIGHT +  3] = this.data[this.DOWN  + 15];
        this.data[this.DOWN  + 15] = this.data[this.LEFT  + 12];
        this.data[this.LEFT  + 12] = corner1;
        // move edge1
        let edge0 = this.data[this.UP +  1];
        this.data[this.UP    +  1] = this.data[this.RIGHT +  7];
        this.data[this.RIGHT +  7] = this.data[this.DOWN  + 14];
        this.data[this.DOWN  + 14] = this.data[this.LEFT  +  8];
        this.data[this.LEFT  +  8] = edge0;
        // move edge1
        let edge1 = this.data[this.UP +  2];
        this.data[this.UP    +  2] = this.data[this.RIGHT + 11];
        this.data[this.RIGHT + 11] = this.data[this.DOWN  + 13];
        this.data[this.DOWN  + 13] = this.data[this.LEFT  +  4];
        this.data[this.LEFT  +  4] = edge1;
        // move bottom corners
        let corner2 = this.data[this.UP +  3];
        this.data[this.UP    +  3] = this.data[this.RIGHT + 15];
        this.data[this.RIGHT + 15] = this.data[this.DOWN  + 12];
        this.data[this.DOWN  + 12] = this.data[this.LEFT  +  0];
        this.data[this.LEFT  +  0] = corner2;
        // rotate face
        this.rotateFaceClockwise (this.BACK);
    }

    // =======================================================================

    // Back face
    // Counter-Clockwise (from looking at back face)
    BPrime () {
        // Rotate slice
        // move top corners
        let corner1 = this.data[this.UP +  0];
        this.data[this.UP    +  0] = this.data[this.LEFT  + 12];
        this.data[this.LEFT  + 12] = this.data[this.DOWN  + 15];
        this.data[this.DOWN  + 15] = this.data[this.RIGHT +  3];
        this.data[this.RIGHT +  3] = corner1;
        // move edge1
        let edge0 = this.data[this.UP +  1];
        this.data[this.UP    +  1] = this.data[this.LEFT  +  8];
        this.data[this.LEFT  +  8] = this.data[this.DOWN  + 14];
        this.data[this.DOWN  + 14] = this.data[this.RIGHT +  7];
        this.data[this.RIGHT +  7] = edge0;
        // move edge1
        let edge1 = this.data[this.UP +  2];
        this.data[this.UP    +  2] = this.data[this.LEFT  +  4];
        this.data[this.LEFT  +  4] = this.data[this.DOWN  + 13];
        this.data[this.DOWN  + 13] = this.data[this.RIGHT + 11];
        this.data[this.RIGHT + 11] = edge1;
        // move bottom corners
        let corner2 = this.data[this.UP +  3];
        this.data[this.UP    +  3] = this.data[this.LEFT  +  0];
        this.data[this.LEFT  +  0] = this.data[this.DOWN  + 12];
        this.data[this.DOWN  + 12] = this.data[this.RIGHT + 15];
        this.data[this.RIGHT + 15] = corner2;
        // rotate face
        this.rotateFaceCounterClockwise (this.BACK);
    }

    // =======================================================================

    // Rotate Top face
    // Clockwise (from looking at top face)
    U () {
        // Rotate slice
        // move left corners
        let corner1 = this.data[this.FRONT +  0];
        this.data[this.FRONT +  0] = this.data[this.RIGHT +  0];
        this.data[this.RIGHT +  0] = this.data[this.BACK  +  0];
        this.data[this.BACK  +  0] = this.data[this.LEFT  +  0];
        this.data[this.LEFT  +  0] = corner1;
        // move edge1
        let edge0 = this.data[this.FRONT +  1];
        this.data[this.FRONT +  1] = this.data[this.RIGHT +  1];
        this.data[this.RIGHT +  1] = this.data[this.BACK  +  1];
        this.data[this.BACK  +  1] = this.data[this.LEFT  +  1];
        this.data[this.LEFT  +  1] = edge0;
        // move edge1
        let edge1 = this.data[this.FRONT +  2];
        this.data[this.FRONT +  2] = this.data[this.RIGHT +  2];
        this.data[this.RIGHT +  2] = this.data[this.BACK  +  2];
        this.data[this.BACK  +  2] = this.data[this.LEFT  +  2];
        this.data[this.LEFT  +  2] = edge1;
        // move right corners
        let corner2 = this.data[this.FRONT +  3];
        this.data[this.FRONT +  3] = this.data[this.RIGHT +  3];
        this.data[this.RIGHT +  3] = this.data[this.BACK  +  3];
        this.data[this.BACK  +  3] = this.data[this.LEFT  +  3];
        this.data[this.LEFT  +  3] = corner2;
        // rotate face
        this.rotateFaceClockwise (this.UP);
    }

    // =======================================================================

    UPrime () {
        // Rotate slice
        // move left corners
        let corner1 = this.data[this.FRONT +  0];
        this.data[this.FRONT +  0] = this.data[this.LEFT  +  0];
        this.data[this.LEFT  +  0] = this.data[this.BACK  +  0];
        this.data[this.BACK  +  0] = this.data[this.RIGHT +  0];
        this.data[this.RIGHT +  0] = corner1;
        // move edge1
        let edge0 = this.data[this.FRONT +  1];
        this.data[this.FRONT +  1] = this.data[this.LEFT  +  1];
        this.data[this.LEFT  +  1] = this.data[this.BACK  +  1];
        this.data[this.BACK  +  1] = this.data[this.RIGHT +  1];
        this.data[this.RIGHT +  1] = edge0;
        // move edge1
        let edge1 = this.data[this.FRONT +  2];
        this.data[this.FRONT +  2] = this.data[this.LEFT  +  2];
        this.data[this.LEFT  +  2] = this.data[this.BACK  +  2];
        this.data[this.BACK  +  2] = this.data[this.RIGHT +  2];
        this.data[this.RIGHT +  2] = edge1;
        // move right corners
        let corner2 = this.data[this.FRONT +  3];
        this.data[this.FRONT +  3] = this.data[this.LEFT  +  3];
        this.data[this.LEFT  +  3] = this.data[this.BACK  +  3];
        this.data[this.BACK  +  3] = this.data[this.RIGHT +  3];
        this.data[this.RIGHT +  3] = corner2;
        // rotate face
        this.rotateFaceCounterClockwise (this.UP);
    }

    // =======================================================================

    // Rotate bottom (DOWN) face
    // Clockwise (from looking at bottom face)
    D () {
        // Rotate slice
        // move left corners
        let corner1 = this.data[this.FRONT + 12];
        this.data[this.FRONT + 12] = this.data[this.LEFT  + 12];
        this.data[this.LEFT  + 12] = this.data[this.BACK  + 12];
        this.data[this.BACK  + 12] = this.data[this.RIGHT + 12];
        this.data[this.RIGHT + 12] = corner1;
        // move edge1
        let edge0 = this.data[this.FRONT + 13];
        this.data[this.FRONT + 13] = this.data[this.LEFT  + 13];
        this.data[this.LEFT  + 13] = this.data[this.BACK  + 13];
        this.data[this.BACK  + 13] = this.data[this.RIGHT + 13];
        this.data[this.RIGHT + 13] = edge0;
        // move edge1
        let edge1 = this.data[this.FRONT + 14];
        this.data[this.FRONT +  14] = this.data[this.LEFT  +  14];
        this.data[this.LEFT  +  14] = this.data[this.BACK  +  14];
        this.data[this.BACK  +  14] = this.data[this.RIGHT +  14];
        this.data[this.RIGHT +  14] = edge1;
        // move right corners
        let corner2 = this.data[this.FRONT + 15];
        this.data[this.FRONT + 15] = this.data[this.LEFT  + 15];
        this.data[this.LEFT  + 15] = this.data[this.BACK  + 15];
        this.data[this.BACK  + 15] = this.data[this.RIGHT + 15];
        this.data[this.RIGHT + 15] = corner2;
        // rotate face
        this.rotateFaceClockwise (this.DOWN);
    }

    // =======================================================================

    // Rotate bottom (DOWN) face
    // Counter-Clockwise (from looking at bottom face)
    DPrime () {
        // Rotate slice
        // move left corners
        let corner1 = this.data[this.FRONT + 12];
        this.data[this.FRONT + 12] = this.data[this.RIGHT + 12];
        this.data[this.RIGHT + 12] = this.data[this.BACK   + 12];
        this.data[this.BACK  + 12] = this.data[this.LEFT   + 12];
        this.data[this.LEFT  + 12] = corner1;
        // move edge1
        let edge0 = this.data[this.FRONT + 13];
        this.data[this.FRONT + 13] = this.data[this.RIGHT + 13];
        this.data[this.RIGHT + 13] = this.data[this.BACK  + 13];
        this.data[this.BACK  + 13] = this.data[this.LEFT  + 13];
        this.data[this.LEFT  + 13] = edge0;
        // move edge1
        let edge1 = this.data[this.FRONT + 14];
        this.data[this.FRONT +  14] = this.data[this.RIGHT +  14];
        this.data[this.RIGHT +  14] = this.data[this.BACK  +  14];
        this.data[this.BACK  +  14] = this.data[this.LEFT  +  14];
        this.data[this.LEFT  +  14] = edge1;
        // move right corners
        let corner2 = this.data[this.FRONT + 15];
        this.data[this.FRONT + 15] = this.data[this.RIGHT + 15];
        this.data[this.RIGHT + 15] = this.data[this.BACK  + 15];
        this.data[this.BACK  + 15] = this.data[this.LEFT  + 15];
        this.data[this.LEFT  + 15] = corner2;
        // rotate face
        this.rotateFaceCounterClockwise (this.DOWN);
    }

    // =======================================================================
    // MOVES : MIDDLE SLICES
    // =======================================================================

    // Rotate middle left slice
    // Clockwise (facing left face)
    l ()
    {
        // Rotate slice
        // cycle top left corners
        let down_0  = this.data[this.DOWN + 1];
        this.data[this.DOWN  +  1] = this.data[this.FRONT +  1];
        this.data[this.FRONT +  1] = this.data[this.UP    +  1];
        this.data[this.UP    +  1] = this.data[this.BACK  + 14];
        this.data[this.BACK  + 14] = down_0 ;
        // cycle top edges
        let down_4  = this.data[this.DOWN + 5];
        this.data[this.DOWN  +  5] = this.data[this.FRONT +  5];
        this.data[this.FRONT +  5] = this.data[this.UP    +  5];
        this.data[this.UP    +  5] = this.data[this.BACK  + 10];
        this.data[this.BACK  + 10] = down_4 ;
        // cycle bottom edges
        let down_8  = this.data[this.DOWN + 9];
        this.data[this.DOWN  +  9] = this.data[this.FRONT +  9];
        this.data[this.FRONT +  9] = this.data[this.UP    +  9];
        this.data[this.UP    +  9] = this.data[this.BACK  +  6];
        this.data[this.BACK  +  6] = down_8 ;
        // cycle bottom corners
        let down_12 = this.data[this.DOWN + 13];
        this.data[this.DOWN  + 13] = this.data[this.FRONT + 13];
        this.data[this.FRONT + 13] = this.data[this.UP    + 13];
        this.data[this.UP    + 13] = this.data[this.BACK  +  2];
        this.data[this.BACK  +  2] = down_12;

        // no face to rotate
    }

    // =======================================================================
    
    lPrime ()
    {
        // Rotate slice
        // cycle top left corners
        let down_0  = this.data[this.DOWN + 1];
        this.data[this.DOWN  +  1] = this.data[this.BACK  + 14];
        this.data[this.BACK  + 14] = this.data[this.UP    +  1];
        this.data[this.UP    +  1] = this.data[this.FRONT +  1];
        this.data[this.FRONT +  1] = down_0 ;
        // cycle top edges
        let down_4  = this.data[this.DOWN + 5];
        this.data[this.DOWN  +  5] = this.data[this.BACK  + 10];
        this.data[this.BACK  + 10] = this.data[this.UP    +  5];
        this.data[this.UP    +  5] = this.data[this.FRONT +  5];
        this.data[this.FRONT +  5] = down_4 ;
        // cycle bottom edges
        let down_8  = this.data[this.DOWN + 9];
        this.data[this.DOWN  +  9] = this.data[this.BACK  +  6];
        this.data[this.BACK  +  6] = this.data[this.UP    +  9];
        this.data[this.UP    +  9] = this.data[this.FRONT +  9];
        this.data[this.FRONT +  9] = down_8 ;
        // cycle bottom corners
        let down_12 = this.data[this.DOWN + 13];
        this.data[this.DOWN  + 13] = this.data[this.BACK  +  2];
        this.data[this.BACK  +  2] = this.data[this.UP    + 13];
        this.data[this.UP    + 13] = this.data[this.FRONT + 13];
        this.data[this.FRONT + 13] = down_12;
        // no face to rotate
    }

    // =======================================================================
    
    f ()
    {
        // Rotate slice
        // move top corners
        let corner1 = this.data[this.UP +  8];
        this.data[this.UP    +  8] = this.data[this.LEFT  + 14];
        this.data[this.LEFT  + 14] = this.data[this.DOWN  +  7];
        this.data[this.DOWN  +  7] = this.data[this.RIGHT +  1];
        this.data[this.RIGHT +  1] = corner1;
        // move edge1
        let edge0 = this.data[this.UP +  9];
        this.data[this.UP    +  9] = this.data[this.LEFT  + 10];
        this.data[this.LEFT  + 10] = this.data[this.DOWN  +  6];
        this.data[this.DOWN  +  6] = this.data[this.RIGHT +  5];
        this.data[this.RIGHT +  5] = edge0;
        // move edge1
        let edge1 = this.data[this.UP + 10];
        this.data[this.UP    + 10] = this.data[this.LEFT  +  6];
        this.data[this.LEFT  +  6] = this.data[this.DOWN  +  5];
        this.data[this.DOWN  +  5] = this.data[this.RIGHT +  9];
        this.data[this.RIGHT +  9] = edge1;
        // move bottom corners
        let corner2 = this.data[this.UP + 11];
        this.data[this.UP    + 11] = this.data[this.LEFT  +  2];
        this.data[this.LEFT  +  2] = this.data[this.DOWN  +  4];
        this.data[this.DOWN  +  4] = this.data[this.RIGHT + 13];
        this.data[this.RIGHT + 13] = corner2;
        // no face to rotate
    }

    // =======================================================================
    
    fPrime ()
    {
        // Rotate slice
        // move top corners
        let corner1 = this.data[this.UP +  8];
        this.data[this.UP    +  8] = this.data[this.RIGHT +  1];
        this.data[this.RIGHT +  1] = this.data[this.DOWN  +  7];
        this.data[this.DOWN  +  7] = this.data[this.LEFT  + 14];
        this.data[this.LEFT  + 14] = corner1;
        // move edge1
        let edge0 = this.data[this.UP +  9];
        this.data[this.UP    +  9] = this.data[this.RIGHT +  5];
        this.data[this.RIGHT +  5] = this.data[this.DOWN  +  6];
        this.data[this.DOWN  +  6] = this.data[this.LEFT  + 10];
        this.data[this.LEFT  + 10] = edge0;
        // move edge1
        let edge1 = this.data[this.UP + 10];
        this.data[this.UP    + 10] = this.data[this.RIGHT +  9];
        this.data[this.RIGHT +  9] = this.data[this.DOWN  +  5];
        this.data[this.DOWN  +  5] = this.data[this.LEFT  +  6];
        this.data[this.LEFT  +  6] = edge1;
        // move bottom corners
        let corner2 = this.data[this.UP + 11];
        this.data[this.UP    + 11] = this.data[this.RIGHT + 13];
        this.data[this.RIGHT + 13] = this.data[this.DOWN  +  4];
        this.data[this.DOWN  +  4] = this.data[this.LEFT  +  2];
        this.data[this.LEFT  +  2] = corner2;
        // no face to rotate
    }

    // =======================================================================
    
    r ()
    {
        // Rotate slice
        // cycle top corners
        let corner0  = this.data[this.DOWN + 2];
        this.data[this.DOWN  +  2] = this.data[this.BACK  + 13];
        this.data[this.BACK  + 13] = this.data[this.UP    +  2];
        this.data[this.UP    +  2] = this.data[this.FRONT +  2];
        this.data[this.FRONT +  2] = corner0 ;
        // cycle top edges
        let edge0  = this.data[this.DOWN + 6];
        this.data[this.DOWN  +  6] = this.data[this.BACK  +  9];
        this.data[this.BACK  +  9] = this.data[this.UP    +  6];
        this.data[this.UP    +  6] = this.data[this.FRONT +  6];
        this.data[this.FRONT +  6] = edge0 ;
        // cycle bottom edges
        let edge1  = this.data[this.DOWN + 10];
        this.data[this.DOWN  + 10] = this.data[this.BACK  +  5];
        this.data[this.BACK  +  5] = this.data[this.UP    + 10];
        this.data[this.UP    + 10] = this.data[this.FRONT + 10];
        this.data[this.FRONT + 10] = edge1 ;
        // cycle bottom corners
        let corner1 = this.data[this.DOWN + 14];
        this.data[this.DOWN  + 14] = this.data[this.BACK  +  1];
        this.data[this.BACK  +  1] = this.data[this.UP    + 14];
        this.data[this.UP    + 14] = this.data[this.FRONT + 14];
        this.data[this.FRONT + 14] = corner1;
        // no face to rotate
    }

    // =======================================================================
    
    rPrime ()
    {
        // Rotate slice
        // cycle top corners
        let corner0  = this.data[this.DOWN + 2];
        this.data[this.DOWN  +  2] = this.data[this.FRONT +  2];
        this.data[this.FRONT +  2] = this.data[this.UP    +  2];
        this.data[this.UP    +  2] = this.data[this.BACK  + 13];
        this.data[this.BACK  + 13] = corner0 ;
        // cycle top edges
        let edge0  = this.data[this.DOWN + 6];
        this.data[this.DOWN  +  6] = this.data[this.FRONT +  6];
        this.data[this.FRONT +  6] = this.data[this.UP    +  6];
        this.data[this.UP    +  6] = this.data[this.BACK  +  9];
        this.data[this.BACK  +  9] = edge0 ;
        // cycle bottom edges
        let edge1  = this.data[this.DOWN + 10];
        this.data[this.DOWN  + 10] = this.data[this.FRONT + 10];
        this.data[this.FRONT + 10] = this.data[this.UP    + 10];
        this.data[this.UP    + 10] = this.data[this.BACK  +  5];
        this.data[this.BACK  +  5] = edge1 ;
        // cycle bottom corners
        let corner1 = this.data[this.DOWN + 14];
        this.data[this.DOWN  + 14] = this.data[this.FRONT + 14];
        this.data[this.FRONT + 14] = this.data[this.UP    + 14];
        this.data[this.UP    + 14] = this.data[this.BACK  +  1];
        this.data[this.BACK  +  1] = corner1;
        // no face to rotate
    }

    // =======================================================================
    
    b ()
    {
        // Rotate slice
        // move top corners
        let corner1 = this.data[this.UP +  4];
        this.data[this.UP    +  4] = this.data[this.RIGHT +  2];
        this.data[this.RIGHT +  2] = this.data[this.DOWN  + 11];
        this.data[this.DOWN  + 11] = this.data[this.LEFT  + 13];
        this.data[this.LEFT  + 13] = corner1;
        // move edge1
        let edge0 = this.data[this.UP +  5];
        this.data[this.UP    +  5] = this.data[this.RIGHT +  6];
        this.data[this.RIGHT +  6] = this.data[this.DOWN  + 10];
        this.data[this.DOWN  + 10] = this.data[this.LEFT  +  9];
        this.data[this.LEFT  +  9] = edge0;
        // move edge1
        let edge1 = this.data[this.UP +  6];
        this.data[this.UP    +  6] = this.data[this.RIGHT + 10];
        this.data[this.RIGHT + 10] = this.data[this.DOWN  +  9];
        this.data[this.DOWN  +  9] = this.data[this.LEFT  +  5];
        this.data[this.LEFT  +  5] = edge1;
        // move bottom corners
        let corner2 = this.data[this.UP +  7];
        this.data[this.UP    +  7] = this.data[this.RIGHT + 14];
        this.data[this.RIGHT + 14] = this.data[this.DOWN  +  8];
        this.data[this.DOWN  +  8] = this.data[this.LEFT  +  1];
        this.data[this.LEFT  +  1] = corner2;
        // no face to rotate
    }

    // =======================================================================
    
    bPrime ()
    {
        // Rotate slice
        // move top corners
        let corner1 = this.data[this.UP +  4];
        this.data[this.UP    +  4] = this.data[this.LEFT  + 13];
        this.data[this.LEFT  + 13] = this.data[this.DOWN  + 11];
        this.data[this.DOWN  + 11] = this.data[this.RIGHT +  2];
        this.data[this.RIGHT +  2] = corner1;
        // move edge1
        let edge0 = this.data[this.UP +  5];
        this.data[this.UP    +  5] = this.data[this.LEFT  +  9];
        this.data[this.LEFT  +  9] = this.data[this.DOWN  + 10];
        this.data[this.DOWN  + 10] = this.data[this.RIGHT +  6];
        this.data[this.RIGHT +  6] = edge0;
        // move edge1
        let edge1 = this.data[this.UP +  6];
        this.data[this.UP    +  6] = this.data[this.LEFT  +  5];
        this.data[this.LEFT  +  5] = this.data[this.DOWN  +  9];
        this.data[this.DOWN  +  9] = this.data[this.RIGHT + 10];
        this.data[this.RIGHT + 10] = edge1;
        // move bottom corners
        let corner2 = this.data[this.UP +  7];
        this.data[this.UP    +  7] = this.data[this.LEFT  +  1];
        this.data[this.LEFT  +  1] = this.data[this.DOWN  +  8];
        this.data[this.DOWN  +  8] = this.data[this.RIGHT + 14];
        this.data[this.RIGHT + 14] = corner2;
        // no face to rotate
    }

    // =======================================================================
    
    u ()
    {
        // Rotate slice
        // move left corners
        let corner1 = this.data[this.FRONT +  4];
        this.data[this.FRONT +  4] = this.data[this.RIGHT +  4];
        this.data[this.RIGHT +  4] = this.data[this.BACK  +  4];
        this.data[this.BACK  +  4] = this.data[this.LEFT  +  4];
        this.data[this.LEFT  +  4] = corner1;
        // move edge1
        let edge0 = this.data[this.FRONT +  5];
        this.data[this.FRONT +  5] = this.data[this.RIGHT +  5];
        this.data[this.RIGHT +  5] = this.data[this.BACK  +  5];
        this.data[this.BACK  +  5] = this.data[this.LEFT  +  5];
        this.data[this.LEFT  +  5] = edge0;
        // move edge1
        let edge1 = this.data[this.FRONT +  6];
        this.data[this.FRONT +  6] = this.data[this.RIGHT +  6];
        this.data[this.RIGHT +  6] = this.data[this.BACK  +  6];
        this.data[this.BACK  +  6] = this.data[this.LEFT  +  6];
        this.data[this.LEFT  +  6] = edge1;
        // move right corners
        let corner2 = this.data[this.FRONT +  7];
        this.data[this.FRONT +  7] = this.data[this.RIGHT +  7];
        this.data[this.RIGHT +  7] = this.data[this.BACK  +  7];
        this.data[this.BACK  +  7] = this.data[this.LEFT  +  7];
        this.data[this.LEFT  +  7] = corner2;
        // no face to rotate
    }

    // =======================================================================
    
    uPrime ()
    {
        // Rotate slice
        // move left corners
        let corner1 = this.data[this.FRONT +  4];
        this.data[this.FRONT +  4] = this.data[this.LEFT  +  4];
        this.data[this.LEFT  +  4] = this.data[this.BACK  +  4];
        this.data[this.BACK  +  4] = this.data[this.RIGHT +  4];
        this.data[this.RIGHT +  4] = corner1;
        // move edge1
        let edge0 = this.data[this.FRONT +  5];
        this.data[this.FRONT +  5] = this.data[this.LEFT  +  5];
        this.data[this.LEFT  +  5] = this.data[this.BACK  +  5];
        this.data[this.BACK  +  5] = this.data[this.RIGHT +  5];
        this.data[this.RIGHT +  5] = edge0;
        // move edge1
        let edge1 = this.data[this.FRONT +  6];
        this.data[this.FRONT +  6] = this.data[this.LEFT  +  6];
        this.data[this.LEFT  +  6] = this.data[this.BACK  +  6];
        this.data[this.BACK  +  6] = this.data[this.RIGHT +  6];
        this.data[this.RIGHT +  6] = edge1;
        // move right corners
        let corner2 = this.data[this.FRONT +  7];
        this.data[this.FRONT +  7] = this.data[this.LEFT  +  7];
        this.data[this.LEFT  +  7] = this.data[this.BACK  +  7];
        this.data[this.BACK  +  7] = this.data[this.RIGHT +  7];
        this.data[this.RIGHT +  7] = corner2;
        // no face to rotate
    }

    // =======================================================================
    
    d ()
    {
        // Rotate slice
        // move left corners
        let corner1 = this.data[this.FRONT +  8];
        this.data[this.FRONT +  8] = this.data[this.LEFT  +  8];
        this.data[this.LEFT  +  8] = this.data[this.BACK  +  8];
        this.data[this.BACK  +  8] = this.data[this.RIGHT +  8];
        this.data[this.RIGHT +  8] = corner1;
        // move edge1
        let edge0 = this.data[this.FRONT +  9];
        this.data[this.FRONT +  9] = this.data[this.LEFT  +  9];
        this.data[this.LEFT  +  9] = this.data[this.BACK  +  9];
        this.data[this.BACK  +  9] = this.data[this.RIGHT +  9];
        this.data[this.RIGHT +  9] = edge0;
        // move edge1
        let edge1 = this.data[this.FRONT + 10];
        this.data[this.FRONT + 10] = this.data[this.LEFT  + 10];
        this.data[this.LEFT  + 10] = this.data[this.BACK  + 10];
        this.data[this.BACK  + 10] = this.data[this.RIGHT + 10];
        this.data[this.RIGHT + 10] = edge1;
        // move right corners
        let corner2 = this.data[this.FRONT + 11];
        this.data[this.FRONT + 11] = this.data[this.LEFT  + 11];
        this.data[this.LEFT  + 11] = this.data[this.BACK  + 11];
        this.data[this.BACK  + 11] = this.data[this.RIGHT + 11];
        this.data[this.RIGHT + 11] = corner2;
        // no face to rotate
    }

    // =======================================================================
    
    dPrime ()
    {
        // Rotate slice
        // move left corners
        let corner1 = this.data[this.FRONT +  8];
        this.data[this.FRONT +  8] = this.data[this.RIGHT +  8];
        this.data[this.RIGHT +  8] = this.data[this.BACK  +  8];
        this.data[this.BACK  +  8] = this.data[this.LEFT  +  8];
        this.data[this.LEFT  +  8] = corner1;
        // move edge1
        let edge0 = this.data[this.FRONT +  9];
        this.data[this.FRONT +  9] = this.data[this.RIGHT +  9];
        this.data[this.RIGHT +  9] = this.data[this.BACK  +  9];
        this.data[this.BACK  +  9] = this.data[this.LEFT  +  9];
        this.data[this.LEFT  +  9] = edge0;
        // move edge1
        let edge1 = this.data[this.FRONT + 10];
        this.data[this.FRONT + 10] = this.data[this.RIGHT + 10];
        this.data[this.RIGHT + 10] = this.data[this.BACK  + 10];
        this.data[this.BACK  + 10] = this.data[this.LEFT  + 10];
        this.data[this.LEFT  + 10] = edge1;
        // move right corners
        let corner2 = this.data[this.FRONT + 11];
        this.data[this.FRONT + 11] = this.data[this.RIGHT + 11];
        this.data[this.RIGHT + 11] = this.data[this.BACK  + 11];
        this.data[this.BACK  + 11] = this.data[this.LEFT  + 11];
        this.data[this.LEFT  + 11] = corner2;
        // no face to rotate
    }

    // =======================================================================
    // MOVES : CUBE ROTATIONS
    // =======================================================================
    
    X () {
        // we can use other moves to achieve this
        this.LPrime ();
        this.lPrime ();
        this.r ();
        this.R ();
    }

    // =======================================================================

    XPrime () {
        // we can use other moves to achieve this
        this.L ();
        this.l ();
        this.rPrime ();
        this.RPrime ();
    }

    // =======================================================================

    Y () {
        // we can use other moves to achieve this
        this.U ();
        this.u ();
        this.dPrime ();
        this.DPrime ();
    }

    // =======================================================================

    YPrime () {
        // we can use other moves to achieve this
        this.UPrime ();
        this.uPrime ();
        this.d ();
        this.D ();
    }

    // =======================================================================

    Z () {
        // we can use other moves to achieve this
        this.F ();
        this.f ();
        this.bPrime ();
        this.BPrime ();
    }

    // =======================================================================

    ZPrime () {
        // we can use other moves to achieve this
        this.FPrime ();
        this.fPrime ();
        this.b ();
        this.B ();
    }

    // =======================================================================
    // VISUALS
    // =======================================================================

    update ()
    {
        // do nothing for now
    }

    // =======================================================================

    // Performs the given move on the rubiks cube
    // in contrast with move(move), this animates the rubiks cube to turn
    // the layer associated with the move and will update the actual cube state
    // when the animation has finished.
    animatedMove (move)
    {
        // TODO: IMPLEMENT
        // just does normal move for now
        this.move (move);
    }

    // =======================================================================

    // Draws 3D representation of the rubiks cube to the current graphics
    // Generalized for any cube size
    draw3DCube ()
    {
        // Rotate the whole cube so we can see more than one side initially
        graphics.rotateX (-30);
        graphics.rotateY (-45);

        let cubieSize = min(graphics.width, graphics.height) / 10;
        let cubeSize = cubieSize * this.dim;
        let halfCubeSize = cubeSize * 0.5;
        // draw each face
        // left
        graphics.translate (-halfCubeSize, 0, 0);
        graphics.rotateY (-90);
        this.drawFace3D (cubieSize, this.LEFT);
        graphics.rotateY ( 90);
        graphics.translate ( halfCubeSize, 0, 0);
        // front
        graphics.translate (0, 0,  halfCubeSize);
        this.drawFace3D (cubieSize, this.FRONT);
        graphics.translate (0, 0, -halfCubeSize);
        // right
        graphics.translate ( halfCubeSize, 0, 0);
        graphics.rotateY ( 90);
        this.drawFace3D (cubieSize, this.RIGHT);
        graphics.rotateY (-90);
        graphics.translate (-halfCubeSize, 0, 0);
        // back
        graphics.translate (0, 0, -halfCubeSize);
        graphics.rotateY ( 180);
        this.drawFace3D (cubieSize, this.BACK);
        graphics.rotateY (-180);
        graphics.translate (0, 0,  halfCubeSize);
        // up
        graphics.translate (0, -halfCubeSize, 0);
        graphics.rotateX ( 90);
        this.drawFace3D (cubieSize, this.UP);
        graphics.rotateX (-90);
        graphics.translate (0,  halfCubeSize, 0);
        // down
        graphics.translate (0,  halfCubeSize, 0);
        graphics.rotateX (-90);
        this.drawFace3D (cubieSize, this.DOWN);
        graphics.rotateX ( 90);
        graphics.translate (0, -halfCubeSize, 0);
    }

    // =======================================================================

    // draws each sticker for a given face
    // Generalized for any cube size
    drawFace3D (cubieFaceSize, elemOffset) {
        let stickerSize = cubieFaceSize - 5;
        graphics.noStroke ();

        // move to top left cubie position
        // so that we can easily iterate over cubie rows and cols
        let num_cubies_from_center_to_edge = this.dim / 2 - 0.5;
        let dist_cube_center_to_outermost_cubie = num_cubies_from_center_to_edge * cubieFaceSize;
        graphics.translate (-dist_cube_center_to_outermost_cubie, -dist_cube_center_to_outermost_cubie, 0);

        for (let i = 0; i < this.dim; ++i)
        {
            for (let j = 0; j < this.dim; ++j)
            {
                this.drawCubieFace (j * cubieFaceSize, i * cubieFaceSize, cubieFaceSize, stickerSize, elemOffset + (i * this.dim + j));
            }
        }

        // undo the translation to top left cubie
        graphics.translate (dist_cube_center_to_outermost_cubie, dist_cube_center_to_outermost_cubie, 0);
    }

    // =======================================================================

    // Draws a single face of a cubie and the sticker for that face
    // Generalized for any cube size
    drawCubieFace (x, y, cubieFaceSize, stickerSize, stickerElement)
    {
        // move to cubie position
        graphics.translate (x, y, 0);
        // draw cubie
        let cubieColor = "black";
        graphics.fill (cubieColor);
        graphics.plane (cubieFaceSize);
        // draw sticker on cubie
        graphics.translate (0, 0,  0.1);
        graphics.fill (this.getColor(this.data[stickerElement]));
        graphics.plane (stickerSize);
        graphics.translate (0, 0, -0.1);
        // undo moving to cubie position
        graphics.translate (-x, -y, 0);
    }

    // =======================================================================

    // Draws rubiks cube 2D minimap representation that shows all sides
    // of the cube.
    // Generalized for any cube size
    drawMinimap () {
        // Draw minimap
        let stickerSize = min (width, height) / this.minimapSizeFactor;
        let faceSize = stickerSize * this.dim;
        let startX = stickerSize;
        let startY = faceSize + stickerSize;
        strokeWeight (1);
        stroke ('black');

        // draw each face
        // left
        this.drawMinimapFace (startX, startY, stickerSize, this.LEFT);
        // front
        this.drawMinimapFace (startX + faceSize, startY, stickerSize, this.FRONT);
        // right
        this.drawMinimapFace (startX + faceSize * 2, startY, stickerSize, this.RIGHT);
        // back
        this.drawMinimapFace (startX + faceSize * 3, startY, stickerSize, this.BACK);
        // up
        this.drawMinimapFace (startX + faceSize, startY - faceSize, stickerSize, this.UP);
        // down
        this.drawMinimapFace (startX + faceSize, startY + faceSize, stickerSize, this.DOWN);
    }

    // =======================================================================

    // Draws each sticker associated with a face of the cube for the minimap
    // Generalized for any cube size
    drawMinimapFace (startX, startY, stickerSize, elemOffset) {
        for (let i = 0; i < this.dim; ++i)
        {
            for (let j = 0; j < this.dim; ++j)
            {
                fill (this.getColor (this.data[elemOffset + (i * this.dim + j)]));
                square (startX + (j * stickerSize), startY + (i * stickerSize), stickerSize);
            }
        }
    }

    // =======================================================================

    // returns a p5.js color for the given color enum
    getColor (colorId) {
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

    // converts move to string representation
    intToMoveString (move) {
        // Outer slice moves
        if (move == this.MOVE_L)      return "L";
        if (move == this.MOVE_LPRIME) return "L'";
        if (move == this.MOVE_F)      return "F";
        if (move == this.MOVE_FPRIME) return "F'";
        if (move == this.MOVE_R)      return "R";
        if (move == this.MOVE_RPRIME) return "R'";
        if (move == this.MOVE_B)      return "B";
        if (move == this.MOVE_BPRIME) return "B'";
        if (move == this.MOVE_U)      return "U";
        if (move == this.MOVE_UPRIME) return "U'";
        if (move == this.MOVE_D)      return "D";
        if (move == this.MOVE_DPRIME) return "D'";
        // Middle slice moves
        if (move == this.MOVE_l)      return "l";
        if (move == this.MOVE_lPRIME) return "l'";
        if (move == this.MOVE_f)      return "f";
        if (move == this.MOVE_fPRIME) return "f'";
        if (move == this.MOVE_r)      return "r";
        if (move == this.MOVE_rPRIME) return "r'";
        if (move == this.MOVE_b)      return "b";
        if (move == this.MOVE_bPRIME) return "b'";
        if (move == this.MOVE_u)      return "u";
        if (move == this.MOVE_uPRIME) return "u'";
        if (move == this.MOVE_d)      return "d";
        if (move == this.MOVE_dPRIME) return "d'";
        // Cube rotations
        if (move == this.MOVE_X)      return "X";
        if (move == this.MOVE_XPRIME) return "X'";
        if (move == this.MOVE_Y)      return "Y";
        if (move == this.MOVE_YPRIME) return "Y'";
        if (move == this.MOVE_Z)      return "Z";
        if (move == this.MOVE_ZPRIME) return "Z'";
    }
}