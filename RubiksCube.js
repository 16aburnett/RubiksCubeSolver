/*
    Rubiks Cube 3x3
    By Amy Burnett
    August 15 2024
*/

// =======================================================================

// const TURN_SPEED = 2;

// =======================================================================

class RubiksCube3x3
{

    constructor ()
    {
        this.dim = 3;
        this.cubies = [];
        let low = -1;
        let high = 1;
        for (let xi = low; xi <= high; ++xi)
        {
            for (let yi = low; yi <= high; ++yi)
            {
                for (let zi = low; zi <= high; ++zi)
                {
                    // TODO: this should probably ignore hidden cubies
                    this.cubies.push (new Cubie (xi, yi, zi));
                }
            }
        }
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

        // Drawing
        this.minimapSizeFactor = 30;

        // Animating
        this.currentMove = 0;
        this.currentAngle = 0;
        this.currentSpeed = TURN_SPEED;
        this.isTurning = false;
    }
    
    // =======================================================================

    isSolved ()
    {

    }

    // =======================================================================

    // restores cube to solved state
    reset ()
    {
        this.cubies = [];
        let low = -1;
        let high = 1;
        for (let xi = low; xi <= high; ++xi)
        {
            for (let yi = low; yi <= high; ++yi)
            {
                for (let zi = low; zi <= high; ++zi)
                {
                    // TODO: this should probably ignore hidden cubies
                    this.cubies.push (new Cubie (xi, yi, zi));
                }
            }
        }
    }

    // =======================================================================
    // Moves

    move (move)
    {
        // Outer slice moves
        if (move == this.MOVE_L) this.rotateX (-1, -1);
        if (move == this.MOVE_LPRIME) this.rotateX (-1, 1);
        if (move == this.MOVE_F) this.rotateZ (1, 1);
        if (move == this.MOVE_FPRIME) this.rotateZ (1, -1);
        if (move == this.MOVE_R) this.rotateX (1, 1);
        if (move == this.MOVE_RPRIME) this.rotateX (1, -1);
        if (move == this.MOVE_B) this.rotateZ (-1, -1);
        if (move == this.MOVE_BPRIME) this.rotateZ (-1, 1);
        if (move == this.MOVE_U) this.rotateY (-1, -1);
        if (move == this.MOVE_UPRIME) this.rotateY (-1, 1);
        if (move == this.MOVE_D) this.rotateY (1, 1);
        if (move == this.MOVE_DPRIME) this.rotateY (1, -1);
        // Middle slice moves
        if (move == this.MOVE_M) this.rotateX (0, 1);
        if (move == this.MOVE_MPRIME) this.rotateX (0, -1);
        if (move == this.MOVE_E) this.rotateY (0, -1);
        if (move == this.MOVE_EPRIME) this.rotateY (0, 1);
        if (move == this.MOVE_S) this.rotateZ (0, 1);
        if (move == this.MOVE_SPRIME) this.rotateZ (0, -1);
        // Cube rotations
        if (move == this.MOVE_X)
        {
            this.rotateX (-1, 1);
            this.rotateX ( 0, 1);
            this.rotateX ( 1, 1);
        }
        if (move == this.MOVE_XPRIME)
        {
            this.rotateX (-1, -1);
            this.rotateX ( 0, -1);
            this.rotateX ( 1, -1);
        }
        if (move == this.MOVE_Y)
        {
            this.rotateY (-1, -1);
            this.rotateY ( 0, -1);
            this.rotateY ( 1, -1);
        }
        if (move == this.MOVE_YPRIME)
        {
            this.rotateY (-1, 1);
            this.rotateY ( 0, 1);
            this.rotateY ( 1, 1);
        }
        if (move == this.MOVE_Z)
        {
            this.rotateZ (-1, 1);
            this.rotateZ ( 0, 1);
            this.rotateZ ( 1, 1);
        }
        if (move == this.MOVE_ZPRIME)
        {
            this.rotateZ (-1, -1);
            this.rotateZ ( 0, -1);
            this.rotateZ ( 1, -1);
        }
    }

    // =======================================================================

    rotateX (index, dir)
    {
        for (let i = 0; i < this.cubies.length; ++i)
        {
            let cubie = this.cubies[i];
            if (cubie.xi == index) {
                cubie.rotateX (dir * HALF_PI);
            }
        }
    }

    // =======================================================================

    rotateY (index, dir)
    {
        for (let i = 0; i < this.cubies.length; ++i)
        {
            let cubie = this.cubies[i];
            if (cubie.yi == index) {
                cubie.rotateY (dir * HALF_PI);
            }
        }
    }

    // =======================================================================

    rotateZ (index, dir)
    {
        for (let i = 0; i < this.cubies.length; ++i)
        {
            let cubie = this.cubies[i];
            if (cubie.zi == index) {
                cubie.rotateZ (dir * HALF_PI);
            }
        }
    }

    // =======================================================================

    update ()
    {
        // keep turning layer if we were turning something
        if (this.isTurning)
        {
            this.currentAngle += this.currentSpeed;
            // Check for if the turn is complete
            if (Math.abs (this.currentAngle) > 90)
            {
                // no longer turning
                this.isTurning = false;
                this.currentAngle = 0;
                // Animation is complete so update the data to reflect the move
                this.move (this.currentMove);
            }
        }
    }

