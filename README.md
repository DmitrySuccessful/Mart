# Runner Game

A simple HTML5 Canvas game where a character automatically runs and can jump over obstacles.

## Features

- Canvas-based rendering
- Character with automatic horizontal movement
- Jumping mechanics with gravity
- Simple physics implementation
- Keyboard and touch controls
- Randomly generated obstacles
- Collision detection system
- Game over state with score tracking
- High score tracking
- Detailed distance and obstacles counter
- Interactive restart button with hover effects
- Multiple ways to restart the game (keyboard, touch, mouse)

## How to Play

1. Open `index.html` in a web browser
2. Press the Space bar, Up arrow key, or tap the screen (on mobile devices) to make the character jump
3. Avoid the red obstacles by jumping over them
4. Try to achieve the highest score possible
5. When you hit an obstacle, the game ends
6. Restart the game by:
   - Clicking the "Restart Game" button
   - Pressing Enter key
   - Tapping the restart button (on mobile devices)

## Controls

- **Space / Up Arrow / Touch**: Jump
- **Enter / Click Restart Button / Touch Restart Button**: Restart game after game over

## Game Mechanics

- The blue rectangle represents the player character
- Red rectangles are obstacles that appear from the right side of the screen
- The player must jump over obstacles to avoid collisions
- Score increases automatically as you run
- Distance is tracked in meters
- The game counts how many obstacles you successfully pass
- Game ends when the player collides with an obstacle
- High score is saved during the session

## Development

The game is built using:
- HTML5
- CSS3
- JavaScript (vanilla)

## Structure

- `index.html`: Main HTML file with canvas element
- `src/js/game.js`: Game logic and rendering
- `src/css/`: CSS styles (not currently used)
- `src/assets/`: Game assets (not currently used) 