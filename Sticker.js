// Rubiks Cube: single sticker of a cubie
// By Amy Burnett
// Inspired by Daniel Shiffman, The Coding Train
// https://github.com/CodingTrain/Coding-Challenges/blob/main/142_Rubiks_Cube_3/Processing/CC_142_Rubiks_Cube_3/Face.pde
// from following his coding challenge on making a rubiks cube
// https://www.youtube.com/watch?v=EGmVulED_4M
// August 15 2024
//
// =======================================================================



// =======================================================================

class Sticker {
    constructor (normal, color)
    {
        this.normal = normal;
        this.color = color;
    }

    // =======================================================================

    rotateX (angle)
    {
        // Manual matrix math with rotation matrix
        let newx = Math.round ((1 * this.normal.x) + (                0 * this.normal.y) + (                0 * this.normal.z));
        let newy = Math.round ((0 * this.normal.x) + ( Math.cos (angle) * this.normal.y) + (-Math.sin (angle) * this.normal.z));
        let newz = Math.round ((0 * this.normal.x) + ( Math.sin (angle) * this.normal.y) + ( Math.cos (angle) * this.normal.z));
        this.normal.x = newx;
        this.normal.y = newy;
        this.normal.z = newz;
    }

    // =======================================================================

    rotateY (angle)
    {
        // Manual matrix math with rotation matrix
        let newx = Math.round (( Math.cos (angle) * this.normal.x) + (                0 * this.normal.y) + ( Math.sin (angle) * this.normal.z));
        let newy = Math.round ((                0 * this.normal.x) + (                1 * this.normal.y) + (                0 * this.normal.z));
        let newz = Math.round ((-Math.sin (angle) * this.normal.x) + (                0 * this.normal.y) + ( Math.cos (angle) * this.normal.z));
        this.normal.x = newx;
        this.normal.y = newy;
        this.normal.z = newz;
    }

    // =======================================================================

    rotateZ (angle)
    {
        // Manual matrix math with rotation matrix
        let newx = Math.round (( Math.cos (angle) * this.normal.x) + (-Math.sin (angle) * this.normal.y) + (                0 * this.normal.z));
        let newy = Math.round (( Math.sin (angle) * this.normal.x) + ( Math.cos (angle) * this.normal.y) + (                0 * this.normal.z));
        let newz = Math.round ((                0 * this.normal.x) + (                0 * this.normal.y) + (                1 * this.normal.z));
        this.normal.x = newx;
        this.normal.y = newy;
        this.normal.z = newz;
    }

    // ===================================================================

    draw (cubieSize)
    {
        let distCubieCenterToStickerLocation = cubieSize/2 + 0.1;
        let stickerSize = cubieSize - 5;

        // move to sticker position
        graphics.translate (this.normal.x * distCubieCenterToStickerLocation, this.normal.y * distCubieCenterToStickerLocation, this.normal.z * distCubieCenterToStickerLocation);

        // rotate so that sticker is facing the same direction as
        // the normal
        if (Math.abs (this.normal.x) > 0)
        {
            graphics.rotateY (90);
        }
        if (Math.abs (this.normal.y) > 0)
        {
            graphics.rotateX (90);
        }

        // Draw sticker
        graphics.fill (getColor (this.color));
        graphics.noStroke ();
        graphics.plane (stickerSize);
        
        // undo sticker rotation
        if (Math.abs (this.normal.x) > 0)
        {
            graphics.rotateY (-90);
        }
        if (Math.abs (this.normal.y) > 0)
        {
            graphics.rotateX (-90);
        }

        // undo move to sticker position
        // doing this instead of push/pop as push/pop can be expensive
        graphics.translate (-this.normal.x * distCubieCenterToStickerLocation, -this.normal.y * distCubieCenterToStickerLocation, -this.normal.z * distCubieCenterToStickerLocation);
    }
}
