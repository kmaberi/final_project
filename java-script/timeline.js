// Timeline Page - Uganda Footy Hub
import { loadEvents, loadTeams, loadNews } from './api.js';
import { initSearch } from './search.js';
import { initFavorites, createFavoriteButton } from './favorites.js';
import { createTimelineCard } from './app.js';

let allEvents = [];
let filteredEvents = [];
let activeFilters = {
    decade: [],
    type: [],
    team: null
};

// Initialize Timeline Page
document.addEventListener('DOMContentLoaded', async () => {
    initNavigation();
    initSearch();
    initFavorites();
    await loadTimelineData();
    initFilters();
    initMobileFilters();
});

// Navigation
function initNavigation() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    const searchToggle = document.getElementById('mobileSearchToggle');
    const searchOverlay = document.getElementById('mobileSearchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    
    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeSearch && searchOverlay) {
        closeSearch.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

// Load Timeline Data
async function loadTimelineData() {
    try {
        // Load events
        allEvents = await loadEvents();
        filteredEvents = [...allEvents];
        
        // Sort by year (descending)
        filteredEvents.sort((a, b) => b.year - a.year);
        
        // Display events
        displayTimeline();
        
        // Load teams for filter
        const teams = await loadTeams();
        populateTeamFilter(teams);
        
        // Load news for sidebar
        loadNewsSidebar();
        
    } catch (error) {
        console.error('Error loading timeline:', error);
        showError();
    }
}

// Display Timeline
function displayTimeline() {
    const container = document.getElementById('timelineGrid');
    const loading = document.getElementById('timelineLoading');
    
    if (loading) loading.style.display = 'none';
    if (!container) return;
    
    if (filteredEvents.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3>No events found</h3>
                <p>Try adjusting your filters</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredEvents.map(event => createTimelineCard(event)).join('');
    
    // Add click handlers and favorite buttons
    container.querySelectorAll('.timeline-card').forEach((card, index) => {
        const event = filteredEvents[index];
        
        // Add favorite button
        const favoriteBtn = createFavoriteButton('events', event);
        const cardBody = card.querySelector('.timeline-card-body');
        if (cardBody) {
            cardBody.appendChild(favoriteBtn);
        }
        
        // Add click handler
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-btn')) {
                showEventDetail(event);
            }
        });
    });
}

// Initialize Filters
function initFilters() {
    // Decade filters
    document.querySelectorAll('input[data-filter="decade"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                activeFilters.decade.push(parseInt(e.target.value));
            } else {
                activeFilters.decade = activeFilters.decade.filter(d => d !== parseInt(e.target.value));
            }
            applyFilters();
        });
    });
    
    // Type filters
    document.querySelectorAll('input[data-filter="type"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                activeFilters.type.push(e.target.value);
            } else {
                activeFilters.type = activeFilters.type.filter(t => t !== e.target.value);
            }
            applyFilters();
        });
    });
    
    // Team filter
    const teamFilter = document.getElementById('teamFilter');
    if (teamFilter) {
        teamFilter.addEventListener('change', (e) => {
            activeFilters.team = e.target.value || null;
            applyFilters();
        });
    }
    
    // Clear filters button
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
    }
}

// Initialize Mobile Filters
function initMobileFilters() {
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            const filterValue = e.target.dataset.filter;
            
            // Remove active class from all chips
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked chip
            e.target.classList.add('active');
            
            // Apply filter
            if (filterValue === 'all') {
                clearFilters();
            } else {
                activeFilters.type = [filterValue];
                activeFilters.decade = [];
                activeFilters.team = null;
                applyFilters();
            }
        });
    });
}

// Apply Filters
function applyFilters() {
    filteredEvents = allEvents.filter(event => {
        // Filter by decade
        if (activeFilters.decade.length > 0) {
            const eventDecade = Math.floor(event.year / 10) * 10;
            if (!activeFilters.decade.includes(eventDecade)) {
                return false;
            }
        }
        
        // Filter by type
        if (activeFilters.type.length > 0) {
            if (!activeFilters.type.includes(event.type)) {
                return false;
            }
        }
        
        // Filter by team
        if (activeFilters.team) {
            if (event.team !== activeFilters.team) {
                return false;
            }
        }
        
        return true;
    });
    
    displayTimeline();
}

// Clear Filters
function clearFilters() {
    // Reset active filters
    activeFilters = {
        decade: [],
        type: [],
        team: null
    };
    
    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset team select
    const teamFilter = document.getElementById('teamFilter');
    if (teamFilter) {
        teamFilter.value = '';
    }
    
    // Reset mobile filters
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
        if (chip.dataset.filter === 'all') {
            chip.classList.add('active');
        }
    });
    
    // Reapply (will show all)
    filteredEvents = [...allEvents];
    displayTimeline();
}

// Populate Team Filter
function populateTeamFilter(teams) {
    const select = document.getElementById('teamFilter');
    if (!select) return;
    
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.name;
        option.textContent = team.name;
        select.appendChild(option);
    });
}

// Load News Sidebar
async function loadNewsSidebar() {
    const newsList = document.getElementById('newsList');
    if (!newsList) return;
    
    try {
        const news = await loadNews();
        const recentNews = news.slice(0, 3);
        
        if (recentNews.length === 0) {
            newsList.innerHTML = '<p class="text-center">No news available</p>';
            return;
        }
        
        newsList.innerHTML = recentNews.map(article => `
            <div class="news-item" onclick="window.open('${article.url}', '_blank')">
                <div class="news-image">
                    ${article.urlToImage 
                        ? `<img src="${article.urlToImage}" alt="${article.title}" loading="lazy">` 
                        : ''
                    }
                </div>
                <div class="news-title">${truncate(article.title, 80)}</div>
                <div class="news-time">${formatTime(article.publishedAt)}</div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading news:', error);
        if (newsList) {
            newsList.innerHTML = '<p class="text-center">Unable to load news</p>';
        }
    }
}

// Show Event Detail
function showEventDetail(event) {
    const detail = `
${event.title}

Year: ${event.year}
Type: ${event.type || 'Event'}
${event.team ? `Team: ${event.team}` : ''}

${event.description}

${event.source ? `Source: ${event.source}` : ''}
    `;
    
    alert(detail.trim());
    // TODO: Replace with proper modal component
}

// Show Error
function showError() {
    const container = document.getElementById('timelineGrid');
    const loading = document.getElementById('timelineLoading');
    
    if (loading) loading.style.display = 'none';
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-state">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <h3>Error loading timeline</h3>
            <p>Please refresh the page to try again</p>
        </div>
    `;
}

// Utility Functions
function truncate(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
}

// Export for debugging
export { allEvents, filteredEvents, activeFilters };