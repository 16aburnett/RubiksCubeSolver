// Rubiks Cube Solver: PatternAlgorithm
// By Amy Burnett
// =======================================================================

/**
 * Represents a pairing between a pattern and an algorithm.
 * Typically used for matching a pattern on the rubik's cube
 * to an algorithm that will solve that pattern case.
 */
class PatternAlgorithm
{
    /**
     * @param {String} name a name of the pattern/algorithm that can be used for debugging
     * @param {Function} patternFunction a function for determining if the pattern matches or not
     * @param {List} algorithm the algorithm moveset associated with the pattern
     */
    constructor (name, patternFunction, algorithm)
    {
        this.name = name;
        this.patternFunction = patternFunction;
        this.algorithm = algorithm;
    }

    /**
     * Determines if the cube matches the pattern
     * @param {RubiksCube} cube the current state of the Rubiks cube
     * @returns 
     */
    matches (cube)
    {
        return this.patternFunction (cube);
    }

    /**
     * @returns the algorithm for the associated pattern
     */
    getAlgorithm ()
    {
        return this.algorithm;
    }

    /**
     * @returns the name for the associated pattern
     */
    getName ()
    {
        return this.name;
    }
}
