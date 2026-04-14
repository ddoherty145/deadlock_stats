### Project: Deadlock Stats Info Chrome Extension

### Overview
A Google Chrome extension that allows you to fetch info from the Deadlock API for quick and easy information. The extension provides a clean popup interface for fast hero (character) lookups with portraits, head-to-head winrate comparisons (positive/negative indicators), and the most-taken items per character.

## Technical Requirements
- Chrome Manifest V3 only.
- Popup-based UI (no content scripts that modify web pages).
- Uses the public Deadlock API[](https://deadlock-api.com/) for all hero, matchup, and item data.
- Data is fetched on-demand; optional localStorage caching for offline/repeat use is allowed but not required.

## Out of Scope / Negative Requirements
- Do NOT implement user authentication, Steam login, or player profile tracking.
- Do NOT add content scripts or inject anything into game/web pages.
- Do NOT support other browsers or mobile.
- Do NOT include real-time match tracking, leaderboards, or ability upgrade paths.
- Do NOT persist any data beyond localStorage (no external databases).

## Versioned Requirements
### v1.0 (MVP)
Core lookup, comparison, and item features with basic error handling.

### v1.1 (Refinements)
Caching, loading states, better error messages, input validation, and polish.

### v1.2 (Stretch)
Advanced filters (e.g., by patch/rank), export to clipboard, or dark/light theme toggle.

## Quality Gates
1. **Gate 1: Extension loads and basic UI renders**  
   Invocation: Open `chrome://extensions/`, enable Developer mode, click "Load unpacked" and select the built extension folder. Click the extension icon in the Chrome toolbar.  
   Success: Popup opens with no JavaScript console errors, displays a search input for characters plus navigation buttons for "Compare" and "Items". Layout is clean and all placeholders render.

2. **Gate 2: Character lookup with portraits**  
   Invocation: In the popup, type a valid hero name (e.g. "Infernus") and submit the search.  
   Success: Hero portrait image loads and displays, along with name and core stats (win rate, pick rate). No broken images or layout shifts.

3. **Gate 3: Winrate comparison**  
   Invocation: In the popup, select or enter two valid heroes (e.g. Infernus vs Haze) and trigger comparison.  
   Success: Displays the winrate percentage between the two heroes with a clear positive (>50%, green) or negative (<50%, red) indicator.

4. **Gate 4: Most-taken items per character**  
   Invocation: Search for a hero and switch to the "Items" section/tab.  
   Success: List of most-taken items for that hero appears with usage rate and winrate data from the API.

5. **Gate 5: Build + verification**  
   Invocation: Run `npm run build` (or equivalent build command) followed by manual testing of Gates 1–4.  
   Success: Build completes with exit code 0, no linting errors, and all previous gates pass.

## Acceptance Criteria
- Given the extension popup is open and an internet connection is available, when the user searches for a valid hero name, then the extension fetches data from the Deadlock API and displays the hero's portrait plus core stats.
- Given two valid hero names are selected, when the user requests a winrate comparison, then the extension displays the matchup winrate percentage with a positive or negative indicator.
- Given a valid hero is selected and the user views the Items section, then the extension displays the most frequently taken items for that hero with usage and winrate percentages.
- Given an invalid or non-existent hero name is entered, when the user submits the search, then a clear "Hero not found" error message is shown and the UI does not crash.
- Given the Deadlock API is unreachable (network error or offline), when any data fetch is attempted, then a user-friendly message such as "Unable to fetch stats – check your connection" is displayed instead of a blank screen or crash.