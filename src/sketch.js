// Rubiks Cube Solver
// By Amy Burnett
// August 13 2024
// =======================================================================
// Global variables

let backgroundColor;
let rubiksCube;
let scrambled = false;
const SCRAMBLE_LENGTH = 20;
const DEFAULT_CUBE_N = 3;
let cubeMoveNotation;
let isApplyingMoveSet = false;
let moveSetToApply = [];

// 3D Graphics globals
let graphics = null;
let cam;

// =======================================================================

function setup () {
    // The main canvas will handle all the 2D aspects
    // and be where we draw the 3D graphics
    createCanvas (window.innerWidth * 0.7, window.innerHeight * 0.9);
    // We want to draw relative to 0, 0 rather than the center of the screen
    translate (0, 0);
    backgroundColor = color ("#eef7ff");
    background (backgroundColor);
    // Setup 3D canvas
    graphics = createGraphics (window.innerWidth * 0.7, window.innerHeight * 0.9, WEBGL);
    graphics.background (backgroundColor);
    graphics.angleMode (DEGREES);
    cam = graphics.createCamera ();

    setupCube (DEFAULT_CUBE_N);

    // Turn speed UI input
    const turnSpeedSlider = document.getElementById ("turnSpeedSlider");
    const turnSpeedTextbox = document.getElementById ("turnSpeedTextbox");
    turnSpeedTextbox.value = turnSpeedSlider.value;
    turnSpeedSlider.oninput = function () {
        // Sync with textbox
        turnSpeedTextbox.value = this.value;
        // Sync with cube's speed
        rubiksCube.currentSpeed = Number (this.value);
    };
    turnSpeedTextbox.oninput = function () {
        const value = Number (this.value);
        const min = Number (this.min);
        const max = Number (this.max);
        // Ensure number is in range
        if (value < min)
            this.value = min;
        else if (value > max)
            this.value = max;
        // Sync with slider
        turnSpeedSlider.value = value;
        // Sync with cube's speed
        rubiksCube.currentSpeed = Number (value);
    };
    // Cube setup: N UI input
    const NSlider = document.getElementById ("NSlider");
    const NTextbox = document.getElementById ("NTextbox");
    NTextbox.value = NSlider.value;
    NSlider.oninput = function () {
        // Sync with textbox
        NTextbox.value = this.value;
    };
    NTextbox.oninput = function () {
        const value = Number (this.value);
        const min = Number (this.min);
        const max = Number (this.max);
        // Ensure number is in range
        if (value < min)
            this.value = min;
        else if (value > max)
            this.value = max;
        // Sync with slider
        NSlider.value = value;
    };
}

// =======================================================================

/**
 * Replaces the current cube, controls, and solvers for the cube
 * that matches the given N value.
 * @param {*} N the number of layers for the Rubik's cube (NxNxN cube)
 */
