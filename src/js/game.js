// Основные переменные игры
let money = 0;
let orderCount = 0;
let currentOrder = null;
let orderTimer = null;
let orderTimeout = 5000; // 5 секунд на обработку заказа

// Инициализация игры
function initGame() {
    updateDisplay();
    
    // Добавляем обработчик события для кнопки "Обработать заказ"
    document.getElementById('processOrderBtn').addEventListener('click', processOrder);
    
    // Запускаем систему генерации заказов
    startOrderGeneration();
}

// Функция запуска системы генерации заказов
function startOrderGeneration() {
    // Генерируем первый заказ
    generateNewOrder();
    
    // Устанавливаем интервал для генерации новых заказов
    setInterval(function() {
        // Если текущий заказ не обработан, обрабатываем его автоматически
        if (currentOrder) {
            autoProcessOrder();
        }
        
        // Генерируем новый заказ
        generateNewOrder();
    }, orderTimeout);
}

// Функция генерации нового заказа
function generateNewOrder() {
    // Генерируем случайную стоимость заказа от 5 до 20
    const orderValue = Math.floor(Math.random() * 16) + 5;
    
    // Создаем новый заказ
    currentOrder = {
        id: Date.now(),
        value: orderValue
    };
    
    // Отображаем информацию о новом заказе
    showOrderNotification(currentOrder);
    
    // Обновляем интерфейс
    updateOrderDisplay();
    
    // Запускаем таймер для этого заказа
    startOrderTimer();
}

// Функция отображения уведомления о новом заказе
function showOrderNotification(order) {
    const notificationElement = document.getElementById('orderNotification');
    
    // Обновляем текст уведомления
    notificationElement.textContent = `Новый заказ на ${order.value} монет!`;
    
    // Добавляем класс для анимации
    notificationElement.classList.add('notification-active');
    
    // Удаляем класс через 3 секунды
    setTimeout(function() {
        notificationElement.classList.remove('notification-active');
    }, 3000);
}

// Функция запуска таймера для заказа
function startOrderTimer() {
    // Сбрасываем предыдущий таймер, если он был
    if (orderTimer) {
        clearInterval(orderTimer);
    }
    
    // Получаем элемент прогресс-бара
    const progressBar = document.getElementById('orderProgressBar');
    
    // Устанавливаем начальное значение
    let timeLeft = 100;
    progressBar.style.width = '100%';
    
    // Запускаем таймер
    orderTimer = setInterval(function() {
        // Уменьшаем оставшееся время
        timeLeft -= 2; // 2% каждые 100мс = 100% за 5 секунд
        
        // Обновляем прогресс-бар
        progressBar.style.width = timeLeft + '%';
        
        // Если время вышло, останавливаем таймер
        if (timeLeft <= 0) {
            clearInterval(orderTimer);
        }
    }, 100);
}

// Функция автоматической обработки заказа
function autoProcessOrder() {
    if (currentOrder) {
        // Добавляем деньги от заказа
        money += currentOrder.value;
        
        // Увеличиваем счетчик заказов
        orderCount++;
        
        // Выводим сообщение об автоматической обработке
        console.log(`Заказ автоматически обработан: +${currentOrder.value} монет`);
        
        // Сбрасываем текущий заказ
        currentOrder = null;
        
        // Останавливаем таймер
        if (orderTimer) {
            clearInterval(orderTimer);
            orderTimer = null;
        }
        
        // Обновляем интерфейс
        updateDisplay();
        updateOrderDisplay();
    }
}

// Функция обработки заказа игроком
function processOrder() {
    if (currentOrder) {
        // Добавляем деньги от заказа
        money += currentOrder.value;
        
        // Увеличиваем счетчик заказов
        orderCount++;
        
        // Показываем анимацию получения денег
        showMoneyAnimation(currentOrder.value);
        
        // Сбрасываем текущий заказ
        currentOrder = null;
        
        // Останавливаем таймер
        if (orderTimer) {
            clearInterval(orderTimer);
            orderTimer = null;
        }
        
        // Обновляем интерфейс
        updateDisplay();
        updateOrderDisplay();
    } else {
        // Если нет активного заказа, показываем сообщение
        showNoOrderMessage();
    }
}

// Функция отображения анимации получения денег
function showMoneyAnimation(value) {
    // Создаем элемент для анимации
    const animationElement = document.createElement('div');
    animationElement.className = 'money-animation';
    animationElement.textContent = `+${value}`;
    
    // Добавляем элемент в DOM
    document.querySelector('.game-container').appendChild(animationElement);
    
    // Удаляем элемент после завершения анимации
    setTimeout(function() {
        animationElement.remove();
    }, 1000);
}

// Функция отображения сообщения об отсутствии заказа
function showNoOrderMessage() {
    const messageElement = document.getElementById('orderMessage');
    messageElement.textContent = 'Нет активных заказов!';
    messageElement.classList.add('message-active');
    
    setTimeout(function() {
        messageElement.classList.remove('message-active');
    }, 2000);
}

// Функция обновления отображения заказа
function updateOrderDisplay() {
    const orderContainer = document.getElementById('currentOrderContainer');
    const orderValueElement = document.getElementById('orderValue');
    
    if (currentOrder) {
        // Если есть активный заказ, показываем его
        orderContainer.style.display = 'block';
        orderValueElement.textContent = currentOrder.value;
    } else {
        // Если нет активного заказа, скрываем контейнер
        orderContainer.style.display = 'none';
    }
}

// Функция обновления отображения
function updateDisplay() {
    document.getElementById('moneyDisplay').textContent = money;
    document.getElementById('orderCountDisplay').textContent = orderCount;
}

// Запускаем игру после загрузки страницы
window.addEventListener('DOMContentLoaded', initGame); 