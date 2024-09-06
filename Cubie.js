//  Rubiks Cube: single cubie representation
//  By Amy Burnett
//  August 15 2024
//
// =======================================================================



// =======================================================================

class Cubie {
    constructor (xi, yi, zi, low, high, dim)
    {
        // Cubie position
        // This is an index based position relative to the cube
        // Not the actual X,Y,Z position in world space
        this.xi = xi;
        this.yi = yi;
        this.zi = zi;
        // Cubie orientation
        // We can keep track of the orientation using the front
        // and up normals
        this.front = createVector ( 0,  0,  1);
        this.up    = createVector ( 0, -1,  0); // y-axis is inverted

        this.low = low;
        this.high = high;
        this.dim = dim;
        // Enums for sticker direction
        this.UP    = createVector ( 0, -1,  0);
        this.DOWN  = createVector ( 0,  1,  0);
        this.LEFT  = createVector (-1,  0,  0);
        this.RIGHT = createVector ( 1,  0,  0);
        this.FRONT = createVector ( 0,  0,  1);
        this.BACK  = createVector ( 0,  0, -1);
        // The stickers for this cubie.
        this.stickers = [];
        // Only add the stickers that will be seen
        // UP - y-axis is mirrored
        if (yi == low)
            this.stickers.push (new Sticker (this.UP   .copy (), YELLOW));
        // DOWN - y-axis is mirrored
        if (yi == high)
            this.stickers.push (new Sticker (this.DOWN .copy (), WHITE));
        // LEFT
        if (xi == low)
            this.stickers.push (new Sticker (this.LEFT .copy (), ORANGE));
        // RIGHT
        if (xi == high)
            this.stickers.push (new Sticker (this.RIGHT.copy (), RED));
        // FRONT
        if (zi == high)
            this.stickers.push (new Sticker (this.FRONT.copy (), BLUE));
        // BACK
        if (zi == low)
            this.stickers.push (new Sticker (this.BACK .copy (), GREEN));
        // A lookup table organized by sticker direction vectors
        // This is to optimize sticker lookup so that not all 12
        // stickers need to be checked to get a specific sticker.
        // this.stickersLookupTable = [];
    }

    // =======================================================================

    // Returns a new Cubie with the same state
    copy ()
    {
        let newCubie = new Cubie (this.xi, this.yi, this.zi, this.low, this.high, this.dim);
        // Copy each of the stickers
        newCubie.stickers = [];
        for (let sticker of this.stickers)
        {
            newCubie.stickers.push (sticker.copy ());
        }
        // Copy stickers lookup table
        // newCubie.stickersLookupTable = this.stickersLookupTable.slice ();
        return newCubie;
    }

    // =======================================================================

    // Returns the sticker color for the sticker in the given direction
    getStickerColor (directionVector)
    {
        // this loop might be bad for performance
        // idealy this should be a lookup rather than a search
        // but it is a max of 3 stickers so this might be fine
        for (let sticker of this.stickers)
        {
            // Ensure sticker matches direction
            if (!(sticker.normal.x == directionVector.x && sticker.normal.y == directionVector.y && sticker.normal.z == directionVector.z))
                continue;
            return sticker.color;
        }
    }

    // =======================================================================

