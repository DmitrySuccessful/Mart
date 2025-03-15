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

// Obstacles array
let obstacles = [];

// Obstacle settings
const obstacleMinWidth = 20;
const obstacleMaxWidth = 60;
const obstacleMinHeight = 30;
const obstacleMaxHeight = 80;
const obstacleMinGap = 300; // Minimum gap between obstacles
const obstacleMaxGap = 600; // Maximum gap between obstacles
const obstacleSpeed = 6;    // Speed of obstacles moving left
let nextObstacleDistance = obstacleMinGap; // Distance until next obstacle

// Game state
let gameRunning = true;
let score = 0;
let highScore = 0;
let distance = 0; // Track distance in meters
let obstaclesPassed = 0; // Count obstacles passed

// Restart button
const restartButton = {
    x: canvas.width / 2 - 100,
    y: canvas.height / 2 + 80,
    width: 200,
    height: 50,
    text: 'Restart Game',
    color: '#3498db',
    hoverColor: '#2980b9',
    textColor: '#fff',
    isHovered: false
};

// Handle keyboard input
document.addEventListener('keydown', function(event) {
    // Space bar or up arrow for jump
    if ((event.code === 'Space' || event.code === 'ArrowUp') && !player.isJumping && gameRunning) {
        jump();
    }
    
    // Restart game with Enter key when game over
    if (event.code === 'Enter' && !gameRunning) {
        restartGame();
    }
});

// Handle touch input for mobile devices
canvas.addEventListener('touchstart', function(event) {
    event.preventDefault();
    
    // Get touch coordinates
    const touch = event.touches[0];
    const touchX = touch.clientX - canvas.getBoundingClientRect().left;
    const touchY = touch.clientY - canvas.getBoundingClientRect().top;
    
    if (!gameRunning) {
        // Check if restart button was touched
        if (
            touchX >= restartButton.x && 
            touchX <= restartButton.x + restartButton.width &&
            touchY >= restartButton.y && 
            touchY <= restartButton.y + restartButton.height
        ) {
            restartGame();
        }
    } else if (!player.isJumping) {
        jump();
    }
});

// Handle mouse movement for button hover effect
canvas.addEventListener('mousemove', function(event) {
    if (!gameRunning) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;
        
        // Check if mouse is over restart button
        restartButton.isHovered = (
            mouseX >= restartButton.x && 
            mouseX <= restartButton.x + restartButton.width &&
            mouseY >= restartButton.y && 
            mouseY <= restartButton.y + restartButton.height
        );
    }
});

// Handle mouse click for restart button
canvas.addEventListener('click', function(event) {
    if (!gameRunning) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;
        
        // Check if restart button was clicked
        if (
            mouseX >= restartButton.x && 
            mouseX <= restartButton.x + restartButton.width &&
            mouseY >= restartButton.y && 
            mouseY <= restartButton.y + restartButton.height
        ) {
            restartGame();
        }
    }
});

// Jump function
function jump() {
    player.velocityY = jumpForce;
    player.isJumping = true;
}

// Create a new obstacle
function createObstacle() {
    const width = Math.floor(Math.random() * (obstacleMaxWidth - obstacleMinWidth + 1)) + obstacleMinWidth;
    const height = Math.floor(Math.random() * (obstacleMaxHeight - obstacleMinHeight + 1)) + obstacleMinHeight;
    
    const obstacle = {
        x: canvas.width,
        y: groundLevel,
        width: width,
        height: height,
        color: '#e74c3c',
        passed: false
    };
    
    obstacles.push(obstacle);
    
    // Set distance until next obstacle
    nextObstacleDistance = Math.floor(Math.random() * (obstacleMaxGap - obstacleMinGap + 1)) + obstacleMinGap;
}

// Check for collision between two rectangles
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y - rect1.height < rect2.y &&
        rect1.y > rect2.y - rect2.height
    );
}

// Game over function
function gameOver() {
    gameRunning = false;
    
    // Update high score if current score is higher
    if (score > highScore) {
        highScore = score;
    }
}

// Restart game function
function restartGame() {
    gameRunning = true;
    score = 0;
    distance = 0;
    obstaclesPassed = 0;
    obstacles = [];
    nextObstacleDistance = obstacleMinGap;
    player.y = groundLevel;
    player.velocityY = 0;
    player.isJumping = false;
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
    score += player.speed / 10;
    
    // Update distance (1 unit = 1 meter)
    distance += obstacleSpeed / 10;
    
    // Generate obstacles
    nextObstacleDistance -= obstacleSpeed;
    if (nextObstacleDistance <= 0) {
        createObstacle();
    }
    
    // Update obstacles and check for collisions
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        
        // Move obstacle to the left
        obstacle.x -= obstacleSpeed;
        
        // Check if player has passed this obstacle
        if (!obstacle.passed && player.x > obstacle.x + obstacle.width) {
            obstacle.passed = true;
            obstaclesPassed++;
        }
        
        // Check for collision with player
        if (checkCollision(player, obstacle)) {
            gameOver();
        }
        
        // Remove obstacles that have gone off screen
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
        }
    }
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = ground.color;
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
    
    // Draw obstacles
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y - obstacle.height, obstacle.width, obstacle.height);
    });

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y - player.height, player.width, player.height);

    // Draw score and stats
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${Math.floor(score)}`, 20, 30);
    ctx.fillText(`High Score: ${Math.floor(highScore)}`, 20, 60);
    ctx.fillText(`Distance: ${Math.floor(distance)}m`, 20, 90);
    ctx.fillText(`Obstacles Passed: ${obstaclesPassed}`, 20, 120);
    
    // Draw game over message
    if (!gameRunning) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 80);
        
        ctx.font = '25px Arial';
        ctx.fillText(`Score: ${Math.floor(score)}`, canvas.width / 2, canvas.height / 2 - 40);
        ctx.fillText(`High Score: ${Math.floor(highScore)}`, canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillText(`Distance: ${Math.floor(distance)}m`, canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText(`Obstacles Passed: ${obstaclesPassed}`, canvas.width / 2, canvas.height / 2 + 50);
        
        // Draw restart button
        ctx.fillStyle = restartButton.isHovered ? restartButton.hoverColor : restartButton.color;
        ctx.fillRect(restartButton.x, restartButton.y, restartButton.width, restartButton.height);
        
        ctx.fillStyle = restartButton.textColor;
        ctx.font = '24px Arial';
        ctx.fillText(restartButton.text, canvas.width / 2, restartButton.y + 33);
        
        ctx.textAlign = 'left';
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop(); 