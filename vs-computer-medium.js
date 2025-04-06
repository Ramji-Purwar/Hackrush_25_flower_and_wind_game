const boardSize = 5;
let turnCount = 7;
let currentPlayer = "flower";
const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
let usedDirections = [];
let allCells = [];
let gameEnded = false;

// DOM Elements
const popup = document.getElementById("gamePopup");
const popupMessage = document.getElementById("popupMessage");
const playAgainBtn = document.getElementById("playAgainBtn");

// Event Listeners
playAgainBtn.addEventListener("click", resetGame);

function createBoard() {
  const gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";
  allCells = [];
  
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", handlePlayerMove);
      gameBoard.appendChild(cell);
      allCells.push(cell);
    }
  }
}

function handlePlayerMove(e) {
  if (currentPlayer !== "flower" || gameEnded) return;
  const cell = e.target;
  if (!cell.classList.contains("cell") || cell.classList.contains("flower") || cell.classList.contains("seed")) return;

  cell.classList.add("flower");
  cell.textContent = "🌸";
  currentPlayer = "wind";
  setTimeout(handleComputerMove, 500);
}

function handleComputerMove() {
  if (gameEnded) return;

  const boardCopy = getCurrentBoardState();
  const direction = aiPickBestDirectionDepth1(boardCopy, usedDirections);
  if (!direction) return;

  usedDirections.push(direction);
  spreadSeeds(direction);
  checkWin();
  turnCount--;
  updateTurnCounter();
  if (!gameEnded) currentPlayer = "flower";
}

function aiPickBestDirectionDepth1(board, usedDirs) {
  let bestDir = null;
  let bestScore = Infinity;

  for (const dir of directions) {
    if (usedDirs.includes(dir)) continue;

    const simulated = simulateSpread(dir, board);
    const score = scoreBoard(simulated);

    if (score < bestScore) {
      bestScore = score;
      bestDir = dir;
    }
  }

  return bestDir;
}

function simulateSpread(direction, board) {
  const copy = board.map(row => [...row]);
  const [dr, dc] = getDirectionDelta(direction);

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (copy[r][c] === "🌸") {
        let nr = r + dr;
        let nc = c + dc;
        while (nr >= 0 && nc >= 0 && nr < boardSize && nc < boardSize) {
          if (copy[nr][nc] === "") copy[nr][nc] = "🌱";
          nr += dr;
          nc += dc;
        }
      }
    }
  }

  return copy;
}

function spreadSeeds(direction) {
  const flowerCells = allCells.filter(cell => cell.classList.contains("flower"));
  const [dr, dc] = getDirectionDelta(direction);

  flowerCells.forEach(cell => {
    let r = parseInt(cell.dataset.row);
    let c = parseInt(cell.dataset.col);

    while (true) {
      r += dr;
      c += dc;
      if (r < 0 || c < 0 || r >= boardSize || c >= boardSize) break;

      const index = r * boardSize + c;
      const target = allCells[index];
      if (!target.classList.contains("flower") && !target.classList.contains("seed")) {
        target.classList.add("seed");
        target.textContent = "🌱";
      }
    }
  });
}

function getDirectionDelta(direction) {
  const map = {
    "N": [-1, 0],
    "NE": [-1, 1],
    "E": [0, 1],
    "SE": [1, 1],
    "S": [1, 0],
    "SW": [1, -1],
    "W": [0, -1],
    "NW": [-1, -1]
  };
  return map[direction];
}

function scoreBoard(board) {
  return board.flat().filter(cell => cell === "🌸" || cell === "🌱").length;
}

function getCurrentBoardState() {
  const board = Array.from({ length: boardSize }, () => Array(boardSize).fill(""));
  allCells.forEach(cell => {
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    if (cell.classList.contains("flower")) board[r][c] = "🌸";
    if (cell.classList.contains("seed")) board[r][c] = "🌱";
  });
  return board;
}

function updateTurnCounter() {
  const counter = document.getElementById("turnCounter");
  counter.textContent = `Turns left: ${turnCount}`;
  if (turnCount <= 0 && !gameEnded) {
    checkWin();
  }
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
  turnCount = 7;
  currentPlayer = "flower";
  usedDirections = [];
  gameEnded = false;
  document.getElementById("gameMessage").textContent = "";
  createBoard();
  updateTurnCounter();
}

function checkWin() {
  const allFilled = allCells.every(cell => cell.classList.contains("flower") || cell.classList.contains("seed"));
  const message = document.getElementById("gameMessage");

  if (allFilled) {
    message.textContent = "🌸 Flower Wins!";
    showPopup("🌸 Flower Wins!");
    gameEnded = true;
  } else if (turnCount <= 0) {
    message.textContent = "💨 Wind Wins!";
    showPopup("💨 Wind Wins!");
    gameEnded = true;
  }
}

// Initialize the game
createBoard();
updateTurnCounter();