// Rubiks Cube: Generalized (2x2, 3x3, 4x4, etc)
// This class is generalized for any rubiks cube dimensions
// By Amy Burnett
// August 31 2024
// =======================================================================

// =======================================================================

class RubiksCube
{
    constructor (dim=3)
    {
        // The number of slices in each 3 directions
        // Perfect cube assumed
        // Cubiod support might be added in the future :)
        this.dim = dim;
        // List to keep track of cubies
        // not stored in any particular order
        // as rotating faces will only change cubie x,y,z position
        // not the position of the cubie in this list
        this.cubies = [];
        // data stores the cube sticker data for quicker lookups
        // This is a duplication of data that already exists
        // within the cubies, but in a format that makes lookup
        // more easier and faster. a lookup table
        // This is essentially a 2D representation of the cube
        this.data = [];
        // face offsets for data
        // generalized for any size
        this.LEFT   = 0 * this.dim * this.dim; // 3x3 -> 0
        this.FRONT  = 1 * this.dim * this.dim; // 3x3 -> 9
        this.RIGHT  = 2 * this.dim * this.dim; // 3x3 -> 18
        this.BACK   = 3 * this.dim * this.dim; // 3x3 -> 27
        this.UP     = 4 * this.dim * this.dim; // 3x3 -> 36
        this.DOWN   = 5 * this.dim * this.dim; // 3x3 -> 45
        // Stores the list of cubies organized by x, y, z
        // For quicker lookup
        this.alignedCubies = [];

        // initialize cube to default state
        this.reset ();

        // Drawing
        this.minimapSizeFactor = 10 * this.dim;

        // Animating
        this.currentMove = 0;
        this.currentMoves = [];
        this.currentAngle = 0;
        this.currentSpeed = TURN_SPEED;
        this.isTurning = false;
    }

    // =======================================================================

    // Returns a new RubiksCube with the same state
    copy ()
    {
        let newCube = new RubiksCube (this.dim);
        // copy each of the cubies
        newCube.cubies = [];
        for (let cubie of this.cubies)
        {
            newCube.cubies.push (cubie.copy ());
        }
        // copy the lookup table
        newCube.data = this.data.slice ();

        return newCube;
    }
    
    // =======================================================================

    // Returns true if the cube is in the solved state, false otherwise.
    isSolved ()
    {
        // Ensure all FRONT pieces are BLUE
        for (var i = 0; i < this.dim*this.dim; ++i) {
            if (this.data[this.FRONT + i] != BLUE) {
                return false;
            }
        }
        // Ensure all BACK pieces are GREEN
        for (var i = 0; i < this.dim*this.dim; ++i) {
            if (this.data[this.BACK + i] != GREEN) {
                return false;
            }
        }
        // Ensure all LEFT pieces are ORANGE
        for (var i = 0; i < this.dim*this.dim; ++i) {
            if (this.data[this.LEFT + i] != ORANGE) {
                return false;
            }
        }
        // Ensure all RIGHT pieces are RED
        for (var i = 0; i < this.dim*this.dim; ++i) {
            if (this.data[this.RIGHT + i] != RED) {
                return false;
            }
        }
        // Ensure all UP pieces are YELLOW
        for (var i = 0; i < this.dim*this.dim; ++i) {
            if (this.data[this.UP + i] != YELLOW) {
                return false;
            }
        }
        // Ensure all DOWN pieces are WHITE
        for (var i = 0; i < this.dim*this.dim; ++i) {
            if (this.data[this.DOWN + i] != WHITE) {
                return false;
            }
        }
        return true;
    }

    // =======================================================================

