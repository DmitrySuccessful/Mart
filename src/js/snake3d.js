// Snake 3D Game - Initial Scene Setup

// Scene, camera, and renderer setup
let scene, camera, renderer;
// Game objects
let gamefield;
let snakeSegments = []; // Array to store snake segments
let food; // Food object
let foodHelper; // Helper to visualize food position
// Game state
let direction = { x: 1, z: 0 }; // Initial direction: moving along positive x-axis
let speed = 5; // Snake movement speed (grid units per second)
let lastUpdateTime = 0; // Time of the last update
let gridSize = 1; // Size of each grid cell
let gridDimension = 20; // Number of cells in the grid (20x20)
let isGameOver = false; // Game over flag
let score = 0; // Player's score
// UI elements
let scoreElement;
// Animation
let animationId;
// Food animation
let foodAnimationPhase = 0;

// Initialize the game
function init() {
    // Get UI elements
    scoreElement = document.getElementById('score');
    
    // Create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222); // Dark background for better contrast
    
    // Create the camera
    const aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.set(0, 15, 15); // Position camera above and back from the field
    camera.lookAt(0, 0, 0); // Look at the center of the field
    
    // Create the renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    
    // Create the game field (plane)
    createGameField();
    
    // Add lighting
    addLighting();
    
    // Set up keyboard controls
    setupControls();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Reset game state
    resetGame();
    
    // Start the animation loop
    animate();
    
    // Debug info
    console.log("Game initialized");
}

// Reset game state
function resetGame() {
    // Reset game variables
    isGameOver = false;
    score = 0;
    direction = { x: 1, z: 0 };
    
    // Update score display
    updateScoreDisplay();
    
    // Clear existing snake
    snakeSegments.forEach(segment => scene.remove(segment));
    snakeSegments = [];
    
    // Create new snake
    createSnake();
    
    // Create new food
    createFood();
    
    // Reset timer
    lastUpdateTime = performance.now();
    
    // Log game start
    console.log("Game started! Use arrow keys or WASD to control the snake.");
}

// Update score display
function updateScoreDisplay() {
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

// Create the game field
function createGameField() {
    const fieldGeometry = new THREE.PlaneGeometry(20, 20);
    const fieldMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x44aa44,  // Green color for the field
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0.2
    });
    
    gamefield = new THREE.Mesh(fieldGeometry, fieldMaterial);
    gamefield.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    scene.add(gamefield);
    
    // Add grid lines to the field for better visual reference
    const gridHelper = new THREE.GridHelper(20, 20, 0x000000, 0x000000);
    gridHelper.position.y = 0.01; // Slightly above the field to avoid z-fighting
    scene.add(gridHelper);
    
    // Add boundary walls
    createBoundaryWalls();
}

// Create boundary walls
function createBoundaryWalls() {
    const wallHeight = 0.5;
    const halfGrid = gridDimension / 2;
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x888888,
        roughness: 0.7,
        metalness: 0.3
    });
    
    // Create walls for each side of the field
    const wallGeometryX = new THREE.BoxGeometry(gridDimension, wallHeight, 0.2);
    const wallGeometryZ = new THREE.BoxGeometry(0.2, wallHeight, gridDimension);
    
    // North wall
    const northWall = new THREE.Mesh(wallGeometryX, wallMaterial);
    northWall.position.set(0, wallHeight / 2, -halfGrid);
    scene.add(northWall);
    
    // South wall
    const southWall = new THREE.Mesh(wallGeometryX, wallMaterial);
    southWall.position.set(0, wallHeight / 2, halfGrid);
    scene.add(southWall);
    
    // East wall
    const eastWall = new THREE.Mesh(wallGeometryZ, wallMaterial);
    eastWall.position.set(halfGrid, wallHeight / 2, 0);
    scene.add(eastWall);
    
    // West wall
    const westWall = new THREE.Mesh(wallGeometryZ, wallMaterial);
    westWall.position.set(-halfGrid, wallHeight / 2, 0);
    scene.add(westWall);
}