    // =======================================================================

    // Performs the given move on the rubiks cube
    // in contrast with move(move), this animates the rubiks cube to turn
    // the layer associated with the move and will update the actual cube state
    // when the animation has finished.
    animatedMove (move)
    {
        // Ensure we arent already performing a move
        if (this.isTurning)
            return false;
        this.currentMove = move;
        this.currentAngle = 0;
        this.currentSpeed = TURN_SPEED;
        this.isTurning = true;
    }

    // =======================================================================

    // Draws 3D representation of the rubiks cube to the current graphics
    // Generalized for any cube size
    draw3DCube ()
    {
        // Rotate the whole cube so we can see more than one side initially
        graphics.rotateX (-30);
        graphics.rotateY (-45);

        let low = -1;
        let high = 1;
        for (let i = 0; i < this.cubies.length; ++i)
        {
            let cubie = this.cubies[i];
            let xi = cubie.xi;
            let yi = cubie.yi;
            let zi = cubie.zi;
            // **this is not generalized - hardcoded to 3x3 moves
            if (this.isTurning && this.currentMove == this.MOVE_U && yi == low)
            {
                graphics.rotateY (-this.currentAngle);
                cubie.draw ();
                graphics.rotateY ( this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_UPRIME && yi == low)
            {
                graphics.rotateY ( this.currentAngle);
                cubie.draw ();
                graphics.rotateY (-this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_D&& yi == high)
            {
                graphics.rotateY ( this.currentAngle);
                cubie.draw ();
                graphics.rotateY (-this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_DPRIME && yi == high)
            {
                graphics.rotateY (-this.currentAngle);
                cubie.draw ();
                graphics.rotateY ( this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_F && zi == high)
            {
                graphics.rotateZ ( this.currentAngle);
                cubie.draw ();
                graphics.rotateZ (-this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_FPRIME && zi == high)
            {
                graphics.rotateZ (-this.currentAngle);
                cubie.draw ();
                graphics.rotateZ ( this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_B && zi == low)
            {
                graphics.rotateZ (-this.currentAngle);
                cubie.draw ();
                graphics.rotateZ ( this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_BPRIME && zi == low)
            {
                graphics.rotateZ ( this.currentAngle);
                cubie.draw ();
                graphics.rotateZ (-this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_L && xi == low)
            {
                graphics.rotateX (-this.currentAngle);
                cubie.draw ();
                graphics.rotateX ( this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_LPRIME && xi == low)
            {
                graphics.rotateX ( this.currentAngle);
                cubie.draw ();
                graphics.rotateX (-this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_R && xi == high)
            {
                graphics.rotateX ( this.currentAngle);
                cubie.draw ();
                graphics.rotateX (-this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_RPRIME && xi == high)
            {
                graphics.rotateX (-this.currentAngle);
                cubie.draw ();
                graphics.rotateX ( this.currentAngle);
            }
            // Middle slice moves
            else if (this.isTurning && this.currentMove == this.MOVE_M && xi == 0)
            {
                graphics.rotateX ( this.currentAngle);
                cubie.draw ();
                graphics.rotateX (-this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_MPRIME && xi == 0)
            {
                graphics.rotateX (-this.currentAngle);
                cubie.draw ();
                graphics.rotateX ( this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_E && yi == 0)
            {
                graphics.rotateY (-this.currentAngle);
                cubie.draw ();
                graphics.rotateY ( this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_EPRIME && yi == 0)
            {
                graphics.rotateY ( this.currentAngle);
                cubie.draw ();
                graphics.rotateY (-this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_S && zi == 0)
            {
                graphics.rotateZ ( this.currentAngle);
                cubie.draw ();
                graphics.rotateZ (-this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_SPRIME && zi == 0)
            {
                graphics.rotateZ (-this.currentAngle);
                cubie.draw ();
                graphics.rotateZ ( this.currentAngle);
            }
            // Cube rotations
            else if (this.isTurning && this.currentMove == this.MOVE_X)
            {
                graphics.rotateX ( this.currentAngle);
                cubie.draw ();
                graphics.rotateX (-this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_XPRIME)
            {
                graphics.rotateX (-this.currentAngle);
                cubie.draw ();
                graphics.rotateX ( this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_Y)
            {
                // y-axis is inverted
                graphics.rotateY (-this.currentAngle);
                cubie.draw ();
                graphics.rotateY ( this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_YPRIME)
            {
                // y-axis is inverted
                graphics.rotateY ( this.currentAngle);
                cubie.draw ();
                graphics.rotateY (-this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_Z)
            {
                graphics.rotateZ ( this.currentAngle);
                cubie.draw ();
                graphics.rotateZ (-this.currentAngle);
            }
            else if (this.isTurning && this.currentMove == this.MOVE_ZPRIME)
            {
                graphics.rotateZ (-this.currentAngle);
                cubie.draw ();
                graphics.rotateZ ( this.currentAngle);
            }
            else
            {
                cubie.draw ();
            }
        }
        // undo cube rotation
        graphics.rotateY ( 45);
        graphics.rotateX ( 30);
    }

    // =======================================================================

    // Draws rubiks cube 2D minimap representation that shows all sides
    // of the cube.
    drawMinimap ()
    {
        // TODO
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