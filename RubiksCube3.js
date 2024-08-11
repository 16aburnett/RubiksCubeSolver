/*
    Rubiks Cube 3x3x3 Representation
    By Amy Burnett
    January 2 2020
*/

// =======================================================================

// =======================================================================

class RubiksCube3 {

    constructor() {
        this.reset();
        // Face Offsets
        this.LEFT   = 0;
        this.FRONT  = 4;
        this.RIGHT  = 8;
        this.BACK   = 12;
        this.UP     = 16;
        this.DOWN   = 20;
        // drawing
        this.stickerSize = window.innerWidth / 35;
        this.faceSize = this.stickerSize * 3;
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

    move(move) {
        if (move == MOVE_L) this.l();
        if (move == MOVE_LPRIME) this.lPrime();
        if (move == MOVE_F) this.f();
        if (move == MOVE_FPRIME) this.fPrime();
        if (move == MOVE_R) this.r();
        if (move == MOVE_RPRIME) this.rPrime();
        if (move == MOVE_B) this.b();
        if (move == MOVE_BPRIME) this.bPrime();
        if (move == MOVE_U) this.u();
        if (move == MOVE_UPRIME) this.uPrime();
        if (move == MOVE_D) this.d();
        if (move == MOVE_DPRIME) this.dPrime();
    }

    // =======================================================================

    l() {
        // save last slice
        let cornerhigh = this.data[DOWN];
        let edge = this.data[DOWN + 3];
        let cornerlow = this.data[DOWN + 6];
        // move bottom corners
        this.data[DOWN + 6] = this.data[FRONT + 6];
        this.data[FRONT + 6] = this.data[UP + 6];
        this.data[UP + 6] = this.data[BACK + 2];
        this.data[BACK + 2] = cornerlow;
        // move edges 
        this.data[DOWN + 3] = this.data[FRONT + 3];
        this.data[FRONT + 3] = this.data[UP + 3];
        this.data[UP + 3] = this.data[BACK + 5]; 
        this.data[BACK + 5] = edge; 
        // move top corners
        this.data[DOWN] = this.data[FRONT];
        this.data[FRONT] = this.data[UP];
        this.data[UP] = this.data[BACK + 8];
        this.data[BACK + 8] = cornerhigh;
        // rotate face
        edge = this.data[LEFT + 3];
        let corner = this.data[LEFT + 6];
        this.data[LEFT + 3] = this.data[LEFT + 7];
        this.data[LEFT + 7] = this.data[LEFT + 5];
        this.data[LEFT + 5] = this.data[LEFT + 1];
        this.data[LEFT + 1] = edge;
        this.data[LEFT + 6] = this.data[LEFT + 8];
        this.data[LEFT + 8] = this.data[LEFT + 2];
        this.data[LEFT + 2] = this.data[LEFT];
        this.data[LEFT] = corner;
    }

    // =======================================================================

    lPrime() {
        // save last slice
        let cornerhigh = this.data[DOWN];
        let edge = this.data[DOWN + 3];
        let cornerlow = this.data[DOWN + 6];
        // move bottom corners
        this.data[DOWN + 6] = this.data[BACK + 2];
        this.data[BACK + 2] = this.data[UP + 6];
        this.data[UP + 6] = this.data[FRONT + 6];
        this.data[FRONT + 6] = cornerlow;
        // move edges 
        this.data[DOWN + 3] = this.data[BACK + 5];
        this.data[BACK + 5] = this.data[UP + 3];
        this.data[UP + 3] = this.data[FRONT + 3]; 
        this.data[FRONT + 3] = edge; 
        // move top corners
        this.data[DOWN] = this.data[BACK + 8];
        this.data[BACK + 8] = this.data[UP];
        this.data[UP] = this.data[FRONT];
        this.data[FRONT] = cornerhigh;
        // rotate face
        edge = this.data[LEFT + 3];
        let corner = this.data[LEFT + 6];
        this.data[LEFT + 3] = this.data[LEFT + 1];
        this.data[LEFT + 1] = this.data[LEFT + 5];
        this.data[LEFT + 5] = this.data[LEFT + 7];
        this.data[LEFT + 7] = edge;
        this.data[LEFT + 6] = this.data[LEFT];
        this.data[LEFT] = this.data[LEFT + 2];
        this.data[LEFT + 2] = this.data[LEFT + 8];
        this.data[LEFT + 8] = corner;
    }

    // =======================================================================

    f() {
        // save last slice
        let corner1 = this.data[UP + 6];
        let edge = this.data[UP + 7];
        let corner2 = this.data[UP + 8];
        // move top corners
        this.data[UP + 6] = this.data[LEFT + 8];
        this.data[LEFT + 8] = this.data[DOWN + 2];
        this.data[DOWN + 2] = this.data[RIGHT];
        this.data[RIGHT] = corner1;
        // move edges 
        this.data[UP + 7] = this.data[LEFT + 5];
        this.data[LEFT + 5] = this.data[DOWN + 1];
        this.data[DOWN + 1] = this.data[RIGHT + 3]; 
        this.data[RIGHT + 3] = edge; 
        // move bottom corners
        this.data[UP + 8] = this.data[LEFT + 2];
        this.data[LEFT + 2] = this.data[DOWN];
        this.data[DOWN] = this.data[RIGHT + 6];
        this.data[RIGHT + 6] = corner2;
        // rotate face
        edge = this.data[FRONT + 3];
        let corner = this.data[FRONT + 6];
        this.data[FRONT + 3] = this.data[FRONT + 7];
        this.data[FRONT + 7] = this.data[FRONT + 5];
        this.data[FRONT + 5] = this.data[FRONT + 1];
        this.data[FRONT + 1] = edge;
        this.data[FRONT + 6] = this.data[FRONT + 8];
        this.data[FRONT + 8] = this.data[FRONT + 2];
        this.data[FRONT + 2] = this.data[FRONT];
        this.data[FRONT] = corner;
    }

    // =======================================================================

    fPrime() {
        // save last slice
        let corner1 = this.data[UP + 6];
        let edge = this.data[UP + 7];
        let corner2 = this.data[UP + 8];
        // move top corners
        this.data[UP + 6] = this.data[RIGHT];
        this.data[RIGHT] = this.data[DOWN + 2];
        this.data[DOWN + 2] = this.data[LEFT + 8];
        this.data[LEFT + 8] = corner1;
        // move edges 
        this.data[UP + 7] = this.data[RIGHT + 3];
        this.data[RIGHT + 3] = this.data[DOWN + 1];
        this.data[DOWN + 1] = this.data[LEFT + 5]; 
        this.data[LEFT + 5] = edge; 
        // move bottom corners
        this.data[UP + 8] = this.data[RIGHT + 6];
        this.data[RIGHT + 6] = this.data[DOWN];
        this.data[DOWN] = this.data[LEFT + 2];
        this.data[LEFT + 2] = corner2;
        // rotate face
        edge = this.data[FRONT + 3];
        let corner = this.data[FRONT + 6];
        this.data[FRONT + 3] = this.data[FRONT + 1];
        this.data[FRONT + 1] = this.data[FRONT + 5];
        this.data[FRONT + 5] = this.data[FRONT + 7];
        this.data[FRONT + 7] = edge;
        this.data[FRONT + 6] = this.data[FRONT];
        this.data[FRONT] = this.data[FRONT + 2];
        this.data[FRONT + 2] = this.data[FRONT + 8];
        this.data[FRONT + 8] = corner;

    }

    // =======================================================================

    r() {
        // save last slice
        let cornerhigh = this.data[DOWN + 2];
        let edge = this.data[DOWN + 5];
        let cornerlow = this.data[DOWN + 8];
        // move bottom corners
        this.data[DOWN + 8] = this.data[BACK];
        this.data[BACK] = this.data[UP + 8];
        this.data[UP + 8] = this.data[FRONT + 8];
        this.data[FRONT + 8] = cornerlow;
        // move edges 
        this.data[DOWN + 5] = this.data[BACK + 3];
        this.data[BACK + 3] = this.data[UP + 5];
        this.data[UP + 5] = this.data[FRONT + 5]; 
        this.data[FRONT + 5] = edge; 
        // move top corners
        this.data[DOWN + 2] = this.data[BACK + 6];
        this.data[BACK + 6] = this.data[UP + 2];
        this.data[UP + 2] = this.data[FRONT + 2];
        this.data[FRONT + 2] = cornerhigh;
        // rotate face
        edge = this.data[RIGHT + 3];
        let corner = this.data[RIGHT + 6];
        this.data[RIGHT + 3] = this.data[RIGHT + 7];
        this.data[RIGHT + 7] = this.data[RIGHT + 5];
        this.data[RIGHT + 5] = this.data[RIGHT + 1];
        this.data[RIGHT + 1] = edge;
        this.data[RIGHT + 6] = this.data[RIGHT + 8];
        this.data[RIGHT + 8] = this.data[RIGHT + 2];
        this.data[RIGHT + 2] = this.data[RIGHT];
        this.data[RIGHT] = corner;
    }

    // =======================================================================

    rPrime() {
        // save last slice
        let cornerhigh = this.data[DOWN + 2];
        let edge = this.data[DOWN + 5];
        let cornerlow = this.data[DOWN + 8];
        // move bottom corners
        this.data[DOWN + 8] = this.data[FRONT + 8];
        this.data[FRONT + 8] = this.data[UP + 8];
        this.data[UP + 8] = this.data[BACK];
        this.data[BACK] = cornerlow;
        // move edges 
        this.data[DOWN + 5] = this.data[FRONT + 5];
        this.data[FRONT + 5] = this.data[UP + 5];
        this.data[UP + 5] = this.data[BACK + 3]; 
        this.data[BACK + 3] = edge; 
        // move top corners
        this.data[DOWN + 2] = this.data[FRONT + 2];
        this.data[FRONT + 2] = this.data[UP + 2];
        this.data[UP + 2] = this.data[BACK + 6];
        this.data[BACK + 6] = cornerhigh;
        // rotate face
        edge = this.data[RIGHT + 3];
        let corner = this.data[RIGHT + 6];
        this.data[RIGHT + 3] = this.data[RIGHT + 1];
        this.data[RIGHT + 1] = this.data[RIGHT + 5];
        this.data[RIGHT + 5] = this.data[RIGHT + 7];
        this.data[RIGHT + 7] = edge;
        this.data[RIGHT + 6] = this.data[RIGHT];
        this.data[RIGHT] = this.data[RIGHT + 2];
        this.data[RIGHT + 2] = this.data[RIGHT + 8];
        this.data[RIGHT + 8] = corner;
    }

    // =======================================================================

    b() {
        // save last slice
        let corner1 = this.data[UP + 2];
        let edge = this.data[UP + 1];
        let corner2 = this.data[UP];
        // move top corners
        this.data[UP + 2] = this.data[RIGHT + 8];
        this.data[RIGHT + 8] = this.data[DOWN + 6];
        this.data[DOWN + 6] = this.data[LEFT];
        this.data[LEFT] = corner1;
        // move edges 
        this.data[UP + 1] = this.data[RIGHT + 5];
        this.data[RIGHT + 5] = this.data[DOWN + 7];
        this.data[DOWN + 7] = this.data[LEFT + 3]; 
        this.data[LEFT + 3] = edge; 
        // move bottom corners
        this.data[UP] = this.data[RIGHT + 2];
        this.data[RIGHT + 2] = this.data[DOWN + 8];
        this.data[DOWN + 8] = this.data[LEFT + 6];
        this.data[LEFT + 6] = corner2;
        // rotate face
        edge = this.data[BACK + 3];
        let corner = this.data[BACK + 6];
        this.data[BACK + 3] = this.data[BACK + 7];
        this.data[BACK + 7] = this.data[BACK + 5];
        this.data[BACK + 5] = this.data[BACK + 1];
        this.data[BACK + 1] = edge;
        this.data[BACK + 6] = this.data[BACK + 8];
        this.data[BACK + 8] = this.data[BACK + 2];
        this.data[BACK + 2] = this.data[BACK];
        this.data[BACK] = corner;
    }

    // =======================================================================

    bPrime() {
        // save last slice
        let corner1 = this.data[UP + 2];
        let edge = this.data[UP + 1];
        let corner2 = this.data[UP];
        // move top corners
        this.data[UP + 2] = this.data[LEFT];
        this.data[LEFT] = this.data[DOWN + 6];
        this.data[DOWN + 6] = this.data[RIGHT + 8];
        this.data[RIGHT + 8] = corner1;
        // move edges 
        this.data[UP + 1] = this.data[LEFT + 3];
        this.data[LEFT + 3] = this.data[DOWN + 7];
        this.data[DOWN + 7] = this.data[RIGHT + 5]; 
        this.data[RIGHT + 5] = edge; 
        // move bottom corners
        this.data[UP] = this.data[LEFT + 6];
        this.data[LEFT + 6] = this.data[DOWN + 8];
        this.data[DOWN + 8] = this.data[RIGHT + 2];
        this.data[RIGHT + 2] = corner2;
        // rotate face
        edge = this.data[BACK + 3];
        let corner = this.data[BACK + 6];
        this.data[BACK + 3] = this.data[BACK + 1];
        this.data[BACK + 1] = this.data[BACK + 5];
        this.data[BACK + 5] = this.data[BACK + 7];
        this.data[BACK + 7] = edge;
        this.data[BACK + 6] = this.data[BACK];
        this.data[BACK] = this.data[BACK + 2];
        this.data[BACK + 2] = this.data[BACK + 8];
        this.data[BACK + 8] = corner;
    }

    // =======================================================================

    u() {
        // save last slice
        let corner1 = this.data[FRONT];
        let edge = this.data[FRONT + 1];
        let corner2 = this.data[FRONT + 2];
        // move left corners
        this.data[FRONT] = this.data[RIGHT];
        this.data[RIGHT] = this.data[BACK];
        this.data[BACK] = this.data[LEFT];
        this.data[LEFT] = corner1;
        // move edges 
        this.data[FRONT + 1] = this.data[RIGHT + 1];
        this.data[RIGHT + 1] = this.data[BACK + 1];
        this.data[BACK + 1] = this.data[LEFT + 1]; 
        this.data[LEFT + 1] = edge; 
        // move right corners
        this.data[FRONT + 2] = this.data[RIGHT + 2];
        this.data[RIGHT + 2] = this.data[BACK + 2];
        this.data[BACK + 2] = this.data[LEFT + 2];
        this.data[LEFT + 2] = corner2;
        // rotate face
        edge = this.data[UP + 3];
        let corner = this.data[UP + 6];
        this.data[UP + 3] = this.data[UP + 7];
        this.data[UP + 7] = this.data[UP + 5];
        this.data[UP + 5] = this.data[UP + 1];
        this.data[UP + 1] = edge;
        this.data[UP + 6] = this.data[UP + 8];
        this.data[UP + 8] = this.data[UP + 2];
        this.data[UP + 2] = this.data[UP];
        this.data[UP] = corner;
    }

    // =======================================================================

    uPrime() {
        // save last slice
        let corner1 = this.data[FRONT];
        let edge = this.data[FRONT + 1];
        let corner2 = this.data[FRONT + 2];
        // move left corners
        this.data[FRONT] = this.data[LEFT];
        this.data[LEFT] = this.data[BACK];
        this.data[BACK] = this.data[RIGHT];
        this.data[RIGHT] = corner1;
        // move edges 
        this.data[FRONT + 1] = this.data[LEFT + 1];
        this.data[LEFT + 1] = this.data[BACK + 1];
        this.data[BACK + 1] = this.data[RIGHT + 1]; 
        this.data[RIGHT + 1] = edge; 
        // move right corners
        this.data[FRONT + 2] = this.data[LEFT + 2];
        this.data[LEFT + 2] = this.data[BACK + 2];
        this.data[BACK + 2] = this.data[RIGHT + 2];
        this.data[RIGHT + 2] = corner2;
        // rotate face
        edge = this.data[UP + 3];
        let corner = this.data[UP + 6];
        this.data[UP + 3] = this.data[UP + 1];
        this.data[UP + 1] = this.data[UP + 5];
        this.data[UP + 5] = this.data[UP + 7];
        this.data[UP + 7] = edge;
        this.data[UP + 6] = this.data[UP];
        this.data[UP] = this.data[UP + 2];
        this.data[UP + 2] = this.data[UP + 8];
        this.data[UP + 8] = corner;
    }

    // =======================================================================

    d() {
        // save last slice
        let corner1 = this.data[FRONT + 6];
        let edge = this.data[FRONT + 7];
        let corner2 = this.data[FRONT + 8];
        // move corner 1 
        this.data[FRONT + 6] = this.data[LEFT + 6];
        this.data[LEFT + 6] = this.data[BACK + 6];
        this.data[BACK + 6] = this.data[RIGHT + 6]; 
        this.data[RIGHT + 6] = corner1; 
        // move edges
        this.data[FRONT + 7] = this.data[LEFT + 7];
        this.data[LEFT + 7] = this.data[BACK + 7];
        this.data[BACK + 7] = this.data[RIGHT + 7];
        this.data[RIGHT + 7] = edge;
        // move right corners
        this.data[FRONT + 8] = this.data[LEFT + 8];
        this.data[LEFT + 8] = this.data[BACK + 8];
        this.data[BACK + 8] = this.data[RIGHT + 8];
        this.data[RIGHT + 8] = corner2;
        // rotate face
        edge = this.data[DOWN + 3];
        let corner = this.data[DOWN + 6];
        this.data[DOWN + 3] = this.data[DOWN + 7];
        this.data[DOWN + 7] = this.data[DOWN + 5];
        this.data[DOWN + 5] = this.data[DOWN + 1];
        this.data[DOWN + 1] = edge;
        this.data[DOWN + 6] = this.data[DOWN + 8];
        this.data[DOWN + 8] = this.data[DOWN + 2];
        this.data[DOWN + 2] = this.data[DOWN];
        this.data[DOWN] = corner;
    }

    // =======================================================================

    dPrime() {
        // save last slice
        let corner1 = this.data[FRONT + 6];
        let edge = this.data[FRONT + 7];
        let corner2 = this.data[FRONT + 8];
        // move first corner 
        this.data[FRONT + 6] = this.data[RIGHT + 6];
        this.data[RIGHT + 6] = this.data[BACK + 6];
        this.data[BACK + 6] = this.data[LEFT + 6]; 
        this.data[LEFT + 6] = corner1; 
        // move edges
        this.data[FRONT + 7] = this.data[RIGHT + 7];
        this.data[RIGHT + 7] = this.data[BACK + 7];
        this.data[BACK + 7] = this.data[LEFT + 7];
        this.data[LEFT + 7] = edge;
        // move right corners
        this.data[FRONT + 8] = this.data[RIGHT + 8];
        this.data[RIGHT + 8] = this.data[BACK + 8];
        this.data[BACK + 8] = this.data[LEFT + 8];
        this.data[LEFT + 8] = corner2;
        // rotate face
        edge = this.data[DOWN + 3];
        let corner = this.data[DOWN + 6];
        this.data[DOWN + 3] = this.data[DOWN + 1];
        this.data[DOWN + 1] = this.data[DOWN + 5];
        this.data[DOWN + 5] = this.data[DOWN + 7];
        this.data[DOWN + 7] = edge;
        this.data[DOWN + 6] = this.data[DOWN];
        this.data[DOWN] = this.data[DOWN + 2];
        this.data[DOWN + 2] = this.data[DOWN + 8];
        this.data[DOWN + 8] = corner;
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
    m () {
        // save last slice
        let edge_high = this.data[DOWN + 1];
        let center    = this.data[DOWN + 4];
        let edge_low  = this.data[DOWN + 7];
        // move bottom/low edges
        this.data[DOWN + 7] = this.data[BACK + 1];
        this.data[BACK + 1] = this.data[UP + 7];
        this.data[UP + 7] = this.data[FRONT + 7];
        this.data[FRONT + 7] = edge_low;
        // move centers
        this.data[DOWN + 4] = this.data[BACK + 4];
        this.data[BACK + 4] = this.data[UP + 4];
        this.data[UP + 4] = this.data[FRONT + 4];
        this.data[FRONT + 4] = center;
        // move top/high edges
        this.data[DOWN + 1] = this.data[BACK + 7];
        this.data[BACK + 7] = this.data[UP + 1];
        this.data[UP + 1] = this.data[FRONT + 1];
        this.data[FRONT + 1] = edge_high;
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
    mPrime () {
        // save last slice
        let edge_high = this.data[DOWN + 1];
        let center    = this.data[DOWN + 4];
        let edge_low  = this.data[DOWN + 7];
        // move bottom/low edges
        this.data[DOWN + 7] = this.data[FRONT + 7];
        this.data[FRONT + 7] = this.data[UP + 7];
        this.data[UP + 7] = this.data[BACK + 1];
        this.data[BACK + 1] = edge_low;
        // move centers
        this.data[DOWN + 4] = this.data[FRONT + 4];
        this.data[FRONT + 4] = this.data[UP + 4];
        this.data[UP + 4] = this.data[BACK + 4];
        this.data[BACK + 4] = center;
        // move top/high edges
        this.data[DOWN + 1] = this.data[FRONT + 1];
        this.data[FRONT + 1] = this.data[UP + 1];
        this.data[UP + 1] = this.data[BACK + 7];
        this.data[BACK + 7] = edge_high;
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
    e() {
        // save last slice
        let edge_left  = this.data[FRONT + 3];
        let center     = this.data[FRONT + 4];
        let edge_right = this.data[FRONT + 5];
        // move left edges
        this.data[FRONT + 3] = this.data[LEFT + 3];
        this.data[LEFT + 3] = this.data[BACK + 3];
        this.data[BACK + 3] = this.data[RIGHT + 3];
        this.data[RIGHT + 3] = edge_left;
        // move centers
        this.data[FRONT + 4] = this.data[LEFT + 4];
        this.data[LEFT + 4] = this.data[BACK + 4];
        this.data[BACK + 4] = this.data[RIGHT + 4];
        this.data[RIGHT + 4] = center;
        // move right edges
        this.data[FRONT + 5] = this.data[LEFT + 5];
        this.data[LEFT + 5] = this.data[BACK + 5];
        this.data[BACK + 5] = this.data[RIGHT + 5];
        this.data[RIGHT + 5] = edge_right;
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
    ePrime () {
        // save last slice
        let edge_left  = this.data[FRONT + 3];
        let center     = this.data[FRONT + 4];
        let edge_right = this.data[FRONT + 5];
        // move left edges
        this.data[FRONT + 3] = this.data[RIGHT + 3];
        this.data[RIGHT + 3] = this.data[BACK + 3];
        this.data[BACK + 3] = this.data[LEFT + 3];
        this.data[LEFT + 3] = edge_left;
        // move centers
        this.data[FRONT + 4] = this.data[RIGHT + 4];
        this.data[RIGHT + 4] = this.data[BACK + 4];
        this.data[BACK + 4] = this.data[LEFT + 4];
        this.data[LEFT + 4] = center;
        // move right edges
        this.data[FRONT + 5] = this.data[RIGHT + 5];
        this.data[RIGHT + 5] = this.data[BACK + 5];
        this.data[BACK + 5] = this.data[LEFT + 5];
        this.data[LEFT + 5] = edge_right;
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
    s() {
        // save last slice
        let edge_left  = this.data[UP + 3];
        let center     = this.data[UP + 4];
        let edge_right = this.data[UP + 5];
        // move left edges
        this.data[UP + 3] = this.data[LEFT + 7];
        this.data[LEFT + 7] = this.data[DOWN + 5];
        this.data[DOWN + 5] = this.data[RIGHT + 1];
        this.data[RIGHT + 1] = edge_left;
        // move centers
        this.data[UP + 4] = this.data[LEFT + 4];
        this.data[LEFT + 4] = this.data[DOWN + 4];
        this.data[DOWN + 4] = this.data[RIGHT + 4];
        this.data[RIGHT + 4] = center;
        // move right edges
        this.data[UP + 5] = this.data[LEFT + 1];
        this.data[LEFT + 1] = this.data[DOWN + 3];
        this.data[DOWN + 3] = this.data[RIGHT + 7];
        this.data[RIGHT + 7] = edge_right;
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
    sPrime () {
        // save last slice
        let edge_left  = this.data[UP + 3];
        let center     = this.data[UP + 4];
        let edge_right = this.data[UP + 5];
        // move left edges
        this.data[UP + 3] = this.data[RIGHT + 1];
        this.data[RIGHT + 1] = this.data[DOWN + 5];
        this.data[DOWN + 5] = this.data[LEFT + 7];
        this.data[LEFT + 7] = edge_left;
        // move centers
        this.data[UP + 4] = this.data[RIGHT + 4];
        this.data[RIGHT + 4] = this.data[DOWN + 4];
        this.data[DOWN + 4] = this.data[LEFT + 4];
        this.data[LEFT + 4] = center;
        // move right edges
        this.data[UP + 5] = this.data[RIGHT + 7];
        this.data[RIGHT + 7] = this.data[DOWN + 3];
        this.data[DOWN + 3] = this.data[LEFT + 1];
        this.data[LEFT + 1] = edge_right;
    }

    // =======================================================================

    // Cube rotation around X axis
    // clockwise from right side
    x () {
        // we can use other moves to achieve this
        this.lPrime ();
        this.m ();
        this.r ();
    }

    // =======================================================================

    // Cube rotation around X axis
    // counter-clockwise from right side
    xPrime () {
        // we can use other moves to achieve this
        this.l ();
        this.mPrime ();
        this.rPrime ();
    }

    // =======================================================================

    // Cube rotation around Y axis
    // clockwise from top side
    y () {
        // we can use other moves to achieve this
        this.u ();
        this.ePrime ();
        this.dPrime ();
    }

    // =======================================================================

    // Cube rotation around Y axis
    // counter-clockwise from top side
    yPrime () {
        // we can use other moves to achieve this
        this.uPrime ();
        this.e ();
        this.d ();
    }

    // =======================================================================

    // Cube rotation around Z axis
    // clockwise from front side
    z () {
        // we can use other moves to achieve this
        this.f ();
        this.s ();
        this.bPrime ();
    }

    // =======================================================================

    // Cube rotation around Z axis
    // counter-clockwise from front side
    zPrime () {
        // we can use other moves to achieve this
        this.fPrime ();
        this.sPrime ();
        this.b ();
    }

    // =======================================================================

    draw() {

        let startX = 50;
        let startY = 275;
        strokeWeight(3);
        stroke('black');

        // draw each face
        // left
        this.drawFace(startX, startY, this.stickerSize, LEFT);
        // front
        this.drawFace(startX + this.faceSize, startY, this.stickerSize, FRONT);
        // right
        this.drawFace(startX + this.faceSize * 2, startY, this.stickerSize, RIGHT);
        // back
        this.drawFace(startX + this.faceSize * 3, startY, this.stickerSize, BACK);
        // up
        this.drawFace(startX + this.faceSize, startY - this.faceSize, this.stickerSize, UP);
        // down
        this.drawFace(startX + this.faceSize, startY + this.faceSize, this.stickerSize, DOWN);

    }

    // =======================================================================

    // draws each sticker associated with a face of the cube
    drawFace(startX, startY, stickerSize, elemOffset) {
        fill(this.getColor(this.data[elemOffset]));
        square(startX                  , startY                  , stickerSize);
        fill(this.getColor(this.data[elemOffset + 1]));
        square(startX + stickerSize    , startY                  , stickerSize);
        fill(this.getColor(this.data[elemOffset + 2]));
        square(startX + stickerSize * 2, startY                  , stickerSize);
        fill(this.getColor(this.data[elemOffset + 3]));
        square(startX                  , startY + stickerSize    , stickerSize);
        fill(this.getColor(this.data[elemOffset + 4]));
        square(startX + stickerSize    , startY + stickerSize    , stickerSize, 17);
        fill(this.getColor(this.data[elemOffset + 5]));
        square(startX + stickerSize * 2, startY + stickerSize    , stickerSize);
        fill(this.getColor(this.data[elemOffset + 6]));
        square(startX                  , startY + stickerSize * 2, stickerSize);
        fill(this.getColor(this.data[elemOffset + 7]));
        square(startX + stickerSize    , startY + stickerSize * 2, stickerSize);
        fill(this.getColor(this.data[elemOffset + 8]));
        square(startX + stickerSize * 2, startY + stickerSize * 2, stickerSize);
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
}