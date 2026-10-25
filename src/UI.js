// Rubiks Cube Solver
// By Amy Burnett
// August 22 2024
// =======================================================================
// Global variables

// =======================================================================

function clearCubeControls ()
{
    const cubeControlsTable = document.getElementById ("cubeControlsTable");
    // Remove all controls
    cubeControlsTable.innerHTML = '';
}

// =======================================================================

function clearSolverControls ()
{
    const solverTab = document.getElementById ("solverTabContent");
    // Remove all controls
    solverTab.innerHTML = '';
}

// =======================================================================

function clearAlgorithmsControls ()
{
    const algorithmsTab = document.getElementById ("algorithmsTabContent");
    // Remove all controls
    algorithmsTab.innerHTML = '';
}

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

class UICollapsibleSection
{
    // <div class="controlHeader collapsible">
    //     <h2>Solver Controls</h2>
    //     <span class="sectionToggleIcon">▾</span>
    // </div>
    // <div class="collapsible-content">
    //     <p class="sectionDescription">...</p>
    //     <div class="stepList">
    //         <!-- Solver steps will get populated here -->
    //     </div>
    // </div>
    //
    // sectionDescription (optional): a short summary shown under the
    // section header explaining what this solver/method is.
    // containerID (optional): id of the element to append this section
    // to. Defaults to the Solver tab; pass "algorithmsTabContent" to
    // instead add this section to the Algorithms tab.
    constructor (sectionTitle, sectionDescription = null, containerID = "solverTabContent")
    {
        const container = document.getElementById (containerID);

        this.sectionDOM = document.createElement ("div");
        this.sectionDOM.className = "solverSection";
        container.appendChild (this.sectionDOM);

        const header = document.createElement ("div");
        header.className = "controlHeader collapsible";
        const h2 = document.createElement ("h2");
        h2.innerText = sectionTitle;
        header.appendChild (h2);
        const toggleIconDOM = document.createElement ("span");
        toggleIconDOM.className = "sectionToggleIcon";
        toggleIconDOM.innerText = "\u25BE"; // ▾ (expanded by default)
        header.appendChild (toggleIconDOM);
        this.sectionDOM.appendChild (header);
        header.addEventListener ("click", function() {
            this.classList.toggle("active");
            const isCollapsed = this.classList.contains ("active");
            let content = this.nextElementSibling;
            content.style.display = isCollapsed ? "none" : "";
            toggleIconDOM.innerText = isCollapsed ? "\u25B8" : "\u25BE"; // ▸ : ▾
        });

        this.contentDOM = document.createElement ("div");
        this.contentDOM.className = "collapsible-content";
        this.sectionDOM.appendChild (this.contentDOM);

        if (sectionDescription)
        {
            const sectionDescriptionDOM = document.createElement ("p");
            sectionDescriptionDOM.className = "sectionDescription";
            sectionDescriptionDOM.innerText = sectionDescription;
            this.contentDOM.appendChild (sectionDescriptionDOM);
        }

        this.stepListDOM = document.createElement ("div");
        this.stepListDOM.className = "stepList";
        this.contentDOM.appendChild (this.stepListDOM);
    }

    // Adds a single flat button/step at the top level of this section.
    // description (optional): short explanation shown under the button.
    addButton (buttonLabel, onclickFunction, description = null)
    {
        this.addStep ({
            label: buttonLabel,
            fn: onclickFunction,
            description: description
        });
    }

    // Adds a list of steps (see addStep for the expected shape of each
    // step) at the top level of this section. This is the preferred,
    // data-driven way to populate a solver section.
    addSteps (steps)
    {
        for (const step of steps)
        {
            this.addStep (step);
        }
    }

    // Recursively renders a step (and any nested sub-steps) as:
    //   [Run button] [▸/▾ toggle if it has sub-steps]
    //   description text (optional, small/muted)
    //   indented sub-steps (collapsed by default)
    //
    // step shape:
    // {
    //     label:       string, button text
    //     fn:          function, onclick handler that runs this step
    //     description: string (optional), short explanation of the step
    //     primary:     bool (optional), marks this as the "main" action
    //                  of the section (e.g. a full/complete solve)
    //     children:    array of steps (optional), sub-steps that make up
    //                  this step (e.g. the 4 F2L pairs under "Solve F2L")
    // }
    addStep (step, parentDOM = this.stepListDOM, depth = 0)
    {
        const hasChildren = step.children && step.children.length > 0;

        const rowDOM = document.createElement ("div");
        rowDOM.className = "stepRow";
        parentDOM.appendChild (rowDOM);

        const mainRowDOM = document.createElement ("div");
        mainRowDOM.className = "stepMainRow";
        rowDOM.appendChild (mainRowDOM);

        const buttonDOM = document.createElement ("button");
        buttonDOM.className = "stepButton " + (
            step.primary ? "primary" : depth == 0 ? "stage" : "substep"
        );
        buttonDOM.innerText = step.label;
        buttonDOM.onclick = step.fn;
        mainRowDOM.appendChild (buttonDOM);

        // Steps with sub-steps get a toggle to expand/collapse them
        // separately from running the step itself.
        if (hasChildren)
        {
            const toggleDOM = document.createElement ("button");
            toggleDOM.className = "stepToggle";
            toggleDOM.innerText = "\u25B8"; // ▸ (collapsed by default)
            toggleDOM.title = "Show/hide sub-steps";
            mainRowDOM.appendChild (toggleDOM);
        }

        if (step.description)
        {
            const descriptionDOM = document.createElement ("div");
            descriptionDOM.className = "stepDescription";
            descriptionDOM.innerText = step.description;
            rowDOM.appendChild (descriptionDOM);
        }

        if (hasChildren)
        {
            const childrenDOM = document.createElement ("div");
            childrenDOM.className = "stepChildren";
            childrenDOM.style.display = "none";
            rowDOM.appendChild (childrenDOM);

            const toggleDOM = mainRowDOM.querySelector (".stepToggle");
            toggleDOM.addEventListener ("click", () => {
                const isCollapsed = childrenDOM.style.display === "none";
                childrenDOM.style.display = isCollapsed ? "" : "none";
                toggleDOM.innerText = isCollapsed ? "\u25BE" : "\u25B8"; // ▾ : ▸
            });

            for (const childStep of step.children)
            {
                this.addStep (childStep, childrenDOM, depth + 1);
            }
        }
    }
}

// =======================================================================

function addCubeControlButtons ()
{
    let cubeControlsTable = document.getElementById ("cubeControlsTable");
    // create a move button for each valid move
    // and pack buttons in rows
    let j = 0;
    let max_col_per_row = 3;
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
        btn.className = "controlButton primary";
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