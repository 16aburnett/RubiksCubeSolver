/*
    Rubiks Cube 3x3x3 Representation
    By Amy Burnett
    January 2 2020
*/

// =======================================================================

// =======================================================================

class RubiksCube3 {

    constructor() {
        this.reset ();
        // Face Offsets
        this.dim = 3;
        this.LEFT   = 0 * this.dim * this.dim; // 0
        this.FRONT  = 1 * this.dim * this.dim; // 9
        this.RIGHT  = 2 * this.dim * this.dim; // 18
        this.BACK   = 3 * this.dim * this.dim; // 27
        this.UP     = 4 * this.dim * this.dim; // 36
        this.DOWN   = 5 * this.dim * this.dim; // 45
        // Moves
        // Outer slice moves
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
        this.MOVE_M          = 12;
        this.MOVE_MPRIME     = 13;
        this.MOVE_E          = 14;
        this.MOVE_EPRIME     = 15;
        this.MOVE_S          = 16;
        this.MOVE_SPRIME     = 17;
        // Cube rotation moves
        this.MOVE_X          = 18;
        this.MOVE_XPRIME     = 19;
        this.MOVE_Y          = 20;
        this.MOVE_YPRIME     = 21;
        this.MOVE_Z          = 22;
        this.MOVE_ZPRIME     = 23;
        this.NUM_VALID_MOVES = 24;
        // drawing
        this.stickerSize = window.innerWidth / 35;
        this.faceSize = this.stickerSize * this.dim;
    }
    
    // =======================================================================

    isSolved() {
        let solution = [
            // left
            ORANGE, ORANGE, ORANGE,
            ORANGE, ORANGE, ORANGE,
            ORANGE, ORANGE, ORANGE,
            // front
            BLUE, BLUE, BLUE,
            BLUE, BLUE, BLUE,
            BLUE, BLUE, BLUE,
            // right
            RED, RED, RED,
            RED, RED, RED,
            RED, RED, RED,
            // back
            GREEN, GREEN, GREEN, 
            GREEN, GREEN, GREEN,
            GREEN, GREEN, GREEN, 
            // up
            YELLOW, YELLOW, YELLOW, 
            YELLOW, YELLOW, YELLOW, 
            YELLOW, YELLOW, YELLOW, 
            // down
            WHITE, WHITE, WHITE,
            WHITE, WHITE, WHITE,
            WHITE, WHITE, WHITE
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
            ORANGE, ORANGE, ORANGE,
            ORANGE, ORANGE, ORANGE,
            ORANGE, ORANGE, ORANGE,
            // front
            BLUE, BLUE, BLUE,
            BLUE, BLUE, BLUE,
            BLUE, BLUE, BLUE,
            // right
            RED, RED, RED,
            RED, RED, RED,
            RED, RED, RED,
            // back
            GREEN, GREEN, GREEN, 
            GREEN, GREEN, GREEN,
            GREEN, GREEN, GREEN, 
            // up
            YELLOW, YELLOW, YELLOW, 
            YELLOW, YELLOW, YELLOW, 
            YELLOW, YELLOW, YELLOW, 
            // down
            WHITE, WHITE, WHITE,
            WHITE, WHITE, WHITE,
            WHITE, WHITE, WHITE
        ];
    }

    // =======================================================================
    // Moves

    move (move) {
        // Outer slice moves
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
        if (move == this.MOVE_M) this.M();
        if (move == this.MOVE_MPRIME) this.MPrime();
        if (move == this.MOVE_E) this.E();
        if (move == this.MOVE_EPRIME) this.EPrime();
        if (move == this.MOVE_S) this.S();
        if (move == this.MOVE_SPRIME) this.SPrime();
        // Cube rotations
        if (move == this.MOVE_X) this.X();
        if (move == this.MOVE_XPRIME) this.XPrime();
        if (move == this.MOVE_Y) this.Y();
        if (move == this.MOVE_YPRIME) this.YPrime();
        if (move == this.MOVE_Z) this.Z();
        if (move == this.MOVE_ZPRIME) this.ZPrime();
    }

    // =======================================================================
    // MOVES : OUTER SLICES
    // =======================================================================

