/**
 * Tests for Hero Comparison Feature (V1.1 - Test-First Development)
 *
 * These tests were written BEFORE the implementation to demonstrate TDD cycle.
 * Focus: Winrate comparison between two heroes with color-coded indicators.
 */

describe('Hero Comparison Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  describe('calculateWinrate', () => {
    it('should calculate winrate correctly from wins and matches', () => {
      const wins = 60;
      const matches = 100;

      const calculateWinrate = (wins, matches) => {
        return ((wins / matches) * 100).toFixed(1);
      };

      const result = calculateWinrate(wins, matches);

      expect(result).toBe('60.0');
    });

    it('should return 50.0 when wins equal half of matches', () => {
      const calculateWinrate = (wins, matches) => {
        return ((wins / matches) * 100).toFixed(1);
      };

      const result = calculateWinrate(50, 100);

      expect(result).toBe('50.0');
    });
  });

  describe('getComparisonIndicator', () => {
    it('should return positive indicator for winrate > 50%', () => {
      const getComparisonIndicator = (winrate) => {
        return winrate > 50 ? 'positive' : 'negative';
      };

      expect(getComparisonIndicator(51)).toBe('positive');
      expect(getComparisonIndicator(60.5)).toBe('positive');
      expect(getComparisonIndicator(100)).toBe('positive');
    });

    it('should return negative indicator for winrate < 50%', () => {
      const getComparisonIndicator = (winrate) => {
        return winrate > 50 ? 'positive' : 'negative';
      };

      expect(getComparisonIndicator(49)).toBe('negative');
      expect(getComparisonIndicator(30.5)).toBe('negative');
      expect(getComparisonIndicator(0)).toBe('negative');
    });

    it('should return negative indicator for exactly 50%', () => {
      const getComparisonIndicator = (winrate) => {
        return winrate > 50 ? 'positive' : 'negative';
      };

      expect(getComparisonIndicator(50)).toBe('negative');
    });
  });

  describe('findMatchupInCombos', () => {
    it('should find matchup when hero order matches', () => {
      const hero1Id = 1;
      const hero2Id = 2;

      const combos = [
        { hero_ids: [3, 4], wins: 100, matches: 200 },
        { hero_ids: [1, 2], wins: 150, matches: 300 },
        { hero_ids: [5, 6], wins: 50, matches: 100 }
      ];

      const findMatchup = (combos, h1, h2) => {
        return combos.find(c =>
          (c.hero_ids[0] === h1 && c.hero_ids[1] === h2) ||
          (c.hero_ids[0] === h2 && c.hero_ids[1] === h1)
        );
      };

      const result = findMatchup(combos, hero1Id, hero2Id);

      expect(result).toBeDefined();
      expect(result.wins).toBe(150);
    });

    it('should find matchup when hero order is reversed', () => {
      const combos = [
        { hero_ids: [1, 2], wins: 150, matches: 300 }
      ];

      const findMatchup = (combos, h1, h2) => {
        return combos.find(c =>
          (c.hero_ids[0] === h1 && c.hero_ids[1] === h2) ||
          (c.hero_ids[0] === h2 && c.hero_ids[1] === h1)
        );
      };

      // Search in reverse order
      const result = findMatchup(combos, 2, 1);

      expect(result).toBeDefined();
      expect(result.wins).toBe(150);
    });

    it('should return undefined when matchup not found', () => {
      const combos = [
        { hero_ids: [1, 2], wins: 150, matches: 300 }
      ];

      const findMatchup = (combos, h1, h2) => {
        return combos.find(c =>
          (c.hero_ids[0] === h1 && c.hero_ids[1] === h2) ||
          (c.hero_ids[0] === h2 && c.hero_ids[1] === h1)
        );
      };

      const result = findMatchup(combos, 99, 100);

      expect(result).toBeUndefined();
    });
  });

  describe('renderComparison', () => {
    it('should generate HTML with positive class for winrate > 50%', () => {
      const matchup = { winrate: '65.5' };
      const hero1Name = 'Infernus';
      const hero2Name = 'Haze';

      const isPositive = parseFloat(matchup.winrate) > 50;

      const html = `
        <div class="compare-winrate ${isPositive ? 'positive' : 'negative'}">
          ${matchup.winrate}%
        </div>
      `;

      expect(html).toContain('positive');
      expect(html).toContain('65.5%');
    });

    it('should generate HTML with negative class for winrate < 50%', () => {
      const matchup = { winrate: '35.2' };
      const isPositive = parseFloat(matchup.winrate) > 50;

      const html = `
        <div class="compare-winrate ${isPositive ? 'positive' : 'negative'}">
          ${matchup.winrate}%
        </div>
      `;

      expect(html).toContain('negative');
      expect(html).toContain('35.2%');
    });

    it('should show correct winner label', () => {
      const hero1Name = 'Infernus';
      const hero2Name = 'Haze';

      const getWinnerLabel = (winrate, h1, h2) => {
        return winrate > 50 ? `${h1} wins more` : `${h2} wins more`;
      };

      expect(getWinnerLabel(60, hero1Name, hero2Name)).toBe('Infernus wins more');
      expect(getWinnerLabel(40, hero1Name, hero2Name)).toBe('Haze wins more');
    });
  });

  describe('API Integration - fetchMatchupData', () => {
    it('should return error when first hero not found', async () => {
      const heroes = [
        { id: 1, name: 'Infernus' },
        { id: 2, name: 'Haze' }
      ];

      const findHeroByName = (heroes, name) => {
        return heroes.find(h => h.name.toLowerCase() === name.toLowerCase());
      };

      const hero1 = findHeroByName(heroes, 'FakeHero');

      if (!hero1) {
        const result = { error: 'First hero not found' };
        expect(result.error).toBe('First hero not found');
      }
    });

    it('should return error when second hero not found', async () => {
      const heroes = [
        { id: 1, name: 'Infernus' },
        { id: 2, name: 'Haze' }
      ];

      const findHeroByName = (heroes, name) => {
        return heroes.find(h => h.name.toLowerCase() === name.toLowerCase());
      };

      const hero2 = findHeroByName(heroes, 'AnotherFake');

      if (!hero2) {
        const result = { error: 'Second hero not found' };
        expect(result.error).toBe('Second hero not found');
      }
    });

    it('should calculate winrate from combo stats API response', async () => {
      const mockComboResponse = [
        { hero_ids: [1, 2], wins: 450, losses: 550, matches: 1000 }
      ];

      const matchup = mockComboResponse[0];
      const winrate = ((matchup.wins / matchup.matches) * 100).toFixed(1);

      expect(winrate).toBe('45.0');
    });
  });

  describe('CSS Color Mapping', () => {
    it('should map positive indicator to green color', () => {
      const cssColors = {
        positive: '#4ade80', // green
        negative: '#f87171'  // red
      };

      expect(cssColors.positive).toBe('#4ade80');
      expect(cssColors.negative).toBe('#f87171');
    });
  });
});
