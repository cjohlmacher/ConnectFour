/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let winner = false;
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
  const boardRow = [];
  for (let i = 0; i < WIDTH; i++) {
    boardRow.push(null);
  };
  for (let j = 0; j < HEIGHT; j++) {
    board.push([...boardRow]);
  };
  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  const htmlBoard = document.getElementById("board");
  // Sets the top row of the table where the player clicks to drop a piece.
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Creates the head of the column where the user clicks and a preview piece.
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    const previewPiece = document.createElement("div");
    previewPiece.setAttribute("id",x);
    previewPiece.classList.add("preview");
    headCell.append(previewPiece);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Adds the game board cells and assigns an id to each cell with col and row position
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      if (x === 0) {cell.classList.add("leftmost");} 
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

const makeResetButton = () => {
  const resetButton = document.createElement("button");
  resetButton.classList.add("reset");
  resetButton.innerText = "Play Again?";
  resetButton.addEventListener("click", (e) => {
    triggerEndgameCollapse();
  });
  document.body.append(resetButton);
};
/** findSpotForCol: given column x, return top empty y (null if filled) */

const findSpotForCol = x => {
  let openSpot = null;
  for (let y = 0; y < HEIGHT; y++) {
    if (board[y][x] === null) {
      openSpot = y;
    }
  };
  return openSpot;
}

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
  const cell = document.getElementById(`${y}-${x}`);
  const piece = document.createElement("div");
  piece.classList.add("piece");
  piece.classList.add(`p${currPlayer}`)
  piece.style.setProperty('--fallDistance',`-${30+y*54}px`);
  piece.style.setProperty('--fallTime',`${0.5+y/2.0}s`);
  cell.append(piece);
}

/** endGame: announce game end */

const endGame = (msg) => {
  winner = true;
  setTimeout( function() {
    alert(msg);
  },100);
  showResetButton();
};

const showResetButton = () => {
  const resetButton = document.querySelector("button.reset");
  resetButton.style.display = 'block';
};

const triggerEndgameCollapse = () => {
  currPlayer = 1;
  winner = false;
  board.length = 0;
  makeBoard();
  const pieces = document.querySelectorAll(".piece");
  for (piece of pieces) {
    piece.remove();
  };
  const resetButton = document.querySelector("button.reset");
  resetButton.style.display = 'none';

};
/** handleClick: handle click of column top to play piece */

const handleClick = (evt) => {
  // get x from ID of clicked cell
  if (winner) {
    return;
  };
  
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  
  if (y !== null) {
    board[y][x] = currPlayer;
  };

  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  };

  // check for tie
  if (board.every( (row) => {
    return row.every( (cell) => {
      return cell !== null;
    });
  })) {
    return endGame(`It's a tie!`);
  } else {
  };

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
  const previewPieces = document.querySelectorAll(".preview");
  previewPieces.forEach( (previewPiece) => {
    previewPiece.style.backgroundColor = previewPiece.style.backgroundColor === "rgb(254, 93, 159)" ? 'rgb(0,48,143)' : 'rgb(254,93,159)';
  });
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  const _win = cells => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // This function goes through every cell in the grid and checks if there is a win
  // extending to the right three squares, extending up three squares, extending up
  // and to the right three squares, or extending down and to the right three squares
  // If there is a win in any of those directions, it returns true.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
makeResetButton();
