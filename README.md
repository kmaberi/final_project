# Uganda Footy Hub ⚽

A comprehensive web application celebrating Uganda's football history, teams, and players.

## 📋 Project Information

- **Student**: Kenneth Maberi
- **Course**: WDD 330 - Web Frontend Development II
- **Term**: 2025 Term 5

## 🎯 Features

- **Interactive Timeline** - Explore Uganda's football history with visual cards
- **Team Profiles** - Detailed information about Ugandan football clubs
- **Player Profiles** - Biographies and career highlights
- **Search & Filter** - Quick search with decade/team/competition filters
- **Live Data** - Integration with TheSportsDB and News APIs
- **Favorites System** - Save your favorite teams, players, and events
- **Responsive Design** - Mobile-first approach with desktop optimization
- **Accessible** - ARIA labels, keyboard navigation, reduced-motion support

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (recommended: VS Code Live Server)
- API keys (optional, for live data):
  - TheSportsDB API key
  - News API key

### Installation

1. **Clone or download** this project to your local machine

2. **Organize the files** according to this structure:
   ```
   uganda-footy-hub/
   ├── index.html
   ├── timeline.html
   ├── teams.html (to be created)
   ├── team-detail.html (to be created)
   ├── players.html (to be created)
   ├── player-detail.html (to be created)
   ├── news.html (to be created)
   ├── about.html (to be created)
   ├── css/
   │   ├── base.css
   │   ├── layout.css
   │   └── components.css
   ├── js/
   │   ├── app.js
   │   ├── api.js
   │   ├── timeline.js
   │   ├── search.js
   │   ├── favorites.js
   │   └── teams.js (to be created)
   ├── data/
   │   └── events.json
   ├── images/
   │   ├── logo.svg (create your own)
   │   └── (add team badges and photos)
   ├── manifest.json
   └── README.md
   ```

3. **Add API keys** (optional):
   - Open `js/api.js`
   - Replace `YOUR_SPORTSDB_API_KEY_HERE` with your TheSportsDB API key
   - Replace `YOUR_NEWS_API_KEY_HERE` with your News API key

4. **Add logo image**:
   - Create or download a logo
   - Save as `images/logo.svg`
   - Or use any image format (update HTML accordingly)

5. **Start a local server**:
   - Using VS Code Live Server: Right-click `index.html` → "Open with Live Server"
   - Using Python: `python -m http.server 8000`
   - Using Node.js: `npx http-server`

6. **Open in browser**:
   - Navigate to `http://localhost:8000` (or your server's URL)

## 📁 File Structure

### HTML Files
- **index.html** - Homepage with hero, stats, and featured content
- **timeline.html** - Interactive timeline with filters
- **teams.html** - List of teams (to be created)
- **team-detail.html** - Individual team page (to be created)
- **players.html** - List of players (to be created)
- **player-detail.html** - Individual player page (to be created)
- **news.html** - News aggregation page (to be created)
- **about.html** - Credits and sources (to be created)

### CSS Files
- **css/base.css** - Base styles, typography, buttons, utilities
- **css/layout.css** - Layout components, navigation, grids
- **css/components.css** - UI components, cards, filters

### JavaScript Files
- **js/app.js** - Main application logic, home page functionality
- **js/api.js** - API integrations (TheSportsDB, News API, Wikipedia)
- **js/timeline.js** - Timeline page functionality with filters
- **js/search.js** - Search functionality across all content
- **js/favorites.js** - Favorites system (in-memory storage)
- **js/teams.js** - Teams page logic (to be created)

### Data Files
- **data/events.json** - Curated historical events (20 events included)

## 🎨 Design System

### Colors
- **Primary**: #003366 (Deep Blue)
- **Accent**: #E03A3C (Red)
- **Background**: #F6F7F9 (Light Gray)
- **Text**: #333333 (Dark Gray)

### Typography
- **Headings**: Montserrat (bold, 700)
- **Body**: Inter (regular, 400-600)

### Icons
- Inline SVG icons throughout the interface
- Lucide icon system (not required as dependency)

## 🔌 API Integration

### TheSportsDB API
- **Endpoint**: `https://www.thesportsdb.com/api/v1/json/{API_KEY}/`
- **Usage**: Team information, badges, stadiums
- **Get Key**: https://www.thesportsdb.com/api.php

### News API
- **Endpoint**: `https://newsapi.org/v2/`
- **Usage**: Latest Uganda football news
- **Get Key**: https://newsapi.org/

### Wikipedia API
- **Endpoint**: `https://en.wikipedia.org/w/api.php`
- **Usage**: Additional historical context
- **No Key Required**

## 💾 Data Storage

**Note**: This application uses **in-memory storage** instead of localStorage to ensure compatibility with the Claude.ai environment.

- Favorites are stored in JavaScript variables
- Data persists only during the current session
- No browser storage APIs are used

## 📱 Responsive Design

- **Mobile-first approach**
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1023px
  - Desktop: ≥ 1024px

## ♿ Accessibility Features

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Skip navigation links
- Focus indicators
- Reduced motion support via CSS

## 🧪 Testing

1. **Mobile Testing**: Use browser DevTools to test responsive views
2. **Browser Testing**: Test in Chrome, Firefox, Safari, Edge
3. **Accessibility**: Use Lighthouse or WAVE tools
4. **Performance**: Check load times and optimize images

## 🔧 Customization

### Adding New Events
Edit `data/events.json` and add new event objects:

```json
{
  "id": 21,
  "year": 2024,
  "title": "Your Event Title",
  "description": "Event description...",
  "image": null,
  "source": "Source name",
  "tags": ["tag1", "tag2"],
  "team": "Team Name",
  "type": "league"
}
```

### Adding Team Images
1. Place team badge images in `images/` folder
2. Update team data in `js/api.js` or fetch from API

### Customizing Colors
Edit CSS variables in `css/base.css`:

```css
:root {
    --primary-color: #your-color;
    --accent-color: #your-color;
}
```

## 📚 Resources & Credits

- **FUFA** - Uganda Football Federation
- **CAF** - Confederation of African Football
- **TheSportsDB** - Sports data API
- **News API** - News aggregation
- **Wikipedia** - Historical information

## 🐛 Known Issues

- News API requires valid key for live data
- Sample data is used when APIs are unavailable
- Some team badges may not be available
- Event images need to be added manually

## 🚧 Future Enhancements

- [ ] Add player profiles page
- [ ] Implement proper modal components
- [ ] Add photo gallery with lightbox
- [ ] Create team comparison feature
- [ ] Add match schedules and results
- [ ] Implement dark mode
- [ ] Add social sharing features
- [ ] Create admin panel for content management

## 📄 License

This project is for educational purposes as part of WDD 330 coursework.

## 👤 Author

**Kenneth Maberi**
- Course: WDD 330 - Web Frontend Development II
- Term: 2025 Term 5

## 🤝 Contributing

This is a student project. Feedback and suggestions are welcome!

---

**Built with ❤️ for Ugandan Football**