function setupCube (N)
{
    clearCubeControls ();
    clearSolverControls ();
    clearAlgorithmsControls ();

    scrambled = false;
    isApplyingMoveSet = false;

    // setup rubiks cube model
    if (N == 1) {
        rubiksCube = new RubiksCube (1);
        // Setup solver controls buttons
        const basicSolverSection = new UICollapsibleSection (
            "Basic Solver",
            "A 1x1 cube only has centers, so it's already solved by definition - this just re-orients it."
        );
        basicSolverSection.addSteps ([
            {
                label: "Solve",
                primary: true,
                description: "Rotates the whole cube back to the standard orientation (white down, blue front).",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver1x1 ().findSolution (cube);
                    });
                }
            },
        ]);
    }
    else if (N == 2) {
        rubiksCube = new RubiksCube (2);
        // Setup solver controls buttons
        const CFOPSolverSection = new UICollapsibleSection (
            "Layer-by-Layer Solver",
            "A simple layer-by-layer solver for the 2x2 cube. Solves one layer, then orients and permutes the last layer."
        );
        CFOPSolverSection.addSteps ([
            {
                label: "Full Solve",
                primary: true,
                description: "Runs every stage below in order: first layer, OLL, then PLL.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver2x2LBL ().findSolution (cube);
                    });
                }
            },
            {
                label: "Solve First Layer",
                description: "Solves one full layer of corners.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver2x2LBL ().solveFirstLayer (cube);
                    });
                }
            },
            {
                label: "Solve OLL",
                description: "Orients the last layer so its face is a single color.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver2x2LBL ().solveOLL (cube);
                    });
                }
            },
            {
                label: "Solve PLL",
                description: "Permutes the last layer corners into their correct positions, finishing the cube.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver2x2LBL ().solvePLL (cube);
                    });
                }
            },
        ]);
    }
    else if (N == 4) {
        rubiksCube = new RubiksCube (4);
    }
    else if (N == 5) {
        rubiksCube = new RubiksCube (5);
    }
    // 3x3
    else if (N == 3) {
        rubiksCube = new RubiksCube (3);
        // Setup solver controls buttons
        const CFOPSolverSection = new UICollapsibleSection (
            "CFOP Solver",
            "Cross, F2L, OLL, PLL - the most popular speedsolving method. Solves layer-by-layer: a bottom cross, " +
            "the first two layers as paired corner+edge pieces, then the last layer's orientation and positions."
        );
        CFOPSolverSection.addSteps ([
            {
                label: "Full Solve",
                primary: true,
                description: "Runs every stage below in order: orient, cross, F2L, OLL, then PLL.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3CFOP ().findSolution (cube);
                    });
                }
            },
            {
                label: "Orient Cube",
                description: "Rotates the whole cube (no face turns) so white is down and blue is in front, " +
                    "the standard starting orientation for the rest of CFOP.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3CFOP ().findSolutionToOrientTheCube (cube);
                    });
                }
            },
            {
                label: "Solve White Cross",
                description: "Solves the four white edges into a cross on the bottom, aligned with their adjacent center colors.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3CFOP ().findSolutionToCross (cube);
                    });
                }
            },
            {
                label: "Solve F2L",
                description: "Solves the first two layers by finding and inserting each of the four corner+edge pairs. Expand to run one pair at a time. Note that this is currently very naive and is not optimized for move count.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3CFOP ().solveF2L (cube);
                    });
                },
                children: [
                    {
                        label: "First Pair",
                        description: "Finds and inserts the first corner-edge pair.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solveFirstF2L (cube);
                            });
                        }
                    },
                    {
                        label: "Second Pair",
                        description: "Finds and inserts the second corner-edge pair.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solveSecondF2L (cube);
                            });
                        }
                    },
                    {
                        label: "Third Pair",
                        description: "Finds and inserts the third corner-edge pair.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solveThirdF2L (cube);
                            });
                        }
                    },
                    {
                        label: "Fourth Pair",
                        description: "Finds and inserts the fourth and final corner-edge pair, completing the first two layers.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solveFourthF2L (cube);
                            });
                        }
                    },
                ]
            },
            {
                label: "Solve 2-Look OLL",
                description: "Orients the last layer in two passes (edges, then corners) so the whole top face is yellow. " +
                    "Uses fewer algorithms than full OLL, but may require more moves.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3CFOP ().solve2LookOLL (cube);
                    });
                },
                children: [
                    {
                        label: "Edges",
                        description: "Orients the top edges into a yellow cross.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solve2LookOLLEdges (cube);
                            });
                        }
                    },
                    {
                        label: "Corners",
                        description: "Orients the top corners, assuming the yellow cross is already solved.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solve2LookOLLCorners (cube);
                            });
                        }
                    },
                ]
            },
            {
                label: "Solve 2-Look PLL",
                description: "Permutes the last layer in two passes (corners, then edges). " +
                    "Uses fewer algorithms than full PLL, but may require more moves." +
                    "Alternative: Full PLL.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3CFOP ().solve2LookPLL (cube);
                    });
                },
                children: [
                    {
                        label: "Corners",
                        description: "Positions the top corners into their correct spots (edges are handled next).",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solve2LookPLLCorners (cube);
                            });
                        }
                    },
                    {
                        label: "Edges",
                        description: "Cycles the top edges into their correct spots, assuming corners are already placed.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3CFOP ().solve2LookPLLEdges (cube);
                            });
                        }
                    },
                ]
            },
            {
                label: "Solve PLL",
                description: "One-look PLL: permutes both corners and edges directly using the full PLL algorithm set " +
                    "(more algorithms to memorize, but fewer moves than 2-Look PLL).",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3CFOP ().solvePLL (cube);
                    });
                }
            },
        ]);

        // Roux solver
        const RouxSolverSection = new UICollapsibleSection (
            "Roux Solver",
            "Builds two 1x3 blocks on the left/right, then solves the last layer corners and remaining " +
            "edges mostly with M- and U-moves - far fewer cube rotations and overall moves than CFOP."
        );
        RouxSolverSection.addSteps ([
            {
                label: "Full Roux Solve",
                primary: true,
                description: "Runs every stage below in order: orient, first block, second block, 2LCMLL, then the last six edges.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3Roux ().findSolution (cube);
                    });
                }
            },
            {
                label: "Orient Cube",
                description: "Rotates the whole cube (no face turns) so white is down and blue is in front, the standard starting orientation.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3Roux ().findSolutionToOrientTheCube (cube);
                    });
                }
            },
            {
                label: "First Block's Bottom Edge",
                description: "Places one bottom-layer edge on the left side to start the first 1x3 block.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3Roux ().findSolutionToFirstBlocksBottomEdge (cube);
                    });
                }
            },
            {
                label: "First Block's First Pair",
                description: "Pairs and inserts a corner+edge piece next to the bottom edge to grow the first block.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3Roux ().findSolutionToFirstBlockFirstPair (cube);
                    });
                }
            },
            {
                label: "First Block's Second Pair",
                description: "Inserts the final corner+edge pair, completing the first 1x3 block.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3Roux ().findSolutionToFirstBlockSecondPair (cube);
                    });
                }
            },
            {
                label: "Second Block's Bottom Edge",
                description: "Places one bottom-layer edge on the right side to start the second 1x3 block.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3Roux ().findSolutionToSecondBlocksBottomEdge (cube);
                    });
                }
            },
            {
                label: "Second Block's First Pair",
                description: "Pairs and inserts a corner+edge piece next to the bottom edge to grow the second block.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3Roux ().findSolutionToSecondBlockFirstPair (cube);
                    });
                }
            },
            {
                label: "Second Block's Second Pair",
                description: "Inserts the final corner+edge pair, completing the second 1x3 block (both blocks done).",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3Roux ().findSolutionToSecondBlockSecondPair (cube);
                    });
                }
            },
            {
                label: "2LCMLL",
                description: "Solves the last layer corners in two passes (orient, then permute), ignoring the M-slice edges - " +
                    "fewer algorithms to learn than full CMLL.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3Roux ().findSolution2LookCMLL (cube);
                    });
                },
                children: [
                    {
                        label: "Orient Corners",
                        description: "Orients the last layer corners so their yellow/white stickers face up, ignoring position.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3Roux ().findSolution2LookCMLLOrientCorners (cube);
                            });
                        }
                    },
                    {
                        label: "Permutate Corners",
                        description: "Permutes the already-oriented corners into their correct positions.",
                        fn: () => {
                            solveFromGivenFunc ((cube) => {
                                return new Solver3x3Roux ().findSolution2LookCMLLPermutateCorners (cube);
                            });
                        }
                    },
                ]
            },
            {
                label: "M Orientation",
                description: "Uses M-slice moves to bring the white/yellow centers back to the top and bottom - the first step of solving the last six edges.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3Roux ().findSolutionMOrientation (cube);
                    });
                }
            },
            {
                label: "Edge Orientation",
                description: "Orients all remaining edges so every top/bottom sticker is white or yellow (EO).",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3Roux ().findSolutionEdgeOrientation (cube);
                    });
                }
            },
            {
                label: "L/R Edges",
                description: "Places the left and right middle-layer edges into their correct spots using U/M moves.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3Roux ().findSolutionLREdges (cube);
                    });
                }
            },
            {
                label: "Last Edges",
                description: "Solves the final front/back edges, completing the cube.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3Roux ().findSolutionLastEdges (cube);
                    });
                }
            },
        ]);

        // Blindfolded solver
        const BlindSolverSection = new UICollapsibleSection (
            "Blindfolded Solver",
            "Solves the cube using a basic memorization-based method (Old Pochmann style letter scheme) rather than " +
            "pattern recognition - in a real blindfolded solve you'd memorize the letters, then execute from memory alone."
        );
        BlindSolverSection.addSteps ([
            {
                label: "Full Solve",
                primary: true,
                description: "Determines the full memorization sequence for edges and corners, then immediately executes it.",
                fn: () => {
                    solveFromGivenFunc ((cube) => {
                        return new Solver3x3Blind ().findSolution (cube);
                    });
                }
            },
        ]);
        buildBlindfoldedMemoPanel (BlindSolverSection);
    }
    // NxN cube
    else {
        rubiksCube = new RubiksCube (N);
    }
    cubeMoveNotation = new CubeMoveNotation (rubiksCube.dim);
    // Setup cube control buttons
    addCubeControlButtons ();
    // Setup Algorithms tab (custom input works for any N; presets are 3x3-specific)
    buildAlgorithmsTab (N);

    // Sync turn speed
    const turnSpeedTextbox = document.getElementById ("turnSpeedTextbox");
    rubiksCube.currentSpeed = Number (turnSpeedTextbox.value);

}

