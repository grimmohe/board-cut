import { Resultset } from 'app/app.model';
import { Statistics } from 'app/cut/statistics';

describe('Statistics', () => {
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

  it('should have updateStatistics Method', () => {
    const r: Resultset = { usedStock: [] };
    Statistics.updateStatistics(r);
  });

  it('should get me the stock area', () => {
    expect(Statistics.getStockArea(result.usedStock)).toBe(10000);
  });

  it('should get me the parts area', () => {
    expect(Statistics.getPartsArea(result.usedStock)).toBe(5000);
  });

  it('should get me the usage ratio', () => {
    expect(Statistics.getUsageRatio(10, 5)).toBe(0.5);
    expect(Statistics.getUsageRatio(10, 0)).toBe(0);
    expect(Statistics.getUsageRatio(10, 10)).toBe(1);
    expect(Statistics.getUsageRatio(10, 11)).toBe(1.1);
  });

  it('should create areas and ratio', () => {
    Statistics.updateStatistics(result);

    expect(result.partsArea).toBe(5000, 'parts');
    expect(result.stockArea).toBe(10000, 'stock');
    expect(result.usageRatio).toBe(0.5, 'ratio');
  });
});
