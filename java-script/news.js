// News Page - Uganda Footy Hub
import { loadNews, loadTeams } from './api.js';
import { initSearch } from './search.js';
import { initFavorites } from './favorites.js';

let allNews = [];
let filteredNews = [];
let currentCategory = 'all';
let currentPage = 1;
const newsPerPage = 9;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSearch();
    initFavorites();
    loadNewsData();
    initCategories();
    initNewsletter();
    loadSidebarContent();
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

// Load News Data
async function loadNewsData() {
    const loading = document.getElementById('newsLoading');

    try {
        if (loading) loading.style.display = 'flex';
        
        allNews = await loadNews();
        filteredNews = [...allNews];
        
        displayFeaturedPost();
        displayNewsGrid();
        
    } catch (error) {
        console.error('Error loading news:', error);
        showError();
    } finally {
        if (loading) loading.style.display = 'none';
    }
}

// Display Featured Post
function displayFeaturedPost() {
    const featuredContainer = document.getElementById('featuredPost');
    if (!featuredContainer || filteredNews.length === 0) return;

    const featured = filteredNews[0];

    featuredContainer.innerHTML = `
        <div class="featured-post-image">
            ${featured.urlToImage 
                ? `<img src="${featured.urlToImage}" alt="${featured.title}" loading="lazy">` 
                : '<div style="font-size: 4rem; color: #9ca3af;">📰</div>'
            }
            <div class="featured-badge">Featured</div>
        </div>
        <div class="featured-post-content">
            <div class="featured-post-meta">
                <span>📅 ${formatDate(featured.publishedAt)}</span>
                <span>📰 ${featured.source?.name || 'News Source'}</span>
            </div>
            <h2 class="featured-post-title">${featured.title}</h2>
            <p class="featured-post-excerpt">${featured.description || 'Read the full article for more details...'}</p>
            <a href="${featured.url}" target="_blank" class="read-more-btn">
                Read Full Article
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </a>
        </div>
    `;
}

// Display News Grid
function displayNewsGrid() {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;

    const startIndex = (currentPage - 1) * newsPerPage + 1; // Skip first one (featured)
    const endIndex = startIndex + newsPerPage;
    const newsToShow = filteredNews.slice(startIndex, endIndex);

    if (newsToShow.length === 0) {
        newsGrid.innerHTML = `
            <div class="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                </svg>
                <h3>No articles found</h3>
                <p>Try selecting a different category</p>
            </div>
        `;
        return;
    }

    newsGrid.innerHTML = newsToShow.map(article => createNewsCard(article)).join('');

    // Update load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        if (endIndex >= filteredNews.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.onclick = loadMoreNews;
        }
    }
}

// Create News Card
function createNewsCard(article) {
    return `
        <article class="news-card" onclick="window.open('${article.url}', '_blank')">
            <div class="news-card-image">
                ${article.urlToImage 
                    ? `<img src="${article.urlToImage}" alt="${article.title}" loading="lazy">` 
                    : '<div style="font-size: 3rem; color: #9ca3af;">📰</div>'
                }
                <div class="news-category-badge">${getCategoryFromArticle(article)}</div>
            </div>
            <div class="news-card-content">
                <div class="news-card-meta">
                    <span>📅 ${formatDate(article.publishedAt)}</span>
                    <span>📰 ${article.source?.name || 'Source'}</span>
                </div>
                <h3 class="news-card-title">${truncate(article.title, 80)}</h3>
                <p class="news-card-excerpt">${truncate(article.description || '', 120)}</p>
                <div class="news-card-footer">
                    <span class="news-source">${article.source?.name || 'News'}</span>
                    <div class="news-actions">
                        <button class="news-action-btn" onclick="event.stopPropagation(); shareArticle('${article.url}')" aria-label="Share">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
                        </button>
                        <button class="news-action-btn" onclick="event.stopPropagation(); bookmarkArticle(this)" aria-label="Bookmark">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    `;
}

// Initialize Categories
function initCategories() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            currentPage = 1;
            filterNewsByCategory();
        });
    });
}

