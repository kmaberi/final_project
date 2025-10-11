// Team Detail Page - Uganda Footy Hub
import { loadTeams } from './api.js';
import { initSearch } from './search.js';
import { initFavorites, createFavoriteButton, isInFavorites } from './favorites.js';

let currentTeam = null;
let comments = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSearch();
    initFavorites();
    loadTeamData();
    initTabs();
    initComments();
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
}

// Load Team Data
async function loadTeamData() {
    const urlParams = new URLSearchParams(window.location.search);
    const teamId = urlParams.get('id');

    if (!teamId) {
        showError('No team ID provided');
        return;
    }

    try {
        const teams = await loadTeams();
        currentTeam = teams.find(t => t.id == teamId);

        if (!currentTeam) {
            showError('Team not found');
            return;
        }

        displayTeamInfo();
        displayTeamStats();
        displayOverview();
        displayHistory();
        displayPlayers();
        setupFavoriteButton();
        setupShareButton();

    } catch (error) {
        console.error('Error loading team:', error);
        showError('Error loading team data');
    }
}

// Display Team Info
function displayTeamInfo() {
    document.getElementById('teamName').textContent = currentTeam.name;
    document.getElementById('mobileTeamName').textContent = currentTeam.name;
    document.getElementById('teamFounded').textContent = `Est. ${currentTeam.founded || 'Unknown'}`;
    document.getElementById('teamStadium').textContent = currentTeam.stadium || 'Stadium TBA';

    // Badge
    const badgeContainer = document.getElementById('teamBadge');
    if (currentTeam.badge) {
        badgeContainer.innerHTML = `<img src="${currentTeam.badge}" alt="${currentTeam.name}">`;
    }

    // Update page title
    document.title = `${currentTeam.name} - Uganda Footy Hub`;
}

// Display Team Stats
function displayTeamStats() {
    document.getElementById('statTrophies').textContent = currentTeam.trophies || '0';
    document.getElementById('statPlayers').textContent = currentTeam.players || '25';
    document.getElementById('statMatches').textContent = currentTeam.matches || '0';
    document.getElementById('statGoals').textContent = currentTeam.goals || '0';
}

// Display Overview Tab
function displayOverview() {
    const description = currentTeam.description || 
        `${currentTeam.name} is one of Uganda's premier football clubs. Founded in ${currentTeam.founded || 'the early years'}, the club has been a cornerstone of Ugandan football, competing in the top leagues and producing talented players who have represented both club and country with distinction.`;
    
    document.getElementById('teamDescription').textContent = description;

    // Achievements
    const achievementsList = document.getElementById('achievementsList');
    const achievements = currentTeam.achievements || [
        { year: 2023, title: 'League Runner-up', icon: '🥈' },
        { year: 2022, title: 'Cup Finalist', icon: '🏆' },
        { year: 2021, title: 'League Champion', icon: '🥇' }
    ];

    achievementsList.innerHTML = achievements.map(achievement => `
        <div class="achievement-item">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <h4>${achievement.title}</h4>
                <p>${achievement.year}</p>
            </div>
        </div>
    `).join('');

    // Stadium Info
    document.getElementById('stadiumName').textContent = currentTeam.stadium || 'N/A';
    document.getElementById('stadiumCapacity').textContent = currentTeam.capacity || 'N/A';
    document.getElementById('stadiumLocation').textContent = currentTeam.location || 'Kampala, Uganda';
}

