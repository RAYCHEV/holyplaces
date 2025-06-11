// Добавяме console.log за дебъгване
console.log('holyplace-detail.js се зарежда');
console.log('holyplacesData е налично?', typeof holyplacesData !== 'undefined');
console.log('holyplacesData съдържание:', holyplacesData);

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM е зареден');
    
    // Проверка дали данните съществуват
    if (typeof holyplacesData === 'undefined') {
        console.error('holyplacesData не е дефинирано!');
        showError('Грешка при зареждане на данните');
        return;
    }
    
    // Извличане на ID от URL параметрите
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id');
    console.log('Търсим място с ID:', placeId);
    
    if (!placeId) {
        showError('Няма избрано място');
        return;
    }
    
    // Намиране на мястото
    const currentPlace = holyplacesData.find(place => place.id === placeId);
    console.log('Намерено място:', currentPlace);
    
    if (!currentPlace) {
        showError('Мястото не е намерено');
        // Показваме всички налични ID-та за дебъг
        console.log('Налични ID-та:', holyplacesData.map(p => p.id));
        return;
    }
    
    // Показване на информацията
    displayPlaceInfo(currentPlace);
    
    // Инициализиране на картата
    setTimeout(() => {
        initMap(currentPlace);
    }, 100);
});

function showError(message) {
    document.getElementById('loading').textContent = message;
}

function displayPlaceInfo(place) {
    console.log('Показваме информация за:', place.name);
    
    // Скриване на loading и показване на съдържанието
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    
    // Обновяване на заглавието
    document.getElementById('page-title').textContent = place.name + ' - Свети места в България';
    
    // Попълване на информацията
    document.getElementById('place-name').textContent = place.name;
    document.getElementById('place-description').textContent = place.description;
    document.getElementById('place-type').textContent = capitalize(place.type);
    document.getElementById('place-denomination').textContent = capitalize(place.denomination);
    document.getElementById('place-address').textContent = place.address;
    document.getElementById('place-hours').textContent = place.workingHours;
    
    // Телефон
    if (place.phone) {
        document.getElementById('phone-row').style.display = 'block';
        const phoneLink = document.getElementById('place-phone');
        phoneLink.textContent = place.phone;
        phoneLink.href = 'tel:' + place.phone;
    }
    
    // Уебсайт
    if (place.website) {
        document.getElementById('website-row').style.display = 'block';
        const websiteLink = document.getElementById('place-website');
        websiteLink.textContent = place.website;
        websiteLink.href = place.website;
        
        document.getElementById('website-btn').style.display = 'inline-block';
        document.getElementById('website-btn').href = place.website;
    }
    
    // Бутон за навигация
    document.getElementById('navigation-btn').onclick = function() {
        openNavigation(place.latitude, place.longitude);
    };
}

function initMap(place) {
    console.log('Инициализираме карта за:', place.latitude, place.longitude);
    
    try {
        // Инициализиране на картата
        const map = L.map('map').setView([place.latitude, place.longitude], 15);
        
        // Добавяне на tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Добавяне на маркер
        L.marker([place.latitude, place.longitude])
            .addTo(map)
            .bindPopup('<strong>' + place.name + '</strong><br>' + place.address)
            .openPopup();
    } catch (error) {
        console.error('Грешка при инициализиране на картата:', error);
    }
}

function openNavigation(lat, lng) {
    if (navigator.userAgent.match(/Android/i)) {
        window.open('geo:' + lat + ',' + lng + '?q=' + lat + ',' + lng);
    } else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        window.open('maps://maps.google.com/maps?daddr=' + lat + ',' + lng);
    } else {
        window.open('https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng);
    }
}

// Проверка за функцията capitalize
if (typeof capitalize === 'undefined') {
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}