# Flower and Wind Game

This is a simple strategy game called "Flower and Wind". The game involves two players: Wind and Flower. The goal is for the Flower to plant flowers and spread seeds by wind, while the Wind tries to block the Flower from filling the grid.

## Features

1. **Modes**:
   - **Multiplayer**: Play with another person.
   - **Vs Computer**: Play against AI with three difficulty levels (Easy, Medium, Hard).

2. **Themes**:
   - Light
   - Dark
   - Neon

3. **Game Rules**:
   - 5x5 grid.
   - Flower plants a flower, and wind spreads seeds.
   - The game repeats for 7 cycles or until all cells are filled.

## Setup

1. Clone the repository.
2. Open `index.html` in your browser to start playing.

## AI Logic

- **Easy Mode**: Random first move, then moves in a circle.
- **Medium Mode**: AI uses DFS (Depth 1) to minimize seed spread.
- **Hard Mode**: AI uses DFS (Depth 3) to minimize seed spread.

## To Do

- Add more visual enhancements and animations.
- Improve AI logic.
