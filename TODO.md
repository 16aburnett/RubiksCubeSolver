

- [] Add a 3D representation of the cube
    - doesnt need to be interactable
    - leave 2D rep as a minimap
- [] Add slice move buttons
- [] Add cube rotation buttons

- [] Add 4x4
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
- [] for 4x4 - reduce to 2x2 and solve like 2x2
- [] 2x2 ortega method https://www.speedcube.us/blogs/speedcubing-solutions/how-to-solve-a-2x2-using-ortega-method-intermediate