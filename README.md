# HW5 – Scrabble (One-Line Version)

**Name:** Sri Bhargava Dendukuri  
**Email:** SriBhargava_Dendukuri@student.uml.edu  
**Course:** COMP 4610 – GUI Programming I  
**Assignment:** HW5 – Implementing a Bit of Scrabble with Drag-and-Drop  

**Live Demo:**  
https://sbdendukuri25.github.io/GUIHW5/

**Repository:**  
https://github.com/sbdendukuri25/GUIHW5.git
---

## Description

This assignment implements a simplified, one-line version of the Scrabble game using HTML, CSS, JavaScript, jQuery, and jQuery UI.  
Players are dealt seven random letter tiles from the official Scrabble tile distribution and can drag and drop tiles from the rack onto a single row of the Scrabble board to form words. Scores are calculated dynamically using letter values and bonus square multipliers.

---

## Implemented Features

### Fully Working Features
- Random selection of letter tiles from a data structure with correct Scrabble distribution
- Drag-and-drop functionality using jQuery UI
- Tiles can be dragged only from the rack to the board
- Tiles dropped outside valid targets bounce back to the rack
- Tiles can be moved from the board back to the rack
- One-line Scrabble board with at least two bonus square types (Double Letter and Double Word)
- Program correctly identifies which tile is dropped on which board square
- Dynamic scoring that updates as tiles are placed or removed
- Correct application of letter and word multipliers
- Enforcement of adjacency rule: except for the first tile, all tiles must be placed next to an existing tile
- Submission of a word adds the score to the total score
- Board is cleared after each submitted word
- Only the number of tiles needed to refill the rack back to seven are drawn
- Multiple words can be played in a single game
- Restart button resets the game, score, board, and tile bag

---

## Extra Credit

### Word Validation (+2 points)
Basic word validation has been implemented.  
A word must:
- Contain at least two letters  
- Consist only of alphabetic characters (A–Z)  

Invalid words are rejected and cannot be submitted.

---

## Files Used

- `index.html` – Main HTML structure
- `css/style.css` – Page layout and styling
- `js/scrabble.js` – Game logic and jQuery UI interactions
- `js/Scrabble_Pieces_AssociativeArray_Jesse.js` – Scrabble tile distribution and values
- `images/` – Scrabble tile, board, and rack images

---

## Acknowledgements

- Scrabble tile distribution data provided by Prof. Jesse M. Heines  
- jQuery and jQuery UI libraries used for drag-and-drop functionality

---

## Known Limitations

- Full English dictionary validation is not implemented
- Only a single row of the Scrabble board is supported (extra credit full board not implemented)

---

