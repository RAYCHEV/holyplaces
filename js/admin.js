// Копие на данните за редактиране
let editableData = JSON.parse(JSON.stringify(holyplacesDatabase.holyplaces));
let currentEditIndex = -1;
let mapPicker = null;
let selectedMarker = null;
let tempCoords = { lat: null, lng: null };

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    
    // Form submit handler
    document.getElementById('placeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        savePlace();
    });
    
    // Event delegation за бутоните в таблицата
    document.getElementById('tableBody').addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-edit')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            editPlace(index);
        } else if (e.target.classList.contains('btn-delete')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            deletePlace(index);
        }
    });
});

// Рендериране на таблицата
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    editableData.forEach((place, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${place.name}</td>
            <td>${place.type}</td>
            <td>${place.denomination}</td>
            <td>${place.city}</td>
            <td>${place.latitude.toFixed(4)}, ${place.longitude.toFixed(4)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit btn-small" data-index="${index}">✏️ Редактирай</button>
                    <button class="btn-delete btn-small" data-index="${index}">🗑️ Изтрий</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Показване на модал за добавяне
function showAddModal() {
    currentEditIndex = -1;
    document.getElementById('modalTitle').textContent = 'Добави ново място';
    document.getElementById('placeForm').reset();
    document.getElementById('editIndex').value = '-1';
    document.getElementById('placeId').disabled = false;
    document.getElementById('editModal').style.display = 'block';
}

// Редактиране на място
function editPlace(index) {
    currentEditIndex = index;
    const place = editableData[index];
    
    document.getElementById('modalTitle').textContent = 'Редактирай място';
    document.getElementById('editIndex').value = index;
    
    // Попълване на формата
    document.getElementById('placeId').value = place.id;
    document.getElementById('placeId').disabled = true; // ID не може да се променя
    document.getElementById('placeName').value = place.name;
    document.getElementById('placeType').value = place.type;
    document.getElementById('placeDenomination').value = place.denomination;
    document.getElementById('placeCity').value = place.city;
    document.getElementById('placeAddress').value = place.address;
    document.getElementById('placeDescription').value = place.description;
    document.getElementById('placeLatitude').value = place.latitude;
    document.getElementById('placeLongitude').value = place.longitude;
    document.getElementById('placeWorkingHours').value = place.workingHours || '';
    document.getElementById('placePhone').value = place.phone || '';
    document.getElementById('placeWebsite').value = place.website || '';
    
    document.getElementById('editModal').style.display = 'block';
}

// Запазване на място
function savePlace() {
    const index = parseInt(document.getElementById('editIndex').value);
    
    const placeData = {
        id: document.getElementById('placeId').value.toLowerCase().replace(/\s+/g, '-'),
        name: document.getElementById('placeName').value,
        type: document.getElementById('placeType').value,
        denomination: document.getElementById('placeDenomination').value,
        city: document.getElementById('placeCity').value,
        address: document.getElementById('placeAddress').value,
        description: document.getElementById('placeDescription').value,
        latitude: parseFloat(document.getElementById('placeLatitude').value),
        longitude: parseFloat(document.getElementById('placeLongitude').value),
        workingHours: document.getElementById('placeWorkingHours').value || '',
        phone: document.getElementById('placePhone').value || '',
        website: document.getElementById('placeWebsite').value || '',
        image: ""
    };
    
    if (index === -1) {
        // Проверка за уникален ID
        if (editableData.some(p => p.id === placeData.id)) {
            alert('Вече съществува място с този ID!');
            return;
        }
        editableData.push(placeData);
    } else {
        editableData[index] = placeData;
    }
    
    renderTable();
    closeModal();
    
    // Показване на съобщение
    alert('Промените са запазени! Не забравяйте да изтеглите новия data.js файл.');
}

// Изтриване на място
function deletePlace(index) {
    const place = editableData[index];
    if (confirm(`Сигурни ли сте, че искате да изтриете "${place.name}"?`)) {
        editableData.splice(index, 1);
        renderTable();
        alert('Мястото е изтрито! Не забравяйте да изтеглите новия data.js файл.');
    }
}

// Затваряне на модал
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('placeForm').reset();
}

// Показване на карта за избор на координати
function showMapModal() {
    document.getElementById('mapPickerModal').style.display = 'block';
    
    // Инициализиране на картата след показване на модала
    setTimeout(() => {
        if (!mapPicker) {
            const lat = parseFloat(document.getElementById('placeLatitude').value) || 42.6977;
            const lng = parseFloat(document.getElementById('placeLongitude').value) || 23.3219;
            
            mapPicker = L.map('mapModal').setView([lat, lng], 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapPicker);
            
            // Добавяне на маркер ако има координати
            if (document.getElementById('placeLatitude').value) {
                selectedMarker = L.marker([lat, lng]).addTo(mapPicker);
                tempCoords = { lat, lng };
                document.getElementById('selectedCoords').textContent = 
                    `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            }
            
            // Клик върху картата
            mapPicker.on('click', function(e) {
                if (selectedMarker) {
                    mapPicker.removeLayer(selectedMarker);
                }
                
                selectedMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mapPicker);
                tempCoords = { lat: e.latlng.lat, lng: e.latlng.lng };
                
                document.getElementById('selectedCoords').textContent = 
                    `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
            });
        } else {
            mapPicker.invalidateSize();
        }
    }, 100);
}

// Затваряне на карта модал
function closeMapModal() {
    document.getElementById('mapPickerModal').style.display = 'none';
}

// Прилагане на избраните координати
function applyCoordinates() {
    if (tempCoords.lat && tempCoords.lng) {
        document.getElementById('placeLatitude').value = tempCoords.lat.toFixed(6);
        document.getElementById('placeLongitude').value = tempCoords.lng.toFixed(6);
        closeMapModal();
    } else {
        alert('Моля изберете местоположение на картата!');
    }
}

// Търсене на локация (използва Nominatim API)
function searchLocation(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const query = document.getElementById('mapSearch').value;
        
        if (!query) return;
        
        // Търсене чрез Nominatim
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, България&limit=1`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const result = data[0];
                    const lat = parseFloat(result.lat);
                    const lng = parseFloat(result.lon);
                    
                    // Центриране на картата
                    mapPicker.setView([lat, lng], 15);
                    
                    // Добавяне на маркер
                    if (selectedMarker) {
                        mapPicker.removeLayer(selectedMarker);
                    }
                    
                    selectedMarker = L.marker([lat, lng]).addTo(mapPicker);
                    tempCoords = { lat, lng };
                    
                    document.getElementById('selectedCoords').textContent = 
                        `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                } else {
                    alert('Не е намерен резултат за това търсене!');
                }
            })
            .catch(error => {
                console.error('Грешка при търсене:', error);
                alert('Грешка при търсене на локация!');
            });
    }
}

// Генериране и изтегляне на data.js файл
function generateAndDownloadDataJS() {
    const dataContent = `const holyplacesDatabase = {
  "holyplaces": ${JSON.stringify(editableData, null, 2)}
};`;
    
    // Създаване на blob
    const blob = new Blob([dataContent], { type: 'text/javascript' });
    
    // Създаване на download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'data.js';
    
    // Кликване на линка
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Освобождаване на URL
    URL.revokeObjectURL(downloadLink.href);
    
    alert('Файлът data.js е изтеглен успешно!');
}

// Затваряне на модали при клик извън тях
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Глобални функции за достъп от HTML
window.showAddModal = showAddModal;
window.closeModal = closeModal;
window.showMapModal = showMapModal;
window.closeMapModal = closeMapModal;
window.applyCoordinates = applyCoordinates;
window.searchLocation = searchLocation;
window.generateAndDownloadDataJS = generateAndDownloadDataJS;