    L () {
        // save last slice
        let cornerhigh = this.data[this.DOWN];
        let edge = this.data[this.DOWN + 3];
        let cornerlow = this.data[this.DOWN + 6];
        // move bottom corners
        this.data[this.DOWN + 6] = this.data[this.FRONT + 6];
        this.data[this.FRONT + 6] = this.data[this.UP + 6];
        this.data[this.UP + 6] = this.data[this.BACK + 2];
        this.data[this.BACK + 2] = cornerlow;
        // move edges 
        this.data[this.DOWN + 3] = this.data[this.FRONT + 3];
        this.data[this.FRONT + 3] = this.data[this.UP + 3];
        this.data[this.UP + 3] = this.data[this.BACK + 5]; 
        this.data[this.BACK + 5] = edge; 
        // move top corners
        this.data[this.DOWN] = this.data[this.FRONT];
        this.data[this.FRONT] = this.data[this.UP];
        this.data[this.UP] = this.data[this.BACK + 8];
        this.data[this.BACK + 8] = cornerhigh;
        // rotate face
        edge = this.data[this.LEFT + 3];
        let corner = this.data[this.LEFT + 6];
        this.data[this.LEFT + 3] = this.data[this.LEFT + 7];
        this.data[this.LEFT + 7] = this.data[this.LEFT + 5];
        this.data[this.LEFT + 5] = this.data[this.LEFT + 1];
        this.data[this.LEFT + 1] = edge;
        this.data[this.LEFT + 6] = this.data[this.LEFT + 8];
        this.data[this.LEFT + 8] = this.data[this.LEFT + 2];
        this.data[this.LEFT + 2] = this.data[this.LEFT];
        this.data[this.LEFT] = corner;
    }

    // =======================================================================

    LPrime () {
        // save last slice
        let cornerhigh = this.data[this.DOWN];
        let edge = this.data[this.DOWN + 3];
        let cornerlow = this.data[this.DOWN + 6];
        // move bottom corners
        this.data[this.DOWN + 6] = this.data[this.BACK + 2];
        this.data[this.BACK + 2] = this.data[this.UP + 6];
        this.data[this.UP + 6] = this.data[this.FRONT + 6];
        this.data[this.FRONT + 6] = cornerlow;
        // move edges 
        this.data[this.DOWN + 3] = this.data[this.BACK + 5];
        this.data[this.BACK + 5] = this.data[this.UP + 3];
        this.data[this.UP + 3] = this.data[this.FRONT + 3]; 
        this.data[this.FRONT + 3] = edge; 
        // move top corners
        this.data[this.DOWN] = this.data[this.BACK + 8];
        this.data[this.BACK + 8] = this.data[this.UP];
        this.data[this.UP] = this.data[this.FRONT];
        this.data[this.FRONT] = cornerhigh;
        // rotate face
        edge = this.data[this.LEFT + 3];
        let corner = this.data[this.LEFT + 6];
        this.data[this.LEFT + 3] = this.data[this.LEFT + 1];
        this.data[this.LEFT + 1] = this.data[this.LEFT + 5];
        this.data[this.LEFT + 5] = this.data[this.LEFT + 7];
        this.data[this.LEFT + 7] = edge;
        this.data[this.LEFT + 6] = this.data[this.LEFT];
        this.data[this.LEFT] = this.data[this.LEFT + 2];
        this.data[this.LEFT + 2] = this.data[this.LEFT + 8];
        this.data[this.LEFT + 8] = corner;
    }

    // =======================================================================

    F () {
        // save last slice
        let corner1 = this.data[this.UP + 6];
        let edge = this.data[this.UP + 7];
        let corner2 = this.data[this.UP + 8];
        // move top corners
        this.data[this.UP + 6] = this.data[this.LEFT + 8];
        this.data[this.LEFT + 8] = this.data[this.DOWN + 2];
        this.data[this.DOWN + 2] = this.data[this.RIGHT];
        this.data[this.RIGHT] = corner1;
        // move edges 
        this.data[this.UP + 7] = this.data[this.LEFT + 5];
        this.data[this.LEFT + 5] = this.data[this.DOWN + 1];
        this.data[this.DOWN + 1] = this.data[this.RIGHT + 3]; 
        this.data[this.RIGHT + 3] = edge; 
        // move bottom corners
        this.data[this.UP + 8] = this.data[this.LEFT + 2];
        this.data[this.LEFT + 2] = this.data[this.DOWN];
        this.data[this.DOWN] = this.data[this.RIGHT + 6];
        this.data[this.RIGHT + 6] = corner2;
        // rotate face
        edge = this.data[this.FRONT + 3];
        let corner = this.data[this.FRONT + 6];
        this.data[this.FRONT + 3] = this.data[this.FRONT + 7];
        this.data[this.FRONT + 7] = this.data[this.FRONT + 5];
        this.data[this.FRONT + 5] = this.data[this.FRONT + 1];
        this.data[this.FRONT + 1] = edge;
        this.data[this.FRONT + 6] = this.data[this.FRONT + 8];
        this.data[this.FRONT + 8] = this.data[this.FRONT + 2];
        this.data[this.FRONT + 2] = this.data[this.FRONT];
        this.data[this.FRONT] = corner;
    }

    // =======================================================================

