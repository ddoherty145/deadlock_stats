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

## Scoped Instructions (Cursor Rules)

Project rules live in `.cursor/rules/` and are automatically applied:

| Rule file | Scope | Purpose |
|-----------|-------|---------|
| `project-conventions.mdc` | always | JS patterns, error handling, custom commands |
| `tdd-workflow.mdc` | always | Red→green→refactor cycle enforcement |
| `api-patterns.mdc` | `popup.js` only | Deadlock API endpoints and data transforms |

## MCP Protocol Integration

`.cursor/mcp.json` configures a **fetch MCP server** (`@modelcontextprotocol/server-fetch`) that lets the AI agent query the live Deadlock API during development — useful for inspecting response shapes and validating endpoint changes without leaving the editor.

```bash
# Verify MCP config is present
cat .cursor/mcp.json
```

## Workflow Commands
- `/task` — Break the request into a numbered todo list before writing any code. Use for anything touching 2+ files.
- `/fast` — Skip planning; implement the simplest solution immediately. Use for single-line fixes.
- `/remember` — Append the key decision or fact to CLAUDE.md under a "Session Notes" heading.

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
