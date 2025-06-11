document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('home-search');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }
        
        const filtered = holyplacesData.filter(place => {
            return place.name.toLowerCase().includes(query) ||
                   place.city.toLowerCase().includes(query) ||
                   place.type.toLowerCase().includes(query) ||
                   place.denomination.toLowerCase().includes(query) ||
                   place.description.toLowerCase().includes(query);
        });
        
        displayResults(filtered);
    });
    
    function displayResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">Няма намерени резултати</div>';
        } else {
            searchResults.innerHTML = results.map(place => `
                <a href="holyplace.html?id=${place.id}" class="search-result-item">
                    <strong>${place.name}</strong>
                    <small>${capitalize(place.type)} • ${place.city}</small>
                </a>
            `).join('');
        }
        
        searchResults.classList.add('active');
    }
    
    // Затваряне при клик извън търсачката
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
});