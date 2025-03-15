// Smart Shop Simulator - Main JavaScript

// Game state
const gameState = {
    balance: 1000,
    customers: 0,
    products: [],
    activeCampaigns: [],
    settings: {
        shopName: "Мой магазин",
        shopType: "grocery",
        difficulty: "medium",
        simulationSpeed: 3,
        autoSave: true
    },
    simulationRunning: false,
    dayCount: 1
};

// Инициализация Telegram WebApp
let tg = window.Telegram.WebApp;

// Данные курсов и тестов
const courses = {
    1: {
        id: 1,
        title: "Основы программирования",
        description: "Введение в мир программирования для начинающих",
        lessons: [
            { id: 1, title: "Введение в программирование", duration: "15 мин", completed: false, locked: false, content: {
                type: "text",
                text: `<h3>Введение в программирование</h3>
                <p>Программирование — это процесс создания компьютерных программ с помощью языков программирования.</p>
                <p>Основные концепции программирования:</p>
                <ul>
                    <li><strong>Переменные</strong> — контейнеры для хранения данных</li>
                    <li><strong>Условные операторы</strong> — позволяют выполнять разные действия в зависимости от условий</li>
                    <li><strong>Циклы</strong> — позволяют повторять блоки кода</li>
                    <li><strong>Функции</strong> — блоки кода, которые можно вызывать многократно</li>
                </ul>
                <div class="video-container">
                    <iframe width="100%" height="200" src="https://www.youtube.com/embed/zOjov-2OZ0E" frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="interactive-element">
                    <h4>Попробуйте сами!</h4>
                    <p>Напишите простую программу, которая выводит "Hello, World!":</p>
                    <pre><code>console.log("Hello, World!");</code></pre>
                    <button class="tg-button" onclick="runCode()">Запустить код</button>
                    <div id="code-output" class="code-output"></div>
                </div>`
            }},
            { id: 2, title: "Переменные и типы данных", duration: "20 мин", completed: false, locked: true },
            { id: 3, title: "Условные операторы", duration: "25 мин", completed: false, locked: true },
            { id: 4, title: "Циклы", duration: "30 мин", completed: false, locked: true },
            { id: 5, title: "Функции", duration: "35 мин", completed: false, locked: true }
        ]
    },
    2: {
        id: 2,
        title: "Веб-разработка",
        description: "Изучите основы создания веб-сайтов с помощью HTML, CSS и JavaScript",
        lessons: [
            { id: 1, title: "Введение в HTML", duration: "20 мин", completed: false, locked: true },
            { id: 2, title: "Основы CSS", duration: "25 мин", completed: false, locked: true },
            { id: 3, title: "Верстка страницы", duration: "30 мин", completed: false, locked: true },
            { id: 4, title: "Введение в JavaScript", duration: "35 мин", completed: false, locked: true },
            { id: 5, title: "DOM-манипуляции", duration: "30 мин", completed: false, locked: true },
            { id: 6, title: "Обработка событий", duration: "25 мин", completed: false, locked: true },
            { id: 7, title: "Работа с формами", duration: "30 мин", completed: false, locked: true },
            { id: 8, title: "Финальный проект", duration: "45 мин", completed: false, locked: true }
        ]
    },
    3: {
        id: 3,
        title: "Мобильная разработка",
        description: "Создание приложений для iOS и Android",
        lessons: [
            { id: 1, title: "Введение в мобильную разработку", duration: "20 мин", completed: false, locked: true },
            { id: 2, title: "Основы UI/UX для мобильных приложений", duration: "25 мин", completed: false, locked: true },
            { id: 3, title: "Работа с API", duration: "30 мин", completed: false, locked: true },
            { id: 4, title: "Хранение данных", duration: "25 мин", completed: false, locked: true },
            { id: 5, title: "Публикация приложения", duration: "20 мин", completed: false, locked: true },
            { id: 6, title: "Финальный проект", duration: "45 мин", completed: false, locked: true }
        ]
    }
};

