// Основные переменные игры
let money = 0;
let orderCount = 0;

// Инициализация игры
function initGame() {
    updateDisplay();
    
    // Добавляем обработчик события для кнопки "Обработать заказ"
    document.getElementById('processOrderBtn').addEventListener('click', processOrder);
}

// Функция обработки заказа
function processOrder() {
    // Увеличиваем деньги на фиксированную сумму
    money += 10;
    
    // Увеличиваем счетчик заказов
    orderCount++;
    
    // Обновляем отображение
    updateDisplay();
}

// Функция обновления отображения
function updateDisplay() {
    document.getElementById('moneyDisplay').textContent = money;
    document.getElementById('orderCountDisplay').textContent = orderCount;
}

// Запускаем игру после загрузки страницы
window.addEventListener('DOMContentLoaded', initGame); 