    // restores cube to solved state
    reset ()
    {
        let numFaces = 6;
        this.cubies = [];
        this.data = Array (numFaces * this.dim * this.dim).fill (0);
        // low(1) = round(1 / 2) - 1 = 1 - 1 = 0   -> [ 0,0] just a single layer
        // low(2) = round(2 / 2) - 2 = 1 - 2 = -1  -> [-1,1] even, so dummy 0th layer
        // low(3) = round(3 / 2) - 3 = 2 - 3 = -1  -> [-1,1]
        // low(4) = round(4 / 2) - 4 = 2 - 4 = -2  -> [-2,2] even, so dummy 0th layer
        // low(5) = round(5 / 2) - 5 = 3 - 5 = -2  -> [-2,2]
        // low(6) = round(6 / 2) - 6 = 3 - 6 = -3  -> [-3,3] even, so dummy 0th layer
        // low(7) = round(7 / 2) - 7 = 4 - 7 = -3  -> [-3,3]
        let low = Math.round (this.dim / 2) - this.dim;
        let high = -low;
        for (let xi = low; xi <= high; ++xi)
        {
            for (let yi = low; yi <= high; ++yi)
            {
                for (let zi = low; zi <= high; ++zi)
                {
                    // Ensure we dont have a middle layer
                    // for even layered cubes
                    if (this.dim % 2 == 0 && (xi == 0 || yi == 0 || zi == 0))
                        continue;
                    // Ensure cubie is not hidden
                    // A cubie is not hidden if at least one dimension
                    // is the outside of the cube
                    if (xi != low && xi != high &&
                        yi != low && yi != high &&
                        zi != low && zi != high)
                    {
                        continue;
                    }
                    // Create and add cubie
                    let cubie = new Cubie (xi, yi, zi, low, high, this.dim);
                    this.cubies.push (cubie);

                    // Update lookup table
                    this.updateLookupTable (cubie);
                }
            }
        }
        // Populate data array
        // we can assume the cubies were initialized to the solved
        // state so nothing to do

    }

    // =======================================================================

    // Updates the lookup table with the given cubie's sticker orientation
    updateLookupTable (cubie)
    {
        let low = Math.round (this.dim / 2) - this.dim;
        let high = -low;
        // Update lookup table
        // convert centered indices to top left indices
        // unsure if this is generalized
        let j = cubie.xi + high;
        let i = cubie.yi + high;
        let k = cubie.zi + high;
        // Adjust for parity
        // Even layered cubes have a dummy center layer
        if (this.dim % 2 == 0 && cubie.xi > 0)
            j = j - 1;
        if (this.dim % 2 == 0 && cubie.yi > 0)
            i = i - 1;
        if (this.dim % 2 == 0 && cubie.zi > 0)
            k = k - 1;
        // cubie has UP face
        if (cubie.yi == low) // y axis is inverted
        {
            this.data[this.UP + k * this.dim + j] = cubie.getStickerColor (cubie.UP);
        }
        // cubie has DOWN face
        if (cubie.yi == high) // y axis is inverted
        {
            // DOWN needs to be mirrored
            this.data[this.DOWN + this.dim*this.dim - 1 - ((k+1) * this.dim - 1 - j)] = cubie.getStickerColor (cubie.DOWN);
        }
        // cubie has FRONT face
        if (cubie.zi == high)
        {
            this.data[this.FRONT + i * this.dim + j] = cubie.getStickerColor (cubie.FRONT);
        }
        // cubie has BACK face
        if (cubie.zi == low)
        {
            // BACK needs to be mirrored
            this.data[this.BACK + ((i+1) * this.dim - 1 - j)] = cubie.getStickerColor (cubie.BACK);
        }
        // cubie has LEFT face
        if (cubie.xi == low)
        {
            this.data[this.LEFT + i * this.dim + k] = cubie.getStickerColor (cubie.LEFT);
        }
        // cubie has RIGHT face
        if (cubie.xi == high)
        {
            // RIGHT needs to be mirrored
            this.data[this.RIGHT + ((i+1) * this.dim - 1 - k)] = cubie.getStickerColor (cubie.RIGHT);
        }
    }

    // =======================================================================
    // Moves

    rotate (axis, slices, direction)
    {
        if (axis == AXIS_X) for (let slice of slices) this.rotateX (slice, direction);
        if (axis == AXIS_Y) for (let slice of slices) this.rotateY (slice, direction);
        if (axis == AXIS_Z) for (let slice of slices) this.rotateZ (slice, direction);
    }

    // =======================================================================

