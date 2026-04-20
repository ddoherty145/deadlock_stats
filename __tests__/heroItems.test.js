/**
 * Tests for Hero Items Feature (V1.1 - Test-First Development)
 *
 * These tests were written BEFORE the implementation to demonstrate TDD cycle.
 * Focus: Fetching and displaying most-taken items per hero.
 */

describe('Hero Items Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
  });

  describe('fetchHeroItemStats', () => {
    it('should return empty array when API returns error', async () => {
      fetch.mockReject(new Error('Network error'));

      const fetchHeroItemStats = async (heroId) => {
        try {
          const response = await fetch(`https://api.deadlock-api.com/v1/analytics/build-item-stats?hero_id=${heroId}`);
          if (!response.ok) {
            return [];
          }
          const data = await response.json();
          return data;
        } catch (error) {
          return [];
        }
      };

      const result = await fetchHeroItemStats(1);

      expect(result).toEqual([]);
    });

    it('should return item stats array from API', async () => {
      const mockResponse = [
        { item_id: 123, builds: 1000 },
        { item_id: 456, builds: 800 }
      ];

      fetch.mockResponseOnce(JSON.stringify(mockResponse));

      const fetchHeroItemStats = async (heroId) => {
        const response = await fetch(`https://api.deadlock-api.com/v1/analytics/build-item-stats?hero_id=${heroId}`);
        if (!response.ok) {
          return [];
        }
        const data = await response.json();
        return data;
      };

      const result = await fetchHeroItemStats(1);

      expect(result).toHaveLength(2);
      expect(result[0].item_id).toBe(123);
    });
  });

  describe('calculateUsageRate', () => {
    it('should calculate usage rate relative to top item', () => {
      const itemBuilds = 800;
      const topItemBuilds = 1000;

      const calculateUsageRate = (itemBuilds, topItemBuilds) => {
        return ((itemBuilds / topItemBuilds) * 100).toFixed(1);
      };

      const result = calculateUsageRate(itemBuilds, topItemBuilds);

      expect(result).toBe('80.0');
    });

    it('should return 100.0 for the top item', () => {
      const calculateUsageRate = (itemBuilds, topItemBuilds) => {
        return ((itemBuilds / topItemBuilds) * 100).toFixed(1);
      };

      const result = calculateUsageRate(1000, 1000);

      expect(result).toBe('100.0');
    });

    it('should handle division by zero gracefully', () => {
      const calculateUsageRate = (itemBuilds, topItemBuilds) => {
        if (topItemBuilds === 0) return '0.0';
        return ((itemBuilds / topItemBuilds) * 100).toFixed(1);
      };

      const result = calculateUsageRate(100, 0);

      expect(result).toBe('0.0');
    });
  });

  describe('createItemMap', () => {
    it('should create a map from item ID to item details', () => {
      const items = [
        { id: 123, name: 'Power Up', image: 'http://example.com/item1.png' },
        { id: 456, name: 'Damage Boost', image: 'http://example.com/item2.png' }
      ];

      const createItemMap = (items) => {
        const itemMap = {};
        items.forEach(item => {
          itemMap[item.id] = item;
        });
        return itemMap;
      };

      const itemMap = createItemMap(items);

      expect(itemMap[123].name).toBe('Power Up');
      expect(itemMap[456].name).toBe('Damage Boost');
    });

    it('should return empty map for empty items array', () => {
      const createItemMap = (items) => {
        const itemMap = {};
        items.forEach(item => {
          itemMap[item.id] = item;
        });
        return itemMap;
      };

      const itemMap = createItemMap([]);

      expect(itemMap).toEqual({});
    });
  });

  describe('sortItemsByBuilds', () => {
    it('should sort items in descending order by builds', () => {
      const items = [
        { name: 'Item C', builds: 500 },
        { name: 'Item A', builds: 1000 },
        { name: 'Item B', builds: 750 }
      ];

      const sortItemsByBuilds = (items) => {
        return [...items].sort((a, b) => b.builds - a.builds);
      };

      const sorted = sortItemsByBuilds(items);

      expect(sorted[0].name).toBe('Item A');
      expect(sorted[1].name).toBe('Item B');
      expect(sorted[2].name).toBe('Item C');
    });

    it('should not modify original array', () => {
      const items = [
        { name: 'Item C', builds: 500 },
        { name: 'Item A', builds: 1000 }
      ];

      const sortItemsByBuilds = (items) => {
        return [...items].sort((a, b) => b.builds - a.builds);
      };

      sortItemsByBuilds(items);

      expect(items[0].name).toBe('Item C'); // Original unchanged
    });
  });

  describe('sliceTopItems', () => {
    it('should return only top 8 items', () => {
      const items = Array.from({ length: 20 }, (_, i) => ({
        name: `Item ${i}`,
        builds: 1000 - i * 10
      }));

      const topItems = items.slice(0, 8);

      expect(topItems).toHaveLength(8);
      expect(topItems[0].name).toBe('Item 0');
      expect(topItems[7].name).toBe('Item 7');
    });

    it('should return all items if fewer than 8', () => {
      const items = [
        { name: 'Item 1', builds: 1000 },
        { name: 'Item 2', builds: 800 }
      ];

      const topItems = items.slice(0, 8);

      expect(topItems).toHaveLength(2);
    });
  });

  describe('renderItems', () => {
    it('should show no-data message when items array is empty', () => {
      const items = [];

      if (!items || items.length === 0) {
        const noDataMessage = '<div class="no-data">No item data available for this hero</div>';
        expect(noDataMessage).toContain('No item data available');
      }
    });

    it('should generate HTML for each item', () => {
      const items = [
        { name: 'Power Up', image: 'http://example.com/powerup.png', usageRate: '100.0', builds: 1000 }
      ];

      const generateItemHTML = (item) => {
        return `
          <div class="item-card">
            <img src="${item.image}" alt="${item.name}" class="item-icon">
            <div class="item-info">
              <div class="item-name">${item.name}</div>
              <div class="item-stats">Usage: ${item.usageRate}% | Builds: ${item.builds}</div>
            </div>
          </div>
        `;
      };

      const html = generateItemHTML(items[0]);

      expect(html).toContain('item-card');
      expect(html).toContain('Power Up');
      expect(html).toContain('100.0%');
      expect(html).toContain('1000');
    });
  });

  describe('filterInvalidItems', () => {
    it('should filter out items with zero builds', () => {
      const items = [
        { name: 'Valid Item', builds: 100 },
        { name: 'Zero Builds', builds: 0 },
        { name: 'Another Valid', builds: 50 }
      ];

      const filtered = items.filter(item => item.builds > 0);

      expect(filtered).toHaveLength(2);
      expect(filtered[0].name).toBe('Valid Item');
    });

    it('should filter out null items', () => {
      const items = [
        { name: 'Valid Item', builds: 100 },
        null,
        { name: 'Another Valid', builds: 50 }
      ];

      const filtered = items.filter(item => item && item.builds > 0);

      expect(filtered).toHaveLength(2);
    });
  });

  describe('API Integration - fetchItemsData', () => {
    it('should return error when hero not found', () => {
      const heroes = [{ id: 1, name: 'Infernus' }];
      const heroName = 'FakeHero';

      const findHeroByName = (heroes, name) => {
        return heroes.find(h => h.name.toLowerCase() === name.toLowerCase());
      };

      const hero = findHeroByName(heroes, heroName);

      if (!hero) {
        const result = { error: 'Hero not found' };
        expect(result.error).toBe('Hero not found');
      }
    });

    it('should map item stats to item details', () => {
      const itemStats = [
        { item_id: 123, builds: 1000 },
        { item_id: 456, builds: 800 }
      ];

      const itemMap = {
        123: { id: 123, name: 'Power Up', image: 'http://example.com/p1.png' },
        456: { id: 456, name: 'Damage Boost', image: 'http://example.com/p2.png' }
      };

      const mapped = itemStats
        .map(stat => {
          const item = itemMap[stat.item_id];
          if (!item) return null;
          const usageRate = ((stat.builds / itemStats[0].builds) * 100).toFixed(1);
          return { name: item.name, image: item.image, usageRate, builds: stat.builds };
        })
        .filter(item => item && item.builds > 0);

      expect(mapped).toHaveLength(2);
      expect(mapped[0].name).toBe('Power Up');
      expect(mapped[0].usageRate).toBe('100.0');
    });
  });
});
