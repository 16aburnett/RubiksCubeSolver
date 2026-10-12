// Rubiks Cube Solver: Uses a Blind-Folded Method to solve the 3x3 Rubik's Cube
// By Amy Burnett
// =======================================================================

// This is based on the blind-folded method from Jperm
// https://www.jperm.net/bld
// This is a simpler slower method than the Old Pochmann method as this only uses T-perm
// for edge swaps, instead of conditionally using Ja/Jb-perm for efficiency.
// This method also uses full swap cycles for simple misoriented pieces
// which is inefficient.

// Memorization letters for Edges (green front, white top)
//         .  A  .
//         D  .  B
//         .  C  .
// .  E  .|.  I  .|.  M  .|.  Q  .
// H  .  F|L  .  J|P  .  N|T  .  R
// .  G  .|.  K  .|.  O  .|.  S  .
//         .  U  .
//         X  .  V
//         .  W  .

// Memorization letters for Corners (green front, white top)
//         A  .  B
//         .  .  .
//         D  .  C
// E  .  F|I  .  J|M  .  N|Q  .  R
// .  .  .|.  .  .|.  .  .|.  .  .
// H  .  G|L  .  K|P  .  O|T  .  S
//         U  .  V
//         .  .  .
//         X  .  W

// =======================================================================

class BlindSolver3x3
{
    constructor ()
    {

    }

    findSolution(cube)
    {
        // Determine memorization sequence for the blind-folded method
        const memorizationSequenceEdges = this.determineMemorizationSequenceForEdges(cube);
        const memorizationSequenceCorners = this.determineMemorizationSequenceForCorners(cube);

        // Convert memorization sequence into actual moves for solving the cube
        const solution = this.convertMemorizationSequenceToMoves(memorizationSequenceEdges, memorizationSequenceCorners);

        return solution;
    }