// Filter News by Category
function filterNewsByCategory() {
    if (currentCategory === 'all') {
        filteredNews = [...allNews];
    } else {
        filteredNews = allNews.filter(article => {
            const title = article.title.toLowerCase();
            const description = (article.description || '').toLowerCase();
            const content = title + ' ' + description;

            switch (currentCategory) {
                case 'teams':
                    return content.includes('team') || content.includes('club') || content.includes('fc');
                case 'players':
                    return content.includes('player') || content.includes('striker') || content.includes('goalkeeper');
                case 'matches':
                    return content.includes('match') || content.includes('game') || content.includes('vs');
                case 'transfers':
                    return content.includes('transfer') || content.includes('sign') || content.includes('joined');
                case 'international':
                    return content.includes('international') || content.includes('world cup') || content.includes('afcon');
                default:
                    return true;
            }
        });
    }

    displayFeaturedPost();
    displayNewsGrid();
}

// Load More News
function loadMoreNews() {
    currentPage++;
    const newsGrid = document.getElementById('newsGrid');
    
    const startIndex = (currentPage - 1) * newsPerPage + 1;
    const endIndex = startIndex + newsPerPage;
    const newsToShow = filteredNews.slice(startIndex, endIndex);

    newsToShow.forEach(article => {
        const cardHTML = createNewsCard(article);
        newsGrid.insertAdjacentHTML('beforeend', cardHTML);
    });

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (endIndex >= filteredNews.length && loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
}

// Load Sidebar Content
async function loadSidebarContent() {
    loadTrendingTopics();
    await loadTopTeams();
}

// Load Trending Topics
function loadTrendingTopics() {
    const trendingList = document.getElementById('trendingList');
    if (!trendingList) return;

    const trending = [
        { title: 'KCCA FC wins crucial match', time: '2 hours ago' },
        { title: 'New signing announced', time: '5 hours ago' },
        { title: 'Uganda Cranes training camp', time: '1 day ago' },
        { title: 'League standings update', time: '2 days ago' },
        { title: 'Player of the month', time: '3 days ago' }
    ];

    trendingList.innerHTML = trending.map((item, index) => `
        <div class="trending-item">
            <div class="trending-number">${index + 1}</div>
            <div class="trending-content">
                <div class="trending-title">${item.title}</div>
                <div class="trending-meta">${item.time}</div>
            </div>
        </div>
    `).join('');
}

// Load Top Teams
async function loadTopTeams() {
    const topTeamsList = document.getElementById('topTeamsList');
    if (!topTeamsList) return;

    try {
        const teams = await loadTeams();
        const topTeams = teams.slice(0, 5);

        topTeamsList.innerHTML = topTeams.map((team, index) => `
            <div class="top-team-item" onclick="window.location.href='team-detail.html?id=${team.id}'">
                <div class="top-team-rank">${index + 1}</div>
                <div class="top-team-badge">
                    ${team.badge 
                        ? `<img src="${team.badge}" alt="${team.name}">` 
                        : '<div style="font-size: 1.5rem;">⚽</div>'
                    }
                </div>
                <div class="top-team-info">
                    <div class="top-team-name">${team.name}</div>
                    <div class="top-team-stats">${team.trophies || 0} trophies</div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading top teams:', error);
    }
}

// Initialize Newsletter
function initNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;

        if (!email) {
            alert('Please enter your email');
            return;
        }

        // Simulate newsletter subscription
        newsletterForm.innerHTML = `
            <div style="text-align: center; padding: 1rem;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #10b981; margin-bottom: 0.5rem;">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <p style="color: white; margin: 0;">Subscribed successfully!</p>
            </div>
        `;
    });
}

// Utility Functions
function formatDate(dateString) {
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

function truncate(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function getCategoryFromArticle(article) {
    const title = article.title.toLowerCase();
    if (title.includes('match') || title.includes('game')) return 'Match';
    if (title.includes('transfer')) return 'Transfer';
    if (title.includes('player')) return 'Player';
    return 'News';
}

// Global functions for onclick handlers
window.shareArticle = function(url) {
    if (navigator.share) {
        navigator.share({ url: url }).catch(err => console.log('Share failed:', err));
    } else {
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    }
};

window.bookmarkArticle = function(btn) {
    btn.classList.toggle('active');
    const svg = btn.querySelector('svg');
    if (btn.classList.contains('active')) {
        svg.setAttribute('fill', 'currentColor');
    } else {
        svg.setAttribute('fill', 'none');
    }
};

// Show Error
function showError() {
    const newsGrid = document.getElementById('newsGrid');
    if (newsGrid) {
        newsGrid.innerHTML = `
            <div class="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <h3>Error loading news</h3>
                <p>Please try again later</p>
            </div>
        `;
    }
}

// Export for debugging
export { allNews, filteredNews, currentCategory };