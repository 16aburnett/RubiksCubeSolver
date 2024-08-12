/*
    Rubiks Cube 2x2x2 Representation
    By Amy Burnett
    February 7 2020
*/

// =======================================================================

// =======================================================================

class RubiksCube2 {

    constructor () {
        this.reset ();
        // Face Offsets
        this.dim = 2;
        this.LEFT   = 0 * this.dim * this.dim; // 0
        this.FRONT  = 1 * this.dim * this.dim; // 4
        this.RIGHT  = 2 * this.dim * this.dim; // 8
        this.BACK   = 3 * this.dim * this.dim; // 12
        this.UP     = 4 * this.dim * this.dim; // 16
        this.DOWN   = 5 * this.dim * this.dim; // 20
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
        // Cube rotation moves
        this.MOVE_X          = 12;
        this.MOVE_XPRIME     = 13;
        this.MOVE_Y          = 14;
        this.MOVE_YPRIME     = 15;
        this.MOVE_Z          = 16;
        this.MOVE_ZPRIME     = 17;
        this.NUM_VALID_MOVES = 18;
        // drawing
        this.stickerSize = window.innerWidth / 20;
        this.faceSize = this.stickerSize * this.dim;
    }
    
    // =======================================================================

    isSolved () {
        let solution = [
            // left
            ORANGE, ORANGE,
            ORANGE, ORANGE,
            // this.FRONT
            BLUE, BLUE,
            BLUE, BLUE,
            // this.RIGHT
            RED, RED,
            RED, RED,
            // this.BACK
            GREEN, GREEN, 
            GREEN, GREEN,
            // this.UP
            YELLOW, YELLOW, 
            YELLOW, YELLOW, 
            // this.DOWN
            WHITE, WHITE,
            WHITE, WHITE
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
            ORANGE, ORANGE,
            ORANGE, ORANGE,
            // this.FRONT
            BLUE, BLUE,
            BLUE, BLUE,
            // this.RIGHT
            RED, RED,
            RED, RED,
            // this.BACK
            GREEN, GREEN, 
            GREEN, GREEN,
            // this.UP
            YELLOW, YELLOW, 
            YELLOW, YELLOW, 
            // this.DOWN
            WHITE, WHITE,
            WHITE, WHITE
        ];
    }

    // =======================================================================
    // Moves

    move (move) {
        // Outer slice moves
        if (move == this.MOVE_L) this.L ();
        if (move == this.MOVE_LPRIME) this.LPrime ();
        if (move == this.MOVE_F) this.F ();
        if (move == this.MOVE_FPRIME) this.FPrime ();
        if (move == this.MOVE_R) this.R();
        if (move == this.MOVE_RPRIME) this.RPrime ();
        if (move == this.MOVE_B) this.B ();
        if (move == this.MOVE_BPRIME) this.BPrime ();
        if (move == this.MOVE_U) this.U ();
        if (move == this.MOVE_UPRIME) this.UPrime ();
        if (move == this.MOVE_D) this.D ();
        if (move == this.MOVE_DPRIME) this.DPrime ();
        // Cube rotations
        if (move == this.MOVE_X) this.X();
        if (move == this.MOVE_XPRIME) this.XPrime();
        if (move == this.MOVE_Y) this.Y();
        if (move == this.MOVE_YPRIME) this.YPrime();
        if (move == this.MOVE_Z) this.Z();
        if (move == this.MOVE_ZPRIME) this.ZPrime();
    }

    // =======================================================================

    // returns a list of valid moves
    getMoves () {

    }

    // =======================================================================
    // MOVES : OUTER SLICES
    // =======================================================================

    L () {
        // save last slice
        let cornerhigh = this.data[this.DOWN];
        let cornerlow = this.data[this.DOWN + 2];
        // move bottom corners
        this.data[this.DOWN + 2] = this.data[this.FRONT + 2];
        this.data[this.FRONT + 2] = this.data[this.UP + 2];
        this.data[this.UP + 2] = this.data[this.BACK + 1];
        this.data[this.BACK + 1] = cornerlow;
        // move top corners
        this.data[this.DOWN] = this.data[this.FRONT];
        this.data[this.FRONT] = this.data[this.UP];
        this.data[this.UP] = this.data[this.BACK + 3];
        this.data[this.BACK + 3] = cornerhigh;
        // rotate face
        let corner = this.data[this.LEFT];
        this.data[this.LEFT] = this.data[this.LEFT + 2];
        this.data[this.LEFT + 2] = this.data[this.LEFT + 3];
        this.data[this.LEFT + 3] = this.data[this.LEFT + 1];
        this.data[this.LEFT + 1] = corner;
    }

    // =======================================================================

