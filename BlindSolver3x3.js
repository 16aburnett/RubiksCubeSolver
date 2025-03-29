// Rubiks Cube Solver: Uses the Blindfolded method
// By Amy Burnett
// =======================================================================
// Globals/constants

// =======================================================================

class BlindSolver3x3
{

    constructor ()
    {

    }

    // ===================================================================

    findSolution (cube)
    {
        const name = "findSolution2LookCMLLOrientCorners";
        console.log (name);
        console.time (name);
        let solution = [];

        let temp = this.findSolutionForEdges (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        temp = this.findSolutionForCorners (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log (`Failed: Could not find solution to ${name}`);
            console.timeEnd (name);
            return null;
        }
        solution = solution.concat(temp);

        console.timeEnd (name);
        return solution;
    }

    // ===================================================================

    findSolutionForEdges (cube)
    {
        const name = "findSolution2LookCMLLOrientCorners";
        console.log (name);
        console.time (name);
        let solution = [];

        const edgeCyclePath = this.determineEdgeCyclePath (cube);
        // TODO

        console.timeEnd (name);
        return solution;
    }

    // ===================================================================

    findSolutionForCorners (cube)
    {
        const name = "findSolution2LookCMLLOrientCorners";
        console.log (name);
        console.time (name);
        let solution = [];

        const cornerCyclePath = this.determineCornerCyclePath (cube);
        // TODO

        console.timeEnd (name);
        return solution;
    }

    // ===================================================================

    determineEdgeCyclePath (cube)
    {

    }

    // ===================================================================

    determineCornerCyclePath (cube)
    {

    }
}


// =======================================================================