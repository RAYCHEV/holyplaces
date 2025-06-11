let currentPlace = null;
let map = null;

document.addEventListener('DOMContentLoaded', async function() {
    // Извличане на ID от URL параметрите
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id');
    
    if (!placeId) {
        showError('Няма избрано място');
        return;
    }
    
    // Зареждане на данните
    if (!holyplacesData) {
        await loadHolyPlacesData();
    }
    
    // Намиране на мястото
    currentPlace = holyplacesData.find(place => place.id === placeId);
    
    if (!currentPlace) {
        showError('Мястото не е намерено');
        return;
    }
    
    // Показване на информацията
    displayPlaceInfo();
    
    // Инициализиране на картата
    initMap();
});

function showError(message) {
    document.getElementById('loading').textContent = message;
}

function displayPlaceInfo() {
    // Скриване на loading и показване на съдържанието
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    
    // Обновяване на заглавието
    document.getElementById('page-title').textContent = currentPlace.name + ' - Свети места в България';
    
    // Попълване на информацията
    document.getElementById('place-name').textContent = currentPlace.name;
    document.getElementById('place-description').textContent = currentPlace.description;
    document.getElementById('place-type').textContent = capitalize(currentPlace.type);
    document.getElementById('place-denomination').textContent = capitalize(currentPlace.denomination);
    document.getElementById('place-address').textContent = currentPlace.address;
    document.getElementById('place-hours').textContent = currentPlace.workingHours;
    
    // Телефон
    if (currentPlace.phone) {
        document.getElementById('phone-row').style.display = 'block';
        const phoneLink = document.getElementById('place-phone');
        phoneLink.textContent = currentPlace.phone;
        phoneLink.href = 'tel:' + currentPlace.phone;
    }
    
    // Уебсайт
    if (currentPlace.website) {
        document.getElementById('website-row').style.display = 'block';
        const websiteLink = document.getElementById('place-website');
        websiteLink.textContent = currentPlace.website;
        websiteLink.href = currentPlace.website;
        
        document.getElementById('website-btn').style.display = 'inline-block';
        document.getElementById('website-btn').href = currentPlace.website;
    }
    
    // Бутон за навигация
    document.getElementById('navigation-btn').onclick = function() {
        openNavigation(currentPlace.latitude, currentPlace.longitude);
    };
}

function initMap() {
    // Инициализиране на картата
    map = L.map('map').setView([currentPlace.latitude, currentPlace.longitude], 15);
    
    // Добавяне на tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Добавяне на маркер
    L.marker([currentPlace.latitude, currentPlace.longitude])
        .addTo(map)
        .bindPopup('<strong>' + currentPlace.name + '</strong><br>' + currentPlace.address)
        .openPopup();
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