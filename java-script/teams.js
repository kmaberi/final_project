// Teams Page - Uganda Footy Hub
import { loadTeams } from './api.js';
import { initSearch } from './search.js';
import { initFavorites, createFavoriteButton } from './favorites.js';

let allTeams = [];
let filteredTeams = [];
let currentView = 'grid';
let currentSort = 'name';
let currentLeague = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSearch();
    initFavorites();
    loadTeamsData();
    initControls();
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

// Load Teams Data
async function loadTeamsData() {
    const container = document.getElementById('teamsContainer');
    const loading = document.getElementById('teamsLoading');

    try {
        if (loading) loading.style.display = 'flex';
        
        allTeams = await loadTeams();
        filteredTeams = [...allTeams];
        
        applySort();
        displayTeams();
        
    } catch (error) {
        console.error('Error loading teams:', error);
        if (container) {
            container.innerHTML = '<p class="text-center">Error loading teams. Please try again.</p>';
        }
    } finally {
        if (loading) loading.style.display = 'none';
    }
}

// Initialize Controls
function initControls() {
    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            displayTeams();
        });
    });

    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            applySort();
            displayTeams();
        });
    }

    // League filters
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentLeague = chip.dataset.league;
            applyFilters();
            displayTeams();
        });
    });
}

// Apply Filters
function applyFilters() {
    if (currentLeague === 'all') {
        filteredTeams = [...allTeams];
    } else {
        filteredTeams = allTeams.filter(team => {
            // Filter logic based on league
            return team.league && team.league.toLowerCase().includes(currentLeague);
        });
    }
    applySort();
}

// Apply Sort
function applySort() {
    filteredTeams.sort((a, b) => {
        switch (currentSort) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'founded':
                return (parseInt(a.founded) || 0) - (parseInt(b.founded) || 0);
            case 'trophies':
                return (b.trophies || 0) - (a.trophies || 0);
            default:
                return 0;
        }
    });
}

// Display Teams
function displayTeams() {
    const container = document.getElementById('teamsContainer');
    if (!container) return;

    // Update container class
    container.className = `teams-container ${currentView}-view`;

    if (filteredTeams.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3>No teams found</h3>
                <p>Try adjusting your filters</p>
            </div>
        `;
        return;
    }

    if (currentView === 'grid') {
        container.innerHTML = filteredTeams.map(team => createTeamCardGrid(team)).join('');
    } else {
        container.innerHTML = filteredTeams.map(team => createTeamCardList(team)).join('');
    }

    // Add event listeners
    container.querySelectorAll('[data-team-id]').forEach((card, index) => {
        const team = filteredTeams[index];
        
        // Add favorite button
        const favoriteBtn = createFavoriteButton('teams', team);
        card.appendChild(favoriteBtn);
        
        // Add click handler
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-btn')) {
                window.location.href = `team-detail.html?id=${team.id}`;
            }
        });
    });
}

// Create Team Card (Grid View)
function createTeamCardGrid(team) {
    return `
        <div class="team-card-grid" data-team-id="${team.id}">
            <div class="team-badge-container">
                ${team.badge 
                    ? `<img src="${team.badge}" alt="${team.name}" loading="lazy">` 
                    : `<svg class="team-badge-placeholder" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="10 8 16 12 10 16 10 8"></polygon>
                    </svg>`
                }
            </div>
            <h3>${team.name}</h3>
            <div class="team-meta-info">
                <span>🏟️ ${team.stadium || 'Stadium TBA'}</span>
                <span>📅 Est. ${team.founded || 'Unknown'}</span>
            </div>
            <div class="team-stats-inline">
                <div class="team-stat-item">
                    <span class="team-stat-value">${team.trophies || 0}</span>
                    <span class="team-stat-label">Trophies</span>
                </div>
                <div class="team-stat-item">
                    <span class="team-stat-value">${team.players || 25}</span>
                    <span class="team-stat-label">Players</span>
                </div>
            </div>
        </div>
    `;
}

// Create Team Card (List View)
function createTeamCardList(team) {
    return `
        <div class="team-card-list" data-team-id="${team.id}">
            <div class="team-badge-list">
                ${team.badge 
                    ? `<img src="${team.badge}" alt="${team.name}" loading="lazy">` 
                    : `<svg class="team-badge-placeholder" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="10 8 16 12 10 16 10 8"></polygon>
                    </svg>`
                }
            </div>
            <div class="team-card-list-content">
                <h3>${team.name}</h3>
                <div class="team-meta-info">
                    <span>🏟️ ${team.stadium || 'Stadium TBA'}</span>
                    <span>📅 Est. ${team.founded || 'Unknown'}</span>
                    <span>🏆 ${team.trophies || 0} Trophies</span>
                </div>
            </div>
            <div class="team-card-list-actions">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </div>
        </div>
    `;
}

// Export for debugging
export { allTeams, filteredTeams };