    FPrime () {
        // save last slice
        let corner1 = this.data[this.UP + 6];
        let edge = this.data[this.UP + 7];
        let corner2 = this.data[this.UP + 8];
        // move top corners
        this.data[this.UP + 6] = this.data[this.RIGHT];
        this.data[this.RIGHT] = this.data[this.DOWN + 2];
        this.data[this.DOWN + 2] = this.data[this.LEFT + 8];
        this.data[this.LEFT + 8] = corner1;
        // move edges 
        this.data[this.UP + 7] = this.data[this.RIGHT + 3];
        this.data[this.RIGHT + 3] = this.data[this.DOWN + 1];
        this.data[this.DOWN + 1] = this.data[this.LEFT + 5]; 
        this.data[this.LEFT + 5] = edge; 
        // move bottom corners
        this.data[this.UP + 8] = this.data[this.RIGHT + 6];
        this.data[this.RIGHT + 6] = this.data[this.DOWN];
        this.data[this.DOWN] = this.data[this.LEFT + 2];
        this.data[this.LEFT + 2] = corner2;
        // rotate face
        edge = this.data[this.FRONT + 3];
        let corner = this.data[this.FRONT + 6];
        this.data[this.FRONT + 3] = this.data[this.FRONT + 1];
        this.data[this.FRONT + 1] = this.data[this.FRONT + 5];
        this.data[this.FRONT + 5] = this.data[this.FRONT + 7];
        this.data[this.FRONT + 7] = edge;
        this.data[this.FRONT + 6] = this.data[this.FRONT];
        this.data[this.FRONT] = this.data[this.FRONT + 2];
        this.data[this.FRONT + 2] = this.data[this.FRONT + 8];
        this.data[this.FRONT + 8] = corner;

    }

    // =======================================================================

    R () {
        // save last slice
        let cornerhigh = this.data[this.DOWN + 2];
        let edge = this.data[this.DOWN + 5];
        let cornerlow = this.data[this.DOWN + 8];
        // move bottom corners
        this.data[this.DOWN + 8] = this.data[this.BACK];
        this.data[this.BACK] = this.data[this.UP + 8];
        this.data[this.UP + 8] = this.data[this.FRONT + 8];
        this.data[this.FRONT + 8] = cornerlow;
        // move edges 
        this.data[this.DOWN + 5] = this.data[this.BACK + 3];
        this.data[this.BACK + 3] = this.data[this.UP + 5];
        this.data[this.UP + 5] = this.data[this.FRONT + 5]; 
        this.data[this.FRONT + 5] = edge; 
        // move top corners
        this.data[this.DOWN + 2] = this.data[this.BACK + 6];
        this.data[this.BACK + 6] = this.data[this.UP + 2];
        this.data[this.UP + 2] = this.data[this.FRONT + 2];
        this.data[this.FRONT + 2] = cornerhigh;
        // rotate face
        edge = this.data[this.RIGHT + 3];
        let corner = this.data[this.RIGHT + 6];
        this.data[this.RIGHT + 3] = this.data[this.RIGHT + 7];
        this.data[this.RIGHT + 7] = this.data[this.RIGHT + 5];
        this.data[this.RIGHT + 5] = this.data[this.RIGHT + 1];
        this.data[this.RIGHT + 1] = edge;
        this.data[this.RIGHT + 6] = this.data[this.RIGHT + 8];
        this.data[this.RIGHT + 8] = this.data[this.RIGHT + 2];
        this.data[this.RIGHT + 2] = this.data[this.RIGHT];
        this.data[this.RIGHT] = corner;
    }

    // =======================================================================

    RPrime () {
        // save last slice
        let cornerhigh = this.data[this.DOWN + 2];
        let edge = this.data[this.DOWN + 5];
        let cornerlow = this.data[this.DOWN + 8];
        // move bottom corners
        this.data[this.DOWN + 8] = this.data[this.FRONT + 8];
        this.data[this.FRONT + 8] = this.data[this.UP + 8];
        this.data[this.UP + 8] = this.data[this.BACK];
        this.data[this.BACK] = cornerlow;
        // move edges 
        this.data[this.DOWN + 5] = this.data[this.FRONT + 5];
        this.data[this.FRONT + 5] = this.data[this.UP + 5];
        this.data[this.UP + 5] = this.data[this.BACK + 3]; 
        this.data[this.BACK + 3] = edge; 
        // move top corners
        this.data[this.DOWN + 2] = this.data[this.FRONT + 2];
        this.data[this.FRONT + 2] = this.data[this.UP + 2];
        this.data[this.UP + 2] = this.data[this.BACK + 6];
        this.data[this.BACK + 6] = cornerhigh;
        // rotate face
        edge = this.data[this.RIGHT + 3];
        let corner = this.data[this.RIGHT + 6];
        this.data[this.RIGHT + 3] = this.data[this.RIGHT + 1];
        this.data[this.RIGHT + 1] = this.data[this.RIGHT + 5];
        this.data[this.RIGHT + 5] = this.data[this.RIGHT + 7];
        this.data[this.RIGHT + 7] = edge;
        this.data[this.RIGHT + 6] = this.data[this.RIGHT];
        this.data[this.RIGHT] = this.data[this.RIGHT + 2];
        this.data[this.RIGHT + 2] = this.data[this.RIGHT + 8];
        this.data[this.RIGHT + 8] = corner;
    }