// Create the snake
function createSnake() {
    // Clear any existing snake segments
    snakeSegments.forEach(segment => scene.remove(segment));
    snakeSegments = [];
    
    // Create snake material
    const snakeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2194ce,  // Blue color for the snake
        specular: 0x111111,
        shininess: 30
    });
    
    // Create head material (slightly different color)
    const headMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1a7aad,  // Darker blue for the head
        specular: 0x222222,
        shininess: 40
    });
    
    // Create snake geometry (slightly smaller than grid cell)
    const snakeGeometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    
    // Create initial snake segments (4 segments)
    for (let i = 0; i < 4; i++) {
        const material = i === 0 ? headMaterial : snakeMaterial;
        const segment = new THREE.Mesh(snakeGeometry, material);
        
        // Position segments in a line at the center of the field
        // Starting with the head at position (0, 0) and extending in the negative x direction
        segment.position.set(-i * gridSize, 0.5, 0); // y = 0.5 to place it on top of the field
        
        scene.add(segment);
        snakeSegments.push(segment);
    }
    
    console.log("Snake created with", snakeSegments.length, "segments");
}

// Add a new segment to the snake
function addSnakeSegment() {
    // Get the position of the last segment
    const lastSegment = snakeSegments[snakeSegments.length - 1];
    const secondLastSegment = snakeSegments[snakeSegments.length - 2];
    
    // Calculate the position for the new segment
    // Place it behind the last segment, continuing the direction from second-last to last
    const directionX = lastSegment.position.x - secondLastSegment.position.x;
    const directionZ = lastSegment.position.z - secondLastSegment.position.z;
    
    const newX = lastSegment.position.x + directionX;
    const newZ = lastSegment.position.z + directionZ;
    
    // Create a new segment
    const snakeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2194ce,
        specular: 0x111111,
        shininess: 30
    });
    
    const snakeGeometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const newSegment = new THREE.Mesh(snakeGeometry, snakeMaterial);
    
    // Position the new segment
    newSegment.position.set(newX, 0.5, newZ);
    
    // Add to scene and snake segments array
    scene.add(newSegment);
    snakeSegments.push(newSegment);
    
    // Increase score
    score++;
    updateScoreDisplay();
    console.log(`Score: ${score}`);
    
    // Increase speed slightly with each food item
    if (score % 5 === 0) {
        speed += 0.5;
        console.log(`Speed increased to ${speed}`);
    }
}

// Create food at a random position
function createFood() {
    // Remove existing food if any
    if (food) {
        scene.remove(food);
    }
    
    // Remove existing food helper if any
    if (foodHelper) {
        scene.remove(foodHelper);
    }
    
    // Create food geometry and material
    // Using a larger size and brighter color for better visibility
    const foodGeometry = new THREE.SphereGeometry(0.7, 16, 16); // Larger than before
    const foodMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff3333,  // Brighter red color for food
        emissive: 0xff0000, // Add emissive for glow effect
        emissiveIntensity: 0.5
    });
    
    food = new THREE.Mesh(foodGeometry, foodMaterial);
    
    // Position food randomly on the grid
    placeRandomFood();
    
    // Add food to scene
    scene.add(food);
    
    // Add a box helper to visualize food position
    foodHelper = new THREE.BoxHelper(food, 0xffff00);
    scene.add(foodHelper);
    
    console.log("Food created at position:", food.position);
}

// Place food at a random position on the grid
function placeRandomFood() {
    // Calculate grid boundaries (accounting for grid size)
    const halfGrid = gridDimension / 2 - 1; // Stay 1 unit away from the edge
    
    // Generate random grid position
    const x = Math.floor(Math.random() * (gridDimension - 2)) - halfGrid + 0.5;
    const z = Math.floor(Math.random() * (gridDimension - 2)) - halfGrid + 0.5;
    
    // Check if the position overlaps with the snake
    const overlapsWithSnake = snakeSegments.some(segment => {
        return Math.abs(segment.position.x - x) < 0.1 && Math.abs(segment.position.z - z) < 0.1;
    });
    
    // If it overlaps, try again
    if (overlapsWithSnake) {
        placeRandomFood();
        return;
    }
    
    // Set food position (y = 1.0 to place it higher above the field for better visibility)
    food.position.set(x, 1.0, z);
    console.log("Food placed at:", x, 1.0, z);
}

// Animate food (bobbing up and down, rotating)
function animateFood(deltaTime) {
    if (!food || isGameOver) return;
    
    // Update animation phase
    foodAnimationPhase += deltaTime * 0.002;
    
    // Bob up and down (with a higher base position)
    food.position.y = 1.0 + Math.sin(foodAnimationPhase) * 0.3;
    
    // Rotate
    food.rotation.y += deltaTime * 0.003;
    
    // Update the helper position
    if (foodHelper) {
        foodHelper.update();
    }
}

