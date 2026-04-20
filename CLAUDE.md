# Dead Stats - Chrome Extension

## Tech Stack
- **Chrome Manifest V3** - Extension manifest format
- **Vanilla JavaScript** - No frameworks, ES6+ syntax
- **HTML5/CSS3** - Popup-based UI
- **Deadlock API** - Public API at https://api.deadlock-api.com

## Project Structure
```
deadlock_stats/
├── manifest.json      # Chrome extension configuration
├── popup.html         # Extension popup UI
├── popup.css          # Styling
├── popup.js           # Main extension logic
├── icons/             # Extension icons (16, 48, 128 px)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── CLAUDE.md          # This file
├── spec.md            # Requirements and quality gates
├── package.json       # npm configuration
└── README.md          # User documentation
```

## Development Commands
```bash
# Validate JavaScript syntax
node --check popup.js

# Build (package extension)
npm run build

# Test API endpoints
curl https://api.deadlock-api.com/v1/analytics/hero-stats?hero_id=1
```

## Code Conventions
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Error Handling**: Return `{ error: 'message' }` objects, show user-friendly messages
- **API Calls**: Use async/await, always handle network errors
- **Caching**: Store frequently-used data (heroes list) in module-level variables
- **Comments**: Document non-obvious logic, especially API response transformations

## Testing Expectations
- **Unit Tests**: Jest framework for API response parsing, data transformation
- **Integration Tests**: Test full feature flows (lookup, compare, items)
- **Manual Tests**: Quality gates defined in spec.md require Chrome extension testing
- **Test-First**: Write failing tests before implementation (TDD cycle)

## Workflow Commands
- `/task` - Create a new task for complex multi-step work
- `/fast` - Use faster response mode for simple queries
- `/remember` - Save context for future conversations

## API Endpoints Used
- `GET /v1/analytics/hero-stats` - Hero statistics (wins, losses, matches)
- `GET /v1/analytics/hero-comb-stats` - Head-to-head matchup data
- `GET /v1/analytics/build-item-stats` - Most-taken items per hero
- `GET /v2/heroes` - Hero metadata (names, portraits) from assets
- `GET /v2/items` - Item metadata from assets

## Known Limitations
- No item winrate data available per hero (API limitation)
- Matchup data requires minimum 50 matches to be returned
- Heroes must be player_selectable and not in development