    // =======================================================================

    B () {
        // save last slice
        let corner1 = this.data[this.UP + 2];
        let edge = this.data[this.UP + 1];
        let corner2 = this.data[this.UP];
        // move top corners
        this.data[this.UP + 2] = this.data[this.RIGHT + 8];
        this.data[this.RIGHT + 8] = this.data[this.DOWN + 6];
        this.data[this.DOWN + 6] = this.data[this.LEFT];
        this.data[this.LEFT] = corner1;
        // move edges 
        this.data[this.UP + 1] = this.data[this.RIGHT + 5];
        this.data[this.RIGHT + 5] = this.data[this.DOWN + 7];
        this.data[this.DOWN + 7] = this.data[this.LEFT + 3]; 
        this.data[this.LEFT + 3] = edge; 
        // move bottom corners
        this.data[this.UP] = this.data[this.RIGHT + 2];
        this.data[this.RIGHT + 2] = this.data[this.DOWN + 8];
        this.data[this.DOWN + 8] = this.data[this.LEFT + 6];
        this.data[this.LEFT + 6] = corner2;
        // rotate face
        edge = this.data[this.BACK + 3];
        let corner = this.data[this.BACK + 6];
        this.data[this.BACK + 3] = this.data[this.BACK + 7];
        this.data[this.BACK + 7] = this.data[this.BACK + 5];
        this.data[this.BACK + 5] = this.data[this.BACK + 1];
        this.data[this.BACK + 1] = edge;
        this.data[this.BACK + 6] = this.data[this.BACK + 8];
        this.data[this.BACK + 8] = this.data[this.BACK + 2];
        this.data[this.BACK + 2] = this.data[this.BACK];
        this.data[this.BACK] = corner;
    }

    // =======================================================================

    BPrime () {
        // save last slice
        let corner1 = this.data[this.UP + 2];
        let edge = this.data[this.UP + 1];
        let corner2 = this.data[this.UP];
        // move top corners
        this.data[this.UP + 2] = this.data[this.LEFT];
        this.data[this.LEFT] = this.data[this.DOWN + 6];
        this.data[this.DOWN + 6] = this.data[this.RIGHT + 8];
        this.data[this.RIGHT + 8] = corner1;
        // move edges 
        this.data[this.UP + 1] = this.data[this.LEFT + 3];
        this.data[this.LEFT + 3] = this.data[this.DOWN + 7];
        this.data[this.DOWN + 7] = this.data[this.RIGHT + 5]; 
        this.data[this.RIGHT + 5] = edge; 
        // move bottom corners
        this.data[this.UP] = this.data[this.LEFT + 6];
        this.data[this.LEFT + 6] = this.data[this.DOWN + 8];
        this.data[this.DOWN + 8] = this.data[this.RIGHT + 2];
        this.data[this.RIGHT + 2] = corner2;
        // rotate face
        edge = this.data[this.BACK + 3];
        let corner = this.data[this.BACK + 6];
        this.data[this.BACK + 3] = this.data[this.BACK + 1];
        this.data[this.BACK + 1] = this.data[this.BACK + 5];
        this.data[this.BACK + 5] = this.data[this.BACK + 7];
        this.data[this.BACK + 7] = edge;
        this.data[this.BACK + 6] = this.data[this.BACK];
        this.data[this.BACK] = this.data[this.BACK + 2];
        this.data[this.BACK + 2] = this.data[this.BACK + 8];
        this.data[this.BACK + 8] = corner;
    }

    // =======================================================================

    U () {
        // save last slice
        let corner1 = this.data[this.FRONT];
        let edge = this.data[this.FRONT + 1];
        let corner2 = this.data[this.FRONT + 2];
        // move left corners
        this.data[this.FRONT] = this.data[this.RIGHT];
        this.data[this.RIGHT] = this.data[this.BACK];
        this.data[this.BACK] = this.data[this.LEFT];
        this.data[this.LEFT] = corner1;
        // move edges 
        this.data[this.FRONT + 1] = this.data[this.RIGHT + 1];
        this.data[this.RIGHT + 1] = this.data[this.BACK + 1];
        this.data[this.BACK + 1] = this.data[this.LEFT + 1]; 
        this.data[this.LEFT + 1] = edge; 
        // move right corners
        this.data[this.FRONT + 2] = this.data[this.RIGHT + 2];
        this.data[this.RIGHT + 2] = this.data[this.BACK + 2];
        this.data[this.BACK + 2] = this.data[this.LEFT + 2];
        this.data[this.LEFT + 2] = corner2;
        // rotate face
        edge = this.data[this.UP + 3];
        let corner = this.data[this.UP + 6];
        this.data[this.UP + 3] = this.data[this.UP + 7];
        this.data[this.UP + 7] = this.data[this.UP + 5];
        this.data[this.UP + 5] = this.data[this.UP + 1];
        this.data[this.UP + 1] = edge;
        this.data[this.UP + 6] = this.data[this.UP + 8];
        this.data[this.UP + 8] = this.data[this.UP + 2];
        this.data[this.UP + 2] = this.data[this.UP];
        this.data[this.UP] = corner;
    }