// Check if the snake has eaten food
function checkFoodCollision() {
    const head = snakeSegments[0];
    const distanceThreshold = 0.9; // Distance threshold for collision
    
    // Calculate distance between snake head and food
    const distance = Math.sqrt(
        Math.pow(head.position.x - food.position.x, 2) + 
        Math.pow(head.position.z - food.position.z, 2)
    );
    
    // If the distance is less than the threshold, the snake has eaten the food
    if (distance < distanceThreshold) {
        console.log("Food eaten! Distance:", distance);
        
        // Add a new segment to the snake
        addSnakeSegment();
        
        // Create new food
        placeRandomFood();
        
        // Add visual effect for eating food
        createFoodEatenEffect(head.position);
    }
}

// Create a visual effect when food is eaten
function createFoodEatenEffect(position) {
    // Create particles
    const particleCount = 20;
    const particles = new THREE.Group();
    
    for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff5500,
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Random position around the food
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.5;
        particle.position.set(
            position.x + Math.cos(angle) * radius,
            position.y + Math.random() * 0.5,
            position.z + Math.sin(angle) * radius
        );
        
        // Store velocity for animation
        particle.userData.velocity = {
            x: (Math.random() - 0.5) * 0.1,
            y: Math.random() * 0.1,
            z: (Math.random() - 0.5) * 0.1
        };
        
        // Store lifetime
        particle.userData.lifetime = 1.0; // 1 second
        
        particles.add(particle);
    }
    
    scene.add(particles);
    
    // Set up animation for particles
    const animateParticles = (time) => {
        let allDead = true;
        
        particles.children.forEach(particle => {
            // Update position
            particle.position.x += particle.userData.velocity.x;
            particle.position.y += particle.userData.velocity.y;
            particle.position.z += particle.userData.velocity.z;
            
            // Update lifetime
            particle.userData.lifetime -= 0.02;
            
            // Update opacity based on lifetime
            particle.material.opacity = particle.userData.lifetime;
            
            // Check if particle is still alive
            if (particle.userData.lifetime > 0) {
                allDead = false;
            }
        });
        
        // If all particles are dead, remove the group
        if (allDead) {
            scene.remove(particles);
            return;
        }
        
        // Continue animation
        requestAnimationFrame(animateParticles);
    };
    
    // Start animation
    animateParticles();
}

// Check if the snake has collided with itself
function checkSelfCollision() {
    const head = snakeSegments[0];
    
    // Check collision with each segment (except the head)
    for (let i = 1; i < snakeSegments.length; i++) {
        const segment = snakeSegments[i];
        const distanceThreshold = 0.5; // Distance threshold for collision
        
        // Calculate distance between snake head and segment
        const distance = Math.sqrt(
            Math.pow(head.position.x - segment.position.x, 2) + 
            Math.pow(head.position.z - segment.position.z, 2)
        );
        
        // If the distance is less than the threshold, the snake has collided with itself
        if (distance < distanceThreshold) {
            gameOver();
            return true;
        }
    }
    
    return false;
}

// Check if the snake has gone out of bounds
function checkBoundaryCollision() {
    const head = snakeSegments[0];
    const halfGrid = gridDimension / 2;
    
    // Check if the snake head is outside the grid boundaries
    if (
        head.position.x < -halfGrid || 
        head.position.x > halfGrid || 
        head.position.z < -halfGrid || 
        head.position.z > halfGrid
    ) {
        gameOver();
        return true;
    }
    
    return false;
}

// Game over function
function gameOver() {
    isGameOver = true;
    console.log(`Game Over! Final Score: ${score}`);
    
    // Display game over message on screen
    displayGameOverMessage();
}

