import { Resultset, UsedPart } from 'app/app.model';
import { Statistics } from 'app/cut/statistics';

describe('Statistics', () => {
  const result: Resultset = {
    usedStock: [
      {
        stock: { id: 0, count: 1, width: 100, height: 96, material: null },
        usedParts: [
          {
            part: {
              id: 0,
              count: 2,
              width: 50,
              height: 50,
              stock: null,
              followGrain: false
            },
            turned: null,
            position: null
          },
          {
            part: {
              id: 1,
              count: 2,
              width: 50,
              height: 50,
              stock: null,
              followGrain: false
            },
            turned: null,
            position: null
          }
        ],
        usedArea: null
      },
      {
        stock: { id: 1, count: 1, width: 20, height: 20, material: null },
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

  it('should get a row ratio', () => {
    const usedParts: UsedPart[] = [
      {
        part: {
          id: 0,
          count: 2,
          width: 50,
          height: 50,
          stock: null,
          followGrain: false
        },
        turned: null,
        position: { x: 0, y: 0 }
      },
      {
        part: {
          id: 1,
          count: 2,
          width: 50,
          height: 50,
          stock: null,
          followGrain: false
        },
        turned: null,
        position: { x: 50, y: 0 }
      },
      {
        part: {
          id: 2,
          count: 2,
          width: 50,
          height: 100,
          stock: null,
          followGrain: false
        },
        turned: null,
        position: { x: 100, y: 0 }
      }
    ];

    const ratio = Statistics.getRowRatio(usedParts, 0, 0);

    expect(ratio).toBe(0.6666666666666666);
  });
});
