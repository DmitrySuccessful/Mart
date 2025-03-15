// Основные переменные игры
let money = 0;
let orderCount = 0;
let currentOrder = null;
let orderTimer = null;
let orderTimeout = 5000; // 5 секунд на обработку заказа

// Переменные для системы апгрейдов
let upgradeLevel = 1;
let baseUpgradeCost = 100; // Базовая стоимость апгрейда

// Переменные для системы монетизации
let isWatchingAd = false;
let hasPremium = false;

// Ключи для localStorage
const STORAGE_KEYS = {
    MONEY: 'mart_money',
    ORDER_COUNT: 'mart_order_count',
    UPGRADE_LEVEL: 'mart_upgrade_level',
    HAS_PREMIUM: 'mart_has_premium'
};

// Инициализация игры
function initGame() {
    // Загружаем сохраненный прогресс
    loadProgress();
    
    // Обновляем отображение
    updateDisplay();
    
    // Добавляем обработчик события для кнопки "Обработать заказ"
    document.getElementById('processOrderBtn').addEventListener('click', processOrder);
    
    // Добавляем обработчик события для кнопки "Апгрейд склада"
    document.getElementById('upgradeBtn').addEventListener('click', upgradeWarehouse);
    
    // Добавляем обработчик события для кнопки "Посмотреть рекламу"
    document.getElementById('watchAdBtn').addEventListener('click', watchAd);
    
    // Добавляем обработчик события для кнопки "Купить премиум"
    document.getElementById('buyPremiumBtn').addEventListener('click', buyPremium);
    
    // Добавляем обработчик события для кнопки "Сбросить прогресс"
    document.getElementById('resetProgressBtn').addEventListener('click', resetProgress);
    
    // Запускаем систему генерации заказов
    startOrderGeneration();
}

// Функция сохранения прогресса
function saveProgress() {
    try {
        // Сохраняем основные переменные
        localStorage.setItem(STORAGE_KEYS.MONEY, money);
        localStorage.setItem(STORAGE_KEYS.ORDER_COUNT, orderCount);
        localStorage.setItem(STORAGE_KEYS.UPGRADE_LEVEL, upgradeLevel);
        localStorage.setItem(STORAGE_KEYS.HAS_PREMIUM, hasPremium);
        
        console.log('Прогресс сохранен');
    } catch (error) {
        console.error('Ошибка при сохранении прогресса:', error);
    }
}

// Функция загрузки прогресса
function loadProgress() {
    try {
        // Проверяем наличие сохраненных данных
        if (localStorage.getItem(STORAGE_KEYS.MONEY) !== null) {
            // Загружаем основные переменные
            money = parseInt(localStorage.getItem(STORAGE_KEYS.MONEY)) || 0;
            orderCount = parseInt(localStorage.getItem(STORAGE_KEYS.ORDER_COUNT)) || 0;
            upgradeLevel = parseInt(localStorage.getItem(STORAGE_KEYS.UPGRADE_LEVEL)) || 1;
            hasPremium = localStorage.getItem(STORAGE_KEYS.HAS_PREMIUM) === 'true';
            
            console.log('Прогресс загружен');
        } else {
            console.log('Сохраненный прогресс не найден, используются начальные значения');
        }
    } catch (error) {
        console.error('Ошибка при загрузке прогресса:', error);
    }
}