// Display game over message
function displayGameOverMessage() {
    // Remove existing game over message if any
    removeGameOverMessage();
    
    // Create a div for the game over message
    const gameOverDiv = document.createElement('div');
    gameOverDiv.id = 'gameOverMessage';
    gameOverDiv.style.position = 'absolute';
    gameOverDiv.style.top = '50%';
    gameOverDiv.style.left = '50%';
    gameOverDiv.style.transform = 'translate(-50%, -50%)';
    gameOverDiv.style.color = 'red';
    gameOverDiv.style.fontSize = '48px';
    gameOverDiv.style.fontWeight = 'bold';
    gameOverDiv.style.textAlign = 'center';
    gameOverDiv.style.textShadow = '2px 2px 4px #000000';
    gameOverDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    gameOverDiv.style.padding = '30px';
    gameOverDiv.style.borderRadius = '10px';
    gameOverDiv.style.zIndex = '1000';
    gameOverDiv.innerHTML = `
        <div>GAME OVER</div>
        <div style="font-size: 24px; margin-top: 10px;">Score: ${score}</div>
        <button id="restartButton" style="margin-top: 20px; padding: 10px 20px; font-size: 18px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Restart Game</button>
        <div style="font-size: 16px; margin-top: 10px;">or press SPACE to restart</div>
    `;
    
    document.body.appendChild(gameOverDiv);
    
    // Add event listener to restart button
    document.getElementById('restartButton').addEventListener('click', () => {
        removeGameOverMessage();
        resetGame();
    });
}

// Remove game over message
function removeGameOverMessage() {
    const gameOverDiv = document.getElementById('gameOverMessage');
    if (gameOverDiv) {
        document.body.removeChild(gameOverDiv);
    }
}

// Set up keyboard controls
function setupControls() {
    document.addEventListener('keydown', (event) => {
        // Prevent default behavior for arrow keys (scrolling)
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(event.key)) {
            event.preventDefault();
        }
        
        // If game is over and space is pressed, restart the game
        if (isGameOver && event.key === ' ') {
            removeGameOverMessage();
            resetGame();
            return;
        }
        
        // If game is over, don't process other controls
        if (isGameOver) {
            return;
        }
        
        // Change direction based on key pressed
        // Prevent 180-degree turns (can't go directly backwards)
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
                if (direction.z !== 1) { // Not going backward
                    direction = { x: 0, z: -1 };
                }
                break;
            case 'ArrowDown':
            case 's':
                if (direction.z !== -1) { // Not going forward
                    direction = { x: 0, z: 1 };
                }
                break;
            case 'ArrowLeft':
            case 'a':
                if (direction.x !== 1) { // Not going right
                    direction = { x: -1, z: 0 };
                }
                break;
            case 'ArrowRight':
            case 'd':
                if (direction.x !== -1) { // Not going left
                    direction = { x: 1, z: 0 };
                }
                break;
        }
    });
}

// Update snake position
function updateSnake(deltaTime) {
    // If game is over, don't update
    if (isGameOver) {
        return;
    }
    
    // Calculate movement based on time elapsed and speed
    const moveDistance = speed * deltaTime / 1000; // Convert to seconds
    
    // Only move when we've traveled a full grid cell
    if (moveDistance >= gridSize) {
        // Store the positions of all segments before moving
        const oldPositions = snakeSegments.map(segment => ({
            x: segment.position.x,
            y: segment.position.y,
            z: segment.position.z
        }));
        
        // Move the head in the current direction
        const head = snakeSegments[0];
        head.position.x += direction.x * gridSize;
        head.position.z += direction.z * gridSize;
        
        // Check for collisions
        if (checkBoundaryCollision() || checkSelfCollision()) {
            return; // Game over, stop updating
        }
        
        // Check if the snake has eaten food
        checkFoodCollision();
        
        // Move each segment to the position of the segment in front of it
        for (let i = 1; i < snakeSegments.length; i++) {
            snakeSegments[i].position.set(
                oldPositions[i-1].x,
                oldPositions[i-1].y,
                oldPositions[i-1].z
            );
        }
        
        // Reset the timer
        lastUpdateTime = performance.now();
    }
}

// Add lighting to the scene
function addLighting() {
    // Add ambient light for general illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Add directional light for shadows and depth
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add a point light near the center for better illumination
    const pointLight = new THREE.PointLight(0xffffff, 0.5, 20);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);
    
    // Add a spotlight to highlight the food
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 10, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 200;
    scene.add(spotLight);
    
    console.log("Lighting added to scene");
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate(currentTime) {
    animationId = requestAnimationFrame(animate);
    
    // Calculate time since last update
    const deltaTime = currentTime - lastUpdateTime;
    
    // Update snake position
    updateSnake(deltaTime);
    
    // Animate food
    animateFood(deltaTime);
    
    // Render the scene
    renderer.render(scene, camera);
}

// Initialize the game when the page loads
window.addEventListener('load', init); 