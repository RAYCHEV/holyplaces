document.addEventListener('DOMContentLoaded', function() {
    const typeFilter = document.getElementById('type-filter');
    const denominationFilter = document.getElementById('denomination-filter');
    const cityFilter = document.getElementById('city-filter');
    const resetButton = document.getElementById('reset-filters');
    const holyplaceCards = document.querySelectorAll('.holyplace-card');
    
    function filterHolyPlaces() {
        const typeValue = typeFilter.value;
        const denominationValue = denominationFilter.value;
        const cityValue = cityFilter.value;
        
        holyplaceCards.forEach(card => {
            const matchType = !typeValue || card.dataset.type === typeValue;
            const matchDenomination = !denominationValue || card.dataset.denomination === denominationValue;
            const matchCity = !cityValue || card.dataset.city === cityValue;
            
            if (matchType && matchDenomination && matchCity) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    typeFilter.addEventListener('change', filterHolyPlaces);
    denominationFilter.addEventListener('change', filterHolyPlaces);
    cityFilter.addEventListener('change', filterHolyPlaces);
    
    resetButton.addEventListener('click', function() {
        typeFilter.value = '';
        denominationFilter.value = '';
        cityFilter.value = '';
        filterHolyPlaces();
    });
});