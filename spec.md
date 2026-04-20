# Deadlock Stats Info Chrome Extension

## Overview
A Google Chrome extension that allows you to fetch info from the Deadlock API for quick and easy information. The extension provides a clean popup interface for fast hero (character) lookups with portraits, head-to-head winrate comparisons (positive/negative indicators), and the most-taken items per character.

## Technical Requirements
- Chrome Manifest V3 only
- Popup-based UI (no content scripts that modify web pages)
- Uses the public Deadlock API (https://deadlock-api.com/) for all hero, matchup, and item data
- Data is fetched on-demand; optional localStorage caching for offline/repeat use is allowed but not required

## Out of Scope / Negative Requirements
- Do NOT implement user authentication, Steam login, or player profile tracking
- Do NOT add content scripts or inject anything into game/web pages
- Do NOT support other browsers or mobile
- Do NOT include real-time match tracking, leaderboards, or ability upgrade paths
- Do NOT persist any data beyond localStorage (no external databases)

## Versioned Requirements

### v1.0 (MVP)
Core lookup, comparison, and item features with basic error handling.

### v1.1 (Refinements)
Caching, loading states, better error messages, input validation, and polish.

### v1.2 (Stretch)
Advanced filters (e.g., by patch/rank), export to clipboard, or dark/light theme toggle.

---

## Quality Gates

### Gate 1: Extension loads and basic UI renders
**Invocation:** Open `chrome://extensions/`, enable Developer mode, click "Load unpacked" and select the built extension folder. Click the extension icon in the Chrome toolbar.

**Success Criteria:**
- Popup opens with no JavaScript console errors
- Displays a search input for characters
- Displays navigation buttons for "Compare" and "Items"
- Layout is clean and all placeholders render

### Gate 2: Character lookup with portraits
**Invocation:** In the popup, type a valid hero name (e.g. "Infernus") and submit the search.

**Success Criteria:**
- Hero portrait image loads and displays
- Hero name is shown
- Core stats (win rate, match count) are displayed
- No broken images or layout shifts

### Gate 3: Winrate comparison
**Invocation:** In the popup, enter two valid hero names (e.g. "Infernus" and "Haze") and trigger comparison.

**Success Criteria:**
- Displays the winrate percentage between the two heroes
- Winrate > 50% shown in green (positive indicator)
- Winrate < 50% shown in red (negative indicator)

### Gate 4: Most-taken items per character
**Invocation:** Search for a hero and switch to the "Items" section/tab.

**Success Criteria:**
- List of most-taken items for that hero appears
- Each item shows usage rate percentage
- Items are sorted by frequency (most used first)

### Gate 5: Build + verification
**Invocation:** Run `npm run build` followed by manual testing of Gates 1-4.

**Success Criteria:**
- Build completes with exit code 0
- No linting errors
- All previous gates (1-4) pass

---

## Acceptance Criteria

### AC-1: Hero Lookup
**Given** the extension popup is open and an internet connection is available,
**When** the user searches for a valid hero name,
**Then** the extension fetches data from the Deadlock API and displays the hero's portrait plus core stats.

### AC-2: Head-to-Head Comparison
**Given** two valid hero names are selected,
**When** the user requests a winrate comparison,
**Then** the extension displays the matchup winrate percentage with a positive (green, >50%) or negative (red, <50%) indicator.

### AC-3: Hero Items Display
**Given** a valid hero is selected and the user views the Items section,
**Then** the extension displays the most frequently taken items for that hero with usage percentages.

### AC-4: Invalid Hero Handling
**Given** an invalid or non-existent hero name is entered,
**When** the user submits the search,
**Then** a clear "Hero not found" error message is shown and the UI does not crash.

### AC-5: Network Error Handling
**Given** the Deadlock API is unreachable (network error or offline),
**When** any data fetch is attempted,
**Then** a user-friendly message such as "Unable to fetch stats – check your connection" is displayed instead of a blank screen or crash.

### AC-6: Tab Navigation
**Given** the extension popup is open,
**When** the user clicks on different tabs (Lookup, Compare, Items),
**Then** the corresponding section is displayed and the active tab is visually highlighted.

### AC-7: Enter Key Submission
**Given** the user is typing in any input field,
**When** they press the Enter key,
**Then** the search/comparison is submitted without requiring a mouse click.