    determineMemorizationSequenceForEdges(cube)
    {
        let sequenceEdges = [];

        // Maps edge sticker to their memorization letters
        const COLOR_UP    = cube.data[cube.UP    + 4];
        const COLOR_LEFT  = cube.data[cube.LEFT  + 4];
        const COLOR_FRONT = cube.data[cube.FRONT + 4];
        const COLOR_RIGHT = cube.data[cube.RIGHT + 4];
        const COLOR_BACK  = cube.data[cube.BACK  + 4];
        const COLOR_DOWN  = cube.data[cube.DOWN  + 4];
        // NOTE: This needs to be a local const since it relies on cube
        const CUBIE_TO_LETTER = {
            [COLOR_UP]: {
                [COLOR_BACK ]: ['A', cube.UP    + 1, cube.BACK  + 1],
                [COLOR_RIGHT]: ['B', cube.UP    + 5, cube.RIGHT + 1],
                [COLOR_FRONT]: ['C', cube.UP    + 7, cube.FRONT + 1],
                [COLOR_LEFT ]: ['D', cube.UP    + 3, cube.LEFT  + 1],
            },
            [COLOR_LEFT]: {
                [COLOR_UP   ]: ['E', cube.LEFT  + 1, cube.UP    + 3],
                [COLOR_FRONT]: ['F', cube.LEFT  + 5, cube.FRONT + 3],
                [COLOR_DOWN ]: ['G', cube.LEFT  + 7, cube.DOWN  + 3],
                [COLOR_BACK ]: ['H', cube.LEFT  + 3, cube.BACK  + 5],
            },
            [COLOR_FRONT]: {
                [COLOR_UP   ]: ['I', cube.FRONT + 1, cube.UP    + 7],
                [COLOR_RIGHT]: ['J', cube.FRONT + 5, cube.RIGHT + 3],
                [COLOR_DOWN ]: ['K', cube.FRONT + 7, cube.DOWN  + 1],
                [COLOR_LEFT ]: ['L', cube.FRONT + 3, cube.LEFT  + 5],
            },
            [COLOR_RIGHT]: {
                [COLOR_UP   ]: ['M', cube.RIGHT + 1, cube.UP    + 5],
                [COLOR_BACK ]: ['N', cube.RIGHT + 5, cube.BACK  + 3],
                [COLOR_DOWN ]: ['O', cube.RIGHT + 7, cube.DOWN  + 5],
                [COLOR_FRONT]: ['P', cube.RIGHT + 3, cube.FRONT + 5],
            },
            [COLOR_BACK]: {
                [COLOR_UP   ]: ['Q', cube.BACK  + 1, cube.UP    + 1],
                [COLOR_LEFT ]: ['R', cube.BACK  + 5, cube.LEFT  + 3],
                [COLOR_DOWN ]: ['S', cube.BACK  + 7, cube.DOWN  + 7],
                [COLOR_RIGHT]: ['T', cube.BACK  + 3, cube.RIGHT + 5],
            },
            [COLOR_DOWN]: {
                [COLOR_FRONT]: ['U', cube.DOWN  + 1, cube.FRONT + 7],
                [COLOR_RIGHT]: ['V', cube.DOWN  + 5, cube.RIGHT + 7],
                [COLOR_BACK ]: ['W', cube.DOWN  + 7, cube.BACK  + 7],
                [COLOR_LEFT ]: ['X', cube.DOWN  + 3, cube.LEFT  + 7],
            },
        }
        const STICKER_POS_TO_LETTER = {
            [cube.TOP   + 1]: 'A',
            [cube.TOP   + 5]: 'B',
            [cube.TOP   + 7]: 'C',
            [cube.TOP   + 3]: 'D',
            [cube.LEFT  + 1]: 'E',
            [cube.LEFT  + 5]: 'F',
            [cube.LEFT  + 7]: 'G',
            [cube.LEFT  + 3]: 'H',
            [cube.FRONT + 1]: 'I',
            [cube.FRONT + 5]: 'J',
            [cube.FRONT + 7]: 'K',
            [cube.FRONT + 3]: 'L',
            [cube.RIGHT + 1]: 'M',
            [cube.RIGHT + 5]: 'N',
            [cube.RIGHT + 7]: 'O',
            [cube.RIGHT + 3]: 'P',
            [cube.BACK  + 1]: 'Q',
            [cube.BACK  + 5]: 'R',
            [cube.BACK  + 7]: 'S',
            [cube.BACK  + 3]: 'T',
            [cube.DOWN  + 1]: 'U',
            [cube.DOWN  + 5]: 'V',
            [cube.DOWN  + 7]: 'W',
            [cube.DOWN  + 3]: 'X',
        }

        // Keep track of unsolved and unaccounted for edge pieces
        // so we know which edge pieces still need to be cycled through
        // if we encounter the buffer piece before all edges are solved
        let unsolvedAndUnaccountedForEdgePositions = this._getUnsolvedEdgePieces(cube);

        // It is not possible to have 1 unsolved edge piece so once you solve the second to last
        // edge, the buffer piece will also be solved.
        // With that knowledge, we never need to worry about solving the buffer edge,
        // and additionally since we dont want to pick up the buffer piece to solve,
        // we can just remove it from the unsolved and unaccounted for edges list.
        let bufferPosition = [cube.UP + 5, cube.RIGHT + 1].toSorted((a, b) => a - b);
        unsolvedAndUnaccountedForEdgePositions = unsolvedAndUnaccountedForEdgePositions.filter(pair => !(pair[0] === bufferPosition[0] && pair[1] === bufferPosition[1]));

        // Perform multiple cycles of swaps until all edges are solved
        let isFirstCycle = true;
        while (unsolvedAndUnaccountedForEdgePositions.length > 0)
        {
            // Buffer position will move around the cube as we make swaps in the cycle.
            // Obviously during the real solve, the buffer position does not move,
            // but for scanning the path of swaps without actually changing the cube,
            // we treat the buffer position as if it moves.
            let currentBufferPosition, currentBufferPositionSorted, bufferPiecePositionSorted;
            // First cycle
            if (isFirstCycle)
            {
                // First cycle starts buffer position at the actual buffer position
                currentBufferPosition = [cube.UP + 5, cube.RIGHT + 1];
                currentBufferPositionSorted = [currentBufferPosition[0], currentBufferPosition[1]].toSorted((a, b) => a - b);
                // Keep track of buffer piece so we know when we are done with the first cycle
                bufferPiecePositionSorted = this._getBufferEdgePosition(cube).toSorted((a, b) => a - b);
                // Skip first cycle if the buffer piece is already in the correct position
                if (currentBufferPositionSorted[0] === bufferPiecePositionSorted[0] && currentBufferPositionSorted[1] === bufferPiecePositionSorted[1])
                {
                    isFirstCycle = false;
                    continue;
                }
                // Reaches here if we have unsolved pieces, and the buffer pos does not have the buffer piece
                // So we should be good to unconditionally read the buffer position and swap that piece to its dest
            } 
            // Following cycles
            else 
            {
                // Pick unprocessed unsolved edge to solve first for the next cycle
                // TODO_OPTIMIZATION: We could choose the next edge piece more intelligently to minimize the number of cycles needed
                let unsolvedEdgePosition = unsolvedAndUnaccountedForEdgePositions[0];
                // Pick an orientation for the piece (the letter of either sticker)
                // TODO_OPTIMIZATION: We should probably pick an orientation that results in fewer moves
                let letter = STICKER_POS_TO_LETTER[unsolvedEdgePosition[0]];
                // Record the letter for swapping in the new piece
                sequenceEdges.push(letter);
                // Buffer position starts at the location of the chosen unsolved edge piece
                currentBufferPosition = [unsolvedEdgePosition[0], unsolvedEdgePosition[1]];
                currentBufferPositionSorted = [unsolvedEdgePosition[0], unsolvedEdgePosition[1]].toSorted((a, b) => a - b);
                // Keep track of buffer piece so we know when we are done with the first cycle
                bufferPiecePositionSorted = [unsolvedEdgePosition[0], unsolvedEdgePosition[1]].toSorted((a, b) => a - b);
            }
            // Perform cycle until buffer piece is encountered again
            do
            {
                // Full cycle not yet reached, read the next piece in the buffer position
                const bufferPositionStickerTop  = cube.data[currentBufferPosition[0]];
                const bufferPositionStickerSide = cube.data[currentBufferPosition[1]];
                // Determine where this sticker belongs
                const [letter, mainStickerPos, secondStickerPos] = CUBIE_TO_LETTER[bufferPositionStickerTop][bufferPositionStickerSide];
                currentBufferPosition = [mainStickerPos, secondStickerPos];
                currentBufferPositionSorted = [mainStickerPos, secondStickerPos].toSorted((a, b) => a - b);
                // Save the letter for the swap
                sequenceEdges.push(letter);
                // This edge piece is now considered accounted for
                // So filter it out of our list
                const edgeIndex = unsolvedAndUnaccountedForEdgePositions.findIndex(pair => pair[0] === currentBufferPositionSorted[0] && pair[1] === currentBufferPositionSorted[1]);
                if (edgeIndex !== -1) {
                    unsolvedAndUnaccountedForEdgePositions.splice(edgeIndex, 1);
                } else {
                    console.error(`Edge piece with sorted sticker positions ${currentBufferPositionSorted} not found in unsolvedAndUnaccountedForEdgePositions`);
                    return null;
                }
            } while (!(bufferPiecePositionSorted[0] === currentBufferPositionSorted[0] && bufferPiecePositionSorted[1] === currentBufferPositionSorted[1]));
            isFirstCycle = false;
        }

        console.log(`Final sequenceEdges:`, sequenceEdges);
        console.log(`Final unsolvedAndUnaccountedForEdgePositions (should be empty):`, unsolvedAndUnaccountedForEdgePositions);

        return sequenceEdges;
    }

