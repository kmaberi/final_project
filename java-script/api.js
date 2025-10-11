// API Integration - Uganda Footy Hub

// API Configuration
const API_CONFIG = {
    SPORTSDB_KEY: 'YOUR_SPORTSDB_API_KEY_HERE', // Get from https://www.thesportsdb.com/api.php
    NEWS_API_KEY: 'YOUR_NEWS_API_KEY_HERE', // Get from https://newsapi.org/
    SPORTSDB_URL: 'https://www.thesportsdb.com/api/v1/json',
    NEWS_API_URL: 'https://newsapi.org/v2',
    WIKIPEDIA_URL: 'https://en.wikipedia.org/w/api.php'
};

// Cache for API responses
const cache = {
    events: null,
    teams: null,
    news: null,
    timestamp: {}
};

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Load Events from local JSON
export async function loadEvents() {
    // Check cache
    if (cache.events && Date.now() - cache.timestamp.events < CACHE_DURATION) {
        return cache.events;
    }

    try {
        const response = await fetch('./data/events.json');
        if (!response.ok) {
            throw new Error('Failed to load events');
        }
        const data = await response.json();
        cache.events = data.events || [];
        cache.timestamp.events = Date.now();
        return cache.events;
    } catch (error) {
        console.error('Error loading events:', error);
        // Return sample data if JSON fails
        return getSampleEvents();
    }
}

// Load Teams from TheSportsDB
export async function loadTeams() {
    // Check cache
    if (cache.teams && Date.now() - cache.timestamp.teams < CACHE_DURATION) {
        return cache.teams;
    }

    try {
        // Using TheSportsDB API - search for Ugandan teams
        const url = `${API_CONFIG.SPORTSDB_URL}/${API_CONFIG.SPORTSDB_KEY}/search_all_teams.php?c=Uganda`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to load teams from API');
        }
        
        const data = await response.json();
        cache.teams = data.teams || getSampleTeams();
        cache.timestamp.teams = Date.now();
        return cache.teams;
    } catch (error) {
        console.error('Error loading teams:', error);
        // Return sample data if API fails
        return getSampleTeams();
    }
}

// Load Featured Teams
export async function loadFeaturedTeams() {
    const teams = await loadTeams();
    return teams.slice(0, 6);
}

// Load News from News API
export async function loadNews() {
    // Check cache
    if (cache.news && Date.now() - cache.timestamp.news < CACHE_DURATION) {
        return cache.news;
    }

    try {
        const url = `${API_CONFIG.NEWS_API_URL}/everything?q=Uganda+football&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_CONFIG.NEWS_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to load news');
        }
        
        const data = await response.json();
        cache.news = data.articles || getSampleNews();
        cache.timestamp.news = Date.now();
        return cache.news;
    } catch (error) {
        console.error('Error loading news:', error);
        return getSampleNews();
    }
}

// Search Wikipedia for additional information
export async function searchWikipedia(query) {
    try {
        const url = `${API_CONFIG.WIKIPEDIA_URL}?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Wikipedia search failed');
        }
        
        const data = await response.json();
        return data.query.search || [];
    } catch (error) {
        console.error('Error searching Wikipedia:', error);
        return [];
    }
}

// Get Wikipedia page content
export async function getWikipediaContent(pageId) {
    try {
        const url = `${API_CONFIG.WIKIPEDIA_URL}?action=query&pageids=${pageId}&prop=extracts|pageimages&exintro=true&explaintext=true&format=json&origin=*`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to get Wikipedia content');
        }
        
        const data = await response.json();
        return data.query.pages[pageId] || null;
    } catch (error) {
        console.error('Error getting Wikipedia content:', error);
        return null;
    }
}

