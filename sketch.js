// Rubiks Cube Solver
// By Amy Burnett
// August 13 2024
// =======================================================================
// Global variables

let rubiksCube;
let scrambled = false;
let shouldScramble = false;
const SCRAMBLE_LENGTH = 20;
let amountToScramble = SCRAMBLE_LENGTH;
let solver;
let isSolving = false;
let solution = [];
let cubeMoveNotation;

// get rubiks cube type from the url
let cubeType = new URLSearchParams(window.location.search).get("type");
// 3x3 by default 
if (cubeType == null) {
    cubeType = "3x3";
}

// 3D Graphics globals
let graphics = null;
let cam;

// =======================================================================

function setup () {
    // The main canvas will handle all the 2D aspects
    // and be where we draw the 3D graphics
    createCanvas (window.innerWidth / 2, 700);
    // We want to draw relative to 0, 0 rather than the center of the screen
    translate(0, 0);
    background(130, 130, 250);
    // Setup 3D canvas
    graphics = createGraphics (window.innerWidth / 2, 700, WEBGL);
    graphics.background (130, 130, 250);
    graphics.angleMode (DEGREES);
    cam = graphics.createCamera ();
    // setup rubiks cube model
    if (cubeType == "1x1") {
        rubiksCube = new RubiksCube (1);
        solver = new CFOPSolver1x1 ();
        // Setup solver controls buttons
        addSolverButton ("Basic Solver", solve);
    }
    else if (cubeType == "2x2") {
        rubiksCube = new RubiksCube (2);
        solver = new CFOPSolver2x2 ();
        // Setup solver controls buttons
        addSolverButton ("Basic Solver", solve);
    }
    else if (cubeType == "4x4") {
        rubiksCube = new RubiksCube (4);
        solver = null;
        // Setup solver controls buttons
        // addSolverButton ("Basic Solver", solve);
    }
    else if (cubeType == "5x5") {
        rubiksCube = new RubiksCube (5);
        solver = null;
        // Setup solver controls buttons
        // addSolverButton ("Basic Solver", solve);
    }
    // 3x3 by default
    else {
        rubiksCube = new RubiksCube (3);
        solver = new CFOPSolver3x3 ();
        // Setup solver controls buttons
        addSolverButton ("CFOP-Like Solver", solve);
    }
    cubeMoveNotation = new CubeMoveNotation (rubiksCube.dim);
    // Setup cube control buttons
    addCubeControlButtons ();
}

// =======================================================================

function draw () {
    clear ();
    background (130, 130, 250);
    graphics.clear ();
    // this resets certain values modified by transforms and lights
    // without this, the performance seems to significantly diminish over time
    // and causes lighting to be much more intense
    graphics.reset ();

    // if we are currently scrambling,
    // then perform a single scramble move for this frame
    if (shouldScramble) {
        // Ensure cube is ready to receive move
        if (!rubiksCube.isTurning)
        {
            // Generate a random move
            let randomMove = random ([...cubeMoveNotation.getCubeNotationMoves ()]);
            console.log(cubeMoveNotation.toString (randomMove));
            // Convert the move from cube notation to axis notation
            let axisNotationMove = cubeMoveNotation.toAxisNotation (randomMove);
            // Start animating the move
            // Future calls to rubikscube.update() will progress the animation
            rubiksCube.animatedRotate (...axisNotationMove);
            amountToScramble -= 1;
            if (amountToScramble < 0) {
                shouldScramble = false;
            }
        }
    }

    // determine if cube was solved
    else if (scrambled && rubiksCube.isSolved ()) {
        scrambled = false;
        isSolving = false;
        console.log("Congrats! You solved it!");
    }

    else if (isSolving && !rubiksCube.isTurning) {
        // this might not be correct logic since
        // the solver could solve the cube with more moves left?
        // i doubt the solver will do that, but...
        if (rubiksCube.isSolved ()) {
            // done solving since cube is solved
            isSolving = false;
        }
        else if (solution.length == 0) {
            isSolving = false;
            console.log("bot could not find a solution");
        }
        else
        {
            // still solving so make another move
            let move = solution[0];
            solution = solution.slice(1);
            console.log(cubeMoveNotation.toString (move));
            rubiksCube.animatedRotate (...cubeMoveNotation.toAxisNotation (move));
        }
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
function solve () {
    console.log("Thinking...");

    isSolving = true;
    let tempCube = rubiksCube.copy ();

    console.time ("Solve");
    solution = solver.findSolution (tempCube);
    console.timeEnd ("Solve");

    console.log("Solution found that has " + solution.length + " moves.")
    console.log("Solving...")
}

// =======================================================================

// activates scramble 
function scramble () {
    shouldScramble = true;
    amountToScramble = SCRAMBLE_LENGTH;
    scrambled = true;
}

// =======================================================================

// sets the cube to the solved state
function reset () {
    rubiksCube.reset();
    scrambled = false;
    shouldScramble = false;
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