    _isBufferEdgePiece (cube, stickerTop, stickerSide)
    {
        const COLOR_UP    = cube.data[cube.UP + 4];
        const COLOR_LEFT  = cube.data[cube.LEFT + 4];
        const COLOR_FRONT = cube.data[cube.FRONT + 4];
        const COLOR_RIGHT = cube.data[cube.RIGHT + 4];
        const COLOR_BACK  = cube.data[cube.BACK + 4];
        const COLOR_DOWN  = cube.data[cube.DOWN + 4];
        // Check if the current buffer stickers correspond to the buffer edge piece
        const bufferPieceTopColor  = COLOR_UP;
        const bufferPieceSideColor = COLOR_RIGHT;
        // Note: The buffer edge piece could be in either orientation
        const doesTopMatchBufferColors = stickerTop === bufferPieceTopColor || stickerTop === bufferPieceSideColor;
        const doesSideMatchBufferColors = stickerSide === bufferPieceSideColor || stickerSide === bufferPieceTopColor;
        return doesTopMatchBufferColors && doesSideMatchBufferColors;
    }

    _getBufferEdgePosition (cube)
    {
        const edgePositions = [
            // Top row
            [cube.UP + 1, cube.BACK + 1],
            [cube.UP + 5, cube.RIGHT + 1],
            [cube.UP + 7, cube.FRONT + 1],
            [cube.UP + 3, cube.LEFT + 1],
            // Middle row
            [cube.FRONT + 3, cube.LEFT + 5],
            [cube.FRONT + 5, cube.RIGHT + 3],
            [cube.BACK + 3, cube.RIGHT + 5],
            [cube.BACK + 5, cube.LEFT + 3],
            // Bottom row
            [cube.DOWN + 1, cube.FRONT + 7],
            [cube.DOWN + 5, cube.RIGHT + 7],
            [cube.DOWN + 7, cube.BACK + 7],
            [cube.DOWN + 3, cube.LEFT + 7],
        ];

        for (const [pos1, pos2] of edgePositions) {
            const stickerTop  = cube.data[pos1];
            const stickerSide = cube.data[pos2];
            if (this._isBufferEdgePiece(cube, stickerTop, stickerSide)) {
                return [pos1, pos2];
            }
        }
        return null; // Buffer edge piece not found
    }

    _getUnsolvedEdgePieces (cube)
    {
        let unsolvedEdges = [];
        const COLOR_UP    = cube.data[cube.UP + 4];
        const COLOR_LEFT  = cube.data[cube.LEFT + 4];
        const COLOR_FRONT = cube.data[cube.FRONT + 4];
        const COLOR_RIGHT = cube.data[cube.RIGHT + 4];
        const COLOR_BACK  = cube.data[cube.BACK + 4];
        const COLOR_DOWN  = cube.data[cube.DOWN + 4];

        // Top row
        if (cube.data[cube.UP + 1] !== COLOR_UP || cube.data[cube.BACK + 1] !== COLOR_BACK)
            unsolvedEdges.push([cube.UP + 1, cube.BACK + 1].toSorted((a, b) => a - b));
        if (cube.data[cube.UP + 5] !== COLOR_UP || cube.data[cube.RIGHT + 1] !== COLOR_RIGHT)
            unsolvedEdges.push([cube.UP + 5, cube.RIGHT + 1].toSorted((a, b) => a - b));
        if (cube.data[cube.UP + 7] !== COLOR_UP || cube.data[cube.FRONT + 1] !== COLOR_FRONT)
            unsolvedEdges.push([cube.UP + 7, cube.FRONT + 1].toSorted((a, b) => a - b));
        if (cube.data[cube.UP + 3] !== COLOR_UP || cube.data[cube.LEFT + 1] !== COLOR_LEFT)
            unsolvedEdges.push([cube.UP + 3, cube.LEFT + 1].toSorted((a, b) => a - b));

        // Middle row
        if (cube.data[cube.FRONT + 3] !== COLOR_FRONT || cube.data[cube.LEFT + 5] !== COLOR_LEFT)
            unsolvedEdges.push([cube.FRONT + 3, cube.LEFT + 5].toSorted((a, b) => a - b));
        if (cube.data[cube.FRONT + 5] !== COLOR_FRONT || cube.data[cube.RIGHT + 3] !== COLOR_RIGHT)
            unsolvedEdges.push([cube.FRONT + 5, cube.RIGHT + 3].toSorted((a, b) => a - b));
        if (cube.data[cube.BACK + 3] !== COLOR_BACK || cube.data[cube.RIGHT + 5] !== COLOR_RIGHT)
            unsolvedEdges.push([cube.BACK + 3, cube.RIGHT + 5].toSorted((a, b) => a - b));
        if (cube.data[cube.BACK + 5] !== COLOR_BACK || cube.data[cube.LEFT + 3] !== COLOR_LEFT)
            unsolvedEdges.push([cube.BACK + 5, cube.LEFT + 3].toSorted((a, b) => a - b));

        // Bottom row
        if (cube.data[cube.DOWN + 1] !== COLOR_DOWN || cube.data[cube.FRONT + 7] !== COLOR_FRONT)
            unsolvedEdges.push([cube.DOWN + 1, cube.FRONT + 7].toSorted((a, b) => a - b));
        if (cube.data[cube.DOWN + 5] !== COLOR_DOWN || cube.data[cube.RIGHT + 7] !== COLOR_RIGHT)
            unsolvedEdges.push([cube.DOWN + 5, cube.RIGHT + 7].toSorted((a, b) => a - b));
        if (cube.data[cube.DOWN + 7] !== COLOR_DOWN || cube.data[cube.BACK + 7] !== COLOR_BACK)
            unsolvedEdges.push([cube.DOWN + 7, cube.BACK + 7].toSorted((a, b) => a - b));
        if (cube.data[cube.DOWN + 3] !== COLOR_DOWN || cube.data[cube.LEFT + 7] !== COLOR_LEFT)
            unsolvedEdges.push([cube.DOWN + 3, cube.LEFT + 7].toSorted((a, b) => a - b));

        return unsolvedEdges;
    }
    
