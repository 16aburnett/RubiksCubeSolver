// SolverRegistry - Manages registration and retrieval of cube solvers
// This allows the app to be extended for new cube solvers without modifying the core code
// Author: Amy Burnett
// =======================================================================

class SolverRegistry {
  constructor() {
    this.solvers = [];
  }

  /**
   * Registers a new solver into the application.
   * Should be called at the bottom of each solver file to register it with the application.
   */
  register(solverInstance) {
    this.solvers.push(solverInstance);
    console.log(`Registered solver: ${solverInstance.name}`);
  }

  /**
   * Returns a filtered list of solvers that support a specific cube size.
   * Handles explicit sizes (like 3) and universal solvers ("NxN").
   * @param {number} size - The current cube size (e.g., 3, 4, 5)
   */
  getSolversForSize(size) {
    return this.solvers.filter(solver => 
      solver.supportedSizes.includes(size) || 
      solver.supportedSizes.includes("NxN")
    );
  }

  /**
   * Returns every single solver registered in the system.
   */
  getAllSolvers() {
    return this.solvers;
  }
}

// Global instance of the solver registry
const solverRegistry = new SolverRegistry();
