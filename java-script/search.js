// Search Functionality - Uganda Footy Hub
import { loadEvents, loadTeams } from './api.js';

let searchData = {
    events: [],
    teams: []
};

// Initialize Search
export async function initSearch() {
    // Load all searchable data
    await loadSearchData();
    
    // Setup search inputs
    const mobileSearch = document.getElementById('mobileSearch');
    const desktopSearch = document.getElementById('desktopSearch');
    
    if (mobileSearch) {
        mobileSearch.addEventListener('input', debounce((e) => {
            performSearch(e.target.value, 'mobile');
        }, 300));
    }
    
    if (desktopSearch) {
        desktopSearch.addEventListener('input', debounce((e) => {
            performSearch(e.target.value, 'desktop');
        }, 300));
    }
}

// Load Search Data
async function loadSearchData() {
    try {
        searchData.events = await loadEvents();
        searchData.teams = await loadTeams();
    } catch (error) {
        console.error('Error loading search data:', error);
    }
}

// Perform Search
function performSearch(query, context = 'mobile') {
    if (!query || query.trim().length < 2) {
        clearSearchResults(context);
        return;
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    const results = [];
    
    // Search events
    searchData.events.forEach(event => {
        if (
            event.title.toLowerCase().includes(normalizedQuery) ||
            event.description.toLowerCase().includes(normalizedQuery) ||
            event.year.toString().includes(normalizedQuery) ||
            (event.team && event.team.toLowerCase().includes(normalizedQuery))
        ) {
            results.push({
                type: 'event',
                data: event,
                title: event.title,
                subtitle: `${event.year} • ${event.type || 'Event'}`,
                description: event.description
            });
        }
    });
    
    // Search teams
    searchData.teams.forEach(team => {
        if (
            team.name.toLowerCase().includes(normalizedQuery) ||
            (team.stadium && team.stadium.toLowerCase().includes(normalizedQuery))
        ) {
            results.push({
                type: 'team',
                data: team,
                title: team.name,
                subtitle: team.stadium || 'Stadium TBA',
                description: `Founded: ${team.founded || 'Unknown'}`
            });
        }
    });
    
    displaySearchResults(results, context);
}

// Display Search Results
function displaySearchResults(results, context = 'mobile') {
    const container = document.getElementById('searchResults');
    if (!container) return;
    
    if (results.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <h3>No results found</h3>
                <p>Try different keywords</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = results.map(result => `
        <div class="search-result-item" data-type="${result.type}" data-id="${result.data.id}">
            <div class="search-result-title">${highlightMatch(result.title)}</div>
            <div class="search-result-type">${result.type.toUpperCase()}</div>
            <div class="search-result-desc">${truncate(result.description, 80)}</div>
        </div>
    `).join('');
    
    // Add click handlers
    container.querySelectorAll('.search-result-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            handleSearchResultClick(results[index]);
        });
    });
}

// Handle Search Result Click
function handleSearchResultClick(result) {
    if (result.type === 'team') {
        window.location.href = `team-detail.html?id=${result.data.id}`;
    } else if (result.type === 'event') {
        // Show event detail or navigate to timeline
        window.location.href = `timeline.html#event-${result.data.id}`;
    }
}

// Clear Search Results
function clearSearchResults(context) {
    const container = document.getElementById('searchResults');
    if (container) {
        container.innerHTML = '';
    }
}

// Highlight Search Match
function highlightMatch(text) {
    // Simple highlight - can be enhanced with actual query matching
    return text;
}

// Truncate Text
function truncate(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for use in other modules
export { performSearch, searchData };