    determineMemorizationSequenceForCorners(cube)
    {
        let sequence = [];

        // Maps corner sticker to their memorization letters
        // NOTE: This needs to be a local const since it relies on cube
        // Note: This duplicates info since A,B,C is equivalent data to A,C,B.
        // A is what maps to the letter, and B and C just help distinquish between which A it is.
        // Order of B and C does not matter.
        // Note: this mapping does assume the standard Rubik's Cube solution.
        // This would not work for a custom solution state - if we add that ability to the solver.
        // It would be better if the RubiksCube would give us the solved location for each piece
        // something like cube.getSolvedLocation(cubieColor0, cubieColor1, cubieColor2)) => []
        const COLOR_UP    = cube.data[cube.UP    + 4];
        const COLOR_LEFT  = cube.data[cube.LEFT  + 4];
        const COLOR_FRONT = cube.data[cube.FRONT + 4];
        const COLOR_RIGHT = cube.data[cube.RIGHT + 4];
        const COLOR_BACK  = cube.data[cube.BACK  + 4];
        const COLOR_DOWN  = cube.data[cube.DOWN  + 4];
        const CUBIE_TO_LETTER = {
            [COLOR_UP]: {
                [COLOR_BACK]: {
                    [COLOR_LEFT ]: ['A', cube.UP    + 0, cube.BACK  + 2, cube.LEFT  + 0],
                    [COLOR_RIGHT]: ['B', cube.UP    + 2, cube.BACK  + 0, cube.RIGHT + 2],
                },
                [COLOR_LEFT]: {
                    [COLOR_BACK ]: ['A', cube.UP    + 0, cube.BACK  + 2, cube.LEFT  + 0],
                    [COLOR_FRONT]: ['D', cube.UP    + 6, cube.LEFT  + 2, cube.FRONT + 0],
                },
                [COLOR_FRONT]: {
                    [COLOR_LEFT ]: ['D', cube.UP    + 6, cube.LEFT  + 2, cube.FRONT + 0],
                    [COLOR_RIGHT]: ['C', cube.UP    + 8, cube.FRONT + 2, cube.RIGHT + 0],
                },
                [COLOR_RIGHT]: {
                    [COLOR_FRONT]: ['C', cube.UP    + 8, cube.FRONT + 2, cube.RIGHT + 0],
                    [COLOR_BACK ]: ['B', cube.UP    + 2, cube.BACK  + 0, cube.RIGHT + 2],
                },
            },
            [COLOR_LEFT]: {
                [COLOR_BACK  ]: {
                    [COLOR_UP   ]: ['E', cube.LEFT  + 0, cube.BACK  + 2, cube.UP    + 0],
                    [COLOR_DOWN ]: ['H', cube.LEFT  + 6, cube.BACK  + 8, cube.DOWN  + 6],
                },
                [COLOR_FRONT]: {
                    [COLOR_UP   ]: ['F', cube.LEFT  + 2, cube.FRONT + 0, cube.UP    + 6],
                    [COLOR_DOWN ]: ['G', cube.LEFT  + 8, cube.FRONT + 6, cube.DOWN  + 0],
                },
                [COLOR_UP]: {
                    [COLOR_FRONT]: ['F', cube.LEFT  + 2, cube.FRONT + 0, cube.UP    + 6],
                    [COLOR_BACK ]: ['E', cube.LEFT  + 0, cube.BACK  + 2, cube.UP    + 0],
                },
                [COLOR_DOWN]: {
                    [COLOR_FRONT]: ['G', cube.LEFT  + 8, cube.FRONT + 6, cube.DOWN  + 0],
                    [COLOR_BACK ]: ['H', cube.LEFT  + 6, cube.BACK  + 8, cube.DOWN  + 6],
                },
            },
            [COLOR_FRONT]: {
                [COLOR_UP]: {
                    [COLOR_LEFT ]: ['I', cube.FRONT + 0, cube.UP    + 6, cube.LEFT  + 2],
                    [COLOR_RIGHT]: ['J', cube.FRONT + 2, cube.UP    + 8, cube.RIGHT + 0],
                },
                [COLOR_DOWN]: {
                    [COLOR_LEFT ]: ['L', cube.FRONT + 6, cube.DOWN  + 0, cube.LEFT  + 8],
                    [COLOR_RIGHT]: ['K', cube.FRONT + 8, cube.DOWN  + 2, cube.RIGHT + 6],
                },
                [COLOR_LEFT ]: {
                    [COLOR_UP   ]: ['I', cube.FRONT + 0, cube.UP    + 6, cube.LEFT  + 2],
                    [COLOR_DOWN ]: ['L', cube.FRONT + 6, cube.DOWN  + 0, cube.LEFT  + 8],
                },
                [COLOR_RIGHT]: {
                    [COLOR_UP   ]: ['J', cube.FRONT + 2, cube.UP    + 8, cube.RIGHT + 0],
                    [COLOR_DOWN ]: ['K', cube.FRONT + 8, cube.DOWN  + 2, cube.RIGHT + 6],
                },
            },
            [COLOR_RIGHT]: {
                [COLOR_UP]: {
                    [COLOR_FRONT]: ['M', cube.RIGHT + 0, cube.FRONT + 2, cube.UP    + 8],
                    [COLOR_BACK ]: ['N', cube.RIGHT + 2, cube.UP    + 2, cube.BACK  + 0],
                },
                [COLOR_DOWN]: {
                    [COLOR_BACK ]: ['O', cube.RIGHT + 8, cube.DOWN  + 8, cube.BACK  + 6],
                    [COLOR_FRONT]: ['P', cube.RIGHT + 6, cube.FRONT + 8, cube.DOWN  + 2],
                },
                [COLOR_FRONT]: {
                    [COLOR_UP   ]: ['M', cube.RIGHT + 0, cube.FRONT + 2, cube.UP    + 8],
                    [COLOR_DOWN ]: ['P', cube.RIGHT + 6, cube.FRONT + 8, cube.DOWN  + 2],
                },
                [COLOR_BACK]: {
                    [COLOR_UP   ]: ['N', cube.RIGHT + 2, cube.UP    + 2, cube.BACK  + 0],
                    [COLOR_DOWN ]: ['O', cube.RIGHT + 8, cube.DOWN  + 8, cube.BACK  + 6],
                },
            },
            [COLOR_BACK]: {
                [COLOR_UP]: {
                    [COLOR_RIGHT]: ['Q', cube.BACK  + 0, cube.UP    + 2, cube.RIGHT + 2],
                    [COLOR_LEFT ]: ['R', cube.BACK  + 2, cube.UP    + 0, cube.LEFT  + 0],
                },
                [COLOR_DOWN]: {
                    [COLOR_LEFT ]: ['S', cube.BACK  + 8, cube.DOWN  + 6, cube.LEFT  + 6],
                    [COLOR_RIGHT]: ['T', cube.BACK  + 6, cube.DOWN  + 8, cube.RIGHT + 8],
                },
                [COLOR_RIGHT]: {
                    [COLOR_UP   ]: ['Q', cube.BACK  + 0, cube.UP    + 2, cube.RIGHT + 2],
                    [COLOR_DOWN ]: ['T', cube.BACK  + 6, cube.DOWN  + 8, cube.RIGHT + 8],
                },
                [COLOR_LEFT]: {
                    [COLOR_UP   ]: ['R', cube.BACK  + 2, cube.UP    + 0, cube.LEFT  + 0],
                    [COLOR_DOWN ]: ['S', cube.BACK  + 8, cube.DOWN  + 6, cube.LEFT  + 6],
                },
            },
            [COLOR_DOWN]: {
                [COLOR_FRONT]: {
                    [COLOR_LEFT ]: ['U', cube.DOWN  + 0, cube.FRONT + 6, cube.LEFT  + 8],
                    [COLOR_RIGHT]: ['V', cube.DOWN  + 2, cube.FRONT + 8, cube.RIGHT + 6],
                },
                [COLOR_BACK]: {
                    [COLOR_RIGHT]: ['W', cube.DOWN  + 8, cube.BACK  + 6, cube.RIGHT + 8],
                    [COLOR_LEFT ]: ['X', cube.DOWN  + 6, cube.BACK  + 8, cube.LEFT  + 6],
                },
                [COLOR_LEFT]: {
                    [COLOR_FRONT]: ['U', cube.DOWN  + 0, cube.FRONT + 6, cube.LEFT  + 8],
                    [COLOR_BACK ]: ['X', cube.DOWN  + 6, cube.BACK  + 8, cube.LEFT  + 6],
                },
                [COLOR_RIGHT]: {
                    [COLOR_FRONT]: ['V', cube.DOWN  + 2, cube.FRONT + 8, cube.RIGHT + 6],
                    [COLOR_BACK ]: ['W', cube.DOWN  + 8, cube.BACK  + 6, cube.RIGHT + 8],
                },
            },
        }
        
        const STICKER_POS_TO_LETTER = {
            [cube.TOP   + 0]: 'A',
            [cube.TOP   + 2]: 'B',
            [cube.TOP   + 8]: 'C',
            [cube.TOP   + 6]: 'D',
            [cube.LEFT  + 0]: 'E',
            [cube.LEFT  + 2]: 'F',
            [cube.LEFT  + 8]: 'G',
            [cube.LEFT  + 6]: 'H',
            [cube.FRONT + 0]: 'I',
            [cube.FRONT + 2]: 'J',
            [cube.FRONT + 8]: 'K',
            [cube.FRONT + 6]: 'L',
            [cube.RIGHT + 0]: 'M',
            [cube.RIGHT + 2]: 'N',
            [cube.RIGHT + 8]: 'O',
            [cube.RIGHT + 6]: 'P',
            [cube.BACK  + 0]: 'Q',
            [cube.BACK  + 2]: 'R',
            [cube.BACK  + 8]: 'S',
            [cube.BACK  + 6]: 'T',
            [cube.DOWN  + 0]: 'U',
            [cube.DOWN  + 2]: 'V',
            [cube.DOWN  + 8]: 'W',
            [cube.DOWN  + 6]: 'X',
        }

        // Keep track of unsolved and unaccounted for corner pieces
        // so we know which corner pieces still need to be cycled through
        // if we encounter the buffer piece before all corners are solved
        let unsolvedAndUnaccountedForCornerPositions = this._getUnsolvedCornerPieces(cube);

        // It is not possible to have 1 unsolved corner piece so once you solve the second to last
        // corner, the buffer piece will also be solved.
        // With that knowledge, we never need to worry about solving the buffer piece,
        // and additionally since we dont want to pick up the buffer piece to solve,
        // we can just remove it from the unsolved and unaccounted for corners list.
        // LBU (Left-Back-Up) corner buffer position
        let bufferPosition = [cube.LEFT + 0, cube.UP + 0, cube.BACK + 2].toSorted((a, b) => a - b);
        unsolvedAndUnaccountedForCornerPositions = unsolvedAndUnaccountedForCornerPositions.filter(pair => !(pair[0] === bufferPosition[0] && pair[1] === bufferPosition[1] && pair[2] === bufferPosition[2]));

        // Perform multiple cycles of swaps until all corners are solved
        let isFirstCycle = true;
        while (unsolvedAndUnaccountedForCornerPositions.length > 0)
        {
            // Buffer position will move around the cube as we make swaps in the cycle.
            // Obviously during the real solve, the buffer position does not move,
            // but for scanning the path of swaps without actually changing the cube,
            // we treat the buffer position as if it moves.
            let currentBufferPosition, currentBufferPositionSorted, bufferPiecePositionSorted;
            // First cycle
            if (isFirstCycle)
            {
                // First cycle starts buffer position at the actual buffer position
                currentBufferPosition = [cube.LEFT + 0, cube.UP + 0, cube.BACK + 2];
                currentBufferPositionSorted = [currentBufferPosition[0], currentBufferPosition[1], currentBufferPosition[2]].toSorted((a, b) => a - b);
                // Keep track of buffer piece so we know when we are done with the first cycle
                bufferPiecePositionSorted = this._getBufferCornerPiecePosition(cube).toSorted((a, b) => a - b);
                // Skip first cycle if the buffer piece is already in the correct position
                if (currentBufferPositionSorted[0] === bufferPiecePositionSorted[0] && currentBufferPositionSorted[1] === bufferPiecePositionSorted[1] && currentBufferPositionSorted[2] === bufferPiecePositionSorted[2])
                {
                    isFirstCycle = false;
                    continue;
                }
                // Reaches here if we have unsolved pieces, and the buffer pos does not have the buffer piece
                // So we should be good to unconditionally read the buffer position and swap that piece to its dest
            } 
            // Following cycles
            else 
            {
                // Pick unprocessed unsolved piece to solve first for the next cycle
                // TODO_OPTIMIZATION: We could choose the next corner piece more intelligently to minimize the number of cycles needed
                let unsolvedCornerPosition = unsolvedAndUnaccountedForCornerPositions[0];
                // Pick an orientation for the piece (the letter of either sticker)
                // TODO_OPTIMIZATION: We should probably pick an orientation that results in fewer moves
                let letter = STICKER_POS_TO_LETTER[unsolvedCornerPosition[0]];
                // Record the letter for swapping in the new piece
                sequence.push(letter);
                // Buffer position starts at the location of the chosen unsolved corner piece
                currentBufferPosition = [unsolvedCornerPosition[0], unsolvedCornerPosition[1], unsolvedCornerPosition[2]];
                currentBufferPositionSorted = [unsolvedCornerPosition[0], unsolvedCornerPosition[1], unsolvedCornerPosition[2]].toSorted((a, b) => a - b);
                // Keep track of buffer piece so we know when we are done with the first cycle
                bufferPiecePositionSorted = [unsolvedCornerPosition[0], unsolvedCornerPosition[1], unsolvedCornerPosition[2]].toSorted((a, b) => a - b);
            }
            // Perform cycle until buffer piece is encountered again
            do
            {
                // Full cycle not yet reached, read the next piece in the buffer position
                const bufferPositionStickerTop  = cube.data[currentBufferPosition[0]];
                const bufferPositionStickerSide = cube.data[currentBufferPosition[1]];
                const bufferPositionStickerThird = cube.data[currentBufferPosition[2]];
                // Determine where this sticker belongs
                const [letter, mainStickerPos, secondStickerPos, thirdStickerPos] = CUBIE_TO_LETTER[bufferPositionStickerTop][bufferPositionStickerSide][bufferPositionStickerThird];
                currentBufferPosition = [mainStickerPos, secondStickerPos, thirdStickerPos];
                currentBufferPositionSorted = [mainStickerPos, secondStickerPos, thirdStickerPos].toSorted((a, b) => a - b);
                // Save the letter for the swap
                sequence.push(letter);
                // This piece is now considered accounted for
                // So filter it out of our list
                const cornerIndex = unsolvedAndUnaccountedForCornerPositions.findIndex(triple => triple[0] === currentBufferPositionSorted[0] && triple[1] === currentBufferPositionSorted[1] && triple[2] === currentBufferPositionSorted[2]);
                if (cornerIndex !== -1) {
                    unsolvedAndUnaccountedForCornerPositions.splice(cornerIndex, 1);
                } else {
                    console.error(`Corner piece with sorted sticker positions ${currentBufferPositionSorted} not found in unsolvedAndUnaccountedForCornerPositions`);
                    return null;
                }
            } while (!(bufferPiecePositionSorted[0] === currentBufferPositionSorted[0] && bufferPiecePositionSorted[1] === currentBufferPositionSorted[1] && bufferPiecePositionSorted[2] === currentBufferPositionSorted[2]));
            isFirstCycle = false;
        }

        console.log(`Final corner sequence:`, sequence);
        console.log(`Final unsolvedAndUnaccountedForCornerPositions (should be empty):`, unsolvedAndUnaccountedForCornerPositions);

        return sequence;
    }


