// API Integration - Uganda Footy Hub

// API Configuration
const API_CONFIG = {
    SPORTSDB_KEY: 'YOUR_SPORTSDB_API_KEY_HERE', // Get from https://www.thesportsdb.com/api.php
    NEWS_API_KEY: 'YOUR_NEWS_API_KEY_HERE', // Get from https://newsapi.org/
    WEATHER_API_KEY: 'YOUR_WEATHER_API_KEY_HERE', // Get from https://openweathermap.org/api
    SPORTSDB_URL: 'https://www.thesportsdb.com/api/v1/json',
    NEWS_API_URL: 'https://newsapi.org/v2',
    WIKIPEDIA_URL: 'https://en.wikipedia.org/w/api.php',
    WEATHER_API_URL: 'https://api.openweathermap.org/data/2.5'
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

// Load Teams from local JSON first, then API as fallback
export async function loadTeams() {
    // Check cache
    if (cache.teams && Date.now() - cache.timestamp.teams < CACHE_DURATION) {
        return cache.teams;
    }

    try {
        // First try loading from local JSON
        const response = await fetch('./data/teams.json');
        if (response.ok) {
            const data = await response.json();
            cache.teams = data.teams || [];
            cache.timestamp.teams = Date.now();
            return cache.teams;
        }
    } catch (error) {
        console.log('Local teams.json not available, trying API...');
    }

    try {
        // Fallback to TheSportsDB API
        const url = `${API_CONFIG.SPORTSDB_URL}/1/search_all_teams.php?c=Uganda`;
        const response = await fetch(url);
        
        if (response.ok) {
            const data = await response.json();
            cache.teams = data.teams || getSampleTeams();
            cache.timestamp.teams = Date.now();
            return cache.teams;
        }
    } catch (error) {
        console.log('API unavailable, using sample data');
    }

    // Final fallback to sample data
    cache.teams = getSampleTeams();
    cache.timestamp.teams = Date.now();
    return cache.teams;
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
            title: 'KCCA FC Wins Uganda Premier League Championship',
            description: 'KCCA FC secured their 13th Uganda Premier League title with a commanding performance throughout the season, celebrating their championship victory.',
            image: null,
            source: 'Uganda Football Federation',
            tags: ['league', 'championship'],
            team: 'KCCA FC',
            type: 'league'
        },
        {
            id: 2,
            year: 2022,
            title: 'Vipers SC Achieves Historic Double Victory',
            description: 'Vipers SC made history by winning both the Uganda Premier League and the Uganda Cup in the same season, achieving a remarkable double.',
            image: null,
            source: 'FUFA',
            tags: ['league', 'cup', 'double'],
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
            year: 2021,
            title: 'Express FC Returns to Premier League',
            description: 'Express FC made a triumphant return to the Uganda Premier League after successful promotion, marking the comeback of one of Uganda\'s most historic clubs.',
            image: null,
            source: 'FUFA',
            tags: ['promotion', 'return'],
            team: 'Express FC',
            type: 'league'
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
            id: 'kcca',
            name: 'KCCA FC',
            stadium: 'Phillip Omondi Stadium',
            founded: 1963,
            badge: 'images/teams/kccafc-badge.jpg',
            league: 'Uganda Premier League'
        },
        {
            id: 'vipers',
            name: 'Vipers SC',
            stadium: 'St. Mary\'s Stadium Kitende',
            founded: 2013,
            badge: 'images/teams/vipers-badge.png',
            league: 'Uganda Premier League'
        },
        {
            id: 'villa',
            name: 'SC Villa',
            stadium: 'Wankulukuku Stadium',
            founded: 1975,
            badge: 'images/teams/scvilla-badge.png',
            league: 'Uganda Premier League'
        },
        {
            id: 'express',
            name: 'Express FC',
            stadium: 'Wankulukuku Stadium',
            founded: 1957,
            badge: 'images/teams/express-badge.png',
            league: 'Uganda Premier League'
        },
        {
            id: 'ura',
            name: 'URA FC',
            stadium: 'Mandela National Stadium',
            founded: 1992,
            badge: 'images/teams/ura-badge.png',
            league: 'Uganda Premier League'
        },
        {
            id: 'updf',
            name: 'UPDF FC',
            stadium: 'Bombo Military Stadium',
            founded: 2007,
            badge: 'images/teams/updf-badge.png',
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

// Get Weather Data for Kampala (Uganda's capital)
export async function getWeatherData(city = 'Kampala,UG') {
    try {
        const url = `${API_CONFIG.WEATHER_API_URL}/weather?q=${city}&units=metric&appid=${API_CONFIG.WEATHER_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Weather data not available');
        }
        
        const data = await response.json();
        return {
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            city: data.name,
            country: data.sys.country
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Return sample weather data as fallback
        return getSampleWeatherData();
    }
}

// Get weather forecast
export async function getWeatherForecast(city = 'Kampala,UG') {
    try {
        const url = `${API_CONFIG.WEATHER_API_URL}/forecast?q=${city}&units=metric&cnt=5&appid=${API_CONFIG.WEATHER_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Weather forecast not available');
        }
        
        const data = await response.json();
        return data.list.map(item => ({
            time: new Date(item.dt * 1000).getHours() + ':00',
            temperature: Math.round(item.main.temp),
            description: item.weather[0].description,
            icon: item.weather[0].icon
        }));
    } catch (error) {
        console.error('Error fetching weather forecast:', error);
        return getSampleWeatherForecast();
    }
}

// Sample weather data
function getSampleWeatherData() {
    return {
        temperature: 26,
        description: 'partly cloudy',
        icon: '02d',
        humidity: 65,
        windSpeed: 3.2,
        city: 'Kampala',
        country: 'UG'
    };
}

function getSampleWeatherForecast() {
    return [
        { time: '12:00', temperature: 28, description: 'sunny', icon: '01d' },
        { time: '15:00', temperature: 30, description: 'partly cloudy', icon: '02d' },
        { time: '18:00', temperature: 27, description: 'cloudy', icon: '03d' },
        { time: '21:00', temperature: 24, description: 'partly cloudy', icon: '02n' },
        { time: '00:00', temperature: 22, description: 'clear', icon: '01n' }
    ];
}

// Export cache for debugging
export { cache };
