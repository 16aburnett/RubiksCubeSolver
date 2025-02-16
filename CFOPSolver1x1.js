// Rubiks Cube Solver: CFOP for 1x1
// By Amy Burnett
// August 18 2024
// =======================================================================

class CFOPSolver1x1
{

    constructor ()
    {
        this.MAX_CUBE_ORIENTATION_MOVES = 4;
    }

    // =======================================================================

    // returns a list of moves to solve the cube from the current state
    findSolution (cube)
    {
        let solution = [];
        // Orient the cube so white is down and blue is front
        let temp = this.findSolutionToOrientTheCube (cube);
        // Ensure solution was found
        if (temp == null)
        {
            console.log ("failed to find solution");
            return null;
        }
        solution = solution.concat(temp);
        return solution;
    }
    
    // =======================================================================

    findSolutionToOrientTheCube (cube) {
        const name = "findSolutionToOrientTheCube";
        console.log (name);
        console.time (name);

        let solution = [];
        let temp = findMinSolution (cube, this.MAX_CUBE_ORIENTATION_MOVES, (cube) => {
            return this.isCentersSolved (cube);
        }, [
            [cubeNotationMove (MOVE_X,  1)],
            [cubeNotationMove (MOVE_X, -1)],
            [cubeNotationMove (MOVE_Y,  1)],
            [cubeNotationMove (MOVE_Y, -1)],
            [cubeNotationMove (MOVE_Z,  1)],
            [cubeNotationMove (MOVE_Z, -1)],
        ]);
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

    // =======================================================================

    isCentersSolved (cube) {
        if (cube.data[cube.FRONT] != BLUE  ) return false;
        if (cube.data[cube.BACK ] != GREEN ) return false;
        if (cube.data[cube.LEFT ] != ORANGE) return false;
        if (cube.data[cube.RIGHT] != RED   ) return false;
        if (cube.data[cube.UP   ] != YELLOW) return false;
        if (cube.data[cube.DOWN ] != WHITE ) return false;
        return true;
    }

}