const tests = {
    1: {
        id: 1,
        title: "Тест по основам программирования",
        courseId: 1,
        lessonId: 1,
        questions: [
            {
                id: 1,
                text: "Что такое переменная?",
                options: [
                    "Контейнер для хранения данных",
                    "Функция для выполнения операций",
                    "Оператор сравнения",
                    "Метод вывода данных"
                ],
                correctAnswer: 0
            },
            {
                id: 2,
                text: "Какой оператор используется для сравнения значений без учета типа?",
                options: [
                    "===",
                    "==",
                    "=",
                    "!="
                ],
                correctAnswer: 1
            },
            {
                id: 3,
                text: "Что выведет следующий код: console.log('Hello, World!')?",
                options: [
                    "Hello, World!",
                    "Ошибку",
                    "Ничего",
                    "undefined"
                ],
                correctAnswer: 0
            },
            {
                id: 4,
                text: "Какой язык программирования чаще всего используется для веб-разработки на стороне клиента?",
                options: [
                    "Java",
                    "Python",
                    "JavaScript",
                    "C++"
                ],
                correctAnswer: 2
            },
            {
                id: 5,
                text: "Что такое функция в программировании?",
                options: [
                    "Переменная для хранения данных",
                    "Блок кода, который можно вызывать многократно",
                    "Оператор сравнения",
                    "Тип данных"
                ],
                correctAnswer: 1
            }
        ]
    },
    2: {
        id: 2,
        title: "Тест по HTML и CSS",
        courseId: 2,
        lessonId: 1,
        questions: [
            {
                id: 1,
                text: "Какой тег используется для создания заголовка первого уровня?",
                options: [
                    "<header>",
                    "<h1>",
                    "<heading>",
                    "<title>"
                ],
                correctAnswer: 1
            },
            {
                id: 2,
                text: "Какое свойство CSS используется для изменения цвета текста?",
                options: [
                    "text-color",
                    "font-color",
                    "color",
                    "text-style"
                ],
                correctAnswer: 2
            },
            // Другие вопросы...
        ]
    },
    3: {
        id: 3,
        title: "Тест по JavaScript",
        courseId: 2,
        lessonId: 4,
        questions: [
            {
                id: 1,
                text: "Какой метод используется для добавления элемента в конец массива?",
                options: [
                    "push()",
                    "append()",
                    "add()",
                    "insert()"
                ],
                correctAnswer: 0
            },
            {
                id: 2,
                text: "Как объявить переменную в JavaScript?",
                options: [
                    "var myVar;",
                    "variable myVar;",
                    "v myVar;",
                    "let myVar = 5;"
                ],
                correctAnswer: 3
            },
            // Другие вопросы...
        ]
    }
};

