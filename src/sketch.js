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

    // Setup rubiks cube model
    rubiksCube = new RubiksCube (N);

    // Setup solver controls buttons for the given cube size
    solverRegistry.getSolversForSize (N).forEach (solverInstance => {
        if (typeof solverInstance.renderUI === "function") {
            solverInstance.renderUI ();
        } else {
            console.warn (`Solver instance does not have a renderUI method.`);
        }
    });
    // Handle case where no solvers are available for the given cube size
    if (solverRegistry.getSolversForSize (N).length === 0) {
        // Display a message in the solver section indicating no solvers are available
        const solverTab = document.getElementById ("solverTabContent");
        if (solverTab) {
            solverTab.innerHTML = `<p style="text-align: center;">No solvers available for ${N}x${N}x${N} cube.</p>`;
        }
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

    // Determine valid moves based on cube dimension
    let validMoves = [];
    // 1x1 only has cube rotations
    if (rubiksCube.dim === 1)
    {
        console.log ("[scramble] 1x1 cube, only using cube rotations");
        // For 1x1 cubes, only use cube rotations
        validMoves = [...cubeMoveNotation.getCubeNotationMoves ([MoveType.ROTATION])];
    }
    // 2x2 only has face moves
    else if (rubiksCube.dim === 2)
    {
        console.log ("[scramble] 2x2 cube, only using face moves");
        // For 2x2 cubes, only use face moves
        // Note: just adding this for symmetry, NxN case would work for this
        validMoves = [...cubeMoveNotation.getCubeNotationMoves ([MoveType.FACE])];
    }
    // WCA 3x3 Moves
    else if (rubiksCube.dim === 3)
    {
        console.log ("[scramble] 3x3 cube, only using face moves");
        // For 3x3 cubes, only use face moves to match WCA scramblers
        // Slices moves are not allowed bc they count as a cube rotation plus 2 face moves
        // Cube rotations on a 3x3 would turn the slice layer, which is not allowed in WCA scramblers
        validMoves = [...cubeMoveNotation.getCubeNotationMoves ([MoveType.FACE])];
    }
    // NxN cubes
    else
    {
        console.log (`[scramble] ${rubiksCube.dim}x${rubiksCube.dim} cube, using face moves and wide moves`);
        // For NxN cubes larger than 3x3, use face moves and wide moves
        // WCA Article 12 only allows face moves and wide moves for NxN cubes
        // It makes no mention of slice or inner layer moves so let's exclude them
        validMoves = [...cubeMoveNotation.getCubeNotationMoves ([MoveType.FACE, MoveType.WIDE])];
    }
    console.log ("[scramble] Valid moves:", validMoves);

    // Generate a random scramble using the valid moves
    const scrambleMoves = [];
    for (let i = 0; i < SCRAMBLE_LENGTH; ++i)
    {
        const randomMove = random (validMoves);
        scrambleMoves.push (randomMove);
    }
    console.log ("[scramble] Scramble:", moveSetToString (scrambleMoves));

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