// =======================================================================

/**
 * Sets up the Rubiks cube that matches the N value from the UI slider.
 */
function setupNxNCube ()
{
    const NTextbox = document.getElementById ("NTextbox");
    const N = Number (NTextbox.value);
    setupCube (N);
}

// =======================================================================

function draw () {
    clear ();
    background (backgroundColor);
    graphics.clear ();
    // this resets certain values modified by transforms and lights
    // without this, the performance seems to significantly diminish over time
    // and causes lighting to be much more intense
    graphics.reset ();

    if (isApplyingMoveSet)
    {
        // Ensure cube is ready to receive move
        if (!rubiksCube.isTurning)
        {
            // Ensure there are moves left to apply
            if (moveSetToApply.length == 0)
            {
                console.log ("Finished applying move set");
                isApplyingMoveSet = false;
            }
            else
            {
                // still applying moves so make another move
                let move = moveSetToApply[0];
                moveSetToApply = moveSetToApply.slice(1);
                console.log(cubeMoveNotation.toString (move));
                rubiksCube.animatedRotate (...cubeMoveNotation.toAxisNotation (move));
            }
        }
    }

    // determine if cube was solved
    else if (scrambled && rubiksCube.isSolved ()) {
        scrambled = false;
        console.log("Congrats! You solved it!");
    }

    // Draw 3D graphics
    rubiksCube.update ();
    rubiksCube.draw3DCube ();

    // Add 3D graphics to canvas as an image
    image (graphics, 0, 0, width, height);

    // All 2D drawings must happen after 3D
    rubiksCube.drawMinimap ();
}

