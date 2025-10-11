// Main Application - Uganda Footy Hub
import { loadEvents, loadFeaturedTeams } from './api.js';
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
}