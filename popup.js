// Deadlock API base URLs
const API_BASE = 'https://api.deadlock-api.com';
const ASSETS_BASE = 'https://assets.deadlock-api.com';

// Global caches
let heroesCache = null;
let itemsCache = null;

// DOM Elements
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('.section');

// Lookup section
const heroSearch = document.getElementById('hero-search');
const searchBtn = document.getElementById('search-btn');
const lookupResult = document.getElementById('lookup-result');

// Compare section
const hero1Input = document.getElementById('hero1-input');
const hero2Input = document.getElementById('hero2-input');
const compareBtn = document.getElementById('compare-btn');
const compareResult = document.getElementById('compare-result');

// Items section
const itemsHeroInput = document.getElementById('items-hero-input');
const itemsSearchBtn = document.getElementById('items-search-btn');
const itemsResult = document.getElementById('items-result');

// Error message
const errorMessage = document.getElementById('error-message');

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');

// Tab switching
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;

    // Update active tab
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Show corresponding section
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(`${tabName}-section`).classList.add('active');
  });
});

// Show error message
function showError(message) {
  errorMessage.innerHTML = `<span class="error-icon">&#9888;</span> ${message}`;
  errorMessage.classList.remove('hidden');
  setTimeout(() => {
    errorMessage.classList.add('hidden');
  }, 5000);
}

// Fetch and cache heroes list
async function fetchHeroesCache() {
  if (heroesCache) return heroesCache;

  try {
    const response = await fetch(`${ASSETS_BASE}/v2/heroes`);
    if (!response.ok) {
      throw new Error('Failed to fetch heroes data');
    }
    const data = await response.json();
    heroesCache = data.filter(h => h.player_selectable && !h.disabled && !h.in_development);
    return heroesCache;
  } catch (error) {
    throw new Error('Unable to fetch stats – check your connection');
  }
}

// Fetch and cache items list
async function fetchItemsCache() {
  if (itemsCache) return itemsCache;

  try {
    const response = await fetch(`${ASSETS_BASE}/v2/items`);
    if (!response.ok) {
      throw new Error('Failed to fetch items data');
    }
    const data = await response.json();
    itemsCache = data;
    return itemsCache;
  } catch (error) {
    throw new Error('Unable to fetch stats – check your connection');
  }
}

// Find hero by name
function findHeroByName(heroes, heroName) {
  return heroes.find(h => h.name.toLowerCase() === heroName.toLowerCase());
}

// Fetch hero stats from analytics API
async function fetchHeroStats(heroId) {
  try {
    const response = await fetch(`${API_BASE}/v1/analytics/hero-stats`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.find(s => s.hero_id === heroId) || null;
  } catch (error) {
    return null;
  }
}

// Fetch hero data by name
async function fetchHeroData(heroName) {
  try {
    const heroes = await fetchHeroesCache();
    const hero = findHeroByName(heroes, heroName);

    if (!hero) {
      return { error: 'Hero not found' };
    }

    // Fetch hero stats
    const stats = await fetchHeroStats(hero.id);

    // Calculate winrate from wins and losses (API doesn't return winrate directly)
    let winRate = null;
    let pickRate = null;
    if (stats && stats.matches > 0) {
      winRate = ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1);
      pickRate = (stats.matches / 1000).toFixed(1);
    }

    return {
      hero: {
        ...hero,
        winRate,
        pickRate,
        portrait: hero.images?.icon_image_small || hero.images?.icon_hero_card
      }
    };
  } catch (error) {
    return { error: 'Unable to fetch stats – check your connection' };
  }
}

