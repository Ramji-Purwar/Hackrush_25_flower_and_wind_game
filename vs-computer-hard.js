const boardSize = 5;
let board = Array.from({ length: boardSize }, () => Array(boardSize).fill(""));
let turnsLeft = 7;
let flowerPlaced = false;
const usedDirections = new Set();

// DOM Elements
const popup = document.getElementById("gamePopup");
const popupMessage = document.getElementById("popupMessage");
const playAgainBtn = document.getElementById("playAgainBtn");

const directions = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
  upLeft: [-1, -1],
  upRight: [-1, 1],
  downLeft: [1, -1],
  downRight: [1, 1],
};

// Event Listeners
playAgainBtn.addEventListener("click", resetGame);

function createBoard() {
  const gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", handleCellClick);
      gameBoard.appendChild(cell);
    }
  }
  updateBoardUI();
}

function handleCellClick(e) {
  if (flowerPlaced || turnsLeft <= 0) return;

  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);

  if (board[row][col] === "") {
    board[row][col] = "🌸";
    flowerPlaced = true;
    updateBoardUI();

    setTimeout(() => {
      const bestDirection = aiPickBestDirection(board, turnsLeft, usedDirections, 3);
      console.log("AI picked direction:", bestDirection);

      if (bestDirection) {
        spreadSeeds(bestDirection);
        usedDirections.add(bestDirection);
        turnsLeft--;
        updateBoardUI();
        updateTurnCounter();
        checkWin();
        flowerPlaced = false;
      }
    }, 500);
  }
}

function aiPickBestDirection(currentBoard, turnsRemaining, usedDirs, depth) {
  let bestDir = null;
  let bestScore = Infinity;

  for (const dir in directions) {
    if (usedDirs.has(dir)) continue;

    const simBoard = simulateSpread(dir, currentBoard);
    const score = countTotalFilled(simBoard);

    if (score < bestScore) {
      bestScore = score;
      bestDir = dir;
    }
  }

  return bestDir;
}

function simulateSpread(direction, simBoard) {
  const [dr, dc] = directions[direction];
  const tempBoard = simBoard.map(row => row.slice());
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (tempBoard[i][j] === "🌸") {
        let r = i + dr, c = j + dc;
        while (isInBounds(r, c)) {
          if (tempBoard[r][c] === "") tempBoard[r][c] = "🌱";
          r += dr;
          c += dc;
        }
      }
    }
  }
  return tempBoard;
}

function spreadSeeds(direction) {
  const [dr, dc] = directions[direction];
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === "🌸") {
        let r = i + dr, c = j + dc;
        while (isInBounds(r, c)) {
          if (board[r][c] === "") board[r][c] = "🌱";
          r += dr;
          c += dc;
        }
      }
    }
  }
}

function isInBounds(row, col) {
  return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}

function countTotalFilled(boardState) {
  let count = 0;
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (boardState[i][j] === "🌸" || boardState[i][j] === "🌱") count++;
    }
  }
  return count;
}

function updateBoardUI() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    cell.textContent = board[row][col];
    cell.className = "cell";
    if (board[row][col] === "🌸") cell.classList.add("flower");
    if (board[row][col] === "🌱") cell.classList.add("seed");
  });
}

function updateTurnCounter() {
  document.getElementById("turnCounter").textContent = `Turns left: ${turnsLeft}`;
}

function showPopup(message) {
  popupMessage.textContent = message;
  popup.style.display = "flex";
}

function hidePopup() {
  popup.style.display = "none";
}

function resetGame() {
  hidePopup();
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(""));
  turnsLeft = 7;
  flowerPlaced = false;
  usedDirections.clear();
  document.getElementById("gameMessage").textContent = "";
  createBoard();
  updateTurnCounter();
}

function checkWin() {
  const allFilled = board.flat().every(cell => cell === "🌸" || cell === "🌱");
  const message = document.getElementById("gameMessage");

  if (allFilled) {
    message.textContent = "🌸 Flower Wins!";
    showPopup("🌸 Flower Wins!");
  } else if (turnsLeft <= 0) {
    message.textContent = "💨 Wind Wins!";
    showPopup("💨 Wind Wins!");
  }
}

createBoard();