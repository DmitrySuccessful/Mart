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
- Virtual currency (coins) system
- Coin rewards for passing obstacles
- Persistent coins between game sessions
- Progress saving with localStorage
- Reset progress button

## How to Play

1. Open `index.html` in a web browser
2. Press the Space bar, Up arrow key, or tap the screen (on mobile devices) to make the character jump
3. Avoid the red obstacles by jumping over them
4. Earn coins by successfully jumping over obstacles
5. Try to achieve the highest score possible
6. When you hit an obstacle, the game ends
7. Restart the game by:
   - Clicking the "Restart Game" button
   - Pressing Enter key
   - Tapping the restart button (on mobile devices)
8. Access the in-game shop by clicking the "Shop" button in the top-right corner
9. Use your earned coins to purchase items in the shop
10. Your progress (coins and high score) is automatically saved

## Controls

- **Space / Up Arrow / Touch**: Jump
- **Enter / Click Restart Button / Touch Restart Button**: Restart game after game over
- **Shop Button**: Open in-game shop
- **Reset Button**: Reset all progress (coins and high score)
- **Escape**: Close shop
- **Click outside shop window**: Close shop

## Game Mechanics

- The blue rectangle represents the player character
- Red rectangles are obstacles that appear from the right side of the screen
- The player must jump over obstacles to avoid collisions
- Score increases automatically as you run
- Distance is tracked in meters
- The game counts how many obstacles you successfully pass
- Each passed obstacle rewards the player with coins
- Coins are persistent between game sessions
- Game ends when the player collides with an obstacle
- High score is saved during the session

## Shop System

The game includes a basic in-game shop with the following features:
- Shop button in the top-right corner
- Modal window interface
- Display of player's current coin balance
- Three sample purchasable items:
  - Coin Pack
  - Character Skin
  - Speed Booster
- Purchase confirmation messages
- Multiple ways to close the shop (button, escape key, click outside)

## Currency System

- Earn coins by successfully jumping over obstacles
- Current coin balance is displayed in the top-left corner
- Coins are persistent between game sessions (not reset on game over)
- Total coins are displayed on the game over screen
- Coins can be used to purchase items in the shop

## Progress Saving

- Game progress (coins and high score) is automatically saved using localStorage
- Progress persists even after closing the browser
- Reset button allows clearing all saved progress
- Confirmation dialog prevents accidental progress reset

## Development

The game is built using:
- HTML5
- CSS3
- JavaScript (vanilla)
- localStorage API for progress saving

## Structure

- `index.html`: Main HTML file with canvas element
- `src/js/game.js`: Game logic and rendering
- `src/css/`: CSS styles (not currently used)
- `src/assets/`: Game assets (not currently used) 