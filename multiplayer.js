const boardSize = 5;
const board = document.getElementById("gameBoard");
let cells = [];
let isFlowerTurn = true;
let turnsLeft = 7;
const usedDirections = new Set();
const flowerPositions = [];

// Timer Variables
const TIME_LIMIT = 150;
let flowerTimeLeft = TIME_LIMIT;
let windTimeLeft = TIME_LIMIT;
let timerInterval;
let currentTimer = 'flower';

const directions = [
  { name: "N",  symbol: "↑" },
  { name: "NE", symbol: "↗" },
  { name: "E",  symbol: "→" },
  { name: "SE", symbol: "↘" },
  { name: "S",  symbol: "↓" },
  { name: "SW", symbol: "↙" },
  { name: "W",  symbol: "←" },
  { name: "NW", symbol: "↖" }
];

const deltas = {
  N:  [-1,  0],
  NE: [-1,  1],
  E:  [ 0,  1],
  SE: [ 1,  1],
  S:  [ 1,  0],
  SW: [ 1, -1],
  W:  [ 0, -1],
  NW: [-1, -1]
};

// Create popup element
function createPopup() {
  const popup = document.createElement("div");
  popup.id = "gamePopup";
  popup.style.position = "fixed";
  popup.style.top = "0";
  popup.style.left = "0";
  popup.style.width = "100%";
  popup.style.height = "100%";
  popup.style.backgroundColor = "rgba(0,0,0,0.7)";
  popup.style.display = "none";
  popup.style.justifyContent = "center";
  popup.style.alignItems = "center";
  popup.style.zIndex = "1000";
  popup.style.flexDirection = "column";
  
  const popupContent = document.createElement("div");
  popupContent.style.backgroundColor = "white";
  popupContent.style.padding = "2rem";
  popupContent.style.borderRadius = "16px";
  popupContent.style.textAlign = "center";
  popupContent.style.boxShadow = "0 5px 30px rgba(0,0,0,0.3)";
  
  const popupMessage = document.createElement("h2");
  popupMessage.id = "popupMessage";
  popupMessage.style.fontSize = "2rem";
  popupMessage.style.marginBottom = "1.5rem";
  popupMessage.style.color = "#6a5acd";
  
  const popupButton = document.createElement("button");
  popupButton.textContent = "Play Again";
  popupButton.style.padding = "0.8rem 1.5rem";
  popupButton.style.background = "#6a5acd";
  popupButton.style.color = "white";
  popupButton.style.border = "none";
  popupButton.style.borderRadius = "8px";
  popupButton.style.cursor = "pointer";
  popupButton.style.fontSize = "1rem";
  popupButton.style.fontWeight = "600";
  popupButton.onclick = initGame;
  
  popupContent.appendChild(popupMessage);
  popupContent.appendChild(popupButton);
  popup.appendChild(popupContent);
  document.body.appendChild(popup);
}

function showPopup(message) {
  const popup = document.getElementById("gamePopup");
  const popupMessage = document.getElementById("popupMessage");
  popupMessage.textContent = message;
  popup.style.display = "flex";
}

function hidePopup() {
  document.getElementById("gamePopup").style.display = "none";
}

function createBoard() {
  board.innerHTML = '';
  cells = [];
  
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", () => handleCellClick(row, col));
      board.appendChild(cell);
      cells.push(cell);
    }
  }
}

function initGame() {
  hidePopup();
  createBoard();
  
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("flower", "seed");
  });

  isFlowerTurn = true;
  turnsLeft = 7;
  usedDirections.clear();
  flowerPositions.length = 0;
  
  flowerTimeLeft = TIME_LIMIT;
  windTimeLeft = TIME_LIMIT;
  
  document.getElementById("turnCounter").textContent = `Turns left: ${turnsLeft}`;
  document.getElementById("gameMessage").textContent = "";
  
  renderDirectionButtons();
  startTimer('flower');
}