    _isBufferCornerPiece (cube, stickerMain, stickerSide0, stickerSide1)
    {
        const COLOR_UP    = cube.data[cube.UP    + 4];
        const COLOR_LEFT  = cube.data[cube.LEFT  + 4];
        const COLOR_FRONT = cube.data[cube.FRONT + 4];
        const COLOR_RIGHT = cube.data[cube.RIGHT + 4];
        const COLOR_BACK  = cube.data[cube.BACK  + 4];
        const COLOR_DOWN  = cube.data[cube.DOWN  + 4];
        // Check if the current buffer stickers correspond to the buffer edge piece
        const bufferPieceColorMain = COLOR_LEFT;
        const bufferPieceColor0 = COLOR_UP;
        const bufferPieceColor1 = COLOR_BACK;
        // Note: The buffer edge piece could be in either orientation
        const doesMainMatchBufferColors = stickerMain === bufferPieceColorMain || stickerMain === bufferPieceColor0 || stickerMain === bufferPieceColor1;
        const doesSide0MatchBufferColors = stickerSide0 === bufferPieceColorMain || stickerSide0 === bufferPieceColor0 || stickerSide0 === bufferPieceColor1;
        const doesSide1MatchBufferColors = stickerSide1 === bufferPieceColorMain || stickerSide1 === bufferPieceColor0 || stickerSide1 === bufferPieceColor1;
        return doesMainMatchBufferColors && doesSide0MatchBufferColors && doesSide1MatchBufferColors;
    }

