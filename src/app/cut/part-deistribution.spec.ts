import { Part, Stock, UsedStock } from 'app/app.model';
import { PartDistribution } from 'app/cut/part-distribution';
import { UsedAreaCalculation } from 'app/cut/used-area-calculation';

describe('PartDistribution', () => {
  it('should fit part into top left corner', () => {
    const stock: Stock = { count: 1, width: 10, height: 10, material: null, description: '' };
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
      material: { cuttingWidth: 1, thickness: 2, description: '' },
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
      material: { cuttingWidth: 1, thickness: 2, description: '' },
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
      material: { cuttingWidth: 1, thickness: 2, description: '' },
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
      material: { cuttingWidth: 5, thickness: 12, description: '' },
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
});
