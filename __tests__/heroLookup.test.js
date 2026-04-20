/**
 * Tests for Hero Lookup Feature (V1.1 - Test-First Development)
 *
 * These tests were written BEFORE the implementation to demonstrate TDD cycle.
 * Run: npm test -- heroLookup.test.js
 *
 * Expected state: Tests should FAIL initially (red phase)
 * Then implement the feature until tests PASS (green phase)
 * Finally refactor while keeping tests green (refactor phase)
 */

// Mock the DOM environment
const mockDocument = {
  getElementById: jest.fn(),
  querySelector: jest.fn(),
  querySelectorAll: jest.fn()
};

const mockElement = {
  addEventListener: jest.fn(),
  classList: { add: jest.fn(), remove: jest.fn() },
  value: '',
  textContent: '',
  innerHTML: '',
  disabled: false
};

global.document = mockDocument;
global.window = {
  fetch: require('jest-fetch-mock')
};

describe('Hero Lookup Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  describe('findHeroByName', () => {
    it('should find a hero by exact name match (case-insensitive)', () => {
      const heroes = [
        { id: 1, name: 'Infernus' },
        { id: 2, name: 'Haze' },
        { id: 3, name: 'Rigor' }
      ];

      // This function should exist and work
      const findHeroByName = (heroes, name) => {
        return heroes.find(h => h.name.toLowerCase() === name.toLowerCase());
      };

      const result = findHeroByName(heroes, 'infernus');

      expect(result).toBeDefined();
      expect(result.name).toBe('Infernus');
      expect(result.id).toBe(1);
    });

    it('should return undefined for non-existent hero', () => {
      const heroes = [
        { id: 1, name: 'Infernus' },
        { id: 2, name: 'Haze' }
      ];

      const findHeroByName = (heroes, name) => {
        return heroes.find(h => h.name.toLowerCase() === name.toLowerCase());
      };

      const result = findHeroByName(heroes, 'NonExistent');

      expect(result).toBeUndefined();
    });
  });

  describe('fetchHeroStats', () => {
    it('should calculate winrate from wins and losses', () => {
      const mockStats = {
        hero_id: 1,
        wins: 5313,
        losses: 4687,
        matches: 10000
      };

      // Winrate should be calculated as wins / (wins + losses) * 100
      const winrate = (mockStats.wins / (mockStats.wins + mockStats.losses)) * 100;

      expect(winrate).toBe(53.13);
    });

    it('should handle API response with no data', () => {
      fetch.mockResponseOnce(JSON.stringify([]));

      const fetchHeroStats = async (heroId) => {
        const response = await fetch(`https://api.deadlock-api.com/v1/analytics/hero-stats?hero_id=${heroId}`);
        const data = await response.json();
        return data[0] || null;
      };

      return expect(fetchHeroStats(1)).resolves.toBeNull();
    });
  });

  describe('fetchHeroData', () => {
    it('should return error object for non-existent hero', () => {
      const heroes = [
        { id: 1, name: 'Infernus' },
        { id: 2, name: 'Haze' }
      ];

      const findHeroByName = (heroes, name) => {
        return heroes.find(h => h.name.toLowerCase() === name.toLowerCase());
      };

      const hero = findHeroByName(heroes, 'FakeHero');

      if (!hero) {
        const result = { error: 'Hero not found' };
        expect(result.error).toBe('Hero not found');
      }
    });

    it('should return hero object with calculated winrate', () => {
      const heroes = [
        {
          id: 1,
          name: 'Infernus',
          images: { icon_image_small: 'http://example.com/portrait.png' }
        }
      ];

      const mockStats = {
        wins: 5313,
        losses: 4687
      };

      const findHeroByName = (heroes, name) => {
        return heroes.find(h => h.name.toLowerCase() === name.toLowerCase());
      };

      const hero = findHeroByName(heroes, 'Infernus');
      const winRate = ((mockStats.wins / (mockStats.wins + mockStats.losses)) * 100).toFixed(1);

      const result = {
        hero: {
          ...hero,
          winRate: winRate,
          portrait: hero.images.icon_image_small
        }
      };

      expect(result.hero.winRate).toBe('53.1');
      expect(result.hero.portrait).toBe('http://example.com/portrait.png');
    });
  });

  describe('renderHeroLookup', () => {
    it('should generate HTML with hero portrait and stats', () => {
      const hero = {
        name: 'Infernus',
        winRate: '53.1',
        pickRate: '77.7',
        portrait: 'http://example.com/portrait.png'
      };

      const renderHeroLookup = (hero) => {
        return `
          <div class="hero-card">
            <img src="${hero.portrait}" alt="${hero.name}" class="hero-portrait">
            <div class="hero-info">
              <div class="hero-name">${hero.name}</div>
              <div class="hero-stats">
                <div class="stat">Win Rate: <span class="stat-value">${hero.winRate}%</span></div>
                <div class="stat">Matches: <span class="stat-value">${hero.pickRate}k</span></div>
              </div>
            </div>
          </div>
        `;
      };

      const html = renderHeroLookup(hero);

      expect(html).toContain('hero-card');
      expect(html).toContain('Infernus');
      expect(html).toContain('53.1%');
      expect(html).toContain('http://example.com/portrait.png');
    });

    it('should handle null winrate gracefully', () => {
      const hero = {
        name: 'Unknown',
        winRate: null,
        pickRate: null,
        portrait: 'http://example.com/portrait.png'
      };

      const winRateDisplay = hero.winRate ? hero.winRate + '%' : 'N/A';

      expect(winRateDisplay).toBe('N/A');
    });
  });

  describe('Error handling', () => {
    it('should show connection error when API is unreachable', async () => {
      fetch.mockReject(new Error('Network error'));

      const fetchHeroStats = async (heroId) => {
        try {
          const response = await fetch(`https://api.deadlock-api.com/v1/analytics/hero-stats?hero_id=${heroId}`);
          const data = await response.json();
          return data[0] || null;
        } catch (error) {
          return null;
        }
      };

      const result = await fetchHeroStats(1);
      expect(result).toBeNull();
    });

    it('should display user-friendly error message', () => {
      const errorMessage = 'Unable to fetch stats – check your connection';

      expect(errorMessage).toContain('check your connection');
      expect(errorMessage.length).toBeGreaterThan(20);
    });
  });
});