    LPrime () {
        // save last slice
        let cornerhigh = this.data[this.DOWN];
        let cornerlow = this.data[this.DOWN + 2];
        // move bottom corners
        this.data[this.DOWN + 2] = this.data[this.BACK + 1];
        this.data[this.BACK + 1] = this.data[this.UP + 2];
        this.data[this.UP + 2] = this.data[this.FRONT + 2];
        this.data[this.FRONT + 2] = cornerlow;
        // move top corners
        this.data[this.DOWN] = this.data[this.BACK + 3];
        this.data[this.BACK + 3] = this.data[this.UP];
        this.data[this.UP] = this.data[this.FRONT];
        this.data[this.FRONT] = cornerhigh;
        // rotate face
        let corner = this.data[this.LEFT];
        this.data[this.LEFT] = this.data[this.LEFT + 1];
        this.data[this.LEFT + 1] = this.data[this.LEFT + 3];
        this.data[this.LEFT + 3] = this.data[this.LEFT + 2];
        this.data[this.LEFT + 2] = corner;
    }

    // =======================================================================

    F () {
        // save last slice
        let corner1 = this.data[this.UP + 2];
        let corner2 = this.data[this.UP + 3];
        // move top corners
        this.data[this.UP + 2] = this.data[this.LEFT + 3];
        this.data[this.LEFT + 3] = this.data[this.DOWN + 1];
        this.data[this.DOWN + 1] = this.data[this.RIGHT];
        this.data[this.RIGHT] = corner1;
        // move bottom corners
        this.data[this.UP + 3] = this.data[this.LEFT + 1];
        this.data[this.LEFT + 1] = this.data[this.DOWN];
        this.data[this.DOWN] = this.data[this.RIGHT + 2];
        this.data[this.RIGHT + 2] = corner2;
        // rotate face
        let corner = this.data[this.FRONT];
        this.data[this.FRONT] = this.data[this.FRONT + 2];
        this.data[this.FRONT + 2] = this.data[this.FRONT + 3];
        this.data[this.FRONT + 3] = this.data[this.FRONT + 1];
        this.data[this.FRONT + 1] = corner;
    }

    // =======================================================================

    FPrime () {
        // save last slice
        let corner1 = this.data[this.UP + 2];
        let corner2 = this.data[this.UP + 3];
        // move top corners
        this.data[this.UP + 2] = this.data[this.RIGHT];
        this.data[this.RIGHT] = this.data[this.DOWN + 1];
        this.data[this.DOWN + 1] = this.data[this.LEFT + 3];
        this.data[this.LEFT + 3] = corner1;
        // move bottom corners
        this.data[this.UP + 3] = this.data[this.RIGHT + 2];
        this.data[this.RIGHT + 2] = this.data[this.DOWN];
        this.data[this.DOWN] = this.data[this.LEFT + 1];
        this.data[this.LEFT + 1] = corner2;
        // rotate face
        let corner = this.data[this.FRONT];
        this.data[this.FRONT] = this.data[this.FRONT + 1];
        this.data[this.FRONT + 1] = this.data[this.FRONT + 3];
        this.data[this.FRONT + 3] = this.data[this.FRONT + 2];
        this.data[this.FRONT + 2] = corner;
    }

    // =======================================================================

    R () {
        // save last slice
        let cornerhigh = this.data[this.DOWN + 1];
        let cornerlow = this.data[this.DOWN + 3];
        // move bottom corners
        this.data[this.DOWN + 1] = this.data[this.BACK + 2];
        this.data[this.BACK + 2] = this.data[this.UP + 1];
        this.data[this.UP + 1] = this.data[this.FRONT + 1];
        this.data[this.FRONT + 1] = cornerhigh;
        // move top corners
        this.data[this.DOWN + 3] = this.data[this.BACK];
        this.data[this.BACK] = this.data[this.UP + 3];
        this.data[this.UP + 3] = this.data[this.FRONT + 3];
        this.data[this.FRONT + 3] = cornerlow;
        // rotate face
        let corner = this.data[this.RIGHT];
        this.data[this.RIGHT] = this.data[this.RIGHT + 2];
        this.data[this.RIGHT + 2] = this.data[this.RIGHT + 3];
        this.data[this.RIGHT + 3] = this.data[this.RIGHT + 1];
        this.data[this.RIGHT + 1] = corner;
    }

    // =======================================================================

