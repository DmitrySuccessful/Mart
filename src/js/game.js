// Get the canvas and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const gravity = 0.5;
const jumpForce = -12;
const groundLevel = canvas.height - 50;

// Player object
const player = {
    x: 100,
    y: groundLevel,
    width: 40,
    height: 60,
    speed: 5,
    velocityY: 0,
    isJumping: false,
    color: '#3498db'
};

// Ground object
const ground = {
    x: 0,
    y: groundLevel,
    width: canvas.width,
    height: 50,
    color: '#2ecc71'
};

// Game state
let gameRunning = true;
let score = 0;

// Handle keyboard input
document.addEventListener('keydown', function(event) {
    // Space bar or up arrow for jump
    if ((event.code === 'Space' || event.code === 'ArrowUp') && !player.isJumping) {
        jump();
    }
});

// Handle touch input for mobile devices
canvas.addEventListener('touchstart', function(event) {
    event.preventDefault();
    if (!player.isJumping) {
        jump();
    }
});

// Jump function
function jump() {
    player.velocityY = jumpForce;
    player.isJumping = true;
}

// Update game state
function update() {
    if (!gameRunning) return;

    // Apply gravity to player
    player.velocityY += gravity;
    player.y += player.velocityY;

    // Check if player is on the ground
    if (player.y >= groundLevel) {
        player.y = groundLevel;
        player.velocityY = 0;
        player.isJumping = false;
    }

    // Automatically move player forward (for running effect)
    // In a real game, you might move obstacles instead of the player
    score += player.speed / 10;
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = ground.color;
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y - player.height, player.width, player.height);

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${Math.floor(score)}`, 20, 30);
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop(); 