    rotateX (angle)
    {
        // Change position
        // Manual matrix math with rotation matrix
        let newx = Math.round ((1 * this.xi) + (                0 * this.yi) + (                0 * this.zi));
        let newy = Math.round ((0 * this.xi) + ( Math.cos (angle) * this.yi) + (-Math.sin (angle) * this.zi));
        let newz = Math.round ((0 * this.xi) + ( Math.sin (angle) * this.yi) + ( Math.cos (angle) * this.zi));
        this.xi = newx;
        this.yi = newy;
        this.zi = newz;
        // Rotate orientation
        let newupx = Math.round ((1 * this.up.x) + (                0 * this.up.y) + (                0 * this.up.z));
        let newupy = Math.round ((0 * this.up.x) + ( Math.cos (angle) * this.up.y) + (-Math.sin (angle) * this.up.z));
        let newupz = Math.round ((0 * this.up.x) + ( Math.sin (angle) * this.up.y) + ( Math.cos (angle) * this.up.z));
        this.up.x = newupx;
        this.up.y = newupy;
        this.up.z = newupz;
        let newfrontx = Math.round ((1 * this.front.x) + (                0 * this.front.y) + (                0 * this.front.z));
        let newfronty = Math.round ((0 * this.front.x) + ( Math.cos (angle) * this.front.y) + (-Math.sin (angle) * this.front.z));
        let newfrontz = Math.round ((0 * this.front.x) + ( Math.sin (angle) * this.front.y) + ( Math.cos (angle) * this.front.z));
        this.front.x = newfrontx;
        this.front.y = newfronty;
        this.front.z = newfrontz;
        // rotate stickers as well
        // for (let sticker of this.stickers)
        // {
        //     sticker.rotateX (angle);
        // }
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
        // Rotate orientation
        let newupx = Math.round (( Math.cos (angle) * this.up.x) + (                0 * this.up.y) + ( Math.sin (angle) * this.up.z));
        let newupy = Math.round ((                0 * this.up.x) + (                1 * this.up.y) + (                0 * this.up.z));
        let newupz = Math.round ((-Math.sin (angle) * this.up.x) + (                0 * this.up.y) + ( Math.cos (angle) * this.up.z));
        this.up.x = newupx;
        this.up.y = newupy;
        this.up.z = newupz;
        let newfrontx = Math.round (( Math.cos (angle) * this.front.x) + (                0 * this.front.y) + ( Math.sin (angle) * this.front.z));
        let newfronty = Math.round ((                0 * this.front.x) + (                1 * this.front.y) + (                0 * this.front.z));
        let newfrontz = Math.round ((-Math.sin (angle) * this.front.x) + (                0 * this.front.y) + ( Math.cos (angle) * this.front.z));
        this.front.x = newfrontx;
        this.front.y = newfronty;
        this.front.z = newfrontz;
        // rotate stickers as well
        // for (let sticker of this.stickers)
        // {
        //     sticker.rotateY (angle);
        // }
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
        // Rotate orientation
        let newupx = Math.round (( Math.cos (angle) * this.up.x) + (-Math.sin (angle) * this.up.y) + (                0 * this.up.z));
        let newupy = Math.round (( Math.sin (angle) * this.up.x) + ( Math.cos (angle) * this.up.y) + (                0 * this.up.z));
        let newupz = Math.round ((                0 * this.up.x) + (                0 * this.up.y) + (                1 * this.up.z));
        this.up.x = newupx;
        this.up.y = newupy;
        this.up.z = newupz;
        let newfrontx = Math.round (( Math.cos (angle) * this.front.x) + (-Math.sin (angle) * this.front.y) + (                0 * this.front.z));
        let newfronty = Math.round (( Math.sin (angle) * this.front.x) + ( Math.cos (angle) * this.front.y) + (                0 * this.front.z));
        let newfrontz = Math.round ((                0 * this.front.x) + (                0 * this.front.y) + (                1 * this.front.z));
        this.front.x = newfrontx;
        this.front.y = newfronty;
        this.front.z = newfrontz;
        // rotate stickers as well
        // for (let sticker of this.stickers)
        // {
        //     sticker.rotateZ (angle);
        // }
    }

    // =======================================================================

