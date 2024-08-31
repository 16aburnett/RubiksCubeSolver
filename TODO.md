

- [] make inverse moves calculatable to generalize move selection
    - i.e. positive N == normal move N, negative N = N prime

- [] add timer for solvers


- [] cube notation
    - r on 4x4 has a unique meaning.....
    - https://www.youtube.com/watch?v=24eHm4ri8WM
    - FIX E,M,S - I HAVE THE WRONG DIRECTION!!!


- [] generalized rubiks cube class
    - Cube move notation is not generalizable since it changes with 2x2, 3x3, 4x4, etc
        - need a way to define move sets outside class
        - and provide a map from move notation to internal move notation

- [] make sure rotations are correct
    - https://jperm.net/3x3/moves

- [DONE] Add a 3D representation of the cube
    - doesnt need to be interactable
    - leave 2D rep as a minimap
- [DONE] Add slice move buttons
- [DONE] Add cube rotation buttons

- [DONE] Add 4x4
     - maybe find a generalization so we can do 5x5, 6x6, etc

- [] add a mode where it can solve each stage of CFOP 
    - find solution for white cross
    - then solve it
    - find f2l pairs solution
    - then solve it

- [] output to website the moves to solve
    - and the scramble moves
    - maybe make this like a console/log
    - when scramble button is pressed - output:
        scramble : <list_of_moves>
    - when other buttons are pressed
        user-btn : <growing_list_of_moves> 
        make this grow, not a line per button
        only go to newline when a diff button is pressed
    - when solve button is pressed
        solver solution: <list_of_moves>
    - maybe special output for each type of solver?
        CFOP solver:
            white cross : <list_of_moves>
            F2L: <list_of_moves>
            OLL: <list_of_moves>
            PLL: <list_of_moves>
            and output JPerm inplace of moves

- [] add algo buttons
    - maybe a new tab for less clutter
    - jperm, tperm etc

- [] Roux solver
- [] Jperm-only solver
- [] blind folded solver
- [] for 4x4 - reduce to 2x2 and solve like 2x2
- [] 2x2 ortega method https://www.speedcube.us/blogs/speedcubing-solutions/how-to-solve-a-2x2-using-ortega-method-intermediate
- [] commutator-only solver
- [] layer by layer 4x4 - not the normal one




Performance
- 3x3 took 180 seconds to solve... way too slow

- web workers for not blocking main thread?