// Display History Tab
function displayHistory() {
    const historyTimeline = document.getElementById('historyTimeline');
    const history = currentTeam.history || [
        { year: 2020, event: 'Promoted to Premier League' },
        { year: 2018, event: 'Won Regional Championship' },
        { year: 2015, event: 'Club Restructuring and Rebranding' },
        { year: 2010, event: 'Youth Academy Established' },
        { year: currentTeam.founded || 2000, event: 'Club Founded' }
    ];

    historyTimeline.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-year">${item.year}</div>
            <div class="history-description">${item.event}</div>
        </div>
    `).join('');
}

// Display Players Tab
function displayPlayers() {
    const playersGrid = document.getElementById('playersGrid');
    const players = currentTeam.squad || [
        { id: 1, name: 'Player 1', position: 'Forward' },
        { id: 2, name: 'Player 2', position: 'Midfielder' },
        { id: 3, name: 'Player 3', position: 'Defender' },
        { id: 4, name: 'Player 4', position: 'Goalkeeper' },
        { id: 5, name: 'Player 5', position: 'Forward' },
        { id: 6, name: 'Player 6', position: 'Midfielder' }
    ];

    playersGrid.innerHTML = players.map(player => `
        <div class="player-card" data-player-id="${player.id}">
            <div class="player-avatar">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </div>
            <div class="player-name">${player.name}</div>
            <div class="player-position">${player.position}</div>
        </div>
    `).join('');

    // Add click handlers
    playersGrid.querySelectorAll('.player-card').forEach(card => {
        card.addEventListener('click', () => {
            const playerId = card.dataset.playerId;
            window.location.href = `player-detail.html?id=${playerId}`;
        });
    });
}

// Initialize Tabs
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all tabs
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

            // Add active to clicked tab
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Setup Favorite Button
function setupFavoriteButton() {
    const favoriteBtn = document.getElementById('favoriteTeamBtn');
    if (!favoriteBtn || !currentTeam) return;

    const isFavorite = isInFavorites('teams', currentTeam.id);
    updateFavoriteButton(favoriteBtn, isFavorite);

    favoriteBtn.addEventListener('click', () => {
        const { addToFavorites, removeFromFavorites } = require('./favorites.js');
        const currentlyFavorite = isInFavorites('teams', currentTeam.id);
        
        if (currentlyFavorite) {
            removeFromFavorites('teams', currentTeam.id);
            updateFavoriteButton(favoriteBtn, false);
        } else {
            addToFavorites('teams', currentTeam);
            updateFavoriteButton(favoriteBtn, true);
        }
    });
}

function updateFavoriteButton(btn, isFavorite) {
    if (isFavorite) {
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            Remove from Favorites
        `;
        btn.classList.add('btn-accent');
        btn.classList.remove('btn-primary');
    } else {
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            Add to Favorites
        `;
        btn.classList.add('btn-primary');
        btn.classList.remove('btn-accent');
    }
}

// Setup Share Button
function setupShareButton() {
    const shareBtn = document.getElementById('shareTeamBtn') || document.getElementById('shareBtn');
    if (!shareBtn || !currentTeam) return;

    shareBtn.addEventListener('click', () => {
        const shareData = {
            title: currentTeam.name,
            text: `Check out ${currentTeam.name} on Uganda Footy Hub!`,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData).catch(err => console.log('Error sharing:', err));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    });
}

// Initialize Comments
function initComments() {
    const submitBtn = document.getElementById('submitComment');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', () => {
        const commentText = document.getElementById('commentText');
        if (!commentText || !commentText.value.trim()) {
            alert('Please enter a comment');
            return;
        }

        addComment(commentText.value.trim());
        commentText.value = '';
    });

    loadComments();
}

// Load Comments
function loadComments() {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;

    if (comments.length === 0) {
        commentsList.innerHTML = `
            <div class="empty-state">
                <p>No comments yet. Be the first to comment!</p>
            </div>
        `;
        return;
    }

    commentsList.innerHTML = comments.map(comment => createCommentHTML(comment)).join('');

    // Add like handlers
    commentsList.querySelectorAll('.comment-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.toggle('active');
            const likesSpan = btn.querySelector('span');
            let likes = parseInt(likesSpan.textContent) || 0;
            likesSpan.textContent = btn.classList.contains('active') ? likes + 1 : likes - 1;
        });
    });
}

// Add Comment
function addComment(text) {
    const newComment = {
        id: Date.now(),
        author: 'Current User',
        text: text,
        time: 'Just now',
        likes: 0
    };

    comments.unshift(newComment);
    loadComments();
    showNotification('Comment posted successfully!');
}

// Create Comment HTML
function createCommentHTML(comment) {
    const initials = comment.author.split(' ').map(n => n[0]).join('').toUpperCase();
    
    return `
        <div class="comment-item">
            <div class="comment-header">
                <div class="comment-avatar">${initials}</div>
                <div class="comment-author-info">
                    <div class="comment-author">${comment.author}</div>
                    <div class="comment-time">${comment.time}</div>
                </div>
            </div>
            <div class="comment-text">${comment.text}</div>
            <div class="comment-actions">
                <button class="comment-action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>${comment.likes}</span>
                </button>
                <button class="comment-action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Reply
                </button>
            </div>
        </div>
    `;
}

// Show Error
function showError(message) {
    const container = document.querySelector('.container');
    if (container) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <h3>${message}</h3>
                <p><a href="teams.html">Back to Teams</a></p>
            </div>
        `;
    }
}

// Show Notification
function showNotification(message) {
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
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

// Export for debugging
export { currentTeam, comments };