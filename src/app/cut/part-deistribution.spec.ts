import { Part, Stock, UsedStock } from 'app/app.model';
import { PartDistribution } from 'app/cut/part-distribution';
import { UsedAreaCalculation } from 'app/cut/used-area-calculation';

describe('PartDistribution', () => {
  it('should fit part into top left corner', () => {
    const stock: Stock = { count: 1, width: 10, height: 10, material: null };
    const usedStock: UsedStock = { stock: stock, usedParts: [], usedArea: { x: 0, y: 0 } };
    const part: Part = {
      count: 1,
      width: 5,
      height: 5,
      stock: stock,
      followGrain: false,
      description: ''
    };

    const result = PartDistribution.fitPartOntoStock(stock, usedStock, part);

    expect(result).toBeTruthy();
    expect(result.position.x).toBe(0, 'x');
    expect(result.position.y).toBe(0, 'y');
    expect(result.turned).toBeFalsy('turned');
    expect(result.usable).toBeTruthy('usable');
  });

  it('should fit part into top right corner', () => {
    const stock: Stock = {
      count: 1,
      width: 10,
      height: 10,
      material: { cuttingWidth: 1, thickness: 2 },
      description: ''
    };
    const usedStock: UsedStock = { stock: stock, usedParts: [], usedArea: { x: 4, y: 4 } };
    const part: Part = {
      count: 1,
      width: 5,
      height: 5,
      stock: stock,
      followGrain: false,
      description: ''
    };

    const result = PartDistribution.fitPartOntoStock(stock, usedStock, part);

    expect(result).toBeTruthy();
    expect(result.position.x).toBe(5, 'x');
    expect(result.position.y).toBe(0, 'y');
    expect(result.turned).toBeFalsy('turned');
    expect(result.usable).toBeTruthy('usable');
  });

  it('should fit part into bottom left corner', () => {
    const stock: Stock = {
      count: 1,
      width: 10,
      height: 10,
      material: { cuttingWidth: 1, thickness: 2 },
      description: ''
    };
    const usedStock: UsedStock = { stock: stock, usedParts: [], usedArea: { x: 8, y: 4 } };
    const part: Part = {
      count: 1,
      width: 5,
      height: 5,
      stock: stock,
      followGrain: false,
      description: ''
    };

    const result = PartDistribution.fitPartOntoStock(stock, usedStock, part);

    expect(result).toBeTruthy();
    expect(result.position.x).toBe(0, 'x');
    expect(result.position.y).toBe(5, 'y');
    expect(result.turned).toBeFalsy('turned');
    expect(result.usable).toBeTruthy('usable');
  });

  it('should not fit part', () => {
    const stock: Stock = {
      count: 1,
      width: 10,
      height: 10,
      material: { cuttingWidth: 1, thickness: 2 },
      description: ''
    };
    const usedStock: UsedStock = { stock: stock, usedParts: [], usedArea: { x: 5, y: 5 } };
    const part: Part = {
      count: 1,
      width: 5,
      height: 5,
      stock: stock,
      followGrain: false,
      description: ''
    };

    const result = PartDistribution.fitPartOntoStock(stock, usedStock, part);

    expect(result).toBeTruthy();
    expect(result.usable).toBeFalsy('usable');
  });

  it('should add a three parts', () => {
    const stock: Stock = {
      count: 1,
      width: 100,
      height: 150,
      material: { cuttingWidth: 5, thickness: 12 },
      description: ''
    };
    const usedStock: UsedStock = {
      stock: stock,
      usedParts: [],
      usedArea: { x: 0, y: 0 }
    };

    const partSmall: Part = {
      count: 2,
      width: 45,
      height: 45,
      stock: stock,
      followGrain: false,
      description: ''
    };

    let result = PartDistribution.fitPartOntoStock(stock, usedStock, partSmall);
    expect(result.usable).toBeTruthy('small 1 usable');
    expect(result.position.x).toBe(0, 'small 1 x');
    expect(result.position.y).toBe(0, 'small 1 y');

    UsedAreaCalculation.updateUsedArea(usedStock, result, partSmall);

    result = PartDistribution.fitPartOntoStock(stock, usedStock, partSmall);
    expect(result.usable).toBeTruthy('small 2 usable');
    expect(result.position.x).toBe(50, 'small 2 x');
    expect(result.position.y).toBe(0, 'small 2 y');

    UsedAreaCalculation.updateUsedArea(usedStock, result, partSmall);

    const partLarge: Part = {
      count: 1,
      width: 100,
      height: 100,
      stock: stock,
      followGrain: false,
      description: ''
    };

    result = PartDistribution.fitPartOntoStock(stock, usedStock, partLarge);

    expect(result).toBeTruthy();
    expect(result.usable).toBeTruthy('usable');
    expect(result.turned).toBeFalsy('turned');
    expect(result.position.x).toBe(0, 'large x');
    expect(result.position.y).toBe(50, 'large y');
  });

  fdescribe('row making', () => {
    const defaultStock: Stock = {
      count: 1,
      width: 100,
      height: 100,
      countLeft: 1,
      material: { cuttingWidth: 4, thickness: 12 },
      description: ''
    };

    it('should build a simple row', () => {
      const parts: Part[] = [
        {
          count: 1,
          width: 10,
          height: 10,
          stock: defaultStock,
          followGrain: false,
          description: ''
        },
        {
          count: 1,
          width: 10,
          height: 10,
          stock: defaultStock,
          followGrain: false,
          description: ''
        },
        {
          count: 1,
          width: 10,
          height: 10,
          stock: defaultStock,
          followGrain: false,
          description: ''
        }
      ];

      const usedParts = PartDistribution.getRowFor(parts, 100, 100);

      expect(usedParts.length).toBe(3);
    });

    it('should make the row horrizontal', () => {
      const stock: Stock = {
        count: 1,
        width: 100,
        height: 100,
        countLeft: 1,
        material: { cuttingWidth: 4, thickness: 0 },
        description: ''
      };
      const parts: Part[] = [
        { count: 1, width: 48, height: 10, stock: stock, followGrain: false },
        { count: 1, width: 48, height: 10, stock: stock, followGrain: false }
      ];

      const usedParts = PartDistribution.getRowFor(parts, 100, 100);

      expect(usedParts[0].position.x).toBe(0, '0 x');
      expect(usedParts[0].position.y).toBe(0, '0 y');
      expect(usedParts[1].position.x).toBe(52, '1 x');
      expect(usedParts[1].position.y).toBe(0, '1 y');
    });

    it('should make the row vertival', () => {
      const stock: Stock = {
        count: 1,
        width: 100,
        height: 100,
        countLeft: 1,
        material: { cuttingWidth: 4, thickness: 0 },
        description: ''
      };
      const parts: Part[] = [
        { count: 1, width: 10, height: 48, stock: stock, followGrain: false },
        { count: 1, width: 10, height: 48, stock: stock, followGrain: false }
      ];

      const usedParts = PartDistribution.getRowFor(parts, 100, 100);

      expect(usedParts[0].position.x).toBe(0, '0 x');
      expect(usedParts[0].position.y).toBe(0, '0 y');
      expect(usedParts[1].position.x).toBe(0, '1 x');
      expect(usedParts[1].position.y).toBe(52, '1 y');
    });

    it('should use the right 2 parts for a row', () => {
      const stock: Stock = {
        count: 1,
        width: 100,
        height: 100,
        countLeft: 1,
        material: { cuttingWidth: 4, thickness: 0 },
        description: ''
      };
      const parts: Part[] = [
        { count: 1, width: 48, height: 10, stock: stock, followGrain: false },
        { count: 1, width: 50, height: 10, stock: stock, followGrain: false },
        { count: 1, width: 48, height: 10, stock: stock, followGrain: false }
      ];

      const usedParts = PartDistribution.getRowFor(parts, 100, 100);
      expect(usedParts.length).toBe(2, 'parts in a row');
      expect(parts.length).toBe(1, 'part left');
    });
  });
});
