// Rubiks Cube Solver
// By Amy Burnett
// August 13 2024
// =======================================================================
// Global variables

let backgroundColor;
let rubiksCube;
let scrambled = false;
let shouldScramble = false;
const SCRAMBLE_LENGTH = 20;
let amountToScramble = SCRAMBLE_LENGTH;
let solver;
let isSolving = false;
let solution = [];
let cubeMoveNotation;
let isApplyingMoveSet = false;
let moveSetToApply = [];

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
    createCanvas (window.innerWidth * 0.7, window.innerHeight * 0.9);
    // We want to draw relative to 0, 0 rather than the center of the screen
    translate (0, 0);
    backgroundColor = color ("#111");
    background (backgroundColor);
    // Setup 3D canvas
    graphics = createGraphics (window.innerWidth * 0.7, window.innerHeight * 0.9, WEBGL);
    graphics.background (backgroundColor);
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
        addSolverButton ("Full CFOP-Like Solve", solve);
        addSolverButton ("Solve First Layer", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveFirstLayer (cube);
            });
        });
        addSolverButton ("Solve Yellow Face", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveYellowFace (cube);
            });
        });
        addSolverButton ("Solve Last Layer", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveLastLayer (cube);
            });
        });
    }
    else if (cubeType == "old 3x3") {
        rubiksCube = new RubiksCube3 ();
        solver = new CFOPSolver3x3 ();
        // Setup solver controls buttons
        addSolverButton ("CFOP-like Solver", solve);
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
        addSolverButton ("Full CFOP-Like Solve", solve);
        addSolverButton ("Orient Cube", () => {
            solveFromGivenFunc ((cube) => {
                return solver.findSolutionToOrientTheCube (cube);
            });
        });
        addSolverButton ("Solve White Cross", () => {
            solveFromGivenFunc ((cube) => {
                return solver.findSolutionToCross (cube);
            });
        });
        addSolverButton ("Solve First F2L", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveFirstF2L (cube);
            });
        });
        addSolverButton ("Solve Second F2L", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveSecondF2L (cube);
            });
        });
        addSolverButton ("Solve Third F2L", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveThirdF2L (cube);
            });
        });
        addSolverButton ("Solve Fourth F2L", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveFourthF2L (cube);
            });
        });
        addSolverButton ("Solve Yellow Cross", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveYellowCross (cube);
            });
        });
        addSolverButton ("Solve Yellow Face", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveYellowFace (cube);
            });
        });
        addSolverButton ("Solve Yellow Corners", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveYellowCorners (cube);
            });
        });
        addSolverButton ("Solve Yellow Edges", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveYellowEdges (cube);
            });
        });
    }
    cubeMoveNotation = new CubeMoveNotation (rubiksCube.dim);
    // Setup cube control buttons
    addCubeControlButtons ();

    // Setup collapsible
    const collapsibleElements = document.getElementsByClassName ("collapsible");

    for (let i = 0; i < collapsibleElements.length; i++)
    {
        collapsibleElements[i].addEventListener ("click", function() {
            this.classList.toggle("active");
            let content = this.nextElementSibling;
            if (content.style.display === "") {
                content.style.display = "none";
            } else {
                content.style.display = "";
            }
        });
    }
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
    // if we are currently scrambling,
    // then perform a single scramble move for this frame
    else if (shouldScramble) {
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

    // Ensure a solution was found
    if (solution == null)
    {
        console.log ("No solution found");
        isSolving = false;
        return;
    }

    console.log("Solution found that has " + solution.length + " moves.")
    console.log("Solving...")
}

// =======================================================================

// activates the bot and loads solution 
function solveFromGivenFunc (findSolutionFunc) {
    console.log("Thinking...");

    isSolving = true;
    let tempCube = rubiksCube.copy ();

    console.time ("Solve");
    solution = findSolutionFunc (tempCube);
    console.timeEnd ("Solve");

    // Ensure a solution was found
    if (solution == null)
    {
        console.log ("No solution found");
        isSolving = false;
        return;
    }

    console.log("Solution found that has " + solution.length + " moves.");
    console.log("Solving...")
}

// =======================================================================

// activates scramble 
function scramble () {
    console.log ("Scrambling");
    shouldScramble = true;
    amountToScramble = SCRAMBLE_LENGTH;
    scrambled = true;
}

// =======================================================================

// activates scramble 
function applyMoveSetFromString (moveSetString) {
    console.log ("Applying move set");
    isApplyingMoveSet = true;
    scrambled = true;
    let moveStrings = moveSetString.split (" ");
    let moves = [];
    for (let moveString of moveStrings)
        moves.push (cubeMoveNotation.stringToMove (moveString));
    moveSetToApply = moves;
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

// =======================================================================

function windowResized () {
    resizeCanvas (window.innerWidth * 0.70, window.innerHeight * 0.9);
    graphics.width = window.innerWidth * 0.70;
    graphics.height = window.innerHeight * 0.9;
}