    // =======================================================================

    UPrime () {
        // save last slice
        let corner1 = this.data[this.FRONT];
        let edge = this.data[this.FRONT + 1];
        let corner2 = this.data[this.FRONT + 2];
        // move left corners
        this.data[this.FRONT] = this.data[this.LEFT];
        this.data[this.LEFT] = this.data[this.BACK];
        this.data[this.BACK] = this.data[this.RIGHT];
        this.data[this.RIGHT] = corner1;
        // move edges 
        this.data[this.FRONT + 1] = this.data[this.LEFT + 1];
        this.data[this.LEFT + 1] = this.data[this.BACK + 1];
        this.data[this.BACK + 1] = this.data[this.RIGHT + 1]; 
        this.data[this.RIGHT + 1] = edge; 
        // move right corners
        this.data[this.FRONT + 2] = this.data[this.LEFT + 2];
        this.data[this.LEFT + 2] = this.data[this.BACK + 2];
        this.data[this.BACK + 2] = this.data[this.RIGHT + 2];
        this.data[this.RIGHT + 2] = corner2;
        // rotate face
        edge = this.data[this.UP + 3];
        let corner = this.data[this.UP + 6];
        this.data[this.UP + 3] = this.data[this.UP + 1];
        this.data[this.UP + 1] = this.data[this.UP + 5];
        this.data[this.UP + 5] = this.data[this.UP + 7];
        this.data[this.UP + 7] = edge;
        this.data[this.UP + 6] = this.data[this.UP];
        this.data[this.UP] = this.data[this.UP + 2];
        this.data[this.UP + 2] = this.data[this.UP + 8];
        this.data[this.UP + 8] = corner;
    }

    // =======================================================================

    D () {
        // save last slice
        let corner1 = this.data[this.FRONT + 6];
        let edge = this.data[this.FRONT + 7];
        let corner2 = this.data[this.FRONT + 8];
        // move corner 1 
        this.data[this.FRONT + 6] = this.data[this.LEFT + 6];
        this.data[this.LEFT + 6] = this.data[this.BACK + 6];
        this.data[this.BACK + 6] = this.data[this.RIGHT + 6]; 
        this.data[this.RIGHT + 6] = corner1; 
        // move edges
        this.data[this.FRONT + 7] = this.data[this.LEFT + 7];
        this.data[this.LEFT + 7] = this.data[this.BACK + 7];
        this.data[this.BACK + 7] = this.data[this.RIGHT + 7];
        this.data[this.RIGHT + 7] = edge;
        // move right corners
        this.data[this.FRONT + 8] = this.data[this.LEFT + 8];
        this.data[this.LEFT + 8] = this.data[this.BACK + 8];
        this.data[this.BACK + 8] = this.data[this.RIGHT + 8];
        this.data[this.RIGHT + 8] = corner2;
        // rotate face
        edge = this.data[this.DOWN + 3];
        let corner = this.data[this.DOWN + 6];
        this.data[this.DOWN + 3] = this.data[this.DOWN + 7];
        this.data[this.DOWN + 7] = this.data[this.DOWN + 5];
        this.data[this.DOWN + 5] = this.data[this.DOWN + 1];
        this.data[this.DOWN + 1] = edge;
        this.data[this.DOWN + 6] = this.data[this.DOWN + 8];
        this.data[this.DOWN + 8] = this.data[this.DOWN + 2];
        this.data[this.DOWN + 2] = this.data[this.DOWN];
        this.data[this.DOWN] = corner;
    }

    // =======================================================================