    draw ()
    {
        graphics.push ();

        // Convert cubie index position to real position
        let cubieSize = min (graphics.width, graphics.height) / 10;
        let x = this.xi;
        let y = this.yi;
        let z = this.zi;
        // Fix position for even parity layered cubes
        // Even layered cubes have a fake middle dummy layer
        // we need to bring in the layers by 50% of a cubie
        let isEvenLayeredCube = this.dim % 2 == 0;
        if (isEvenLayeredCube)
        {
            x = Math.sign (x) * (Math.abs (x) - 0.5);
            y = Math.sign (y) * (Math.abs (y) - 0.5);
            z = Math.sign (z) * (Math.abs (z) - 0.5);
        }

        // move to cubie position
        graphics.translate (x * cubieSize, y * cubieSize, z * cubieSize);

        // draw cubie
        graphics.noFill ();
        graphics.stroke (0);
        graphics.strokeWeight (1);
        graphics.box (cubieSize);

        // draw stickers on cubie
        let distCubieCenterToStickerLocation = cubieSize/2 + 0.1;
        let stickerSize = cubieSize - 5;
        // UP - y-axis is mirrored
        let normal = this.up.copy ();
        // if (this.yi == this.low)
        {
            let stickerColor = YELLOW;
            // this.stickers.push (new Sticker (this.UP   .copy (), YELLOW));
            graphics.translate (
                normal.x * distCubieCenterToStickerLocation,
                normal.y * distCubieCenterToStickerLocation,
                normal.z * distCubieCenterToStickerLocation
            );
            // rotate so that sticker is facing the same direction as
            // the normal
            if (Math.abs (normal.x) > 0)
            {
                graphics.rotateY (90);
            }
            if (Math.abs (normal.y) > 0)
            {
                graphics.rotateX (90);
            }
            graphics.fill (getColor (stickerColor));
            graphics.noStroke ();
            graphics.plane (stickerSize);
            // undo sticker rotation
            if (Math.abs (normal.x) > 0)
            {
                graphics.rotateY (-90);
            }
            if (Math.abs (normal.y) > 0)
            {
                graphics.rotateX (-90);
            }
            graphics.translate (
                -normal.x * distCubieCenterToStickerLocation,
                -normal.y * distCubieCenterToStickerLocation,
                -normal.z * distCubieCenterToStickerLocation
            );
        }
        // DOWN - y-axis is mirrored
        normal = p5.Vector.mult (this.up, -1);
        // if (this.yi * Math.abs (normal.y) == this.high)
        {
            let stickerColor = WHITE;
            // this.stickers.push (new Sticker (this.DOWN .copy (), WHITE));
            graphics.translate (
                normal.x * distCubieCenterToStickerLocation,
                normal.y * distCubieCenterToStickerLocation,
                normal.z * distCubieCenterToStickerLocation
            );
            // rotate so that sticker is facing the same direction as
            // the normal
            if (Math.abs (normal.x) > 0)
            {
                graphics.rotateY (90);
            }
            if (Math.abs (normal.y) > 0)
            {
                graphics.rotateX (90);
            }
            graphics.fill (getColor (stickerColor));
            graphics.noStroke ();
            graphics.plane (stickerSize);
            // undo sticker rotation
            if (Math.abs (normal.x) > 0)
            {
                graphics.rotateY (-90);
            }
            if (Math.abs (normal.y) > 0)
            {
                graphics.rotateX (-90);
            }
            graphics.translate (
                -normal.x * distCubieCenterToStickerLocation,
                -normal.y * distCubieCenterToStickerLocation,
                -normal.z * distCubieCenterToStickerLocation
            );
        }
        // LEFT
        normal = p5.Vector.cross (this.up, this.front);
        // if (this.xi * Math.abs (normal.x) == this.low)
        {
            let stickerColor = ORANGE;
            // this.stickers.push (new Sticker (this.LEFT .copy (), ORANGE));
            graphics.translate (
                normal.x * distCubieCenterToStickerLocation,
                normal.y * distCubieCenterToStickerLocation,
                normal.z * distCubieCenterToStickerLocation
            );
            // rotate so that sticker is facing the same direction as
            // the normal
            if (Math.abs (normal.x) > 0)
            {
                graphics.rotateY (90);
            }
            if (Math.abs (normal.y) > 0)
            {
                graphics.rotateX (90);
            }
            graphics.fill (getColor (stickerColor));
            graphics.noStroke ();
            graphics.plane (stickerSize);
            // undo sticker rotation
            if (Math.abs (normal.x) > 0)
            {
                graphics.rotateY (-90);
            }
            if (Math.abs (normal.y) > 0)
            {
                graphics.rotateX (-90);
            }
            graphics.translate (
                -normal.x * distCubieCenterToStickerLocation,
                -normal.y * distCubieCenterToStickerLocation,
                -normal.z * distCubieCenterToStickerLocation
            );
        }
        // RIGHT
        normal = p5.Vector.cross (this.front, this.up);
        // if (this.xi * Math.abs (normal.x) == this.high)
        {
            let stickerColor = RED;
            // this.stickers.push (new Sticker (this.RIGHT.copy (), RED));
            graphics.translate (
                normal.x * distCubieCenterToStickerLocation,
                normal.y * distCubieCenterToStickerLocation,
                normal.z * distCubieCenterToStickerLocation
            );
            // rotate so that sticker is facing the same direction as
            // the normal
            if (Math.abs (normal.x) > 0)
            {
                graphics.rotateY (90);
            }
            if (Math.abs (normal.y) > 0)
            {
                graphics.rotateX (90);
            }
            graphics.fill (getColor (stickerColor));
            graphics.noStroke ();
            graphics.plane (stickerSize);
            // undo sticker rotation
            if (Math.abs (normal.x) > 0)
            {
                graphics.rotateY (-90);
            }
            if (Math.abs (normal.y) > 0)
            {
                graphics.rotateX (-90);
            }
            graphics.translate (
                -normal.x * distCubieCenterToStickerLocation,
                -normal.y * distCubieCenterToStickerLocation,
                -normal.z * distCubieCenterToStickerLocation
            );
        }
        // FRONT
        normal = p5.Vector.mult (this.front, 1);
        // if (this.zi * Math.abs (normal.z) == this.high)
        {
            let stickerColor = BLUE;
            // this.stickers.push (new Sticker (this.FRONT.copy (), BLUE));
            graphics.translate (
                normal.x * distCubieCenterToStickerLocation,
                normal.y * distCubieCenterToStickerLocation,
                normal.z * distCubieCenterToStickerLocation
            );
            // rotate so that sticker is facing the same direction as
            // the normal
            if (Math.abs (normal.x) > 0)
            {
                graphics.rotateY (90);
            }
            if (Math.abs (normal.y) > 0)
            {
                graphics.rotateX (90);
            }
            graphics.fill (getColor (stickerColor));
            graphics.noStroke ();
            graphics.plane (stickerSize);
            // undo sticker rotation
            if (Math.abs (normal.x) > 0)
            {
                graphics.rotateY (-90);
            }
            if (Math.abs (normal.y) > 0)
            {
                graphics.rotateX (-90);
            }
            graphics.translate (
                -normal.x * distCubieCenterToStickerLocation,
                -normal.y * distCubieCenterToStickerLocation,
                -normal.z * distCubieCenterToStickerLocation
            );
        }
        // BACK
        normal = p5.Vector.mult (this.front, -1);
        // if (this.zi * Math.abs (normal.z) == this.low)
        {
            let stickerColor = GREEN;
            // this.stickers.push (new Sticker (this.BACK .copy (), GREEN));
            graphics.translate (
                normal.x * distCubieCenterToStickerLocation,
                normal.y * distCubieCenterToStickerLocation,
                normal.z * distCubieCenterToStickerLocation
            );
            // rotate so that sticker is facing the same direction as
            // the normal
            if (Math.abs (normal.x) > 0)
            {
                graphics.rotateY (90);
            }
            if (Math.abs (normal.y) > 0)
            {
                graphics.rotateX (90);
            }
            graphics.fill (getColor (stickerColor));
            graphics.noStroke ();
            graphics.plane (stickerSize);
            // undo sticker rotation
            if (Math.abs (normal.x) > 0)
            {
                graphics.rotateY (-90);
            }
            if (Math.abs (normal.y) > 0)
            {
                graphics.rotateX (-90);
            }
            graphics.translate (
                -normal.x * distCubieCenterToStickerLocation,
                -normal.y * distCubieCenterToStickerLocation,
                -normal.z * distCubieCenterToStickerLocation
            );
        }
        // for (let sticker of this.stickers)
        // {
        //     sticker.draw (cubieSize);
        // }
        
        // move back from cubie position
        graphics.translate (-(x * cubieSize), -(y * cubieSize), -(z * cubieSize));

        graphics.pop ();
    }
}