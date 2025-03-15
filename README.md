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
- In-game shop with purchasable items
- Modal window interface for the shop
- Purchase confirmation messages

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
7. Access the in-game shop by clicking the "Shop" button in the top-right corner

## Controls

- **Space / Up Arrow / Touch**: Jump
- **Enter / Click Restart Button / Touch Restart Button**: Restart game after game over
- **Shop Button**: Open in-game shop
- **Escape**: Close shop
- **Click outside shop window**: Close shop

## Game Mechanics

- The blue rectangle represents the player character
- Red rectangles are obstacles that appear from the right side of the screen
- The player must jump over obstacles to avoid collisions
- Score increases automatically as you run
- Distance is tracked in meters
- The game counts how many obstacles you successfully pass
- Game ends when the player collides with an obstacle
- High score is saved during the session

## Shop System

The game includes a basic in-game shop with the following features:
- Shop button in the top-right corner
- Modal window interface
- Three sample purchasable items:
  - Coin Pack
  - Character Skin
  - Speed Booster
- Purchase confirmation messages
- Multiple ways to close the shop (button, escape key, click outside)

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