// Fetch matchup data between two heroes
async function fetchMatchupData(hero1Name, hero2Name) {
  try {
    const heroes = await fetchHeroesCache();
    const hero1 = findHeroByName(heroes, hero1Name);
    const hero2 = findHeroByName(heroes, hero2Name);

    if (!hero1) {
      return { error: 'First hero not found' };
    }
    if (!hero2) {
      return { error: 'Second hero not found' };
    }

    // Fetch hero combo stats to find matchup data
    const response = await fetch(
      `${API_BASE}/v1/analytics/hero-comb-stats?hero_id=${hero1.id}&comb_size=2&min_matches=50`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch matchup data');
    }
    const combos = await response.json();

    // Find the specific matchup
    const matchup = combos.find(c =>
      (c.hero_ids[0] === hero1.id && c.hero_ids[1] === hero2.id) ||
      (c.hero_ids[0] === hero2.id && c.hero_ids[1] === hero1.id)
    );

    if (!matchup) {
      return { error: 'No matchup data available for these heroes' };
    }

    // Calculate winrate for hero1 against hero2
    const winrate = ((matchup.wins / matchup.matches) * 100).toFixed(1);

    return {
      matchup: { winrate },
      hero1Name: hero1.name,
      hero2Name: hero2.name
    };
  } catch (error) {
    return { error: 'Unable to fetch stats – check your connection' };
  }
}

