// Main Application - Uganda Footy Hub
import { loadEvents, loadFeaturedTeams, getWeatherData } from './api.js';
import { initSearch } from './search.js';
import { initFavorites } from './favorites.js';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSearch();
    initFavorites();
    loadHomeContent();
});

// Navigation
function initNavigation() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu && !e.target.closest('.mobile-menu') && !e.target.closest('.menu-toggle')) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Mobile search toggle
    const searchToggle = document.getElementById('mobileSearchToggle');
    const searchOverlay = document.getElementById('mobileSearchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    
    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.getElementById('mobileSearch')?.focus();
        });
    }
    
    if (closeSearch && searchOverlay) {
        closeSearch.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

// Load Home Content
async function loadHomeContent() {
    await loadRecentEvents();
    await loadFeaturedTeamsSection();
    await loadWeatherWidget();
}

// Load Recent Events
async function loadRecentEvents() {
    const container = document.getElementById('recentEvents');
    if (!container) return;

    try {
        container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
        
        const events = await loadEvents();
        const recentEvents = events.slice(0, 3);
        
        if (recentEvents.length === 0) {
            container.innerHTML = '<p class="text-center">No recent events found.</p>';
            return;
        }
        
        container.innerHTML = recentEvents.map(event => createTimelineCard(event)).join('');
        
        // Add click handlers
        container.querySelectorAll('.timeline-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                showEventDetail(recentEvents[index]);
            });
        });
        
    } catch (error) {
        console.error('Error loading recent events:', error);
        container.innerHTML = '<p class="text-center">Error loading events. Please try again.</p>';
    }
}

// Load Featured Teams
async function loadFeaturedTeamsSection() {
    const container = document.getElementById('featuredTeams');
    if (!container) return;

    try {
        container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
        
        const teams = await loadFeaturedTeams();
        const featuredTeams = teams.slice(0, 6);
        
        if (featuredTeams.length === 0) {
            container.innerHTML = '<p class="text-center">No teams found.</p>';
            return;
        }
        
        container.innerHTML = featuredTeams.map(team => createTeamCard(team)).join('');
        
        // Add click handlers
        container.querySelectorAll('.team-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                window.location.href = `team-detail.html?id=${featuredTeams[index].id}`;
            });
        });
        
    } catch (error) {
        console.error('Error loading featured teams:', error);
        container.innerHTML = '<p class="text-center">Error loading teams. Please try again.</p>';
    }
}

// Create Timeline Card
function createTimelineCard(event) {
     return `
        <div class="timeline-card" data-id="${event.id}">
            <div class="timeline-card-header">
                <div class="timeline-year">${event.year}</div>
                <svg class="timeline-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 9l6 6 6-6"/>
                </svg>
            </div>
            <div class="timeline-image">


                ${event.image 
                    ? `<img src="${event.image}" alt="${event.title}" loading="lazy">` 
                    : `<svg class="timeline-image-placeholder" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="3" y1="9" x2="21" y2="9"/>
                        <line x1="9" y1="21" x2="9" y2="9"/>
                    </svg>`}
            </div>
            <div class="timeline-content">
                <h3 class="timeline-title">${event.title}</h3>
                <p class="timeline-description">${event.description}</p>
                ${event.team ? `<span class="timeline-team">${event.team}</span>` : ''}
            </div>
        </div>
    `;
}

// Create Team Card
function createTeamCard(team) {
    return `
        <div class="team-card" data-id="${team.id}">
            <div class="team-badge">
                ${team.badge 
                    ? `<img src="${team.badge}" alt="${team.name}" loading="lazy">` 
                    : `<svg class="team-badge-placeholder" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="10 8 16 12 10 16 10 8"></polygon>
                    </svg>`}
            </div>
            <h3 class="team-name">${team.name}</h3>
            <p class="team-stadium">${team.stadium || 'Stadium TBA'}</p>
            <p class="team-founded">Founded: ${team.founded || 'Unknown'}</p>
        </div>
    `;
}

// Show Event Detail
function showEventDetail(event) {
    // Simple modal implementation
    const message = `${event.title} (${event.year})\n\n${event.description}\n\nTeam: ${event.team || 'N/A'}\nType: ${event.type || 'Event'}`;
    alert(message);
    // TODO: Replace with proper modal component
}

// Load Weather Widget
async function loadWeatherWidget() {
    const container = document.getElementById('weatherWidget');
    if (!container) return;
    
    try {
        container.innerHTML = '<div class="weather-loading">☁️ Loading weather...</div>';
        
        const weather = await getWeatherData();
        
        container.innerHTML = `
            <div class="weather-widget">
                <div class="weather-header">
                    <h3>🌤️ Weather in ${weather.city}</h3>
                    <small>Current conditions</small>
                </div>
                <div class="weather-main">
                    <div class="weather-temp">
                        <span class="temp-value">${weather.temperature}°</span>
                        <span class="temp-unit">C</span>
                    </div>
                    <div class="weather-details">
                        <div class="weather-desc">${weather.description}</div>
                        <div class="weather-meta">
                            <span>💧 ${weather.humidity}%</span>
                            <span>💨 ${weather.windSpeed} m/s</span>
                        </div>
                    </div>
                </div>
                <div class="weather-footer">
                    <small>Perfect weather for football! ⚽</small>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading weather widget:', error);
        container.innerHTML = `
            <div class="weather-widget weather-error">
                <div class="weather-header">
                    <h3>🌤️ Weather in Kampala</h3>
                </div>
                <div class="weather-main">
                    <div class="weather-temp">
                        <span class="temp-value">26°</span>
                        <span class="temp-unit">C</span>
                    </div>
                    <div class="weather-details">
                        <div class="weather-desc">Partly cloudy</div>
                        <div class="weather-meta">
                            <span>💧 65%</span>
                            <span>💨 3.2 m/s</span>
                        </div>
                    </div>
                </div>
                <div class="weather-footer">
                    <small>Great day for football! ⚽</small>
                </div>
            </div>
        `;
    }
}