// Данные пользователя
let userData = {
    completedLessons: [],
    testResults: []
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram WebApp
    tg.expand();
    
    // Применение темы Telegram
    applyTelegramTheme();
    
    // Инициализация навигации
    initNavigation();
    
    // Инициализация обработчиков событий
    initEventListeners();
    
    // Home tab elements
    const balanceElement = document.getElementById('balance');
    const customersElement = document.getElementById('customers');
    const productsElement = document.getElementById('products');
    const startSimulationBtn = document.getElementById('start-simulation');
    
    // Shop tab elements
    const inventoryList = document.getElementById('inventory-list');
    const addProductForm = document.getElementById('add-product-form');
    
    // Marketing tab elements
    const activeCampaignsList = document.getElementById('active-campaigns');
    const campaignButtons = document.querySelectorAll('[data-campaign]');
    
    // Settings tab elements
    const shopSettingsForm = document.getElementById('shop-settings-form');
    const gameSettingsForm = document.getElementById('game-settings-form');
    
    // Initialize the UI
    updateStats();
    
    // Event Listeners
    
    // Tab navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs
            navLinks.forEach(link => link.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Start simulation button
    if (startSimulationBtn) {
        startSimulationBtn.addEventListener('click', function() {
            if (!gameState.simulationRunning) {
                startSimulation();
                this.textContent = 'Остановить день';
            } else {
                stopSimulation();
                this.textContent = 'Начать день';
            }
        });
    }
    
    // Add product form
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const productName = document.getElementById('product-name').value;
            const productPrice = parseFloat(document.getElementById('product-price').value);
            const productCost = parseFloat(document.getElementById('product-cost').value);
            const productQuantity = parseInt(document.getElementById('product-quantity').value);
            
            // Validate inputs
            if (productPrice <= productCost) {
                showNotification('Цена продажи должна быть выше закупочной цены!', 'error');
                return;
            }
            
            // Calculate total cost
            const totalCost = productCost * productQuantity;
            
            // Check if user has enough balance
            if (totalCost > gameState.balance) {
                showNotification('Недостаточно средств для закупки товара!', 'error');
                return;
            }
            
            // Add product to inventory
            const product = {
                id: Date.now(), // Unique ID
                name: productName,
                price: productPrice,
                cost: productCost,
                quantity: productQuantity,
                sold: 0
            };
            
            gameState.products.push(product);
            gameState.balance -= totalCost;
            
            // Update UI
            updateInventory();
            updateStats();
            showNotification(`Товар "${productName}" добавлен в ассортимент!`, 'success');
            
            // Reset form
            addProductForm.reset();
        });
    }
    
    // Campaign buttons
    campaignButtons.forEach(button => {
        button.addEventListener('click', function() {
            const campaignType = this.getAttribute('data-campaign');
            startCampaign(campaignType);
        });
    });
    
    // Shop settings form
    if (shopSettingsForm) {
        shopSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            gameState.settings.shopName = document.getElementById('shop-name').value;
            gameState.settings.shopType = document.getElementById('shop-type').value;
            
            saveGameState();
            showNotification('Настройки магазина сохранены!', 'success');
        });
    }
    
    // Game settings form
    if (gameSettingsForm) {
        gameSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            gameState.settings.difficulty = document.getElementById('difficulty').value;
            gameState.settings.simulationSpeed = document.getElementById('simulation-speed').value;
            gameState.settings.autoSave = document.getElementById('auto-save').checked;
            
            saveGameState();
            showNotification('Настройки игры сохранены!', 'success');
        });
    }
    
    // Load saved game state if exists
    loadGameState();
    
    // Загрузка данных пользователя (если есть)
    loadUserData();
});

// Game Functions

// Update stats display
function updateStats() {
    document.getElementById('balance').textContent = gameState.balance;
    document.getElementById('customers').textContent = gameState.customers;
    document.getElementById('products').textContent = gameState.products.length;
}

// Update inventory display
function updateInventory() {
    const inventoryList = document.getElementById('inventory-list');
    
    if (gameState.products.length === 0) {
        inventoryList.innerHTML = '<p class="empty-state">У вас пока нет товаров. Добавьте их справа.</p>';
        return;
    }
    
    let html = '';
    gameState.products.forEach(product => {
        html += `
            <div class="product-item" data-id="${product.id}">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <div class="product-details">
                        <span>Цена: ${product.price}₽</span>
                        <span>Закупочная: ${product.cost}₽</span>
                        <span>В наличии: ${product.quantity}</span>
                        <span>Продано: ${product.sold}</span>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="secondary-btn restock-btn" data-id="${product.id}">Пополнить</button>
                    <button class="secondary-btn remove-btn" data-id="${product.id}">Удалить</button>
                </div>
            </div>
        `;
    });
    
    inventoryList.innerHTML = html;
    
    // Add event listeners to new buttons
    document.querySelectorAll('.restock-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            restockProduct(productId);
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeProduct(productId);
        });
    });
}

