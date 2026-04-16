# Dead Stats - Chrome Extension

A Chrome extension for quick Deadlock hero lookups, matchup comparisons, and item data.

## Features

- **Hero Lookup** - Search for any hero to view their portrait, win rate, and match stats
- **Head-to-Head Comparison** - Compare two heroes and see their matchup win rate with color-coded indicators (green = favorable, red = unfavorable)
- **Most-Taken Items** - View the most frequently used items for any hero with usage percentages

## Installation

### From Chrome Web Store (Recommended)

Coming soon...

### Side-load for Testing

1. Download the latest release ZIP file
2. Extract the ZIP to a folder
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable **Developer mode** (toggle in top right)
5. Click **Load unpacked**
6. Select the extracted folder

## Usage

1. Click the Dead Stats icon in your Chrome toolbar
2. Use the tabs to switch between:
   - **Lookup** - Search for a hero by name
   - **Compare** - Enter two hero names to see their matchup stats
   - **Items** - View the most-taken items for a hero

## Data Source

All data is fetched from the [Deadlock API](https://deadlock-api.com/).

## Development

```bash
# Load the extension for development
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click Load unpacked
# 4. Select this folder
```

## Building

```bash
npm run build
```

## License

MIT