// =======================================================================

// activates the bot and loads solution
function solveFromGivenFunc (findSolutionFunc) {
    console.log("Thinking...");

    let tempCube = rubiksCube.copy ();

    console.time ("Solve");
    let solution = findSolutionFunc (tempCube);
    console.timeEnd ("Solve");

    // Ensure a solution was found
    if (solution == null)
    {
        console.log ("No solution found");
        return;
    }

    console.log ("Solution found that has " + solution.length + " moves.");
    console.log ("Solution: ", moveSetToString (solution));
    console.log ("Applying solution...")
    startApplyingMoveSet (solution);
}

// =======================================================================

// Valid blindfolded memorization letters (one letter per edge/corner
// sticker position - see the lettering diagrams in Solver3x3Blind.js)
const BLIND_VALID_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWX";

/**
 * Parses free-typed text into a memorization sequence (an array of
 * single uppercase letters A-X). Whitespace is ignored so both
 * "C K P R" and "CKPR" are accepted.
 * @param {*} rawText the text typed into a memorization input box
 * @returns { sequence } on success, or { error } with a user-facing
 * message if any character isn't a valid memorization letter.
 */
function parseBlindMemoSequence (rawText) {
    const cleaned = rawText.toUpperCase ().replace (/\s+/g, "");
    const invalidLetters = [...new Set (
        [...cleaned].filter (c => !BLIND_VALID_LETTERS.includes (c))
    )];
    if (invalidLetters.length > 0)
    {
        return { error: `Invalid letter(s): ${invalidLetters.join (", ")} (only A-X are valid)` };
    }
    return { sequence: cleaned.split ("") };
}

/**
 * Builds the memorization-sequence controls for the Blindfolded solver
 * section: a "Generate" button that reads the current cube and fills in
 * the edge/corner letter sequences, editable text inputs so the player
 * can transcribe their own memorization or tweak the generated one, an
 * "Execute" button that solves using whatever sequence is currently
 * shown, and a collapsible reference for the lettering scheme itself.
 * @param {*} section the UICollapsibleSection to add these controls to
 */