    _getBufferCornerPiecePosition (cube)
    {
        const cornerPositions = [
            // Top row
            [cube.UP + 0, cube.BACK + 2, cube.LEFT + 0],
            [cube.UP + 2, cube.RIGHT + 2, cube.BACK + 0],
            [cube.UP + 8, cube.FRONT + 2, cube.RIGHT + 0],
            [cube.UP + 6, cube.LEFT + 2, cube.FRONT + 0],
            // Bottom row
            [cube.DOWN + 0, cube.FRONT + 6, cube.LEFT + 8],
            [cube.DOWN + 2, cube.RIGHT + 6, cube.FRONT + 8],
            [cube.DOWN + 8, cube.BACK + 6, cube.RIGHT + 8],
            [cube.DOWN + 6, cube.LEFT + 6, cube.BACK + 8],
        ];

        for (const [pos1, pos2, pos3] of cornerPositions) {
            const stickerMain  = cube.data[pos1];
            const stickerSide0 = cube.data[pos2];
            const stickerSide1 = cube.data[pos3];
            if (this._isBufferCornerPiece(cube, stickerMain, stickerSide0, stickerSide1)) {
                return [pos1, pos2, pos3];
            }
        }
        return null; // Buffer corner piece not found
    }

    _getUnsolvedCornerPieces (cube)
    {
        let unsolvedCorners = [];
        const COLOR_UP    = cube.data[cube.UP    + 4];
        const COLOR_LEFT  = cube.data[cube.LEFT  + 4];
        const COLOR_FRONT = cube.data[cube.FRONT + 4];
        const COLOR_RIGHT = cube.data[cube.RIGHT + 4];
        const COLOR_BACK  = cube.data[cube.BACK  + 4];
        const COLOR_DOWN  = cube.data[cube.DOWN  + 4];

        // Top row
        if (cube.data[cube.UP + 0] !== COLOR_UP || cube.data[cube.BACK + 2] !== COLOR_BACK || cube.data[cube.LEFT + 0] !== COLOR_LEFT)
            unsolvedCorners.push([cube.UP   + 0, cube.BACK + 2, cube.LEFT + 0].toSorted((a, b) => a - b));
        if (cube.data[cube.UP + 2] !== COLOR_UP || cube.data[cube.RIGHT + 2] !== COLOR_RIGHT || cube.data[cube.BACK + 0] !== COLOR_BACK)
            unsolvedCorners.push([cube.UP   + 2, cube.RIGHT + 2, cube.BACK + 0].toSorted((a, b) => a - b));
        if (cube.data[cube.UP + 8] !== COLOR_UP || cube.data[cube.FRONT + 2] !== COLOR_FRONT || cube.data[cube.RIGHT + 0] !== COLOR_RIGHT)
            unsolvedCorners.push([cube.UP   + 8, cube.FRONT + 2, cube.RIGHT + 0].toSorted((a, b) => a - b));
        if (cube.data[cube.UP + 6] !== COLOR_UP || cube.data[cube.LEFT + 2] !== COLOR_LEFT || cube.data[cube.FRONT + 0] !== COLOR_FRONT)
            unsolvedCorners.push([cube.UP + 6, cube.LEFT + 2, cube.FRONT + 0].toSorted((a, b) => a - b));

        // Bottom row
        if (cube.data[cube.DOWN + 0] !== COLOR_DOWN || cube.data[cube.FRONT + 6] !== COLOR_FRONT || cube.data[cube.LEFT + 8] !== COLOR_LEFT)
            unsolvedCorners.push([cube.DOWN + 0, cube.FRONT + 6, cube.LEFT + 8].toSorted((a, b) => a - b));
        if (cube.data[cube.DOWN + 2] !== COLOR_DOWN || cube.data[cube.RIGHT + 6] !== COLOR_RIGHT || cube.data[cube.FRONT + 8] !== COLOR_FRONT)
            unsolvedCorners.push([cube.DOWN + 2, cube.RIGHT + 6, cube.FRONT + 8].toSorted((a, b) => a - b));
        if (cube.data[cube.DOWN + 8] !== COLOR_DOWN || cube.data[cube.BACK + 6] !== COLOR_BACK || cube.data[cube.RIGHT + 8] !== COLOR_RIGHT)
            unsolvedCorners.push([cube.DOWN + 8, cube.BACK + 6, cube.RIGHT + 8].toSorted((a, b) => a - b));
        if (cube.data[cube.DOWN + 6] !== COLOR_DOWN || cube.data[cube.LEFT + 6] !== COLOR_LEFT || cube.data[cube.BACK + 8] !== COLOR_BACK)
            unsolvedCorners.push([cube.DOWN + 6, cube.LEFT + 6, cube.BACK + 8].toSorted((a, b) => a - b));

        return unsolvedCorners;
    }

