// Get the canvas and its context
const canvas = document.getElementById('gameCanvas');
if (!canvas) {
    console.error('Canvas element not found! Make sure the HTML has loaded before the script runs.');
    throw new Error('Canvas element not found');
}
const ctx = canvas.getContext('2d');
if (!ctx) {
    console.error('Could not get 2D context from canvas');
    throw new Error('Canvas context not available');
}

// Game settings
const gravity = 0.5;
const jumpForce = -12;
const groundLevel = canvas.height - 50;

// Проверка поддержки localStorage
function isLocalStorageAvailable() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        console.error('localStorage не поддерживается:', e);
        return false;
    }
}

// Функции для работы с localStorage
function saveGameData() {
    if (isLocalStorageAvailable()) {
        localStorage.setItem("playerCoins", playerCoins);
        localStorage.setItem("highScore", highScore);
    }
}

function loadGameData() {
    if (isLocalStorageAvailable()) {
        if (localStorage.getItem("playerCoins") !== null) {
            playerCoins = parseInt(localStorage.getItem("playerCoins"));
        }
        
        if (localStorage.getItem("highScore") !== null) {
            highScore = parseInt(localStorage.getItem("highScore"));
        }
    }
}

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
let shopOpen = false; // Track if shop is open
let playerCoins = 0; // Player's virtual currency
const coinsPerObstacle = 5; // Coins earned per obstacle passed

// Загрузка сохраненных данных при инициализации
loadGameData();

// Shop button
const shopButton = {
    x: canvas.width - 110,
    y: 20,
    width: 90,
    height: 40,
    text: 'Shop',
    color: '#9b59b6',
    hoverColor: '#8e44ad',
    textColor: '#fff',
    isHovered: false
};

// Reset progress button
const resetButton = {
    x: canvas.width - 110,
    y: 70, // Под кнопкой магазина
    width: 90,
    height: 40,
    text: 'Reset',
    color: '#e74c3c',
    hoverColor: '#c0392b',
    textColor: '#fff',
    isHovered: false
};

// Shop modal
const shopModal = {
    x: canvas.width / 2 - 200,
    y: canvas.height / 2 - 200,
    width: 400,
    height: 400,
    color: '#f8f9fa',
    borderColor: '#6c757d',
    titleColor: '#343a40',
    titleText: 'Магазин внутриигровых покупок',
    closeButton: {
        x: 0, // Will be calculated
        y: 0, // Will be calculated
        width: 80,
        height: 40,
        text: 'Закрыть',
        color: '#dc3545',
        hoverColor: '#c82333',
        textColor: '#fff',
        isHovered: false
    }
};

// Shop items
const shopItems = [
    {
        name: 'Пакет монет',
        description: '1000 монет для покупок',
        price: '100 руб.',
        color: '#ffc107',
        button: {
            text: 'Купить',
            color: '#28a745',
            hoverColor: '#218838',
            textColor: '#fff',
            isHovered: false
        }
    },
    {
        name: 'Скин персонажа',
        description: 'Уникальный внешний вид',
        price: '200 руб.',
        color: '#17a2b8',
        button: {
            text: 'Купить',
            color: '#28a745',
            hoverColor: '#218838',
            textColor: '#fff',
            isHovered: false
        }
    },
    {
        name: 'Бустер скорости',
        description: 'Увеличивает скорость на 50%',
        price: '150 руб.',
        color: '#fd7e14',
        button: {
            text: 'Купить',
            color: '#28a745',
            hoverColor: '#218838',
            textColor: '#fff',
            isHovered: false
        }
    }
];

// Calculate positions for shop modal elements
function calculateShopPositions() {
    // Position close button in top right of modal
    shopModal.closeButton.x = shopModal.x + shopModal.width - shopModal.closeButton.width - 10;
    shopModal.closeButton.y = shopModal.y + 10;
    
    // Calculate positions for shop items and their buttons
    const itemHeight = 80;
    const itemPadding = 20;
    const startY = shopModal.y + 70; // Start after title
    
    shopItems.forEach((item, index) => {
        item.x = shopModal.x + 20;
        item.y = startY + (itemHeight + itemPadding) * index;
        item.width = shopModal.width - 40;
        item.height = itemHeight;
        
        // Position buy button
        item.button.width = 80;
        item.button.height = 30;
        item.button.x = item.x + item.width - item.button.width - 10;
        item.button.y = item.y + (item.height - item.button.height) / 2;
    });
}