function buildBlindfoldedMemoPanel (section) {
    const panelDOM = document.createElement ("div");
    panelDOM.className = "blindMemoPanel";
    section.stepListDOM.appendChild (panelDOM);

    const descriptionDOM = document.createElement ("div");
    descriptionDOM.className = "stepDescription";
    descriptionDOM.innerText = "Step through a real blindfolded solve: memorize the letters below (or type in " +
        "your own), then execute purely from that sequence - without re-reading the cube.";
    panelDOM.appendChild (descriptionDOM);

    const edgesInputDOM = addBlindMemoInputRow (panelDOM, "Edges");
    const cornersInputDOM = addBlindMemoInputRow (panelDOM, "Corners");

    const errorDOM = document.createElement ("div");
    errorDOM.className = "blindMemoError";
    errorDOM.style.display = "none";
    panelDOM.appendChild (errorDOM);

    const buttonRowDOM = document.createElement ("div");
    buttonRowDOM.className = "blindMemoButtonRow";
    panelDOM.appendChild (buttonRowDOM);

    const showError = (message) => {
        errorDOM.innerText = message;
        errorDOM.style.display = "";
    };
    const clearError = () => {
        errorDOM.style.display = "none";
    };

    const generateButtonDOM = document.createElement ("button");
    generateButtonDOM.className = "stepButton stage";
    generateButtonDOM.innerText = "Generate Memorization";
    generateButtonDOM.onclick = () => {
        clearError ();
        const solver = new Solver3x3Blind ();
        const edgesSequence = solver.determineMemorizationSequenceForEdges (rubiksCube);
        const cornersSequence = solver.determineMemorizationSequenceForCorners (rubiksCube);
        edgesInputDOM.value = edgesSequence.join (" ");
        cornersInputDOM.value = cornersSequence.join (" ");
    };
    buttonRowDOM.appendChild (generateButtonDOM);

    const executeButtonDOM = document.createElement ("button");
    executeButtonDOM.className = "stepButton primary";
    executeButtonDOM.innerText = "Execute From Above";
    executeButtonDOM.onclick = () => {
        clearError ();
        const edgesResult = parseBlindMemoSequence (edgesInputDOM.value);
        if (edgesResult.error)
        {
            showError ("Edges: " + edgesResult.error);
            return;
        }
        const cornersResult = parseBlindMemoSequence (cornersInputDOM.value);
        if (cornersResult.error)
        {
            showError ("Corners: " + cornersResult.error);
            return;
        }
        if (edgesResult.sequence.length === 0 && cornersResult.sequence.length === 0)
        {
            showError ("Enter or generate a memorization sequence first.");
            return;
        }
        const moves = new Solver3x3Blind ().convertMemorizationSequenceToMoves (
            edgesResult.sequence, cornersResult.sequence
        );
        startApplyingMoveSet (moves);
    };
    buttonRowDOM.appendChild (executeButtonDOM);

    addBlindLetterSchemeReference (panelDOM);
}

/**
 * Adds a labeled text input row (used for the edge/corner memorization
 * sequences) to the given parent and returns the input element.
 */
function addBlindMemoInputRow (parentDOM, labelText) {
    const rowDOM = document.createElement ("div");
    rowDOM.className = "blindInputRow";
    parentDOM.appendChild (rowDOM);

    const labelDOM = document.createElement ("label");
    labelDOM.className = "blindInputLabel";
    labelDOM.innerText = labelText;
    rowDOM.appendChild (labelDOM);

    const inputDOM = document.createElement ("input");
    inputDOM.type = "text";
    inputDOM.className = "blindInput";
    inputDOM.placeholder = "e.g. C K P R";
    inputDOM.autocomplete = "off";
    rowDOM.appendChild (inputDOM);

    return inputDOM;
}

/**
 * Adds a collapsible reference showing the edge/corner memorization
 * lettering diagrams (see Solver3x3Blind.js), so the letters above are
 * actually interpretable.
 */
function addBlindLetterSchemeReference (parentDOM) {
    const toggleButtonDOM = document.createElement ("button");
    toggleButtonDOM.className = "schemeToggleButton";
    toggleButtonDOM.innerText = "\u25B8 Letter Scheme Reference";
    parentDOM.appendChild (toggleButtonDOM);

    const schemeBlockDOM = document.createElement ("div");
    schemeBlockDOM.className = "schemeBlock";
    schemeBlockDOM.style.display = "none";
    parentDOM.appendChild (schemeBlockDOM);

    const schemeCaptionDOM = document.createElement ("div");
    schemeCaptionDOM.className = "schemeCaption";
    schemeCaptionDOM.innerText = "Scheme matches unfolded minimap view of cube. Buffer pieces are skipped while memorizing " +
        "(they're where you start), and the last letter in a cycle is the target - the piece already in place.";
    schemeBlockDOM.appendChild (schemeCaptionDOM);

    const edgesHeaderDOM = document.createElement ("div");
    edgesHeaderDOM.className = "schemeHeader";
    edgesHeaderDOM.innerText = "Edges - buffer: B (UR), target: D (UL)";
    schemeBlockDOM.appendChild (edgesHeaderDOM);

    const edgesDiagramDOM = document.createElement ("pre");
    edgesDiagramDOM.className = "schemeDiagram";
    edgesDiagramDOM.innerText =
        "        .  A  .\n" +
        "        D  .  B\n" +
        "        .  C  .\n" +
        ".  E  .|.  I  .|.  M  .|.  Q  .\n" +
        "H  .  F|L  .  J|P  .  N|T  .  R\n" +
        ".  G  .|.  K  .|.  O  .|.  S  .\n" +
        "        .  U  .\n" +
        "        X  .  V\n" +
        "        .  W  .";
    schemeBlockDOM.appendChild (edgesDiagramDOM);

    const cornersHeaderDOM = document.createElement ("div");
    cornersHeaderDOM.className = "schemeHeader";
    cornersHeaderDOM.innerText = "Corners - buffer: E (LBU), target: V (BFR)";
    schemeBlockDOM.appendChild (cornersHeaderDOM);

    const cornersDiagramDOM = document.createElement ("pre");
    cornersDiagramDOM.className = "schemeDiagram";
    cornersDiagramDOM.innerText =
        "        A  .  B\n" +
        "        .  .  .\n" +
        "        D  .  C\n" +
        "E  .  F|I  .  J|M  .  N|Q  .  R\n" +
        ".  .  .|.  .  .|.  .  .|.  .  .\n" +
        "H  .  G|L  .  K|P  .  O|T  .  S\n" +
        "        U  .  V\n" +
        "        .  .  .\n" +
        "        X  .  W";
    schemeBlockDOM.appendChild (cornersDiagramDOM);

    toggleButtonDOM.onclick = () => {
        const isCollapsed = schemeBlockDOM.style.display === "none";
        schemeBlockDOM.style.display = isCollapsed ? "" : "none";
        toggleButtonDOM.innerText = (isCollapsed ? "\u25BE" : "\u25B8") + " Letter Scheme Reference";
    };
}