// Fetch hero item stats (most taken items)
async function fetchHeroItemStats(heroId) {
  try {
    const response = await fetch(
      `${API_BASE}/v1/analytics/build-item-stats?hero_id=${heroId}`
    );
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}

// Fetch items data for a hero
async function fetchItemsData(heroName) {
  try {
    const heroes = await fetchHeroesCache();
    const hero = findHeroByName(heroes, heroName);

    if (!hero) {
      return { error: 'Hero not found' };
    }

    // Fetch hero item stats
    const itemStats = await fetchHeroItemStats(hero.id);

    // Get items cache for item details
    const items = await fetchItemsCache();

    // Create a map of item_id to item details
    const itemMap = {};
    items.forEach(item => {
      itemMap[item.id] = item;
    });

    // Map item stats to item details
    const heroItems = itemStats.map(stat => {
      const item = itemMap[stat.item_id];
      if (!item) return null;

      // Calculate usage rate relative to top item
      const usageRate = (stat.builds / (itemStats[0]?.builds || 1) * 100).toFixed(1);

      return {
        name: item.name,
        image: item.image,
        usageRate: usageRate,
        builds: stat.builds
      };
    }).filter(item => item && item.builds > 0);

    // Sort by builds and take top items
    const sortedItems = heroItems.sort((a, b) => b.builds - a.builds).slice(0, 8);

    return {
      hero: { name: hero.name },
      items: sortedItems
    };
  } catch (error) {
    return { error: 'Unable to fetch stats – check your connection' };
  }
}

// Render hero lookup result
function renderHeroLookup(hero) {
  lookupResult.innerHTML = `
    <div class="hero-card">
      <img src="${hero.portrait}" alt="${hero.name}" class="hero-portrait" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22><rect fill=%22%23333%22 width=%2280%22 height=%2280%22/><text fill=%22%23666%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>No Image</text></svg>'">
      <div class="hero-info">
        <div class="hero-name">${hero.name}</div>
        <div class="hero-stats">
          <div class="stat">Win Rate: <span class="stat-value">${hero.winRate ? hero.winRate + '%' : 'N/A'}</span></div>
          <div class="stat">Matches: <span class="stat-value">${hero.pickRate ? hero.pickRate + 'k' : 'N/A'}</span></div>
        </div>
      </div>
    </div>
  `;
}

// Render comparison result
function renderComparison(matchup, hero1Name, hero2Name) {
  const winrate = parseFloat(matchup.winrate);
  const isPositive = winrate > 50;

  compareResult.innerHTML = `
    <div class="compare-card">
      <div class="compare-heroes">
        <span>${hero1Name}</span>
        <span class="vs">vs</span>
        <span>${hero2Name}</span>
      </div>
      <div class="compare-winrate ${isPositive ? 'positive' : 'negative'}">
        ${matchup.winrate}%
      </div>
      <div class="compare-label">
        ${isPositive ? hero1Name + ' wins more' : hero2Name + ' wins more'}
      </div>
    </div>
  `;
}

// Render items list
function renderItems(hero, items) {
  if (!items || items.length === 0) {
    itemsResult.innerHTML = '<div class="no-data">No item data available for this hero</div>';
    return;
  }

  itemsResult.innerHTML = `
    <div class="items-list">
      ${items.map(item => `
        <div class="item-card">
          <img src="${item.image}" alt="${item.name}" class="item-icon" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22><rect fill=%22%23333%22 width=%2248%22 height=%2248%22/><text fill=%22%23666%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>?</text></svg>'">
          <div class="item-info">
            <div class="item-name">${item.name}</div>
            <div class="item-stats">
              Usage: ${item.usageRate}% | Builds: ${item.builds}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Search button click handler
searchBtn.addEventListener('click', async () => {
  const heroName = heroSearch.value.trim();
  if (!heroName) {
    showError('Please enter a hero name to search');
    return;
  }

  searchBtn.disabled = true;
  lookupResult.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <div class="loading-text">Searching for ${heroName}...</div>
    </div>
  `;

  const result = await fetchHeroData(heroName);
  searchBtn.disabled = false;

  if (result.error) {
    lookupResult.innerHTML = '<div class="no-data">' + result.error + '</div>';
    if (result.error.includes('connection')) {
      showError('Unable to connect to Deadlock API. Please check your internet connection.');
    } else if (result.error.includes('not found')) {
      showError('Hero not found. Please check the spelling and try again.');
    }
  } else {
    renderHeroLookup(result.hero);
  }
});

// Compare button click handler
compareBtn.addEventListener('click', async () => {
  const hero1 = hero1Input.value.trim();
  const hero2 = hero2Input.value.trim();

  if (!hero1 || !hero2) {
    showError('Please enter both hero names to compare');
    return;
  }

  compareBtn.disabled = true;
  compareResult.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <div class="loading-text">Fetching matchup data...</div>
    </div>
  `;

  const result = await fetchMatchupData(hero1, hero2);
  compareBtn.disabled = false;

  if (result.error) {
    compareResult.innerHTML = '<div class="no-data">' + result.error + '</div>';
    if (result.error.includes('connection')) {
      showError('Unable to connect to Deadlock API. Please check your internet connection.');
    } else if (result.error.includes('not found')) {
      showError('One or both heroes not found. Please check spelling and try again.');
    } else if (result.error.includes('matchup data')) {
      showError('No matchup data available. These heroes may not have enough recorded games.');
    }
  } else {
    renderComparison(result.matchup, result.hero1Name, result.hero2Name);
  }
});

// Items search button click handler
itemsSearchBtn.addEventListener('click', async () => {
  const heroName = itemsHeroInput.value.trim();
  if (!heroName) {
    showError('Please enter a hero name to view items');
    return;
  }

  itemsSearchBtn.disabled = true;
  itemsResult.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading item data for ${heroName}...</div>
    </div>
  `;

  const result = await fetchItemsData(heroName);
  itemsSearchBtn.disabled = false;

  if (result.error) {
    itemsResult.innerHTML = '<div class="no-data">' + result.error + '</div>';
    if (result.error.includes('connection')) {
      showError('Unable to connect to Deadlock API. Please check your internet connection.');
    } else if (result.error.includes('not found')) {
      showError('Hero not found. Please check the spelling and try again.');
    }
  } else {
    renderItems(result.hero, result.items);
  }
});

// Allow Enter key to submit
heroSearch.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchBtn.click();
});

hero1Input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') compareBtn.click();
});

hero2Input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') compareBtn.click();
});

itemsHeroInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') itemsSearchBtn.click();
});

// Theme toggle functionality
const THEME_KEY = 'deadlock-stats-theme';

// Initialize theme from localStorage or default to dark
const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  // Sun icon for light mode, moon icon for dark mode
  themeToggle.innerHTML = theme === 'light' ? '&#9790;' : '&#9728;';
}

// --- Clipboard Export (V1.3) ---

function formatHeroForClipboard(hero) {
  const winRate = hero.winRate ?? 'N/A';
  const matches = hero.matches ?? 'N/A';
  return `${hero.name} | Win Rate: ${winRate}% | Matches: ${matches}`;
}

function formatComparisonForClipboard(hero1, hero2, winrate) {
  const winner = parseFloat(winrate) > 50 ? hero1 : hero2;
  return `${hero1} vs ${hero2} | ${hero1} winrate: ${winrate}% | Favors: ${winner}`;
}

async function copyToClipboard(text) {
  if (!navigator.clipboard) {
    return { error: 'Clipboard not available' };
  }
  await navigator.clipboard.writeText(text);
}
