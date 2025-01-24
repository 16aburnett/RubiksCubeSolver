// Rubiks Cube Solver
// By Amy Burnett
// August 22 2024
// =======================================================================
// Global variables

// =======================================================================



// =======================================================================

function openTab (event, tabContentID)
{
    // Ensure all other tab contents are closed/hidden
    const tabContentElements = document.getElementsByClassName ("tab-content");
    for (const tabContentElement of tabContentElements)
    {
        tabContentElement.style.display = "none";
    }

    // Ensure all other tabs are inactive
    const tabs = document.getElementsByClassName ("tab");
    for (const tab of tabs)
    {
        tab.className = tab.className.replace (" active", "");
    }

    // Open the given tab and mark as active
    document.getElementById (tabContentID).style.display = "";
    event.currentTarget.className += " active";
}

// =======================================================================

// Adds a solver button to the solver controls section
// with the given buttonLabel and onclickFunction.
function addSolverButton (buttonLabel, onclickFunction)
{
    let solverControlsTable = document.getElementById ("solverControlsTable");
    let tr = document.createElement ("tr");
    tr.className = "controlRow";
    solverControlsTable.appendChild (tr);
    let td = document.createElement ("td");
    td.colSpan = 4
    let btn = document.createElement ("button");
    btn.className = "controlButton";
    btn.onclick = onclickFunction;
    btn.innerText = buttonLabel;
    td.appendChild (btn);
    tr.appendChild (td);
    tr.appendChild (td);
}

// =======================================================================

function addCubeControlButtons ()
{
    let cubeControlsTable = document.getElementById ("cubeControlsTable");
    // create a move button for each valid move
    // and pack buttons in rows
    let j = 0;
    let max_col_per_row = 4;
    let controls_tr = document.createElement ("tr");
    controls_tr.className = "controlRow";
    cubeControlsTable.appendChild (controls_tr);
    for (let move of cubeMoveNotation.getCubeNotationMoves ())
    {
        // Ensure we don't overflow the row with buttons
        if (j >= max_col_per_row)
        {
            j = 0;
            controls_tr = document.createElement ("tr");
            controls_tr.className = "controlRow";
            cubeControlsTable.appendChild (controls_tr);
        }
        // create button column
        let td = document.createElement ("td");
        let btn = document.createElement ("button");
        btn.className = "controlButton";
        btn.onclick = () => {
            console.log (cubeMoveNotation.toString (move));
            rubiksCube.animatedRotate (...(cubeMoveNotation.toAxisNotation (move)));
        };
        btn.innerText = cubeMoveNotation.toString (move);
        td.appendChild (btn);
        controls_tr.appendChild (td);
        // added a button to the row so incr how many in row
        ++j;
    }
}