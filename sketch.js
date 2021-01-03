/*
    Rubiks Cube Solver
    By Amy Burnett
    January 2 2020
*/

// =======================================================================

let rubiksCube; 
let scrambled = false;
let shouldScramble = false;
const SCRAMBLE_LENGTH = 20;
let amountToScramble = SCRAMBLE_LENGTH;
let solver; 
let isSolving = false;
let solution = [];

// =======================================================================

function setup() {
    // setup canvas
    createCanvas(window.innerWidth / 2, 700);
    translate(0, 0);
    background(130, 130, 250);
    // setup rubiks cube model
    rubiksCube = new RubiksCube();
    solver = new CubeSolver();
}

// =======================================================================

function draw() {
    background(130, 130, 250);

    // perform a scramble move if in scramble mode 
    if (shouldScramble) {
        let randMove = int(random(0, NUM_VALID_MOVES));
        console.log(intToMoveString(randMove));
        rubiksCube.move(randMove);
        amountToScramble -= 1;
        if (amountToScramble < 0) {
            shouldScramble = false;
        }
    }

    // determine if cube was solved
    else if (scrambled && rubiksCube.isSolved()) {
        scrambled = false;
        isSolving = false;
        console.log("Congrats! You solved it!");
    }

    else if (isSolving) {
        if (rubiksCube.isSolved()) {
            isSolving = false;
        }
        else if (solution.length == 0) {
            isSolving = false;
            console.log("bot could not find a solution");
        }
        let move = solution[0];
        solution = solution.slice(1);
        console.log(intToMoveString(move));
        rubiksCube.move(move);
    }

    rubiksCube.draw();
}

// =======================================================================

// activates the bot and loads solution 
function solve() {
    console.log("Thinking...");

    isSolving = true;
    let tempCube = new RubiksCube();
    tempCube.data = rubiksCube.data.slice();
    solution = solver.findSolution(tempCube);

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