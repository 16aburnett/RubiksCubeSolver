//  Rubiks Cube: single cubie representation
//  By Amy Burnett
//  August 15 2024
//
// =======================================================================



// =======================================================================

class Cubie {
    constructor (xi, yi, zi)
    {
        this.xi = xi;
        this.yi = yi;
        this.zi = zi;
        // Cubies dont actually have 6 stickers,
        // but we can assume they do for simplicity
        this.stickers = [
            // UP
            new Sticker (createVector ( 0, -1,  0), YELLOW),
            // DOWN
            new Sticker (createVector ( 0,  1,  0), WHITE),
            // LEFT
            new Sticker (createVector (-1,  0,  0), ORANGE),
            // RIGHT
            new Sticker (createVector ( 1,  0,  0), RED),
            // FRONT
            new Sticker (createVector ( 0,  0,  1), BLUE),
            // BACK
            new Sticker (createVector ( 0,  0, -1), GREEN),
        ];
    }

    // =======================================================================

    update (x, y, z)
    {
        this.xi = x;
        this.yi = y;
        this.zi = z;
    }

    // =======================================================================

    rotateX (angle)
    {
        // Manual matrix math with rotation matrix
        let newx = Math.round ((1 * this.xi) + (                0 * this.yi) + (                0 * this.zi));
        let newy = Math.round ((0 * this.xi) + ( Math.cos (angle) * this.yi) + (-Math.sin (angle) * this.zi));
        let newz = Math.round ((0 * this.xi) + ( Math.sin (angle) * this.yi) + ( Math.cos (angle) * this.zi));
        this.xi = newx;
        this.yi = newy;
        this.zi = newz;
        // rotate stickers as well
        for (let sticker of this.stickers)
        {
            sticker.rotateX (angle);
        }
    }

    // =======================================================================

    rotateY (angle)
    {
        // Manual matrix math with rotation matrix
        let newx = Math.round (( Math.cos (angle) * this.xi) + (                0 * this.yi) + ( Math.sin (angle) * this.zi));
        let newy = Math.round ((                0 * this.xi) + (                1 * this.yi) + (                0 * this.zi));
        let newz = Math.round ((-Math.sin (angle) * this.xi) + (                0 * this.yi) + ( Math.cos (angle) * this.zi));
        this.xi = newx;
        this.yi = newy;
        this.zi = newz;
        // rotate stickers as well
        for (let sticker of this.stickers)
        {
            sticker.rotateY (angle);
        }
    }

    // =======================================================================

    rotateZ (angle)
    {
        // Manual matrix math with rotation matrix
        let newx = Math.round (( Math.cos (angle) * this.xi) + (-Math.sin (angle) * this.yi) + (                0 * this.zi));
        let newy = Math.round (( Math.sin (angle) * this.xi) + ( Math.cos (angle) * this.yi) + (                0 * this.zi));
        let newz = Math.round ((                0 * this.xi) + (                0 * this.yi) + (                1 * this.zi));
        this.xi = newx;
        this.yi = newy;
        this.zi = newz;
        // rotate stickers as well
        for (let sticker of this.stickers)
        {
            sticker.rotateZ (angle);
        }
    }

    // =======================================================================

    draw ()
    {
        graphics.push ();

        let cubieSize = min (graphics.width, graphics.height) / 10;

        // move to cubie position
        graphics.translate (this.xi * cubieSize, this.yi * cubieSize, this.zi * cubieSize);

        // draw cubie
        graphics.fill (0);
        graphics.box (cubieSize);

        // draw stickers on cubie
        for (let sticker of this.stickers)
        {
            sticker.draw (cubieSize);
        }
        
        // move back from cubie position
        graphics.translate (-this.xi * cubieSize, -this.yi * cubieSize, -this.zi * cubieSize);

        graphics.pop ();
    }
}