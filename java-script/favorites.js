// Favorites System - Uganda Footy Hub
// Uses in-memory storage instead of localStorage

let favoritesData = {
    teams: [],
    players: [],
    events: []
};

// Initialize Favorites
export function initFavorites() {
    // Setup favorites button
    const favoritesBtn = document.getElementById('favoritesBtn');
    if (favoritesBtn) {
        favoritesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showFavoritesModal();
        });
    }
    
    // Update favorites count badge
    updateFavoritesBadge();
}

// Add to Favorites
export function addToFavorites(type, item) {
    if (!favoritesData[type]) {
        console.error('Invalid favorites type:', type);
        return false;
    }
    
    // Check if already in favorites
    const exists = favoritesData[type].some(fav => fav.id === item.id);
    if (exists) {
        console.log('Item already in favorites');
        return false;
    }
    
    // Add to favorites
    favoritesData[type].push({
        id: item.id,
        ...item,
        addedAt: new Date().toISOString()
    });
    
    updateFavoritesBadge();
    showNotification(`Added to favorites!`);
    return true;
}

// Remove from Favorites
export function removeFromFavorites(type, itemId) {
    if (!favoritesData[type]) {
        console.error('Invalid favorites type:', type);
        return false;
    }
    
    const index = favoritesData[type].findIndex(fav => fav.id === itemId);
    if (index === -1) {
        console.log('Item not in favorites');
        return false;
    }
    
    favoritesData[type].splice(index, 1);
    updateFavoritesBadge();
    showNotification(`Removed from favorites`);
    return true;
}

// Check if in Favorites
export function isInFavorites(type, itemId) {
    if (!favoritesData[type]) return false;
    return favoritesData[type].some(fav => fav.id === itemId);
}

// Get All Favorites
export function getAllFavorites() {
    return {
        teams: [...favoritesData.teams],
        players: [...favoritesData.players],
        events: [...favoritesData.events]
    };
}

// Get Favorites Count
export function getFavoritesCount() {
    return favoritesData.teams.length + 
           favoritesData.players.length + 
           favoritesData.events.length;
}

// Update Favorites Badge
function updateFavoritesBadge() {
    const count = getFavoritesCount();
    const badge = document.querySelector('.favorites-badge');
    
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Show Favorites Modal
function showFavoritesModal() {
    const favorites = getAllFavorites();
    const totalCount = getFavoritesCount();
    
    if (totalCount === 0) {
        alert('No favorites yet!\n\nStart adding teams, players, or events to your favorites.');
        return;
    }
    
    let message = '📌 YOUR FAVORITES\n\n';
    
    if (favorites.teams.length > 0) {
        message += `⚽ TEAMS (${favorites.teams.length}):\n`;
        favorites.teams.forEach(team => {
            message += `• ${team.name}\n`;
        });
        message += '\n';
    }
    
    if (favorites.players.length > 0) {
        message += `👤 PLAYERS (${favorites.players.length}):\n`;
        favorites.players.forEach(player => {
            message += `• ${player.name}\n`;
        });
        message += '\n';
    }
    
    if (favorites.events.length > 0) {
        message += `📅 EVENTS (${favorites.events.length}):\n`;
        favorites.events.forEach(event => {
            message += `• ${event.title} (${event.year})\n`;
        });
    }
    
    alert(message);
    // TODO: Replace with proper modal component
}

// Show Notification
function showNotification(message) {
    // Simple notification - can be enhanced with a toast component
    console.log('Notification:', message);
    
    // Create temporary notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideUp 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Create Favorite Button
export function createFavoriteButton(type, item) {
    const isFavorite = isInFavorites(type, item.id);
    
    const button = document.createElement('button');
    button.className = `favorite-btn ${isFavorite ? 'active' : ''}`;
    button.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
    `;
    
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isInFavorites(type, item.id)) {
            removeFromFavorites(type, item.id);
            button.classList.remove('active');
            button.querySelector('svg').setAttribute('fill', 'none');
        } else {
            addToFavorites(type, item);
            button.classList.add('active');
            button.querySelector('svg').setAttribute('fill', 'currentColor');
        }
    });
    
    return button;
}

// Clear All Favorites
export function clearAllFavorites() {
    if (confirm('Are you sure you want to clear all favorites?')) {
        favoritesData = {
            teams: [],
            players: [],
            events: []
        };
        updateFavoritesBadge();
        showNotification('All favorites cleared');
        return true;
    }
    return false;
}

// Export favorites data for debugging
export { favoritesData };