function startTimer(player) {
  clearInterval(timerInterval);
  currentTimer = player;
  
  const turnIndicator = document.getElementById('turnIndicator');
  const windIndicator = document.getElementById('windIndicator');
  
  turnIndicator.className = `player-turn ${player}`;
  document.getElementById(`${player}Timer`).textContent = formatTime(player === 'flower' ? flowerTimeLeft : windTimeLeft);
  
  turnIndicator.style.opacity = '1';
  windIndicator.style.opacity = '0.5';
  
  timerInterval = setInterval(() => {
    if (player === 'flower') {
      flowerTimeLeft--;
      document.getElementById('flowerTimer').textContent = formatTime(flowerTimeLeft);
      updateTimerStyle('flowerTimer', flowerTimeLeft);
    } else {
      windTimeLeft--;
      document.getElementById('windTimer').textContent = formatTime(windTimeLeft);
      updateTimerStyle('windTimer', windTimeLeft);
    }
    
    if ((player === 'flower' && flowerTimeLeft <= 0) || 
        (player === 'wind' && windTimeLeft <= 0)) {
      clearInterval(timerInterval);
      checkGameEnd();
    }
  }, 1000);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateTimerStyle(timerId, timeLeft) {
  const timerElement = document.getElementById(timerId);
  timerElement.className = 'timer';
  
  if (timeLeft <= 30) timerElement.classList.add('warning');
  if (timeLeft <= 10) timerElement.classList.add('danger');
}

function handleCellClick(row, col) {
  if (!isFlowerTurn) return;
  
  const index = row * boardSize + col;
  const cell = cells[index];
  if (cell.classList.contains("flower") || cell.classList.contains("seed")) return;

  cell.textContent = "🌸";
  cell.classList.add("flower");
  flowerPositions.push({ row, col });

  if (checkWin()) {
    endGame("🌸 Flower wins!");
    return;
  }

  isFlowerTurn = false;
  windTimeLeft = TIME_LIMIT;
  startTimer('wind');
  renderDirectionButtons();
}

function renderDirectionButtons() {
  const directionButtons = document.getElementById("directionButtons");
  directionButtons.innerHTML = "";

  if (!isFlowerTurn) {
    directions.forEach(dir => {
      const btn = document.createElement("button");
      btn.textContent = dir.symbol;
      btn.title = dir.name;
      btn.dataset.direction = dir.name;
      btn.disabled = usedDirections.has(dir.name);
      btn.onclick = () => applyWind(dir.name);
      directionButtons.appendChild(btn);
    });

    // Force reflow to ensure positions are calculated
    void directionButtons.offsetWidth;

    // Reset transforms after creation
    const buttons = directionButtons.querySelectorAll('button');
    buttons.forEach(btn => {
      const dir = btn.dataset.direction;
      if (dir === "N") btn.style.transform = "translateX(-50%)";
      else if (dir === "S") btn.style.transform = "translateX(-50%)";
      else if (dir === "E") btn.style.transform = "translateY(-50%)";
      else if (dir === "W") btn.style.transform = "translateY(-50%)";
      else btn.style.transform = "none";
    });

    document.getElementById("directionOverlay").classList.add("visible");
  } else {
    document.getElementById("directionOverlay").classList.remove("visible");
  }
}

function applyWind(direction) {
  if (isFlowerTurn || usedDirections.has(direction)) return;

  usedDirections.add(direction);
  flowerPositions.forEach(pos => spreadSeed(pos.row, pos.col, direction));

  turnsLeft--;
  document.getElementById("turnCounter").textContent = `Turns left: ${turnsLeft}`;

  if (checkWin()) {
    endGame("🌸 Flower wins!");
    return;
  }

  if (turnsLeft <= 0) {
    checkGameEnd();
    return;
  }

  isFlowerTurn = true;
  flowerTimeLeft = TIME_LIMIT;
  startTimer('flower');
  renderDirectionButtons();

  // Check if flower can make any moves
  const canPlaceFlower = cells.some(cell => 
    !cell.classList.contains("flower") && !cell.classList.contains("seed")
  );
  
  if (!canPlaceFlower) {
    endGame("🌸 Flower wins!");
  }
}

function spreadSeed(row, col, direction) {
  const [dr, dc] = deltas[direction];
  let r = row + dr;
  let c = col + dc;

  while (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
    const index = r * boardSize + c;
    const cell = cells[index];
    if (!cell.classList.contains("flower")) {
      cell.textContent = "🌱";
      cell.classList.add("seed");
    }
    r += dr;
    c += dc;
  }
}

function checkWin() {
  return cells.every(cell =>
    cell.classList.contains("flower") || cell.classList.contains("seed")
  );
}

function checkGameEnd() {
  if (checkWin()) {
    endGame("🌸 Flower wins!");
  } else if (turnsLeft <= 0) {
    endGame("💨 Wind wins!");
  }
}

function endGame(message) {
  clearInterval(timerInterval);
  document.getElementById("gameMessage").textContent = message;
  cells.forEach(cell => cell.onclick = null);
  document.getElementById("directionOverlay").classList.remove("visible");
  showPopup(message);
}

// Initialize the popup when the script loads
createPopup();
window.onload = initGame;