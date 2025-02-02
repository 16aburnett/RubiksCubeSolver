// Rubiks Cube Solver
// By Amy Burnett
// August 13 2024
// =======================================================================
// Global variables

let backgroundColor;
let rubiksCube;
let scrambled = false;
const SCRAMBLE_LENGTH = 20;
let solver;
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
        const basicSolverSection = new UICollapsibleSection ("Basic Solver");
        basicSolverSection.addButton ("Solve", () => {
            solveFromGivenFunc ((cube) => {
                return solver.findSolution (cube);
            });
        });
    }
    else if (cubeType == "2x2") {
        rubiksCube = new RubiksCube (2);
        solver = new CFOPSolver2x2 ();
        // Setup solver controls buttons
        const CFOPSolverSection = new UICollapsibleSection ("CFOP-like Solver");
        CFOPSolverSection.addButton ("Full CFOP-Like Solve", () => {
            solveFromGivenFunc ((cube) => {
                return solver.findSolution (cube);
            });
        });
        CFOPSolverSection.addButton ("Solve First Layer", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveFirstLayer (cube);
            });
        });
        CFOPSolverSection.addButton ("Solve Yellow Face", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveYellowFace (cube);
            });
        });
        CFOPSolverSection.addButton ("Solve Last Layer", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveLastLayer (cube);
            });
        });
    }
    else if (cubeType == "old 3x3") {
        rubiksCube = new RubiksCube3 ();
        solver = new CFOPSolver3x3 ();
        // Setup solver controls buttons
        addSolverButton ("CFOP-like Solver", () => {
            solveFromGivenFunc ((cube) => {
                return solver.findSolution (cube);
            });
        });
    }
    else if (cubeType == "4x4") {
        rubiksCube = new RubiksCube (4);
        solver = null;
        // Setup solver controls buttons
        // addSolverButton ("Basic Solver", () => {
        //     solveFromGivenFunc ((cube) => {
        //         return solver.findSolution (cube);
        //     });
        // });
    }
    else if (cubeType == "5x5") {
        rubiksCube = new RubiksCube (5);
        solver = null;
        // Setup solver controls buttons
        // addSolverButton ("Basic Solver", () => {
        //     solveFromGivenFunc ((cube) => {
        //         return solver.findSolution (cube);
        //     });
        // });
    }
    // 3x3 by default
    else {
        rubiksCube = new RubiksCube (3);
        solver = new CFOPSolver3x3 ();
        // Setup solver controls buttons
        const CFOPSolverSection = new UICollapsibleSection ("CFOP Solver");
        CFOPSolverSection.addButton ("Full CFOP-Like Solve", () => {
            solveFromGivenFunc ((cube) => {
                return solver.findSolution (cube);
            });
        });
        CFOPSolverSection.addButton ("Orient Cube", () => {
            solveFromGivenFunc ((cube) => {
                return solver.findSolutionToOrientTheCube (cube);
            });
        });
        CFOPSolverSection.addButton ("Solve White Cross", () => {
            solveFromGivenFunc ((cube) => {
                return solver.findSolutionToCross (cube);
            });
        });
        CFOPSolverSection.addButton ("Solve F2L", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveF2L (cube);
            });
        });
        CFOPSolverSection.addButton ("Solve F2L: First Pair", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveFirstF2L (cube);
            });
        });
        CFOPSolverSection.addButton ("Solve F2L: Second Pair", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveSecondF2L (cube);
            });
        });
        CFOPSolverSection.addButton ("Solve F2L: Third Pair", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveThirdF2L (cube);
            });
        });
        CFOPSolverSection.addButton ("Solve F2L: Fourth Pair", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solveFourthF2L (cube);
            });
        });
        CFOPSolverSection.addButton ("Solve 2-Look OLL", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solve2LookOLL (cube);
            });
        });
        CFOPSolverSection.addButton ("Solve 2-Look OLL: Edges", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solve2LookOLLEdges (cube);
            });
        });
        CFOPSolverSection.addButton ("Solve 2-Look OLL: Corners", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solve2LookOLLCorners (cube);
            });
        });
        CFOPSolverSection.addButton ("Solve 2-Look PLL", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solve2LookPLL (cube);
            });
        });
        CFOPSolverSection.addButton ("Solve 2-Look PLL: Corners", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solve2LookPLLCorners (cube);
            });
        });
        CFOPSolverSection.addButton ("Solve 2-Look PLL: Edges", () => {
            solveFromGivenFunc ((cube) => {
                return solver.solve2LookPLLEdges (cube);
            });
        });

        // Roux solver
        const RouxSolverSection = new UICollapsibleSection ("Roux Solver");
        RouxSolverSection.addButton ("Full Roux Solve", () => {
            solveFromGivenFunc ((cube) => {
                return new RouxSolver3x3 ().findSolution (cube);
            });
        });
        RouxSolverSection.addButton ("Orient Cube", () => {
            solveFromGivenFunc ((cube) => {
                return new RouxSolver3x3 ().findSolutionToOrientTheCube (cube);
            });
        });
        RouxSolverSection.addButton ("First Block's Bottom Edge", () => {
            solveFromGivenFunc ((cube) => {
                return new RouxSolver3x3 ().findSolutionToFirstBlocksBottomEdge (cube);
            });
        });
        RouxSolverSection.addButton ("First Block's First Pair", () => {
            solveFromGivenFunc ((cube) => {
                return new RouxSolver3x3 ().findSolutionToFirstBlockFirstPair (cube);
            });
        });
        RouxSolverSection.addButton ("First Block's Second Pair", () => {
            solveFromGivenFunc ((cube) => {
                return new RouxSolver3x3 ().findSolutionToFirstBlockSecondPair (cube);
            });
        });
        RouxSolverSection.addButton ("Second Block's Bottom Edge", () => {
            solveFromGivenFunc ((cube) => {
                return new RouxSolver3x3 ().findSolutionToSecondBlocksBottomEdge (cube);
            });
        });
        RouxSolverSection.addButton ("Second Block's First Pair", () => {
            solveFromGivenFunc ((cube) => {
                return new RouxSolver3x3 ().findSolutionToSecondBlockFirstPair (cube);
            });
        });
        RouxSolverSection.addButton ("Second Block's Second Pair", () => {
            solveFromGivenFunc ((cube) => {
                return new RouxSolver3x3 ().findSolutionToSecondBlockSecondPair (cube);
            });
        });
        RouxSolverSection.addButton ("CMLL", () => {
            solveFromGivenFunc ((cube) => {
                return new RouxSolver3x3 ().findSolutionCMLL (cube);
            });
        });
        RouxSolverSection.addButton ("M Orientation", () => {
            solveFromGivenFunc ((cube) => {
                return new RouxSolver3x3 ().findSolutionMOrientation (cube);
            });
        });
        RouxSolverSection.addButton ("Edge Orientation", () => {
            solveFromGivenFunc ((cube) => {
                return new RouxSolver3x3 ().findSolutionEdgeOrientation (cube);
            });
        });
        RouxSolverSection.addButton ("L/R Edges", () => {
            solveFromGivenFunc ((cube) => {
                return new RouxSolver3x3 ().findSolutionLREdges (cube);
            });
        });
        RouxSolverSection.addButton ("Last Edges", () => {
            solveFromGivenFunc ((cube) => {
                return new RouxSolver3x3 ().findSolutionLastEdges (cube);
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
    let moveStrings = moveSetString.split (" ");
    let moves = [];
    for (let moveString of moveStrings)
        moves.push (cubeMoveNotation.stringToMove (moveString));
    startApplyingMoveSet (moves);
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