// Update campaigns display
function updateCampaigns() {
    const campaignsList = document.getElementById('active-campaigns');
    
    if (gameState.activeCampaigns.length === 0) {
        campaignsList.innerHTML = '<p class="empty-state">У вас нет активных рекламных кампаний.</p>';
        return;
    }
    
    let html = '';
    gameState.activeCampaigns.forEach(campaign => {
        html += `
            <div class="campaign-item">
                <div class="campaign-info">
                    <h4>${getCampaignName(campaign.type)}</h4>
                    <div class="campaign-details">
                        <span>Осталось дней: ${campaign.daysLeft}</span>
                        <span>Эффект: +${campaign.effect} клиентов в день</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    campaignsList.innerHTML = html;
}

// Get campaign name by type
function getCampaignName(type) {
    switch(type) {
        case 'flyers': return 'Листовки';
        case 'online': return 'Реклама в интернете';
        case 'referral': return 'Акция "Приведи друга"';
        default: return 'Неизвестная кампания';
    }
}

// Start a marketing campaign
function startCampaign(campaignType) {
    let cost = 0;
    let effect = 0;
    let duration = 0;
    
    switch(campaignType) {
        case 'flyers':
            cost = 500;
            effect = 10;
            duration = 3;
            break;
        case 'online':
            cost = 2000;
            effect = 50;
            duration = 7;
            break;
        case 'referral':
            cost = 1000;
            effect = 30;
            duration = 5;
            break;
    }
    
    // Check if user has enough balance
    if (cost > gameState.balance) {
        showNotification('Недостаточно средств для запуска кампании!', 'error');
        return;
    }
    
    // Add campaign
    const campaign = {
        type: campaignType,
        effect: effect,
        daysLeft: duration
    };
    
    gameState.activeCampaigns.push(campaign);
    gameState.balance -= cost;
    
    // Update UI
    updateCampaigns();
    updateStats();
    showNotification(`Кампания "${getCampaignName(campaignType)}" запущена!`, 'success');
}

// Restock a product
function restockProduct(productId) {
    const product = gameState.products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Create a simple form for restocking
    const quantity = prompt(`Сколько единиц товара "${product.name}" вы хотите закупить?`, "10");
    
    if (quantity === null) return; // User cancelled
    
    const quantityNum = parseInt(quantity);
    
    if (isNaN(quantityNum) || quantityNum <= 0) {
        showNotification('Пожалуйста, введите корректное количество!', 'error');
        return;
    }
    
    const totalCost = product.cost * quantityNum;
    
    // Check if user has enough balance
    if (totalCost > gameState.balance) {
        showNotification('Недостаточно средств для закупки товара!', 'error');
        return;
    }
    
    // Update product
    product.quantity += quantityNum;
    gameState.balance -= totalCost;
    
    // Update UI
    updateInventory();
    updateStats();
    showNotification(`Товар "${product.name}" пополнен на ${quantityNum} единиц!`, 'success');
}

// Remove a product
function removeProduct(productId) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
    
    const productIndex = gameState.products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) return;
    
    // Remove product
    gameState.products.splice(productIndex, 1);
    
    // Update UI
    updateInventory();
    updateStats();
    showNotification('Товар удален из ассортимента!', 'success');
}

// Start simulation
function startSimulation() {
    if (gameState.products.length === 0) {
        showNotification('Добавьте хотя бы один товар перед началом дня!', 'error');
        return;
    }
    
    gameState.simulationRunning = true;
    showNotification(`День ${gameState.dayCount} начался!`, 'info');
    
    // Run simulation
    simulateDay();
}

// Stop simulation
function stopSimulation() {
    gameState.simulationRunning = false;
    gameState.dayCount++;
    showNotification('День завершен!', 'info');
    
    // Process end of day
    processEndOfDay();
}

// Simulate a day
function simulateDay() {
    // Calculate base customers based on difficulty
    let baseCustomers = 10;
    
    switch(gameState.settings.difficulty) {
        case 'easy': baseCustomers = 15; break;
        case 'medium': baseCustomers = 10; break;
        case 'hard': baseCustomers = 5; break;
    }
    
    // Add customers from active campaigns
    gameState.activeCampaigns.forEach(campaign => {
        baseCustomers += campaign.effect;
    });
    
    // Add some randomness
    const customers = Math.floor(baseCustomers * (0.8 + Math.random() * 0.4));
    
    // Process customers
    processCustomers(customers);
    
    // Update UI
    updateStats();
    updateInventory();
}

// Process customers
function processCustomers(customers) {
    gameState.customers += customers;
    
    // Each customer has a chance to buy products
    let totalSales = 0;
    let totalProfit = 0;
    
    for (let i = 0; i < customers; i++) {
        // Determine how many products the customer will buy (0-3)
        const productsToBuy = Math.floor(Math.random() * 3);
        
        for (let j = 0; j < productsToBuy; j++) {
            // Select a random product
            if (gameState.products.length === 0) break;
            
            const randomIndex = Math.floor(Math.random() * gameState.products.length);
            const product = gameState.products[randomIndex];
            
            // Check if product is in stock
            if (product.quantity > 0) {
                // Sell the product
                product.quantity--;
                product.sold++;
                
                // Calculate profit
                const profit = product.price - product.cost;
                totalSales += product.price;
                totalProfit += profit;
            }
        }
    }
    
    // Update balance
    gameState.balance += totalSales;
    
    // Show sales notification
    if (totalSales > 0) {
        showNotification(`Продажи за день: ${totalSales}₽ (прибыль: ${totalProfit}₽)`, 'success');
    } else {
        showNotification('Сегодня не было продаж.', 'info');
    }
}

// Process end of day
function processEndOfDay() {
    // Update campaign days left
    gameState.activeCampaigns.forEach((campaign, index) => {
        campaign.daysLeft--;
        
        // Remove expired campaigns
        if (campaign.daysLeft <= 0) {
            showNotification(`Кампания "${getCampaignName(campaign.type)}" завершена!`, 'info');
            gameState.activeCampaigns.splice(index, 1);
        }
    });
    
    // Update UI
    updateCampaigns();
    
    // Auto save if enabled
    if (gameState.settings.autoSave) {
        saveGameState();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
        
        // Add styles
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '4px';
        notification.style.color = 'white';
        notification.style.fontWeight = '500';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
    }
    
    // Set notification type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notification.style.backgroundColor = '#F44336';
            break;
        case 'info':
        default:
            notification.style.backgroundColor = '#2196F3';
            break;
    }
    
    // Set message
    notification.textContent = message;
    
    // Show notification
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
    }, 3000);
}

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('smartShopState', JSON.stringify(gameState));
    showNotification('Игра сохранена!', 'success');
}

// Load game state from localStorage
function loadGameState() {
    const savedState = localStorage.getItem('smartShopState');
    
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            
            // Update game state
            Object.assign(gameState, parsedState);
            
            // Update UI
            updateStats();
            updateInventory();
            updateCampaigns();
            
            // Update settings form values
            document.getElementById('shop-name').value = gameState.settings.shopName;
            document.getElementById('shop-type').value = gameState.settings.shopType;
            document.getElementById('difficulty').value = gameState.settings.difficulty;
            document.getElementById('simulation-speed').value = gameState.settings.simulationSpeed;
            document.getElementById('auto-save').checked = gameState.settings.autoSave;
            
            showNotification('Игра загружена!', 'success');
        } catch (error) {
            console.error('Error loading game state:', error);
            showNotification('Ошибка при загрузке сохраненной игры!', 'error');
        }
    }
}

// Применение темы Telegram
function applyTelegramTheme() {
    document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
    document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
    document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999');
    document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#2481cc');
    document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#2481cc');
    document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
    
    // Применение темной темы, если она активна в Telegram
    if (tg.themeParams.bg_color && tg.themeParams.bg_color.match(/^#[0-9a-f]{6}$/i) && 
        parseInt(tg.themeParams.bg_color.substring(1), 16) < 0x808080) {
        document.body.classList.add('tg-dark-theme');
    }
}

// Инициализация навигации
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // Обновление активной кнопки
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Показать определенную секцию
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Обработчики для карточек курсов на главной
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course-id');
            openCourse(courseId);
            showSection('courses');
            
            // Обновление активной кнопки навигации
            document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
            document.querySelector('.nav-button[data-section="courses"]').classList.add('active');
        });
    });
}

// Открыть курс
function openCourse(courseId) {
    const course = courses[courseId];
    if (!course) return;
    
    // Обновление заголовка курса
    document.getElementById('course-title').textContent = course.title;
    
    // Очистка и заполнение списка уроков
    const lessonContainer = document.getElementById('lesson-container');
    lessonContainer.innerHTML = '';
    
    course.lessons.forEach(lesson => {
        const lessonElement = document.createElement('div');
        lessonElement.className = `lesson-item ${lesson.completed ? 'lesson-completed' : ''} ${lesson.locked ? 'lesson-locked' : ''}`;
        lessonElement.innerHTML = `
            <div class="lesson-number">${lesson.id}</div>
            <div class="lesson-info">
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-duration">${lesson.duration}</div>
            </div>
            ${lesson.locked ? '<div class="lesson-lock-icon">🔒</div>' : ''}
        `;
        
        lessonElement.addEventListener('click', function() {
            if (!lesson.locked) {
                startLesson(courseId, lesson.id);
            } else {
                showSubscriptionMessage();
            }
        });
        
        lessonContainer.appendChild(lessonElement);
    });
    
    // Показать секцию просмотра курса
    showSection('course-view');
}

// Показать сообщение о необходимости подписки
function showSubscriptionMessage() {
    tg.showPopup({
        title: 'Урок заблокирован',
        message: 'Для доступа к этому уроку необходимо приобрести подписку',
        buttons: [{
            type: 'ok'
        }]
    });
}

// Начать урок
function startLesson(courseId, lessonId) {
    const course = courses[courseId];
    const lesson = course.lessons.find(l => l.id === lessonId);
    
    if (!lesson) return;
    
    // Создаем секцию для просмотра урока, если ее еще нет
    let lessonViewSection = document.getElementById('lesson-view');
    if (!lessonViewSection) {
        lessonViewSection = document.createElement('section');
        lessonViewSection.id = 'lesson-view';
        lessonViewSection.className = 'content-section';
        
        const mainContent = document.querySelector('.app-content');
        mainContent.appendChild(lessonViewSection);
    }
    
    // Заполняем секцию содержимым урока
    lessonViewSection.innerHTML = `
        <div class="lesson-navigation">
            <button class="back-button" onclick="backToCourseView()">← Назад к курсу</button>
            <h2>${lesson.title}</h2>
        </div>
        <div class="lesson-content">
            ${lesson.content ? lesson.content.text : 'Содержимое урока в разработке'}
        </div>
        <div class="lesson-actions">
            <button class="tg-button" onclick="startLessonTest(${courseId}, ${lessonId})">Пройти тест</button>
        </div>
    `;
    
    // Показываем секцию урока
    showSection('lesson-view');
}

// Вернуться к просмотру курса
function backToCourseView() {
    showSection('course-view');
}

// Запустить код в интерактивном элементе
function runCode() {
    const outputElement = document.getElementById('code-output');
    outputElement.innerHTML = 'Hello, World!';
    outputElement.style.display = 'block';
}

// Начать тест по уроку
function startLessonTest(courseId, lessonId) {
    // Находим тест, соответствующий уроку
    const test = Object.values(tests).find(t => t.courseId === parseInt(courseId) && t.lessonId === parseInt(lessonId));
    
    if (test) {
        startTest(test.id);
    } else {
        tg.showPopup({
            title: 'Тест недоступен',
            message: 'К сожалению, тест для этого урока еще не готов',
            buttons: [{
                type: 'ok'
            }]
        });
    }
}

// Начать тест
function startTest(testId) {
    const test = tests[testId];
    if (!test) return;
    
    // Обновление заголовка теста
    document.getElementById('test-title').textContent = test.title;
    
    // Очистка и заполнение контейнера теста
    const testContainer = document.getElementById('test-container');
    testContainer.innerHTML = '';
    
    test.questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'test-question';
        questionElement.innerHTML = `
            <div class="question-text">${index + 1}. ${question.text}</div>
            <div class="answer-options">
                ${question.options.map((option, optIndex) => `
                    <label class="answer-option">
                        <input type="radio" name="question-${question.id}" value="${optIndex}">
                        ${option}
                    </label>
                `).join('')}
            </div>
            <div class="question-feedback" id="feedback-${question.id}"></div>
        `;
        
        testContainer.appendChild(questionElement);
    });
    
    // Добавление обработчиков для вариантов ответов
    const answerOptions = document.querySelectorAll('.answer-option');
    answerOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radioInput = this.querySelector('input[type="radio"]');
            if (radioInput) {
                radioInput.checked = true;
                
                // Удаление класса selected у всех опций в этой группе
                const name = radioInput.getAttribute('name');
                document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
                    input.closest('.answer-option').classList.remove('selected');
                });
                
                // Добавление класса selected к выбранной опции
                this.classList.add('selected');
            }
        });
    });
    
    // Изменение кнопки отправки теста
    const submitButton = document.getElementById('submit-test');
    submitButton.textContent = 'Проверить ответы';
    submitButton.onclick = function() {
        checkTestAnswers(testId);
    };
    
    // Показать секцию просмотра теста
    showSection('test-view');
}

// Проверить ответы теста
function checkTestAnswers(testId) {
    const test = tests[testId];
    if (!test) return;
    
    let correctAnswers = 0;
    const totalQuestions = test.questions.length;
    
    // Проверяем каждый вопрос
    test.questions.forEach((question) => {
        const selectedOption = document.querySelector(`input[name="question-${question.id}"]:checked`);
        const feedbackElement = document.getElementById(`feedback-${question.id}`);
        
        if (selectedOption) {
            const selectedAnswer = parseInt(selectedOption.value);
            
            if (selectedAnswer === question.correctAnswer) {
                correctAnswers++;
                feedbackElement.textContent = '✓ Правильно!';
                feedbackElement.className = 'question-feedback correct';
            } else {
                feedbackElement.textContent = `✗ Неправильно. Правильный ответ: ${question.options[question.correctAnswer]}`;
                feedbackElement.className = 'question-feedback incorrect';
            }
        } else {
            feedbackElement.textContent = 'Вы не выбрали ответ';
            feedbackElement.className = 'question-feedback warning';
        }
    });
    
    // Вычисляем процент правильных ответов
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Сохраняем результат теста
    saveTestResult(testId, score);
    
    // Если это тест по уроку, отмечаем урок как пройденный
    if (test.courseId && test.lessonId) {
        markLessonAsCompleted(test.courseId, test.lessonId);
    }
    
    // Показываем результат
    tg.showPopup({
        title: 'Результат теста',
        message: `Вы ответили правильно на ${correctAnswers} из ${totalQuestions} вопросов (${score}%)`,
        buttons: [{
            type: 'ok'
        }]
    });
    
    // Изменяем кнопку на "Вернуться к тестам"
    const submitButton = document.getElementById('submit-test');
    submitButton.textContent = 'Вернуться к тестам';
    submitButton.onclick = function() {
        backToTests();
    };
}

// Отметить урок как пройденный
function markLessonAsCompleted(courseId, lessonId) {
    const course = courses[courseId];
    if (!course) return;
    
    const lesson = course.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    lesson.completed = true;
    
    // Добавляем в список пройденных уроков
    if (!userData.completedLessons.includes(`${courseId}-${lessonId}`)) {
        userData.completedLessons.push(`${courseId}-${lessonId}`);
    }
    
    // Сохраняем данные пользователя
    saveUserData();
    
    // Обновляем отображение курса
    updateCourseProgress(courseId);
}

// Сохранить результат теста
function saveTestResult(testId, score) {
    // Проверяем, есть ли уже результат для этого теста
    const existingResultIndex = userData.testResults.findIndex(r => r.testId === testId);
    
    if (existingResultIndex !== -1) {
        // Обновляем существующий результат
        userData.testResults[existingResultIndex].score = score;
        userData.testResults[existingResultIndex].date = new Date().toISOString();
    } else {
        // Добавляем новый результат
        userData.testResults.push({
            testId: testId,
            score: score,
            date: new Date().toISOString()
        });
    }
    
    // Сохраняем данные пользователя
    saveUserData();
}

// Обновить прогресс курса
function updateCourseProgress(courseId) {
    const course = courses[courseId];
    if (!course) return;
    
    const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
    const totalLessons = course.lessons.length;
    
    // Обновляем отображение прогресса в списке курсов
    const courseItem = document.querySelector(`.course-item[data-course-id="${courseId}"]`);
    if (courseItem) {
        const progressElement = courseItem.querySelector('.course-progress');
        if (progressElement) {
            progressElement.textContent = `${completedLessons}/${totalLessons} уроков`;
        }
    }
}

// Вернуться к списку курсов
function backToCourses() {
    showSection('courses');
    
    // Обновление активной кнопки навигации
    document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.nav-button[data-section="courses"]').classList.add('active');
}

// Вернуться к списку тестов
function backToTests() {
    showSection('tests');
    
    // Обновление активной кнопки навигации
    document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.nav-button[data-section="tests"]').classList.add('active');
}

// Отправить результаты теста
function submitTest() {
    const testView = document.getElementById('test-view');
    const testTitle = document.getElementById('test-title').textContent;
    const testId = Object.values(tests).find(test => test.title === testTitle)?.id;
    
    if (!testId) return;
    
    // Сбор ответов
    const answers = [];
    const questions = document.querySelectorAll('.test-question');
    
    questions.forEach((question, index) => {
        const selectedOption = question.querySelector('input[type="radio"]:checked');
        const answer = selectedOption ? parseInt(selectedOption.value) : -1;
        
        answers.push({
            questionId: index + 1,
            answer: answer
        });
    });
    
    // Отправка данных в Telegram
    tg.sendData(JSON.stringify({
        action: 'submitTest',
        testId: testId,
        answers: answers
    }));
    
    // Показать уведомление
    tg.showPopup({
        title: 'Тест завершен',
        message: 'Ваши ответы отправлены на проверку',
        buttons: [{
            type: 'ok'
        }]
    });
    
    // Вернуться к списку тестов
    backToTests();
}

// Сохранить данные пользователя
function saveUserData() {
    localStorage.setItem('telegramMiniAppUserData', JSON.stringify(userData));
}

// Загрузить данные пользователя
function loadUserData() {
    const savedData = localStorage.getItem('telegramMiniAppUserData');
    
    if (savedData) {
        try {
            userData = JSON.parse(savedData);
            
            // Применяем сохраненные данные
            applyUserData();
        } catch (error) {
            console.error('Ошибка при загрузке данных пользователя:', error);
        }
    }
    
    // Обновляем прогресс курсов
    updateAllCoursesProgress();
}

// Применить данные пользователя
function applyUserData() {
    // Отмечаем пройденные уроки
    userData.completedLessons.forEach(lessonKey => {
        const [courseId, lessonId] = lessonKey.split('-').map(Number);
        
        if (courses[courseId]) {
            const lesson = courses[courseId].lessons.find(l => l.id === lessonId);
            if (lesson) {
                lesson.completed = true;
            }
        }
    });
}

// Обновить прогресс всех курсов
function updateAllCoursesProgress() {
    Object.keys(courses).forEach(courseId => {
        updateCourseProgress(parseInt(courseId));
    });
} 