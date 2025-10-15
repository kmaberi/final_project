// Mobile Menu and Search Functionality - Uganda Footy Hub

class MobileUI {
    constructor() {
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.mobileSearchToggle = document.getElementById('mobileSearchToggle');
        this.mobileSearchOverlay = document.getElementById('mobileSearchOverlay');
        this.closeSearch = document.getElementById('closeSearch');
        this.mobileSearch = document.getElementById('mobileSearch');
        
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupMobileSearch();
        this.setupOutsideClicks();
        this.setupKeyboardNavigation();
    }

    setupMobileMenu() {
        if (this.mobileMenuToggle && this.mobileMenu) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close menu when clicking on menu links
            const menuLinks = this.mobileMenu.querySelectorAll('.mobile-menu-link');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
        }
    }

    setupMobileSearch() {
        if (this.mobileSearchToggle && this.mobileSearchOverlay) {
            this.mobileSearchToggle.addEventListener('click', () => {
                this.openMobileSearch();
            });
        }

        if (this.closeSearch) {
            this.closeSearch.addEventListener('click', () => {
                this.closeMobileSearch();
            });
        }

        if (this.mobileSearch) {
            this.mobileSearch.addEventListener('input', (e) => {
                this.handleMobileSearch(e.target.value);
            });
        }
    }

    setupOutsideClicks() {
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.mobileMenu && this.mobileMenu.classList.contains('active')) {
                if (!this.mobileMenu.contains(e.target) && !this.mobileMenuToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            }
        });

        // Close mobile search when clicking outside
        if (this.mobileSearchOverlay) {
            this.mobileSearchOverlay.addEventListener('click', (e) => {
                if (e.target === this.mobileSearchOverlay) {
                    this.closeMobileSearch();
                }
            });
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.mobileMenu && this.mobileMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
                if (this.mobileSearchOverlay && this.mobileSearchOverlay.classList.contains('active')) {
                    this.closeMobileSearch();
                }
            }
        });
    }

    toggleMobileMenu() {
        if (this.mobileMenu.classList.contains('active')) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.mobileMenu.classList.add('active');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeMobileMenu() {
        this.mobileMenu.classList.remove('active');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Restore scrolling
    }

    openMobileSearch() {
        this.mobileSearchOverlay.classList.add('active');
        this.mobileSearch.focus();
        document.body.style.overflow = 'hidden';
    }

    closeMobileSearch() {
        this.mobileSearchOverlay.classList.remove('active');
        this.mobileSearch.value = '';
        this.clearSearchResults();
        document.body.style.overflow = '';
    }

    handleMobileSearch(query) {
        if (query.length < 2) {
            this.clearSearchResults();
            return;
        }

        // Simple search functionality
        this.performSearch(query);
    }

    async performSearch(query) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;

        try {
            // Show loading
            searchResults.innerHTML = `
                <div class="search-loading">
                    <div class="spinner"></div>
                    <p>Searching...</p>
                </div>
            `;

            // Simulate search (you can replace this with actual search logic)
            const results = await this.mockSearch(query);
            this.displaySearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            searchResults.innerHTML = `
                <div class="search-error">
                    <p>Search failed. Please try again.</p>
                </div>
            `;
        }
    }

    async mockSearch(query) {
        // Mock search data - replace with real search implementation
        const mockData = [
            { type: 'team', title: 'KCCA FC', description: 'Kampala Capital City Authority FC' },
            { type: 'team', title: 'Vipers SC', description: 'Vipers Sports Club' },
            { type: 'player', title: 'Denis Onyango', description: 'Goalkeeper, Mamelodi Sundowns' },
            { type: 'event', title: 'KCCA 2018 Champions', description: 'KCCA FC wins Uganda Premier League' },
        ];

        // Simple filter based on query
        return mockData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
    }

    displaySearchResults(results) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-empty">
                    <p>No results found</p>
                </div>
            `;
            return;
        }

        const resultsHTML = results.map(result => `
            <div class="search-result-item" data-type="${result.type}">
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-type">${result.type}</div>
                <div class="search-result-desc">${result.description}</div>
            </div>
        `).join('');

        searchResults.innerHTML = resultsHTML;

        // Add click handlers to results
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                this.handleSearchResultClick(item);
            });
        });
    }

    handleSearchResultClick(item) {
        const type = item.dataset.type;
        const title = item.querySelector('.search-result-title').textContent;
        
        // Navigate based on result type
        switch (type) {
            case 'team':
                window.location.href = `team-detail.html?team=${encodeURIComponent(title)}`;
                break;
            case 'player':
                window.location.href = `players.html?player=${encodeURIComponent(title)}`;
                break;
            case 'event':
                window.location.href = `timeline.html?search=${encodeURIComponent(title)}`;
                break;
            default:
                console.log('Clicked on:', title);
        }
        
        this.closeMobileSearch();
    }

    clearSearchResults() {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.innerHTML = '';
        }
    }
}

// Header scroll effects
class HeaderEffects {
    constructor() {
        this.header = document.querySelector('.desktop-header, .mobile-header');
        this.lastScrollY = window.scrollY;
        this.init();
    }

    init() {
        if (this.header) {
            window.addEventListener('scroll', this.handleScroll.bind(this));
        }
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        // Hide header on scroll down, show on scroll up
        if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
            this.header.classList.add('hidden');
        } else {
            this.header.classList.remove('hidden');
        }

        this.lastScrollY = currentScrollY;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileUI();
    new HeaderEffects();
});

export { MobileUI, HeaderEffects };