    RPrime () {
        // save last slice
        let cornerhigh = this.data[this.DOWN + 1];
        let cornerlow = this.data[this.DOWN + 3];
        // move bottom corners
        this.data[this.DOWN + 1] = this.data[this.FRONT + 1];
        this.data[this.FRONT + 1] = this.data[this.UP + 1];
        this.data[this.UP + 1] = this.data[this.BACK + 2];
        this.data[this.BACK + 2] = cornerhigh;
        // move top corners
        this.data[this.DOWN + 3] = this.data[this.FRONT + 3];
        this.data[this.FRONT + 3] = this.data[this.UP + 3];
        this.data[this.UP + 3] = this.data[this.BACK];
        this.data[this.BACK] = cornerlow;
        // rotate face
        let corner = this.data[this.RIGHT];
        this.data[this.RIGHT] = this.data[this.RIGHT + 1];
        this.data[this.RIGHT + 1] = this.data[this.RIGHT + 3];
        this.data[this.RIGHT + 3] = this.data[this.RIGHT + 2];
        this.data[this.RIGHT + 2] = corner;
    }

    // =======================================================================

    B () {
        // save last slice
        let corner1 = this.data[this.UP];
        let corner2 = this.data[this.UP + 1];
        // move top corners
        this.data[this.UP] = this.data[this.RIGHT + 1];
        this.data[this.RIGHT + 1] = this.data[this.DOWN + 3];
        this.data[this.DOWN + 3] = this.data[this.LEFT + 2];
        this.data[this.LEFT + 2] = corner1;
        // move bottom corners
        this.data[this.UP + 1] = this.data[this.RIGHT + 3];
        this.data[this.RIGHT + 3] = this.data[this.DOWN + 2];
        this.data[this.DOWN + 2] = this.data[this.LEFT];
        this.data[this.LEFT] = corner2;
        // rotate face
        let corner = this.data[this.BACK];
        this.data[this.BACK] = this.data[this.BACK + 2];
        this.data[this.BACK + 2] = this.data[this.BACK + 3];
        this.data[this.BACK + 3] = this.data[this.BACK + 1];
        this.data[this.BACK + 1] = corner;
    }

    // =======================================================================

    BPrime () {
        // save last slice
        let corner1 = this.data[this.UP];
        let corner2 = this.data[this.UP + 1];
        // move top corners
        this.data[this.UP] = this.data[this.LEFT + 2];
        this.data[this.LEFT + 2] = this.data[this.DOWN + 3];
        this.data[this.DOWN + 3] = this.data[this.RIGHT + 1];
        this.data[this.RIGHT + 1] = corner1;
        // move bottom corners
        this.data[this.UP + 1] = this.data[this.LEFT];
        this.data[this.LEFT] = this.data[this.DOWN + 2];
        this.data[this.DOWN + 2] = this.data[this.RIGHT + 3];
        this.data[this.RIGHT + 3] = corner2;
        // rotate face
        let corner = this.data[this.BACK];
        this.data[this.BACK] = this.data[this.BACK + 1];
        this.data[this.BACK + 1] = this.data[this.BACK + 3];
        this.data[this.BACK + 3] = this.data[this.BACK + 2];
        this.data[this.BACK + 2] = corner;
    }

    // =======================================================================

    U () {
        // save last slice
        let corner1 = this.data[this.FRONT];
        let corner2 = this.data[this.FRONT + 1];
        // move this.LEFT corners
        this.data[this.FRONT] = this.data[this.RIGHT];
        this.data[this.RIGHT] = this.data[this.BACK];
        this.data[this.BACK] = this.data[this.LEFT];
        this.data[this.LEFT] = corner1;
        // move this.RIGHT corners
        this.data[this.FRONT + 1] = this.data[this.RIGHT + 1];
        this.data[this.RIGHT + 1] = this.data[this.BACK + 1];
        this.data[this.BACK + 1] = this.data[this.LEFT + 1];
        this.data[this.LEFT + 1] = corner2;
        // rotate face
        let corner = this.data[this.UP];
        this.data[this.UP] = this.data[this.UP + 2];
        this.data[this.UP + 2] = this.data[this.UP + 3];
        this.data[this.UP + 3] = this.data[this.UP + 1];
        this.data[this.UP + 1] = corner;
    }

    // =======================================================================

    UPrime () {
        // save last slice
        let corner1 = this.data[this.FRONT];
        let corner2 = this.data[this.FRONT + 1];
        // move this.LEFT corners
        this.data[this.FRONT] = this.data[this.LEFT];
        this.data[this.LEFT] = this.data[this.BACK];
        this.data[this.BACK] = this.data[this.RIGHT];
        this.data[this.RIGHT] = corner1;
        // move this.RIGHT corners
        this.data[this.FRONT + 1] = this.data[this.LEFT + 1];
        this.data[this.LEFT + 1] = this.data[this.BACK + 1];
        this.data[this.BACK + 1] = this.data[this.RIGHT + 1];
        this.data[this.RIGHT + 1] = corner2;
        // rotate face
        let corner = this.data[this.UP];
        this.data[this.UP] = this.data[this.UP + 1];
        this.data[this.UP + 1] = this.data[this.UP + 3];
        this.data[this.UP + 3] = this.data[this.UP + 2];
        this.data[this.UP + 2] = corner;
    }