// Calculate initial positions
calculateShopPositions();

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
    if ((event.code === 'Space' || event.code === 'ArrowUp') && !player.isJumping && gameRunning && !shopOpen) {
        jump();
    }
    
    // Restart game with Enter key when game over
    if (event.code === 'Enter' && !gameRunning && !shopOpen) {
        restartGame();
    }
    
    // Close shop with Escape key
    if (event.code === 'Escape' && shopOpen) {
        shopOpen = false;
    }
});

// Handle touch input for mobile devices
canvas.addEventListener('touchstart', function(event) {
    event.preventDefault();
    
    // Get touch coordinates
    const touch = event.touches[0];
    const touchX = touch.clientX - canvas.getBoundingClientRect().left;
    const touchY = touch.clientY - canvas.getBoundingClientRect().top;
    
    if (shopOpen) {
        handleShopTouch(touchX, touchY);
    } else if (!gameRunning) {
        // Check if restart button was touched
        if (
            touchX >= restartButton.x && 
            touchX <= restartButton.x + restartButton.width &&
            touchY >= restartButton.y && 
            touchY <= restartButton.y + restartButton.height
        ) {
            restartGame();
        }
    } else {
        // Check if shop button was touched
        if (
            touchX >= shopButton.x && 
            touchX <= shopButton.x + shopButton.width &&
            touchY >= shopButton.y && 
            touchY <= shopButton.y + shopButton.height
        ) {
            shopOpen = true;
        } else if (!player.isJumping) {
            jump();
        }
    }
});

// Handle mouse movement for button hover effects
canvas.addEventListener('mousemove', function(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    
    if (shopOpen) {
        // Check hover for shop close button
        shopModal.closeButton.isHovered = (
            mouseX >= shopModal.closeButton.x && 
            mouseX <= shopModal.closeButton.x + shopModal.closeButton.width &&
            mouseY >= shopModal.closeButton.y && 
            mouseY <= shopModal.closeButton.y + shopModal.closeButton.height
        );
        
        // Check hover for shop item buttons
        shopItems.forEach(item => {
            item.button.isHovered = (
                mouseX >= item.button.x && 
                mouseX <= item.button.x + item.button.width &&
                mouseY >= item.button.y && 
                mouseY <= item.button.y + item.button.height
            );
        });
    } else if (!gameRunning) {
        // Check hover for restart button
        restartButton.isHovered = (
            mouseX >= restartButton.x && 
            mouseX <= restartButton.x + restartButton.width &&
            mouseY >= restartButton.y && 
            mouseY <= restartButton.y + restartButton.height
        );
    }
    
    // Always check hover for shop button
    shopButton.isHovered = (
        mouseX >= shopButton.x && 
        mouseX <= shopButton.x + shopButton.width &&
        mouseY >= shopButton.y && 
        mouseY <= shopButton.y + shopButton.height
    );
    
    // Always check hover for reset button
    resetButton.isHovered = (
        mouseX >= resetButton.x && 
        mouseX <= resetButton.x + resetButton.width &&
        mouseY >= resetButton.y && 
        mouseY <= resetButton.y + resetButton.height
    );
});