    // Performs the given move on the rubiks cube.
    // in contrast with move(move), this animates the rubiks cube to turn
    // the layer associated with the move and will update the actual cube state
    // when the animation has finished.
    animatedRotate (axis, slices, direction)
    {
        // Ensure we arent already performing a move
        if (this.isTurning)
            return false;
        // this.currentMove = move;
        this.currentAngle = 0;
        this.currentSpeed = TURN_SPEED;
        this.isTurning = true;
        this.currentMoveAxis = axis;
        this.currentMoveSlices = slices;
        this.currentMoveDirection = direction;
    }

    // =======================================================================

    // Rotate the given slice along the X axis in the given direction.
    rotateX (sliceIndex, dir)
    {
        // Search over all cubies to find which need to rotate
        // This is probably not optimal
        // if dim was 100, we would have 100*100*100 cubies to search through
        // just to rotate 100*100 of them
        for (let i = 0; i < this.cubies.length; ++i)
        {
            let cubie = this.cubies[i];
            if (cubie.xi == sliceIndex)
            {
                cubie.rotateX (dir * HALF_PI);
                this.updateLookupTable (cubie);
            }
        }
    }

    // =======================================================================
    
    // Rotate the given slice along the Y axis in the given direction.
    rotateY (sliceIndex, dir)
    {
        // Search over all cubies to find which need to rotate
        // This is probably not optimal
        // if dim was 100, we would have 100*100*100 cubies to search through
        // just to rotate 100*100 of them
        for (let i = 0; i < this.cubies.length; ++i)
        {
            let cubie = this.cubies[i];
            if (cubie.yi == sliceIndex)
            {
                cubie.rotateY (dir * HALF_PI);
                this.updateLookupTable (cubie);
            }
        }
    }

    // =======================================================================
    
    // Rotate the given slice along the X axis in the given direction.
    rotateZ (sliceIndex, dir)
    {
        // Search over all cubies to find which need to rotate
        // This is probably not optimal
        // if dim was 100, we would have 100*100*100 cubies to search through
        // just to rotate 100*100 of them
        for (let i = 0; i < this.cubies.length; ++i)
        {
            let cubie = this.cubies[i];
            if (cubie.zi == sliceIndex)
            {
                cubie.rotateZ (dir * HALF_PI);
                this.updateLookupTable (cubie);
            }
        }
    }

    // =======================================================================

    // Updates the Rubiks Cube by one frame
    // Should be called in the main draw() loop
    update ()
    {
        // Keep turning layer if we were turning something
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
                this.rotate (this.currentMoveAxis, this.currentMoveSlices, this.currentMoveDirection);
            }
        }
    }

    // =======================================================================

    // Draws 3D representation of the rubiks cube to the current graphics.
    // Maybe generalized for any cube dim? need to check - might need to
    // handle parity
    draw3DCube ()
    {
        // Rotate the whole cube so we can see more than one side initially
        graphics.rotateX (-30);
        graphics.rotateY (-45);
        // Draw each cubie
        for (let i = 0; i < this.cubies.length; ++i)
        {
            let cubie = this.cubies[i];
            // Check if cubie should be rotating
            if (this.isTurning && this.currentMoveAxis == AXIS_X && this.currentMoveSlices.includes (cubie.xi))
            {
                graphics.rotateX (this.currentAngle * this.currentMoveDirection);
                cubie.draw ();
                graphics.rotateX (this.currentAngle * -this.currentMoveDirection);
            }
            else if (this.isTurning && this.currentMoveAxis == AXIS_Y && this.currentMoveSlices.includes (cubie.yi))
            {
                graphics.rotateY (this.currentAngle * this.currentMoveDirection);
                cubie.draw ();
                graphics.rotateY (this.currentAngle * -this.currentMoveDirection);
            }
            else if (this.isTurning && this.currentMoveAxis == AXIS_Z && this.currentMoveSlices.includes (cubie.zi))
            {
                graphics.rotateZ (this.currentAngle * this.currentMoveDirection);
                cubie.draw ();
                graphics.rotateZ (this.currentAngle * -this.currentMoveDirection);
            }
            else
            {
                // Cubie is not in a currently rotating face
                // so just draw without rotations
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
                fill (getColor (this.data[elemOffset + (i * this.dim + j)]));
                // fill (255);
                square (startX + (j * stickerSize), startY + (i * stickerSize), stickerSize);
            }
        }
    }

}




