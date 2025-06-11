let allHolyPlaces = [];

document.addEventListener('DOMContentLoaded', async function() {
    // Зареждане на данните
    if (!holyplacesData) {
        await loadHolyPlacesData();
    }
    allHolyPlaces = holyplacesData;
    
    // Попълване на филтрите
    populateFilters();
    
    // Показване на всички места
    displayHolyPlaces(allHolyPlaces);
    
    // Добавяне на event listeners
    const typeFilter = document.getElementById('type-filter');
    const denominationFilter = document.getElementById('denomination-filter');
    const cityFilter = document.getElementById('city-filter');
    const resetButton = document.getElementById('reset-filters');
    
    typeFilter.addEventListener('change', filterHolyPlaces);
    denominationFilter.addEventListener('change', filterHolyPlaces);
    cityFilter.addEventListener('change', filterHolyPlaces);
    
    resetButton.addEventListener('click', function() {
        typeFilter.value = '';
        denominationFilter.value = '';
        cityFilter.value = '';
        displayHolyPlaces(allHolyPlaces);
    });
});

function populateFilters() {
    // Попълване на типове
    const types = getUniqueValues(allHolyPlaces, 'type');
    const typeSelect = document.getElementById('type-filter');
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = capitalize(type);
        typeSelect.appendChild(option);
    });
    
    // Попълване на деноминации
    const denominations = getUniqueValues(allHolyPlaces, 'denomination');
    const denominationSelect = document.getElementById('denomination-filter');
    denominations.forEach(denomination => {
        const option = document.createElement('option');
        option.value = denomination;
        option.textContent = capitalize(denomination);
        denominationSelect.appendChild(option);
    });
    
    // Попълване на градове
    const cities = getUniqueValues(allHolyPlaces, 'city');
    const citySelect = document.getElementById('city-filter');
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

function filterHolyPlaces() {
    const typeValue = document.getElementById('type-filter').value;
    const denominationValue = document.getElementById('denomination-filter').value;
    const cityValue = document.getElementById('city-filter').value;
    
    const filtered = allHolyPlaces.filter(place => {
        const matchType = !typeValue || place.type === typeValue;
        const matchDenomination = !denominationValue || place.denomination === denominationValue;
        const matchCity = !cityValue || place.city === cityValue;
        
        return matchType && matchDenomination && matchCity;
    });
    
    displayHolyPlaces(filtered);
}

function displayHolyPlaces(places) {
    const container = document.getElementById('holyplaces-list');
    
    if (places.length === 0) {
        container.innerHTML = '<p>Няма намерени резултати</p>';
        return;
    }
    
    container.innerHTML = places.map(place => `
        <div class="holyplace-card">
            <h3><a href="holyplace.html?id=${place.id}">${place.name}</a></h3>
            <p class="holyplace-meta">
                <span class="badge">${capitalize(place.type)}</span>
                <span class="badge">${capitalize(place.denomination)}</span>
                <span class="location">📍 ${place.city}</span>
            </p>
            <p>${place.description}</p>
            <a href="holyplace.html?id=${place.id}" class="btn-primary">Виж повече</a>
        </div>
    `).join('');
}