// Handle mouse click
canvas.addEventListener('click', function(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    
    if (shopOpen) {
        handleShopClick(mouseX, mouseY);
    } else if (!gameRunning) {
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
    
    // Always check for shop button click
    if (
        mouseX >= shopButton.x && 
        mouseX <= shopButton.x + shopButton.width &&
        mouseY >= shopButton.y && 
        mouseY <= shopButton.y + shopButton.height
    ) {
        shopOpen = true;
    }
    
    // Always check for reset button click
    if (
        mouseX >= resetButton.x && 
        mouseX <= resetButton.x + resetButton.width &&
        mouseY >= resetButton.y && 
        mouseY <= resetButton.y + resetButton.height
    ) {
        resetProgress();
    }
});

// Reset progress function
function resetProgress() {
    if (confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.')) {
        localStorage.removeItem("playerCoins");
        localStorage.removeItem("highScore");
        playerCoins = 0;
        highScore = 0;
        showPurchaseMessage("Прогресс сброшен");
    }
}

// Handle shop click
function handleShopClick(x, y) {
    // Check if close button was clicked
    if (
        x >= shopModal.closeButton.x && 
        x <= shopModal.closeButton.x + shopModal.closeButton.width &&
        y >= shopModal.closeButton.y && 
        y <= shopModal.closeButton.y + shopModal.closeButton.height
    ) {
        shopOpen = false;
        return;
    }
    
    // Check if clicked outside modal (to close)
    if (
        x < shopModal.x || 
        x > shopModal.x + shopModal.width ||
        y < shopModal.y || 
        y > shopModal.y + shopModal.height
    ) {
        shopOpen = false;
        return;
    }
    
    // Check if any buy button was clicked
    shopItems.forEach(item => {
        if (
            x >= item.button.x && 
            x <= item.button.x + item.button.width &&
            y >= item.button.y && 
            y <= item.button.y + item.button.height
        ) {
            console.log(`Покупка совершена: ${item.name} за ${item.price}`);
            // Show purchase message on screen
            showPurchaseMessage(item.name);
        }
    });
}

// Handle shop touch
function handleShopTouch(x, y) {
    // Same logic as handleShopClick
    handleShopClick(x, y);
}

// Show purchase message
let purchaseMessage = null;
let purchaseMessageTimer = 0;

function showPurchaseMessage(itemName) {
    purchaseMessage = {
        text: `Покупка совершена: ${itemName}`,
        timer: 120 // Show for 2 seconds (60 frames per second)
    };
}

// Show coin earned message
let coinMessage = null;

function showCoinMessage(amount) {
    coinMessage = {
        text: `+${amount} монет!`,
        timer: 60, // Show for 1 second
        y: 150 // Starting Y position
    };
}

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
        saveGameData(); // Сохраняем новый рекорд
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
    // Note: playerCoins is not reset here, so coins accumulate across games
}

