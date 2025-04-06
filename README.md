# Flower and Wind Game

## Description
'Flower and Wind' is a strategic game where there are two players: **Wind** and **Flower**. The game is played on a 5x5 grid, where Flower plants a flower in a cell, and the Wind blows seeds in one of eight directions. The objective is for Flower to fill all the grid cells, or for Wind to stop the spread before it happens. 

The game can be played in **Multiplayer Mode** or **Vs Computer Mode** with three difficulty levels: Easy, Medium, and Hard.

## Features
- **Main Page**: Displays a title and buttons for accessing rules, multiplayer, or vs computer mode.
- **Multiplayer Mode**: Two players alternate turns with a timer, and the game ends if Flower fills all cells or after 7 turns.
- **AI Difficulty**: The game features three levels of difficulty for playing against the computer (Easy, Medium, Hard).
- **Wind Direction Arrows**: Wind directions are represented by arrows arranged in a circle.
- **Mobile-Friendly**: The game is designed to work on both desktop and mobile devices.

## Setup Instructions
1. Clone or download the project.
2. Open `index.html` in a browser to play the game.
3. The game will automatically load the main menu where you can select a mode.

## Game Rules
1. **Players**: There are two players: Wind and Flower.
2. **Grid**: The game is played on a 5x5 board.
3. **Flower's Turn**: Flower plants a flower in a selected cell.
4. **Wind's Turn**: The Wind blows seeds in one of eight directions (up, down, left, right, or diagonals).
5. **Game Cycle**: The game continues for 7 turns or until the Flower fills all cells.
6. **Victory Conditions**:
   - **Flower Wins**: If Flower fills all the cells before 7 turns.
   - **Wind Wins**: If Flower does not fill all the cells after 7 turns.

## Multiplayer Mode
1. Players take turns, with each turn having a timer of 150 seconds.
2. After every move, the grid updates, and the wind direction is chosen from arrows arranged in a circle.
3. If a player wins, a pop-up message will show the winner.

## AI Mode
1. **Easy Mode**: The AI makes a random first move and then continues in a circular pattern.
2. **Medium Mode**: The AI uses Depth-First Search (DFS) with a depth of 1 to minimize seed spread.
3. **Hard Mode**: The AI uses DFS with a depth of 3 to explore more possibilities and minimize seed spread.

## Wind Direction Arrows
- Wind direction is selected using arrows arranged in a circle with up, down, left, right, and diagonal options.
- The selected wind direction is shown in a pop-up.

## Back Button Navigation
- Each page has a **Back** button at the top-left corner to return to the main menu.

## CSS for Visual Styles
- The game is styled using CSS with the following features:
  - **Responsive design**: The game is mobile-friendly, with elements adjusting for small screens.
  - **Themes**: There are three available themes for the game:
    - **Light**: A bright and clean look.
    - **Dark**: A darker theme for night-time play.
    - **Neon**: A vibrant and colorful theme.
  
## Game Reset & Replay Button
- A **Play Again** button is shown after the game ends to allow players to start a new match.

## Pop-Up Features
- Pop-ups display game results, the rules, and wind direction selection.
- The pop-ups are centered on the screen with modern, clean design.

## To Do
- **AI Improvements**: Further improve the AI logic for harder difficulty levels.
- **Theme Customization**: Allow users to customize the game theme.
- **Multiplayer Enhancements**: Add features like chat functionality or custom game rules.

## Technologies Used
- HTML5
- CSS3
- JavaScript

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- The game idea and concept are inspired by classic grid-based strategy games.
- Special thanks to the open-source community for libraries and tools used in this project.