// =======================================================================
// Algorithms tab: a place to apply preset named algorithms (OLL, PLL,
// common finger-trick triggers) and to type in and apply any custom
// algorithm string, independent of the step-by-step solvers.
// =======================================================================

// Remembers the last few custom algorithms applied this session so they
// can be re-applied without retyping them.
let recentCustomAlgorithms = [];

/**
 * (Re)builds the Algorithms tab for the current cube. The custom
 * algorithm input works for any cube size; the named preset algorithms
 * (OLL/PLL/triggers) assume a standard 3x3 last-layer, so they're only
 * shown for N == 3.
 * @param {*} N the number of layers for the current cube (NxNxN)
 */
function buildAlgorithmsTab (N) {
    const customSection = new UICollapsibleSection (
        "Custom Algorithm",
        "Type any sequence of moves in standard cube notation (e.g. \"R U R' U'\") and apply it directly to the cube.",
        "algorithmsTabContent"
    );
    buildCustomAlgorithmPanel (customSection);

    if (N !== 3)
    {
        return;
    }

    const ollSection = new UICollapsibleSection (
        "OLL Algorithms",
        "Orients the last layer so the whole top face is one color. A few commonly named cases/triggers.",
        "algorithmsTabContent"
    );
    ollSection.addSteps ([
        {
            label: "Sune",
            description: "R U R' U R U2 R' - cycles/orients 3 corners. Order 6 (applying it 6 times returns to solved).",
            fn: () => applyAlgorithmMoves ("R U R' U R U U R'")
        },
        {
            label: "Anti-Sune",
            description: "R U2 R' U' R U' R' - the mirror of Sune.",
            fn: () => applyAlgorithmMoves ("R U U R' U' R U' R'")
        },
    ]);

    const pllSection = new UICollapsibleSection (
        "PLL Algorithms",
        "Permutes the last layer pieces into their correct spots, assuming orientation is already solved.",
        "algorithmsTabContent"
    );
    pllSection.addSteps ([
        {
            label: "T-Perm",
            description: "R U R' U' R' F R2 U' R' U' R U R' F' - swaps 2 corners and 2 edges.",
            fn: () => applyAlgorithmMoves ("R U R' U' R' F R R U' R' U' R U R' F'")
        },
        {
            label: "Y-Perm",
            description: "F R U' R' U' R U R' F' R U R' U' R' F R F' - swaps 2 corners and 2 edges (diagonal).",
            fn: () => applyAlgorithmMoves ("F R U' R' U' R U R' F' R U R' U' R' F R F'")
        },
        {
            label: "A-Perm",
            description: "R' F R' B2 R F' R' B2 R2 - cycles 3 corners.",
            fn: () => applyAlgorithmMoves ("R' F R' B B R F' R' B B R R")
        },
        {
            label: "U-Perm",
            description: "R U' R U R U R U' R' U' R2 - cycles 3 edges.",
            fn: () => applyAlgorithmMoves ("R U' R U R U R U' R' U' R R")
        },
    ]);

    const triggersSection = new UICollapsibleSection (
        "Common Triggers",
        "Short finger-trick building blocks that show up inside many longer algorithms.",
        "algorithmsTabContent"
    );
    triggersSection.addSteps ([
        {
            label: "Sexy Move",
            description: "R U R' U' - the most common trigger in speedsolving. Order 6.",
            fn: () => applyAlgorithmMoves ("R U R' U'")
        },
        {
            label: "Inverse Sexy Move",
            description: "U R U' R' - the Sexy Move done backwards.",
            fn: () => applyAlgorithmMoves ("U R U' R'")
        },
        {
            label: "Sledgehammer",
            description: "R' F R F' - another very common trigger.",
            fn: () => applyAlgorithmMoves ("R' F R F'")
        },
        {
            label: "Inverse Sledgehammer",
            description: "F R' F' R - the Sledgehammer done backwards.",
            fn: () => applyAlgorithmMoves ("F R' F' R")
        },
    ]);
}