// Sample Data Functions
function getSampleEvents() {
    return [
        {
            id: 1,
            year: 2023,
            title: 'KCCA FC Wins Uganda Premier League',
            description: 'KCCA FC secured their 13th Uganda Premier League title with a commanding performance throughout the season.',
            image: null,
            source: 'Uganda Football Federation',
            tags: ['league', 'championship'],
            team: 'KCCA FC',
            type: 'league'
        },
        {
            id: 2,
            year: 2020,
            title: 'Vipers SC Dominates Local Football',
            description: 'Vipers SC established themselves as the dominant force in Ugandan football, winning multiple titles.',
            image: null,
            source: 'FUFA',
            tags: ['league', 'success'],
            team: 'Vipers SC',
            type: 'league'
        },
        {
            id: 3,
            year: 2018,
            title: 'Uganda Cranes Qualifies for AFCON',
            description: 'The Uganda Cranes national team qualified for the Africa Cup of Nations, marking a significant achievement.',
            image: null,
            source: 'CAF',
            tags: ['international', 'qualification'],
            team: 'Uganda Cranes',
            type: 'international'
        },
        {
            id: 4,
            year: 2015,
            title: 'KCCA FC Continental Success',
            description: 'KCCA FC made history with impressive performances in CAF Champions League.',
            image: null,
            source: 'CAF',
            tags: ['international', 'achievement'],
            team: 'KCCA FC',
            type: 'international'
        },
        {
            id: 5,
            year: 2010,
            title: 'Express FC Wins Uganda Cup',
            description: 'Express FC lifted the prestigious Uganda Cup trophy in a thrilling final.',
            image: null,
            source: 'FUFA',
            tags: ['cup', 'victory'],
            team: 'Express FC',
            type: 'cup'
        },
        {
            id: 6,
            year: 2005,
            title: 'SC Villa Revival Season',
            description: 'SC Villa experienced a revival with strong performances and fan engagement.',
            image: null,
            source: 'Local Media',
            tags: ['league', 'comeback'],
            team: 'SC Villa',
            type: 'league'
        }
    ];
}

function getSampleTeams() {
    return [
        {
            id: 1,
            name: 'KCCA FC',
            stadium: 'Phillip Omondi Stadium',
            founded: '1963',
            badge: null,
            league: 'Uganda Premier League'
        },
        {
            id: 2,
            name: 'Vipers SC',
            stadium: 'St. Mary\'s Stadium',
            founded: '2013',
            badge: null,
            league: 'Uganda Premier League'
        },
        {
            id: 3,
            name: 'SC Villa',
            stadium: 'Mandela National Stadium',
            founded: '1975',
            badge: null,
            league: 'Uganda Premier League'
        },
        {
            id: 4,
            name: 'Express FC',
            stadium: 'Wankulukuku Stadium',
            founded: '1957',
            badge: null,
            league: 'Uganda Premier League'
        },
        {
            id: 5,
            name: 'URA FC',
            stadium: 'Mehta Stadium',
            founded: '1992',
            badge: null,
            league: 'Uganda Premier League'
        },
        {
            id: 6,
            name: 'UPDF FC',
            stadium: 'Bombo Military Barracks',
            founded: '2006',
            badge: null,
            league: 'Uganda Premier League'
        }
    ];
}

function getSampleNews() {
    return [
        {
            title: 'Uganda Premier League Season Preview',
            description: 'An exciting season ahead for Ugandan football with strong competition expected.',
            url: '#',
            publishedAt: new Date().toISOString(),
            source: { name: 'Uganda Sports' }
        },
        {
            title: 'KCCA FC Signs New Players',
            description: 'KCCA FC announces major signings ahead of the new season.',
            url: '#',
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
            source: { name: 'Football Uganda' }
        },
        {
            title: 'Uganda Cranes Training Camp Begins',
            description: 'National team starts preparations for upcoming international fixtures.',
            url: '#',
            publishedAt: new Date(Date.now() - 172800000).toISOString(),
            source: { name: 'FUFA Media' }
        }
    ];
}

// Export cache for debugging
export { cache };