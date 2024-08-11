/*
    Rubiks Cube 2x2x2 Representation
    By Amy Burnett
    February 7 2020
*/

// =======================================================================

// =======================================================================

class RubiksCube2 {

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
        this.stickerSize = window.innerWidth / 20;
        this.faceSize = this.stickerSize * 2;
    }
    
    // =======================================================================

    isSolved() {
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

    // returns a list of valid moves
    getMoves() {

    }

    l() {
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
    lPrime() {
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
    f() {
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
    fPrime() {
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
    r() {
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
    rPrime() {
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
    b() {
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
    bPrime() {
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
    u() {
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
    uPrime() {
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
    d() {
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
    dPrime() {
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

    // Cube rotation around X axis
    // clockwise from right side
    x () {
        // we can use other moves to achieve this
        this.lPrime ();
        this.r ();
    }

    // =======================================================================

    // Cube rotation around X axis
    // counter-clockwise from right side
    xPrime () {
        // we can use other moves to achieve this
        this.l ();
        this.rPrime ();
    }

    // =======================================================================

    // Cube rotation around Y axis
    // clockwise from top side
    y () {
        // we can use other moves to achieve this
        this.u ();
        this.dPrime ();
    }

    // =======================================================================

    // Cube rotation around Y axis
    // counter-clockwise from top side
    yPrime () {
        // we can use other moves to achieve this
        this.uPrime ();
        this.d ();
    }

    // =======================================================================

    // Cube rotation around Z axis
    // clockwise from front side
    z () {
        // we can use other moves to achieve this
        this.f ();
        this.bPrime ();
    }

    // =======================================================================

    // Cube rotation around Z axis
    // counter-clockwise from front side
    zPrime () {
        // we can use other moves to achieve this
        this.fPrime ();
        this.b ();
    }

    // =======================================================================

    draw() {

        let startX = 50;
        let startY = 275;
        strokeWeight(3);
        stroke('black');

        // draw each face
        // this.LEFT
        this.drawFace(startX, startY, this.stickerSize, this.LEFT);
        // this.FRONT
        this.drawFace(startX + this.faceSize, startY, this.stickerSize, this.FRONT);
        // this.RIGHT
        this.drawFace(startX + this.faceSize * 2, startY, this.stickerSize, this.RIGHT);
        // this.BACK
        this.drawFace(startX + this.faceSize * 3, startY, this.stickerSize, this.BACK);
        // this.UP
        this.drawFace(startX + this.faceSize, startY - this.faceSize, this.stickerSize, this.UP);
        // this.DOWN
        this.drawFace(startX + this.faceSize, startY + this.faceSize, this.stickerSize, this.DOWN);

    }

    // =======================================================================

    // draws each sticker associated with a face of the cube
    drawFace(startX, startY, stickerSize, elemOffset) {
        fill(this.getColor(this.data[elemOffset]));
        square(startX                  , startY                  , stickerSize);
        fill(this.getColor(this.data[elemOffset + 1]));
        square(startX + stickerSize    , startY                  , stickerSize);
        fill(this.getColor(this.data[elemOffset + 2]));
        square(startX                  , startY + stickerSize    , stickerSize);
        fill(this.getColor(this.data[elemOffset + 3]));
        square(startX + stickerSize    , startY + stickerSize    , stickerSize);
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