    convertMemorizationSequenceToMoves(memorizationSequenceEdges, memorizationSequenceCorners)
    {
        // Solve edges
        let edgeMoves = this.convertMemorizationSequenceToMovesForEdges(memorizationSequenceEdges);

        // If edges/corners are odd -> apply parity algorithm
        // Edges and corners should have the same parity
        // Parity is needed bc the T-Perm edge swap, also swaps two corners, and if you
        // use that swap an odd number of times, then 2 corners will be in swapped positions
        // relative to when you examined the cube, throwing off the corner solving sequence.
        // The corner swapping algorithm also swaps 2 edges and has the same parity issue.
        // This parity algorithm swaps the problematic two edges and two corners from those 2 algs.
        let parityMoves = [];
        if (memorizationSequenceEdges.length % 2 !== 0 || memorizationSequenceCorners.length % 2 !== 0)
        {
            console.log("Applying parity algorithm due to odd number of edges swaps.");
            // FIXME: Support "U2" move
            // parityMoves = cubeMoveNotation.stringToMoveSet("R U' R' U' R U R D R' U' R D' R' U2 R' U'");
            parityMoves = cubeMoveNotation.stringToMoveSet("R U' R' U' R U R D R' U' R D' R' U U R' U'");
        }

        // Solver corners
        let cornerMoves = this.convertMemorizationSequenceToMovesForCorners(memorizationSequenceCorners);

        let totalMoves = [].concat(edgeMoves, parityMoves, cornerMoves);
        return totalMoves;
    }

