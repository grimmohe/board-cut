import { Resultset } from 'app/app.model';
import { Statistics } from 'app/cut/statistics';

describe('Statistics', () => {
  let statistics: Statistics;

  const result: Resultset = {
    usedStock: [
      {
        stock: { count: 1, width: 100, height: 96, material: null, description: '' },
        usedParts: [
          {
            part: {
              count: 2,
              width: 50,
              height: 50,
              stock: null,
              followGrain: false,
              description: ''
            },
            turned: null,
            position: null
          },
          {
            part: {
              count: 2,
              width: 50,
              height: 50,
              stock: null,
              followGrain: false,
              description: ''
            },
            turned: null,
            position: null
          }
        ],
        usedArea: null
      },
      {
        stock: { count: 1, width: 20, height: 20, material: null, description: '' },
        usedParts: [],
        usedArea: null
      }
    ]
  };

  beforeEach(() => {
    statistics = new Statistics();
  });

  it('should be created', () => {
    expect(statistics).toBeTruthy();
  });

  it('should have updateStatistics Method', () => {
    const r: Resultset = { usedStock: [] };
    statistics.updateStatistics(r);
  });

  it('should get me the stock area', () => {
    expect(statistics.getStockArea(result.usedStock)).toBe(10000);
  });

  it('should get me the parts area', () => {
    expect(statistics.getPartsArea(result.usedStock)).toBe(5000);
  });

  it('should get me the usage ratio', () => {
    expect(statistics.getUsageRatio(10, 5)).toBe(0.5);
    expect(statistics.getUsageRatio(10, 0)).toBe(0);
    expect(statistics.getUsageRatio(10, 10)).toBe(1);
    expect(statistics.getUsageRatio(10, 11)).toBe(1.1);
  });

  it('should create areas and ratio', () => {
    statistics.updateStatistics(result);

    expect(result.partsArea).toBe(5000, 'parts');
    expect(result.stockArea).toBe(10000, 'stock');
    expect(result.usageRatio).toBe(0.5, 'ratio');
  });
});
