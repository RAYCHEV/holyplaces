// Директно използваме данните от data.js
const holyplacesData = holyplacesDatabase.holyplaces;

// Функция за извличане на уникални стойности
function getUniqueValues(array, key) {
    return [...new Set(array.map(item => item[key]))].sort();
}

// Функция за форматиране на текст с главна буква
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Инициализация при зареждане на страницата
document.addEventListener('DOMContentLoaded', function() {
    // Обновяване на статистиките на началната страница
    if (document.getElementById('total-places')) {
        updateHomeStats();
    }
});

// Функция за обновяване на статистиките
function updateHomeStats() {
    document.getElementById('total-places').textContent = holyplacesData.length;
    document.getElementById('total-cities').textContent = getUniqueValues(holyplacesData, 'city').length;
    document.getElementById('total-types').textContent = getUniqueValues(holyplacesData, 'type').length;
}