/**
 * Parses the given algorithm string and animates it on the current
 * cube. Throws (via cubeMoveNotation.stringToMove) if any move token
 * isn't valid for the current cube size - callers that take user input
 * should catch that and report it, rather than let it propagate.
 * @param {*} algorithmString space-delimited cube notation moves
 */
function applyAlgorithmMoves (algorithmString) {
    const moveSet = cubeMoveNotation.stringToMoveSet (algorithmString);
    startApplyingMoveSet (moveSet);
}

/**
 * Returns the exact reverse of the given algorithm string: moves in
 * reverse order, each one inverted, so applying it undoes the original.
 */
function reverseAlgorithmMoves (algorithmString) {
    const moveSet = cubeMoveNotation.stringToMoveSet (algorithmString);
    const reversed = [];
    for (let i = moveSet.length - 1; i >= 0; --i)
    {
        reversed.push (cubeMoveNotation.getReverseMove (moveSet[i]));
    }
    return reversed;
}

/**
 * Builds the free-text "type any algorithm" controls: an input, Apply/
 * Apply Reversed buttons, an error message area, and a small list of
 * recently-applied algorithms that can be re-applied with one click.
 */
function buildCustomAlgorithmPanel (section) {
    const panelDOM = document.createElement ("div");
    panelDOM.className = "blindMemoPanel";
    section.stepListDOM.appendChild (panelDOM);

    const inputRowDOM = document.createElement ("div");
    inputRowDOM.className = "blindInputRow";
    panelDOM.appendChild (inputRowDOM);

    const labelDOM = document.createElement ("label");
    labelDOM.className = "blindInputLabel";
    labelDOM.innerText = "Alg";
    inputRowDOM.appendChild (labelDOM);

    const inputDOM = document.createElement ("input");
    inputDOM.type = "text";
    inputDOM.className = "blindInput";
    inputDOM.placeholder = "e.g. R U R' U'";
    inputDOM.autocomplete = "off";
    inputRowDOM.appendChild (inputDOM);

    const errorDOM = document.createElement ("div");
    errorDOM.className = "blindMemoError";
    errorDOM.style.display = "none";
    panelDOM.appendChild (errorDOM);

    const recentListDOM = document.createElement ("div");
    recentListDOM.className = "recentAlgoList";
    panelDOM.appendChild (recentListDOM);

    const renderRecentList = () => {
        recentListDOM.innerHTML = "";
        for (const algorithmString of recentCustomAlgorithms)
        {
            const chipDOM = document.createElement ("button");
            chipDOM.className = "recentAlgoChip";
            chipDOM.innerText = algorithmString;
            chipDOM.title = "Click to re-apply";
            chipDOM.onclick = () => {
                inputDOM.value = algorithmString;
                applyFromInput ();
            };
            recentListDOM.appendChild (chipDOM);
        }
    };

    const remember = (algorithmString) => {
        recentCustomAlgorithms = recentCustomAlgorithms.filter (a => a !== algorithmString);
        recentCustomAlgorithms.unshift (algorithmString);
        recentCustomAlgorithms = recentCustomAlgorithms.slice (0, 5);
        renderRecentList ();
    };

    const applyFromInput = () => {
        errorDOM.style.display = "none";
        const trimmed = inputDOM.value.trim ();
        if (trimmed === "")
        {
            errorDOM.innerText = "Enter an algorithm first.";
            errorDOM.style.display = "";
            return;
        }
        try
        {
            applyAlgorithmMoves (trimmed);
            remember (trimmed);
        }
        catch (e)
        {
            errorDOM.innerText = "Invalid algorithm: " + e.message;
            errorDOM.style.display = "";
        }
    };

    const applyReversedFromInput = () => {
        errorDOM.style.display = "none";
        const trimmed = inputDOM.value.trim ();
        if (trimmed === "")
        {
            errorDOM.innerText = "Enter an algorithm first.";
            errorDOM.style.display = "";
            return;
        }
        try
        {
            startApplyingMoveSet (reverseAlgorithmMoves (trimmed));
            remember (trimmed);
        }
        catch (e)
        {
            errorDOM.innerText = "Invalid algorithm: " + e.message;
            errorDOM.style.display = "";
        }
    };

    const buttonRowDOM = document.createElement ("div");
    buttonRowDOM.className = "blindMemoButtonRow";
    panelDOM.appendChild (buttonRowDOM);

    const applyButtonDOM = document.createElement ("button");
    applyButtonDOM.className = "stepButton primary";
    applyButtonDOM.innerText = "Apply";
    applyButtonDOM.onclick = applyFromInput;
    buttonRowDOM.appendChild (applyButtonDOM);

    const applyReversedButtonDOM = document.createElement ("button");
    applyReversedButtonDOM.className = "stepButton stage";
    applyReversedButtonDOM.innerText = "Apply Reversed";
    applyReversedButtonDOM.onclick = applyReversedFromInput;
    buttonRowDOM.appendChild (applyReversedButtonDOM);

    inputDOM.addEventListener ("keydown", (event) => {
        if (event.key === "Enter")
        {
            applyFromInput ();
        }
    });

    renderRecentList ();
}

