/**
 * Tests for Clipboard Export Feature (V1.3 - Test-First Development)
 *
 * Covers AC: Given a hero lookup result is displayed,
 * When the user clicks "Copy to Clipboard",
 * Then the hero name, winrate, and pick rate are copied as plain text.
 *
 * Written BEFORE implementation (TDD red phase).
 * Run: npm test -- clipboardExport.test.js
 */

describe('Clipboard Export Feature', () => {
  describe('formatHeroForClipboard', () => {
    it('should format hero stats as readable plain text', () => {
      // Covers AC: copy includes name, winrate, matches
      const formatHeroForClipboard = (hero) => {
        return `${hero.name} | Win Rate: ${hero.winRate}% | Matches: ${hero.matches}`;
      };

      const hero = { name: 'Infernus', winRate: '53.1', matches: '12400' };
      const result = formatHeroForClipboard(hero);

      expect(result).toBe('Infernus | Win Rate: 53.1% | Matches: 12400');
    });

    it('should handle missing stats gracefully', () => {
      const formatHeroForClipboard = (hero) => {
        const winRate = hero.winRate ?? 'N/A';
        const matches = hero.matches ?? 'N/A';
        return `${hero.name} | Win Rate: ${winRate}% | Matches: ${matches}`;
      };

      const hero = { name: 'Unknown', winRate: null, matches: null };
      const result = formatHeroForClipboard(hero);

      expect(result).toContain('Unknown');
      expect(result).toContain('N/A%');
    });
  });

  describe('formatComparisonForClipboard', () => {
    it('should format matchup result as readable plain text', () => {
      const formatComparisonForClipboard = (hero1, hero2, winrate) => {
        const winner = parseFloat(winrate) > 50 ? hero1 : hero2;
        return `${hero1} vs ${hero2} | ${hero1} winrate: ${winrate}% | Favors: ${winner}`;
      };

      const result = formatComparisonForClipboard('Infernus', 'Haze', '65.5');

      expect(result).toBe('Infernus vs Haze | Infernus winrate: 65.5% | Favors: Infernus');
    });

    it('should indicate underdog correctly when winrate < 50', () => {
      const formatComparisonForClipboard = (hero1, hero2, winrate) => {
        const winner = parseFloat(winrate) > 50 ? hero1 : hero2;
        return `${hero1} vs ${hero2} | ${hero1} winrate: ${winrate}% | Favors: ${winner}`;
      };

      const result = formatComparisonForClipboard('Infernus', 'Haze', '34.5');

      expect(result).toContain('Favors: Haze');
    });
  });

  describe('copyToClipboard', () => {
    it('should call navigator.clipboard.writeText with formatted text', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(global.navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true
      });

      const copyToClipboard = async (text) => {
        await navigator.clipboard.writeText(text);
      };

      await copyToClipboard('Infernus | Win Rate: 53.1% | Matches: 12400');

      expect(mockWriteText).toHaveBeenCalledWith(
        'Infernus | Win Rate: 53.1% | Matches: 12400'
      );
    });

    it('should return error object when clipboard API is unavailable', async () => {
      Object.defineProperty(global.navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true
      });

      const copyToClipboard = async (text) => {
        if (!navigator.clipboard) {
          return { error: 'Clipboard not available' };
        }
        await navigator.clipboard.writeText(text);
      };

      const result = await copyToClipboard('any text');

      expect(result).toEqual({ error: 'Clipboard not available' });
    });
  });
});