    DPrime () {
        // save last slice
        let corner1 = this.data[this.FRONT + 6];
        let edge = this.data[this.FRONT + 7];
        let corner2 = this.data[this.FRONT + 8];
        // move first corner 
        this.data[this.FRONT + 6] = this.data[this.RIGHT + 6];
        this.data[this.RIGHT + 6] = this.data[this.BACK + 6];
        this.data[this.BACK + 6] = this.data[this.LEFT + 6]; 
        this.data[this.LEFT + 6] = corner1; 
        // move edges
        this.data[this.FRONT + 7] = this.data[this.RIGHT + 7];
        this.data[this.RIGHT + 7] = this.data[this.BACK + 7];
        this.data[this.BACK + 7] = this.data[this.LEFT + 7];
        this.data[this.LEFT + 7] = edge;
        // move right corners
        this.data[this.FRONT + 8] = this.data[this.RIGHT + 8];
        this.data[this.RIGHT + 8] = this.data[this.BACK + 8];
        this.data[this.BACK + 8] = this.data[this.LEFT + 8];
        this.data[this.LEFT + 8] = corner2;
        // rotate face
        edge = this.data[this.DOWN + 3];
        let corner = this.data[this.DOWN + 6];
        this.data[this.DOWN + 3] = this.data[this.DOWN + 1];
        this.data[this.DOWN + 1] = this.data[this.DOWN + 5];
        this.data[this.DOWN + 5] = this.data[this.DOWN + 7];
        this.data[this.DOWN + 7] = edge;
        this.data[this.DOWN + 6] = this.data[this.DOWN];
        this.data[this.DOWN] = this.data[this.DOWN + 2];
        this.data[this.DOWN + 2] = this.data[this.DOWN + 8];
        this.data[this.DOWN + 8] = corner;
    }

    // =======================================================================

    // middle vertical slice
    // up/clockwise looking from right side
    //            ^
    //            |
    //     +--------------+
    //     |    |    |    |
    //     +--------------+
    //     |    |    |    |
    //     +--------------+
    //     |    |    |    |
    //     +--------------+
    //            ^
    //            |
    M () {
        // save last slice
        let edge_high = this.data[this.DOWN + 1];
        let center    = this.data[this.DOWN + 4];
        let edge_low  = this.data[this.DOWN + 7];
        // move bottom/low edges
        this.data[this.DOWN + 7] = this.data[this.BACK + 1];
        this.data[this.BACK + 1] = this.data[this.UP + 7];
        this.data[this.UP + 7] = this.data[this.FRONT + 7];
        this.data[this.FRONT + 7] = edge_low;
        // move centers
        this.data[this.DOWN + 4] = this.data[this.BACK + 4];
        this.data[this.BACK + 4] = this.data[this.UP + 4];
        this.data[this.UP + 4] = this.data[this.FRONT + 4];
        this.data[this.FRONT + 4] = center;
        // move top/high edges
        this.data[this.DOWN + 1] = this.data[this.BACK + 7];
        this.data[this.BACK + 7] = this.data[this.UP + 1];
        this.data[this.UP + 1] = this.data[this.FRONT + 1];
        this.data[this.FRONT + 1] = edge_high;
    }

    // =======================================================================

    // middle vertical slice
    // down/counter-clockwise looking from right side
    //            |
    //            v
    //     +--------------+
    //     |    |    |    |
    //     +--------------+
    //     |    |    |    |
    //     +--------------+
    //     |    |    |    |
    //     +--------------+
    //            |
    //            v
    MPrime () {
        // save last slice
        let edge_high = this.data[this.DOWN + 1];
        let center    = this.data[this.DOWN + 4];
        let edge_low  = this.data[this.DOWN + 7];
        // move bottom/low edges
        this.data[this.DOWN + 7] = this.data[this.FRONT + 7];
        this.data[this.FRONT + 7] = this.data[this.UP + 7];
        this.data[this.UP + 7] = this.data[this.BACK + 1];
        this.data[this.BACK + 1] = edge_low;
        // move centers
        this.data[this.DOWN + 4] = this.data[this.FRONT + 4];
        this.data[this.FRONT + 4] = this.data[this.UP + 4];
        this.data[this.UP + 4] = this.data[this.BACK + 4];
        this.data[this.BACK + 4] = center;
        // move top/high edges
        this.data[this.DOWN + 1] = this.data[this.FRONT + 1];
        this.data[this.FRONT + 1] = this.data[this.UP + 1];
        this.data[this.UP + 1] = this.data[this.BACK + 7];
        this.data[this.BACK + 7] = edge_high;
    }

    // =======================================================================

