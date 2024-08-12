/*
    Rubiks Cube Solver
    By Amy Burnett
    August 11 2024
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

// get rubiks cube type from the url
let cubeType = new URLSearchParams(window.location.search).get("type");
// 3x3 by default 
if (cubeType == null) {
    cubeType = "3x3";
}

// =======================================================================

function setup () {
    // setup canvas
    createCanvas(window.innerWidth / 2, 700);
    translate(0, 0);
    background(130, 130, 250);
    // setup rubiks cube model
    if (cubeType == "2x2") {
        rubiksCube = new RubiksCube2();
        solver = new CFOPSolver2();
        // Setup solver controls buttons
        let solverControlsTable = document.getElementById ("solverControlsTable");
        let tr = document.createElement ("tr");
        tr.className = "controlRow";
        solverControlsTable.appendChild (tr);
        let td = document.createElement ("td");
        td.colSpan = 4
        let btn = document.createElement ("button");
        btn.className = "controlButton";
        btn.onclick = () => solve ();
        btn.innerText = "CFOP-like solver";
        td.appendChild (btn);
        tr.appendChild (td);
        tr.appendChild (td);
    }
    else if (cubeType == "4x4") {
        rubiksCube = new RubiksCube4();
        solver = null;
        // Setup solver controls buttons
        let solverControlsTable = document.getElementById ("solverControlsTable");
        let tr = document.createElement ("tr");
        tr.className = "controlRow";
        solverControlsTable.appendChild (tr);
        let td = document.createElement ("td");
        td.colSpan = 4
        let btn = document.createElement ("button");
        btn.className = "controlButton";
        btn.onclick = () => null;
        btn.innerText = "No 4x4 solver yet";
        td.appendChild (btn);
        tr.appendChild (td);
        tr.appendChild (td);
    }
    // 3x3 by default
    else {
        rubiksCube = new RubiksCube3();
        solver = new CFOPSolver3();
        // Setup solver controls buttons
        let solverControlsTable = document.getElementById ("solverControlsTable");
        let tr = document.createElement ("tr");
        tr.className = "controlRow";
        solverControlsTable.appendChild (tr);
        let td = document.createElement ("td");
        td.colSpan = 4
        let btn = document.createElement ("button");
        btn.className = "controlButton";
        btn.onclick = () => solve ();
        btn.innerText = "CFOP-like solver";
        td.appendChild (btn);
        tr.appendChild (td);
        tr.appendChild (td);
    }
    
    // Setup cube control buttons
    let cubeControlsTable = document.getElementById ("cubeControlsTable");
    // create a move button for each valid move
    // and pack buttons in rows
    let j = 0;
    let max_col_per_row = 4;
    let tr = document.createElement ("tr");
    tr.className = "controlRow";
    cubeControlsTable.appendChild (tr);
    for (let m = 0; m < rubiksCube.NUM_VALID_MOVES; ++m)
    {
        // Ensure we don't overflow the row with buttons
        if (j >= max_col_per_row)
        {
            j = 0;
            tr = document.createElement ("tr");
            tr.className = "controlRow";
            cubeControlsTable.appendChild (tr);
        }
        // create button column
        let td = document.createElement ("td");
        let btn = document.createElement ("button");
        btn.className = "controlButton";
        btn.onclick = () => rubiksCube.move (m);
        btn.innerText = rubiksCube.intToMoveString (m);
        td.appendChild (btn);
        tr.appendChild (td);
        // added a button to the row so incr how many in row
        ++j;
    }
}

// =======================================================================

function draw () {
    background(130, 130, 250);

    // if we are currently scrambling,
    // then perform a single scramble move for this frame
    if (shouldScramble) {
        let randMove = int(random(0, rubiksCube.NUM_VALID_MOVES));
        console.log(rubiksCube.intToMoveString(randMove));
        rubiksCube.move (randMove);
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
        console.log(rubiksCube.intToMoveString(move));
        rubiksCube.move(move);
    }

    rubiksCube.draw();
}

// =======================================================================

// activates the bot and loads solution 
function solve () {
    console.log("Thinking...");

    isSolving = true;
    let tempCube = null;
    if (cubeType == "2x2") {
        tempCube = new RubiksCube2();
    }
    else if (cubeType == "4x4") {
        tempCube = new RubiksCube4();
    }
    // 3x3 by default
    else {
        tempCube = new RubiksCube3();
    }
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