    convertMemorizationSequenceToMovesForEdges(memorizationSequence)
    {
        let moves = [];

        // Buffer position: UR (letter 'B')
        // Target position: UL (letter 'D')
        // FIXME: Support missing moves here so we dont have to translate them to simpler move sequences.
        const edgeSetupMovesMapping = {
            'A': cubeMoveNotation.stringToMoveSet ("L' M' L' M' D' L M L M"), // Lw2 D' Lw2
            'B': cubeMoveNotation.stringToMoveSet (""),                       // Ignoring buffer position
            'C': cubeMoveNotation.stringToMoveSet ("L M L M D L' M' L' M'"),  // Lw2 D Lw2
            'D': cubeMoveNotation.stringToMoveSet (""),                       // Target position: no setup moves needed
            'E': cubeMoveNotation.stringToMoveSet ("L D' E' L"),              // Lw Dw' Lw
            'F': cubeMoveNotation.stringToMoveSet ("D' E' L"),                // Dw' L
            'G': cubeMoveNotation.stringToMoveSet ("L D E L'"),               // L Dw L'
            'H': cubeMoveNotation.stringToMoveSet ("D E L'"),                 // Dw L'
            'I': cubeMoveNotation.stringToMoveSet ("L M D' L L"),             // Lw D' L2
            'J': cubeMoveNotation.stringToMoveSet ("D E D E L"),              // Dw2 L
            'K': cubeMoveNotation.stringToMoveSet ("L M D L L"),              // Lw D L2
            'L': cubeMoveNotation.stringToMoveSet ("L'"),                     // L'
            'M': cubeMoveNotation.stringToMoveSet (""),                       // Ignoring buffer position
            'N': cubeMoveNotation.stringToMoveSet ("D E L"),                  // Dw L
            'O': cubeMoveNotation.stringToMoveSet ("D' L M D L L"),           // D' Lw D L2
            'P': cubeMoveNotation.stringToMoveSet ("D' E' L'"),               // Dw' L'
            'Q': cubeMoveNotation.stringToMoveSet ("L' M' D L L"),            // Lw' D L2
            'R': cubeMoveNotation.stringToMoveSet ("L"),                      // L
            'S': cubeMoveNotation.stringToMoveSet ("L' M' D' L L"),           // Lw' D' L2
            'T': cubeMoveNotation.stringToMoveSet ("D E D E L'"),             // Dw2 L'
            'U': cubeMoveNotation.stringToMoveSet ("D' L L"),                 // D' L2
            'V': cubeMoveNotation.stringToMoveSet ("D D L L"),                // D2 L2
            'W': cubeMoveNotation.stringToMoveSet ("D L L"),                  // D L2
            'X': cubeMoveNotation.stringToMoveSet ("L L"),                    // L2
        };

        for (let i = 0; i < memorizationSequence.length; i++) {
            let letter = memorizationSequence[i];
            if (edgeSetupMovesMapping[letter]) {
                const setupMoves = edgeSetupMovesMapping[letter];
                const reverseSetupMoves = [];
                for (let j = setupMoves.length - 1; j >= 0; j--) {
                    reverseSetupMoves.push(cubeMoveNotation.getReverseMove(setupMoves[j]));
                }
                // const edgeSwapAlgorithm = cubeMoveNotation.stringToMoveSet("R U R' U' R' F R2 U' R' U' R U R' F'");
                const edgeSwapAlgorithm = cubeMoveNotation.stringToMoveSet("R U R' U' R' F R R U' R' U' R U R' F'");
                moves = moves.concat(setupMoves);
                moves = moves.concat(edgeSwapAlgorithm);
                moves = moves.concat(reverseSetupMoves);
            } else {
                // Handle the case where the letter does not have a corresponding setup move
                console.warn(`No setup moves found for letter: ${letter}`);
            }
        }

        return moves;
    }

    convertMemorizationSequenceToMovesForCorners(memorizationSequence)
    {
        let moves = [];

        // Buffer position: LBU (letter 'E')
        // Target position: BFR (letter 'V')
        // FIXME: Support missing moves here so we dont have to translate them to simpler move sequences.
        const cornerSetupMovesMapping = {
            'A': cubeMoveNotation.stringToMoveSet (""), // Ignoring buffer position
            'B': cubeMoveNotation.stringToMoveSet ("R R"), // R2
            'C': cubeMoveNotation.stringToMoveSet ("F F D"), // F2 D
            'D': cubeMoveNotation.stringToMoveSet ("F F"), // F2
            'E': cubeMoveNotation.stringToMoveSet (""), // Ignoring buffer position
            'F': cubeMoveNotation.stringToMoveSet ("F' D"), // F' D
            'G': cubeMoveNotation.stringToMoveSet ("F'"), // F'
            'H': cubeMoveNotation.stringToMoveSet ("D' R"), // D' R
            'I': cubeMoveNotation.stringToMoveSet ("F R'"), // F R'
            'J': cubeMoveNotation.stringToMoveSet ("R'"), // R'
            'K': cubeMoveNotation.stringToMoveSet ("R' D'"), // R' D'
            'L': cubeMoveNotation.stringToMoveSet ("D D R"), // D2 R
            'M': cubeMoveNotation.stringToMoveSet ("F"), // F
            'N': cubeMoveNotation.stringToMoveSet ("R' F"), // R' F
            'O': cubeMoveNotation.stringToMoveSet ("R R F"), // R2 F
            'P': cubeMoveNotation.stringToMoveSet ("R F"), // R F
            'Q': cubeMoveNotation.stringToMoveSet ("R D'"), // R D'
            'R': cubeMoveNotation.stringToMoveSet (""), // Ignoring buffer position
            'S': cubeMoveNotation.stringToMoveSet ("D F'"), // D F'
            'T': cubeMoveNotation.stringToMoveSet ("R"), // R
            'U': cubeMoveNotation.stringToMoveSet ("D"), // D
            'V': cubeMoveNotation.stringToMoveSet (""), // Target position - no moves needed
            'W': cubeMoveNotation.stringToMoveSet ("D'"), // D'
            'X': cubeMoveNotation.stringToMoveSet ("D D"), // D2
        };

        for (let i = 0; i < memorizationSequence.length; i++) {
            let letter = memorizationSequence[i];
            if (cornerSetupMovesMapping[letter]) {
                const setupMoves = cornerSetupMovesMapping[letter];
                const reverseSetupMoves = [];
                for (let j = setupMoves.length - 1; j >= 0; j--) {
                    reverseSetupMoves.push(cubeMoveNotation.getReverseMove(setupMoves[j]));
                }
                const cornerSwapAlgorithm = cubeMoveNotation.stringToMoveSet("R U' R' U' R U R' F' R U R' U' R' F R");
                moves = moves.concat(setupMoves);
                moves = moves.concat(cornerSwapAlgorithm);
                moves = moves.concat(reverseSetupMoves);
            } else {
                // Handle the case where the letter does not have a corresponding setup move
                console.warn(`No setup moves found for letter: ${letter}`);
            }
        }

        return moves;
    }

}
