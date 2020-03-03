import { Resultset, Stock, UsedPart } from 'app/app.model';
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

    const ratio = Statistics.getRowRatio(usedParts, <Stock>{
      count: 1,
      id: 1,
      width: 250,
      height: 150,
      material: null
    });

    expect(ratio).toBe(0.9333333333333333);
  });
});