// =======================================================================

/**
 * Generates a new scrambled moveset for the cube and starts
 * applying the scrambled moveset.
 */
function scramble () {
    console.log ("Scrambling");

    // Ensure cube is ready to be scrambled
    if (rubiksCube.isTurning)
    {
        console.log ("Cube is turning, cannot scramble");
        return;
    }

    const validMoves = [...cubeMoveNotation.getCubeNotationMoves ()];
    const scrambleMoves = [];
    for (let i = 0; i < SCRAMBLE_LENGTH; ++i)
    {
        const randomMove = random (validMoves);
        scrambleMoves.push (randomMove);
    }
    console.log ("Scramble:", moveSetToString (scrambleMoves));
    startApplyingMoveSet (scrambleMoves);
    scrambled = true;
}

// =======================================================================

/**
 * Parses the given string into a moveset and starts the animation
 * of applying the moveset
 * @param {*} moveSetString string representation of a set of moves.
 * Moves should be space delimited, and must be valid Rubik's cube
 * move notation.
 * Example: "R U R' U'"
 */
function applyMoveSetFromString (moveSetString) {
    console.log ("Applying move set");
    scrambled = true;
    const moveSet = cubeMoveNotation.stringToMoveSet (moveSetString);
    startApplyingMoveSet (moveSet);
}

// =======================================================================

/**
 * Starts the animation of applying the given moveset to the cube
 * over time.
 * @param {*} moveSet the given moveset to apply to the cube
 */
function startApplyingMoveSet (moveSet)
{
    isApplyingMoveSet = true;
    moveSetToApply = moveSet;
}

// =======================================================================

// sets the cube to the solved state
function reset () {
    rubiksCube.reset();
    scrambled = false;
}

// =======================================================================

// https://stackoverflow.com/questions/68986225/orbitcontrol-in-creategraphics-webgl-on-a-2d-canvas
// this is to work around orbitControl not working with createGraphics.
const sensitivityX = 1;
const sensitivityY = 1;
const sensitivityZ = 1;
const scaleFactor = 100;
function mouseDragged () {
    // Ensure mouse is over canvas when it was dragged
    if (!(0 <= mouseX && mouseX < width && 0 <= mouseY && mouseY < height))
    {
        // mouse is not over the canvas
        // ignore drag
        return false;
    }
    const deltaTheta = (-sensitivityX * (mouseX - pmouseX)) / scaleFactor;
    const deltaPhi = (sensitivityY * (mouseY - pmouseY)) / scaleFactor;
    cam._orbit(deltaTheta, deltaPhi, 0);
}

function mouseWheel (event) {
    // Ensure mouse is over canvas when the wheel moved
    if (!(0 <= mouseX && mouseX < width && 0 <= mouseY && mouseY < height))
    {
        // mouse is not over the canvas
        // ignore wheel movement
        return false;
    }
    if (event.delta > 0) {
        cam._orbit(0, 0, sensitivityZ * scaleFactor);
    } else {
        cam._orbit(0, 0, -sensitivityZ * scaleFactor);
    }
}

// =======================================================================

function windowResized () {
    resizeCanvas (window.innerWidth * 0.70, window.innerHeight * 0.9);
    graphics.width = window.innerWidth * 0.70;
    graphics.height = window.innerHeight * 0.9;
}