    // middle horizontal slice
    // push left to right
    // counter-clockwise looking down from top
    //     +--------------+
    //     |    |    |    |
    //     +--------------+
    // --->|    |    |    |--->
    //     +--------------+
    //     |    |    |    |
    //     +--------------+
    E () {
        // save last slice
        let edge_left  = this.data[this.FRONT + 3];
        let center     = this.data[this.FRONT + 4];
        let edge_right = this.data[this.FRONT + 5];
        // move left edges
        this.data[this.FRONT + 3] = this.data[this.LEFT + 3];
        this.data[this.LEFT + 3] = this.data[this.BACK + 3];
        this.data[this.BACK + 3] = this.data[this.RIGHT + 3];
        this.data[this.RIGHT + 3] = edge_left;
        // move centers
        this.data[this.FRONT + 4] = this.data[this.LEFT + 4];
        this.data[this.LEFT + 4] = this.data[this.BACK + 4];
        this.data[this.BACK + 4] = this.data[this.RIGHT + 4];
        this.data[this.RIGHT + 4] = center;
        // move right edges
        this.data[this.FRONT + 5] = this.data[this.LEFT + 5];
        this.data[this.LEFT + 5] = this.data[this.BACK + 5];
        this.data[this.BACK + 5] = this.data[this.RIGHT + 5];
        this.data[this.RIGHT + 5] = edge_right;
    }

    // =======================================================================

    // middle horizontal slice
    // push right to left
    // clockwise looking down from top
    //     +--------------+
    //     |    |    |    |
    //     +--------------+
    // <---|    |    |    |<---
    //     +--------------+
    //     |    |    |    |
    //     +--------------+
    EPrime () {
        // save last slice
        let edge_left  = this.data[this.FRONT + 3];
        let center     = this.data[this.FRONT + 4];
        let edge_right = this.data[this.FRONT + 5];
        // move left edges
        this.data[this.FRONT + 3] = this.data[this.RIGHT + 3];
        this.data[this.RIGHT + 3] = this.data[this.BACK + 3];
        this.data[this.BACK + 3] = this.data[this.LEFT + 3];
        this.data[this.LEFT + 3] = edge_left;
        // move centers
        this.data[this.FRONT + 4] = this.data[this.RIGHT + 4];
        this.data[this.RIGHT + 4] = this.data[this.BACK + 4];
        this.data[this.BACK + 4] = this.data[this.LEFT + 4];
        this.data[this.LEFT + 4] = center;
        // move right edges
        this.data[this.FRONT + 5] = this.data[this.RIGHT + 5];
        this.data[this.RIGHT + 5] = this.data[this.BACK + 5];
        this.data[this.BACK + 5] = this.data[this.LEFT + 5];
        this.data[this.LEFT + 5] = edge_right;
    }

    // =======================================================================

    // front/back middle slice
    // push left to right from top
    // clockwise from front   
    //        ___ ___ ___
    //      /___/___/___/|
    // --->/___/___/___/---->
    //    /___/___/__ /|/|
    //   |   |   |   | /||
    //   |___|___|___|/|/|
    //   |   |   |   | /||
    //   |___|___|___|/|/<---
    //   |   |   |   | /
    //   |___|___|___|/
    S () {
        // save last slice
        let edge_left  = this.data[this.UP + 3];
        let center     = this.data[this.UP + 4];
        let edge_right = this.data[this.UP + 5];
        // move left edges
        this.data[this.UP + 3] = this.data[this.LEFT + 7];
        this.data[this.LEFT + 7] = this.data[this.DOWN + 5];
        this.data[this.DOWN + 5] = this.data[this.RIGHT + 1];
        this.data[this.RIGHT + 1] = edge_left;
        // move centers
        this.data[this.UP + 4] = this.data[this.LEFT + 4];
        this.data[this.LEFT + 4] = this.data[this.DOWN + 4];
        this.data[this.DOWN + 4] = this.data[this.RIGHT + 4];
        this.data[this.RIGHT + 4] = center;
        // move right edges
        this.data[this.UP + 5] = this.data[this.LEFT + 1];
        this.data[this.LEFT + 1] = this.data[this.DOWN + 3];
        this.data[this.DOWN + 3] = this.data[this.RIGHT + 7];
        this.data[this.RIGHT + 7] = edge_right;
    }

    // =======================================================================

    // front/back middle slice
    // push right to left from top
    // counter-clockwise from front   
    //        ___ ___ ___
    //      /___/___/___/|
    // <---/___/___/___/<----
    //    /___/___/__ /|/|
    //   |   |   |   | /||
    //   |___|___|___|/|/|
    //   |   |   |   | /||
    //   |___|___|___|/|/
    //   |   |   |   | /^
    //   |___|___|___|/ |
    SPrime () {
        // save last slice
        let edge_left  = this.data[this.UP + 3];
        let center     = this.data[this.UP + 4];
        let edge_right = this.data[this.UP + 5];
        // move left edges
        this.data[this.UP + 3] = this.data[this.RIGHT + 1];
        this.data[this.RIGHT + 1] = this.data[this.DOWN + 5];
        this.data[this.DOWN + 5] = this.data[this.LEFT + 7];
        this.data[this.LEFT + 7] = edge_left;
        // move centers
        this.data[this.UP + 4] = this.data[this.RIGHT + 4];
        this.data[this.RIGHT + 4] = this.data[this.DOWN + 4];
        this.data[this.DOWN + 4] = this.data[this.LEFT + 4];
        this.data[this.LEFT + 4] = center;
        // move right edges
        this.data[this.UP + 5] = this.data[this.RIGHT + 7];
        this.data[this.RIGHT + 7] = this.data[this.DOWN + 3];
        this.data[this.DOWN + 3] = this.data[this.LEFT + 1];
        this.data[this.LEFT + 1] = edge_right;
    }