// Update game state
function update() {
    // Update purchase message timer
    if (purchaseMessage) {
        purchaseMessage.timer--;
        if (purchaseMessage.timer <= 0) {
            purchaseMessage = null;
        }
    }
    
    // Update coin message timer
    if (coinMessage) {
        coinMessage.timer--;
        coinMessage.y -= 1; // Move message upward
        if (coinMessage.timer <= 0) {
            coinMessage = null;
        }
    }
    
    if (!gameRunning || shopOpen) return;

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
            
            // Award coins for passing obstacle
            playerCoins += coinsPerObstacle;
            showCoinMessage(coinsPerObstacle);
            saveGameData(); // Сохраняем прогресс после получения монет
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
    
    // Draw coins with coin icon
    ctx.fillStyle = '#f1c40f'; // Gold color for coins
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`🪙 ${playerCoins}`, 20, 150);
    
    // Draw shop button
    ctx.fillStyle = shopButton.isHovered ? shopButton.hoverColor : shopButton.color;
    ctx.fillRect(shopButton.x, shopButton.y, shopButton.width, shopButton.height);
    ctx.fillStyle = shopButton.textColor;
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(shopButton.text, shopButton.x + shopButton.width / 2, shopButton.y + shopButton.height / 2 + 7);
    
    // Draw reset button
    ctx.fillStyle = resetButton.isHovered ? resetButton.hoverColor : resetButton.color;
    ctx.fillRect(resetButton.x, resetButton.y, resetButton.width, resetButton.height);
    ctx.fillStyle = resetButton.textColor;
    ctx.fillText(resetButton.text, resetButton.x + resetButton.width / 2, resetButton.y + resetButton.height / 2 + 7);
    
    ctx.textAlign = 'left';
    
    // Draw purchase message if active
    if (purchaseMessage) {
        ctx.fillStyle = 'rgba(40, 167, 69, 0.9)'; // Green background
        const msgWidth = 300;
        const msgHeight = 50;
        const msgX = (canvas.width - msgWidth) / 2;
        const msgY = 150;
        
        // Draw message box
        ctx.fillRect(msgX, msgY, msgWidth, msgHeight);
        
        // Draw message text
        ctx.fillStyle = '#fff';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(purchaseMessage.text, canvas.width / 2, msgY + msgHeight / 2 + 6);
        ctx.textAlign = 'left';
    }
    
    // Draw coin message if active
    if (coinMessage) {
        ctx.fillStyle = '#f1c40f'; // Gold color
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(coinMessage.text, player.x + player.width / 2, coinMessage.y);
        ctx.textAlign = 'left';
    }
    
    // Draw game over message
    if (!gameRunning && !shopOpen) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 100);
        
        ctx.font = '25px Arial';
        ctx.fillText(`Score: ${Math.floor(score)}`, canvas.width / 2, canvas.height / 2 - 60);
        ctx.fillText(`High Score: ${Math.floor(highScore)}`, canvas.width / 2, canvas.height / 2 - 30);
        ctx.fillText(`Distance: ${Math.floor(distance)}m`, canvas.width / 2, canvas.height / 2);
        ctx.fillText(`Obstacles Passed: ${obstaclesPassed}`, canvas.width / 2, canvas.height / 2 + 30);
        
        // Draw coins earned
        ctx.fillStyle = '#f1c40f'; // Gold color for coins
        ctx.fillText(`🪙 Coins: ${playerCoins}`, canvas.width / 2, canvas.height / 2 + 60);
        ctx.fillStyle = '#fff';
        
        // Draw restart button
        ctx.fillStyle = restartButton.isHovered ? restartButton.hoverColor : restartButton.color;
        ctx.fillRect(restartButton.x, restartButton.y, restartButton.width, restartButton.height);
        
        ctx.fillStyle = restartButton.textColor;
        ctx.font = '24px Arial';
        ctx.fillText(restartButton.text, canvas.width / 2, restartButton.y + 33);
        
        ctx.textAlign = 'left';
    }
    
    // Draw shop modal
    if (shopOpen) {
        // Draw semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw modal background
        ctx.fillStyle = shopModal.color;
        ctx.fillRect(shopModal.x, shopModal.y, shopModal.width, shopModal.height);
        
        // Draw modal border
        ctx.strokeStyle = shopModal.borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(shopModal.x, shopModal.y, shopModal.width, shopModal.height);
        
        // Draw modal title
        ctx.fillStyle = shopModal.titleColor;
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(shopModal.titleText, shopModal.x + shopModal.width / 2, shopModal.y + 40);
        
        // Draw player coins in shop
        ctx.fillStyle = '#f1c40f'; // Gold color for coins
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`Ваши монеты: 🪙 ${playerCoins}`, shopModal.x + shopModal.width / 2, shopModal.y + 70);
        
        // Draw close button
        ctx.fillStyle = shopModal.closeButton.isHovered ? shopModal.closeButton.hoverColor : shopModal.closeButton.color;
        ctx.fillRect(
            shopModal.closeButton.x, 
            shopModal.closeButton.y, 
            shopModal.closeButton.width, 
            shopModal.closeButton.height
        );
        
        ctx.fillStyle = shopModal.closeButton.textColor;
        ctx.font = '16px Arial';
        ctx.fillText(
            shopModal.closeButton.text, 
            shopModal.closeButton.x + shopModal.closeButton.width / 2 - 25, 
            shopModal.closeButton.y + shopModal.closeButton.height / 2 + 5
        );
        
        // Draw shop items
        ctx.textAlign = 'left';
        shopItems.forEach((item, index) => {
            // Draw item background
            ctx.fillStyle = item.color;
            ctx.fillRect(item.x, item.y, item.width, item.height);
            
            // Draw item text
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 18px Arial';
            ctx.fillText(item.name, item.x + 10, item.y + 25);
            
            ctx.font = '14px Arial';
            ctx.fillText(item.description, item.x + 10, item.y + 50);
            ctx.fillText(item.price, item.x + 10, item.y + 70);
            
            // Draw buy button
            ctx.fillStyle = item.button.isHovered ? item.button.hoverColor : item.button.color;
            ctx.fillRect(
                item.button.x, 
                item.button.y, 
                item.button.width, 
                item.button.height
            );
            
            ctx.fillStyle = item.button.textColor;
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
                item.button.text, 
                item.button.x + item.button.width / 2, 
                item.button.y + item.button.height / 2 + 5
            );
            ctx.textAlign = 'left';
        });
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