    // =======================================================================

    D () {
        // save last slice
        let corner1 = this.data[this.FRONT + 2];
        let corner2 = this.data[this.FRONT + 3];
        // move corner 1 
        this.data[this.FRONT + 2] = this.data[this.LEFT + 2];
        this.data[this.LEFT + 2] = this.data[this.BACK + 2];
        this.data[this.BACK + 2] = this.data[this.RIGHT + 2]; 
        this.data[this.RIGHT + 2] = corner1; 
        // move this.RIGHT corners
        this.data[this.FRONT + 3] = this.data[this.LEFT + 3];
        this.data[this.LEFT + 3] = this.data[this.BACK + 3];
        this.data[this.BACK + 3] = this.data[this.RIGHT + 3];
        this.data[this.RIGHT + 3] = corner2;
        // rotate face
        let corner = this.data[this.DOWN];
        this.data[this.DOWN] = this.data[this.DOWN + 2];
        this.data[this.DOWN + 2] = this.data[this.DOWN + 3];
        this.data[this.DOWN + 3] = this.data[this.DOWN + 1];
        this.data[this.DOWN + 1] = corner;
    }

    // =======================================================================

    DPrime () {
        // save last slice
        let corner1 = this.data[this.FRONT + 2];
        let corner2 = this.data[this.FRONT + 3];
        // move corner 1 
        this.data[this.FRONT + 2] = this.data[this.RIGHT + 2];
        this.data[this.RIGHT + 2] = this.data[this.BACK + 2];
        this.data[this.BACK + 2] = this.data[this.LEFT + 2]; 
        this.data[this.LEFT + 2] = corner1; 
        // move this.RIGHT corners
        this.data[this.FRONT + 3] = this.data[this.RIGHT + 3];
        this.data[this.RIGHT + 3] = this.data[this.BACK + 3];
        this.data[this.BACK + 3] = this.data[this.LEFT + 3];
        this.data[this.LEFT + 3] = corner2;
        // rotate face
        let corner = this.data[this.DOWN];
        this.data[this.DOWN] = this.data[this.DOWN + 1];
        this.data[this.DOWN + 1] = this.data[this.DOWN + 3];
        this.data[this.DOWN + 3] = this.data[this.DOWN + 2];
        this.data[this.DOWN + 2] = corner;
    }

    // =======================================================================
    // MOVES : CUBE ROTATIONS
    // =======================================================================

    // Cube rotation around X axis
    // clockwise from right side
    X () {
        // we can use other moves to achieve this
        this.LPrime ();
        this.R ();
    }

    // =======================================================================

    // Cube rotation around X axis
    // counter-clockwise from right side
    XPrime () {
        // we can use other moves to achieve this
        this.L ();
        this.RPrime ();
    }

    // =======================================================================

    // Cube rotation around Y axis
    // clockwise from top side
    Y () {
        // we can use other moves to achieve this
        this.U ();
        this.DPrime ();
    }

    // =======================================================================

    // Cube rotation around Y axis
    // counter-clockwise from top side
    YPrime () {
        // we can use other moves to achieve this
        this.UPrime ();
        this.D ();
    }

    // =======================================================================

    // Cube rotation around Z axis
    // clockwise from front side
    Z () {
        // we can use other moves to achieve this
        this.F ();
        this.BPrime ();
    }

    // =======================================================================

    // Cube rotation around Z axis
    // counter-clockwise from front side
    ZPrime () {
        // we can use other moves to achieve this
        this.FPrime ();
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
        // this.LEFT
        this.drawFace (startX, startY, this.stickerSize, this.LEFT);
        // this.FRONT
        this.drawFace (startX + this.faceSize, startY, this.stickerSize, this.FRONT);
        // this.RIGHT
        this.drawFace (startX + this.faceSize * 2, startY, this.stickerSize, this.RIGHT);
        // this.BACK
        this.drawFace (startX + this.faceSize * 3, startY, this.stickerSize, this.BACK);
        // this.UP
        this.drawFace (startX + this.faceSize, startY - this.faceSize, this.stickerSize, this.UP);
        // this.DOWN
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
        square (startX                  , startY + stickerSize    , stickerSize);
        fill (this.getColor(this.data[elemOffset + 3]));
        square (startX + stickerSize    , startY + stickerSize    , stickerSize);
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
        // Cube rotations
        if (move == this.MOVE_X)      return "X";
        if (move == this.MOVE_XPRIME) return "X'";
        if (move == this.MOVE_Y)      return "Y";
        if (move == this.MOVE_YPRIME) return "Y'";
        if (move == this.MOVE_Z)      return "Z";
        if (move == this.MOVE_ZPRIME) return "Z'";
    }
}