    // =======================================================================
    // MOVES : CUBE ROTATIONS
    // =======================================================================

    // Cube rotation around X axis
    // clockwise from right side
    X () {
        // we can use other moves to achieve this
        this.LPrime ();
        this.M ();
        this.R ();
    }

    // =======================================================================

    // Cube rotation around X axis
    // counter-clockwise from right side
    XPrime () {
        // we can use other moves to achieve this
        this.L ();
        this.MPrime ();
        this.RPrime ();
    }

    // =======================================================================

    // Cube rotation around Y axis
    // clockwise from top side
    Y () {
        // we can use other moves to achieve this
        this.U ();
        this.EPrime ();
        this.DPrime ();
    }

    // =======================================================================

    // Cube rotation around Y axis
    // counter-clockwise from top side
    YPrime () {
        // we can use other moves to achieve this
        this.UPrime ();
        this.E ();
        this.D ();
    }

    // =======================================================================

    // Cube rotation around Z axis
    // clockwise from front side
    Z () {
        // we can use other moves to achieve this
        this.F ();
        this.S ();
        this.BPrime ();
    }

    // =======================================================================

    // Cube rotation around Z axis
    // counter-clockwise from front side
    ZPrime () {
        // we can use other moves to achieve this
        this.FPrime ();
        this.SPrime ();
        this.B ();
    }

    // =======================================================================
    // VISUALS
    // =======================================================================

    draw () {

        let startX = 50;
        let startY = 275;
        strokeWeight(3);
        stroke('black');

        // draw each face
        // left
        this.drawFace (startX, startY, this.stickerSize, this.LEFT);
        // front
        this.drawFace (startX + this.faceSize, startY, this.stickerSize, this.FRONT);
        // right
        this.drawFace (startX + this.faceSize * 2, startY, this.stickerSize, this.RIGHT);
        // back
        this.drawFace (startX + this.faceSize * 3, startY, this.stickerSize, this.BACK);
        // up
        this.drawFace (startX + this.faceSize, startY - this.faceSize, this.stickerSize, this.UP);
        // down
        this.drawFace (startX + this.faceSize, startY + this.faceSize, this.stickerSize, this.DOWN);

    }

    // =======================================================================

    // draws each sticker associated with a face of the cube
    drawFace (startX, startY, stickerSize, elemOffset) {
        fill (this.getColor(this.data[elemOffset]));
        square (startX                  , startY                  , stickerSize);
        fill (this.getColor(this.data[elemOffset + 1]));
        square (startX + stickerSize    , startY                  , stickerSize);
        fill (this.getColor(this.data[elemOffset + 2]));
        square (startX + stickerSize * 2, startY                  , stickerSize);
        fill (this.getColor(this.data[elemOffset + 3]));
        square (startX                  , startY + stickerSize    , stickerSize);
        fill (this.getColor(this.data[elemOffset + 4]));
        square (startX + stickerSize    , startY + stickerSize    , stickerSize, 17);
        fill (this.getColor(this.data[elemOffset + 5]));
        square (startX + stickerSize * 2, startY + stickerSize    , stickerSize);
        fill (this.getColor(this.data[elemOffset + 6]));
        square (startX                  , startY + stickerSize * 2, stickerSize);
        fill (this.getColor(this.data[elemOffset + 7]));
        square (startX + stickerSize    , startY + stickerSize * 2, stickerSize);
        fill (this.getColor(this.data[elemOffset + 8]));
        square (startX + stickerSize * 2, startY + stickerSize * 2, stickerSize);
    }

    // =======================================================================

    // returns a p5.js color for the given color enum
    getColor(colorId) {
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
        if (move == this.MOVE_M)      return "M";
        if (move == this.MOVE_MPRIME) return "M'";
        if (move == this.MOVE_E)      return "E";
        if (move == this.MOVE_EPRIME) return "E'";
        if (move == this.MOVE_S)      return "S";
        if (move == this.MOVE_SPRIME) return "S'";
        // Cube rotations
        if (move == this.MOVE_X)      return "X";
        if (move == this.MOVE_XPRIME) return "X'";
        if (move == this.MOVE_Y)      return "Y";
        if (move == this.MOVE_YPRIME) return "Y'";
        if (move == this.MOVE_Z)      return "Z";
        if (move == this.MOVE_ZPRIME) return "Z'";
    }
}