// Функция сброса прогресса
function resetProgress() {
    // Показываем диалог подтверждения
    if (confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.')) {
        try {
            // Очищаем localStorage
            localStorage.removeItem(STORAGE_KEYS.MONEY);
            localStorage.removeItem(STORAGE_KEYS.ORDER_COUNT);
            localStorage.removeItem(STORAGE_KEYS.UPGRADE_LEVEL);
            localStorage.removeItem(STORAGE_KEYS.HAS_PREMIUM);
            
            // Сбрасываем переменные к начальным значениям
            money = 0;
            orderCount = 0;
            upgradeLevel = 1;
            hasPremium = false;
            
            // Обновляем интерфейс
            updateDisplay();
            updatePremiumStatus();
            
            // Показываем сообщение об успешном сбросе
            showMessage('Прогресс успешно сброшен!');
            
            console.log('Прогресс сброшен');
        } catch (error) {
            console.error('Ошибка при сбросе прогресса:', error);
        }
    }
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
    const baseOrderValue = Math.floor(Math.random() * 16) + 5;
    
    // Применяем множитель в зависимости от уровня склада
    const orderValue = Math.floor(baseOrderValue * getIncomeMultiplier());
    
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

// Функция получения множителя дохода в зависимости от уровня склада
function getIncomeMultiplier() {
    // Базовый множитель 1.0 + 0.2 за каждый уровень выше первого
    let multiplier = 1.0 + (upgradeLevel - 1) * 0.2;
    
    // Если есть премиум, добавляем дополнительный бонус
    if (hasPremium) {
        multiplier += 0.5;
    }
    
    return multiplier;
}

// Функция получения стоимости следующего апгрейда
function getUpgradeCost() {
    return baseUpgradeCost * upgradeLevel;
}

// Функция апгрейда склада
function upgradeWarehouse() {
    const upgradeCost = getUpgradeCost();
    
    // Проверяем, достаточно ли денег
    if (money >= upgradeCost) {
        // Вычитаем стоимость апгрейда
        money -= upgradeCost;
        
        // Увеличиваем уровень склада
        upgradeLevel++;
        
        // Показываем анимацию апгрейда
        showUpgradeAnimation();
        
        // Обновляем интерфейс
        updateDisplay();
        updateUpgradeInfo();
        
        // Сохраняем прогресс
        saveProgress();
    } else {
        // Показываем сообщение о недостатке денег
        showNotEnoughMoneyMessage();
    }
}

// Функция симуляции просмотра рекламы
function watchAd() {
    // Проверяем, не смотрит ли пользователь уже рекламу
    if (isWatchingAd) {
        return;
    }
    
    // Устанавливаем флаг просмотра рекламы
    isWatchingAd = true;
    
    // Показываем оверлей рекламы
    const adOverlay = document.getElementById('adOverlay');
    adOverlay.style.display = 'flex';
    
    // Запускаем таймер для симуляции просмотра рекламы
    let adTimeLeft = 3;
    const adTimerElement = document.getElementById('adTimer');
    adTimerElement.textContent = adTimeLeft;
    
    // Обновляем таймер каждую секунду
    const adTimer = setInterval(function() {
        adTimeLeft--;
        adTimerElement.textContent = adTimeLeft;
        
        // Если время вышло, завершаем просмотр рекламы
        if (adTimeLeft <= 0) {
            clearInterval(adTimer);
            completeAdWatching();
        }
    }, 1000);
}

// Функция завершения просмотра рекламы
function completeAdWatching() {
    // Скрываем оверлей рекламы
    const adOverlay = document.getElementById('adOverlay');
    adOverlay.style.display = 'none';
    
    // Сбрасываем флаг просмотра рекламы
    isWatchingAd = false;
    
    // Добавляем бонус к деньгам
    const adBonus = 50;
    money += adBonus;
    
    // Показываем анимацию получения денег
    showMoneyAnimation(adBonus);
    
    // Обновляем интерфейс
    updateDisplay();
    
    // Сохраняем прогресс
    saveProgress();
}

// Функция симуляции покупки премиума
function buyPremium() {
    // Если уже есть премиум, ничего не делаем
    if (hasPremium) {
        showMessage('У вас уже есть премиум!');
        return;
    }
    
    // Показываем сообщение о недоступности функции
    showPremiumMessage();
    
    // Для демонстрации, активируем премиум
    hasPremium = true;
    
    // Обновляем интерфейс
    updatePremiumStatus();
    updateDisplay();
    
    // Сохраняем прогресс
    saveProgress();
}

// Функция отображения сообщения о премиуме
function showPremiumMessage() {
    const messageElement = document.getElementById('orderMessage');
    messageElement.textContent = 'Поздравляем! Вы приобрели премиум-статус!';
    messageElement.classList.add('message-active');
    messageElement.style.color = '#ff9800';
    
    setTimeout(function() {
        messageElement.classList.remove('message-active');
        messageElement.style.color = '';
    }, 3000);
}

// Функция обновления статуса премиума
function updatePremiumStatus() {
    const premiumBtn = document.getElementById('buyPremiumBtn');
    const premiumIndicator = document.getElementById('premiumIndicator');
    
    if (hasPremium) {
        premiumBtn.disabled = true;
        premiumBtn.textContent = 'Премиум активирован';
        premiumIndicator.style.display = 'inline-block';
    } else {
        premiumBtn.disabled = false;
        premiumBtn.textContent = 'Купить премиум';
        premiumIndicator.style.display = 'none';
    }
}

// Функция отображения сообщения
function showMessage(text) {
    const messageElement = document.getElementById('orderMessage');
    messageElement.textContent = text;
    messageElement.classList.add('message-active');
    
    setTimeout(function() {
        messageElement.classList.remove('message-active');
    }, 2000);
}

// Функция отображения анимации апгрейда
function showUpgradeAnimation() {
    // Создаем элемент для анимации
    const animationElement = document.createElement('div');
    animationElement.className = 'upgrade-animation';
    animationElement.textContent = `Уровень ${upgradeLevel}!`;
    
    // Добавляем элемент в DOM
    document.querySelector('.game-container').appendChild(animationElement);
    
    // Удаляем элемент после завершения анимации
    setTimeout(function() {
        animationElement.remove();
    }, 2000);
}

// Функция отображения сообщения о недостатке денег
function showNotEnoughMoneyMessage() {
    const messageElement = document.getElementById('orderMessage');
    messageElement.textContent = 'Недостаточно денег для апгрейда!';
    messageElement.classList.add('message-active');
    
    setTimeout(function() {
        messageElement.classList.remove('message-active');
    }, 2000);
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
        
        // Сохраняем прогресс
        saveProgress();
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
        
        // Сохраняем прогресс
        saveProgress();
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

// Функция обновления информации об апгрейде
function updateUpgradeInfo() {
    // Обновляем отображение уровня склада
    document.getElementById('upgradeLevel').textContent = upgradeLevel;
    
    // Обновляем отображение стоимости следующего апгрейда
    document.getElementById('upgradeCost').textContent = getUpgradeCost();
    
    // Обновляем отображение множителя дохода
    document.getElementById('incomeMultiplier').textContent = getIncomeMultiplier().toFixed(1);
}

// Функция обновления отображения
function updateDisplay() {
    document.getElementById('moneyDisplay').textContent = money;
    document.getElementById('orderCountDisplay').textContent = orderCount;
    updateUpgradeInfo();
    updatePremiumStatus();
}

// Запускаем игру после загрузки страницы
window.addEventListener('DOMContentLoaded', initGame); 