import { HowToFit, Part, Stock, UsedStock } from 'app/app.model';
import { CutToolbox } from 'app/cut/cut-toolbox';

describe('Statistics', () => {
  let tool: CutToolbox;

  beforeEach(() => {
    tool = new CutToolbox();
  });

  it('should be created', () => {
    expect(tool).toBeTruthy();
  });

  describe('updateUsedArea', () => {
    it('should update empty used area', () => {
      const usedStock: UsedStock = {
        usedArea: { x: 0, y: 0 },
        usedParts: [],
        stock: { count: 1, width: 100, height: 100, material: null, description: '' }
      };
      const htf: HowToFit = { usable: true, turned: false, position: { x: 0, y: 0 } };
      const part: Part = {
        count: 1,
        width: 50,
        height: 50,
        stock: null,
        followGrain: false,
        description: ''
      };

      tool.updateUsedArea(usedStock, htf, part);

      expect(usedStock.usedArea.x).toBe(50, 'x');
      expect(usedStock.usedArea.y).toBe(50, 'y');
    });

    it('should extent x', () => {
      const usedStock: UsedStock = {
        usedArea: { x: 50, y: 50 },
        usedParts: [],
        stock: { count: 1, width: 100, height: 100, material: null, description: '' }
      };
      const htf: HowToFit = { usable: true, turned: false, position: { x: 50, y: 0 } };
      const part: Part = {
        count: 1,
        width: 50,
        height: 50,
        stock: null,
        followGrain: false,
        description: ''
      };

      tool.updateUsedArea(usedStock, htf, part);

      expect(usedStock.usedArea.x).toBe(100, 'x');
      expect(usedStock.usedArea.y).toBe(50, 'y');
    });

    it('should extent y', () => {
      const usedStock: UsedStock = {
        usedArea: { x: 50, y: 50 },
        usedParts: [],
        stock: { count: 1, width: 100, height: 100, material: null, description: '' }
      };
      const htf: HowToFit = { usable: true, turned: false, position: { x: 0, y: 50 } };
      const part: Part = {
        count: 1,
        width: 50,
        height: 50,
        stock: null,
        followGrain: false,
        description: ''
      };

      tool.updateUsedArea(usedStock, htf, part);

      expect(usedStock.usedArea.x).toBe(50, 'x');
      expect(usedStock.usedArea.y).toBe(100, 'y');
    });
  });

  describe('getNewUsedStock', () => {
    it('should give new used stock and add to array', () => {
      const stock: Stock = {
        count: 1,
        countLeft: 1,
        width: 10,
        height: 10,
        material: null,
        description: ''
      };
      const array = [];

      const result = tool.getNewUsedStock(stock, array);

      expect(result).toBeTruthy();
      expect(result.stock).toBe(stock, 'stock kept');
      expect(array.length).toBe(1, 'array length');
      expect(array[0]).toBe(result, 'the right object');
      expect(stock.countLeft).toBe(0, 'availability dropped');
    });
  });

  describe('fitPartOntoStock', () => {
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

      const result = tool.fitPartOntoStock(stock, usedStock, part);

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

      const result = tool.fitPartOntoStock(stock, usedStock, part);

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

      const result = tool.fitPartOntoStock(stock, usedStock, part);

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

      const result = tool.fitPartOntoStock(stock, usedStock, part);

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

      let result = tool.fitPartOntoStock(stock, usedStock, partSmall);
      expect(result.usable).toBeTruthy('small 1 usable');
      expect(result.position.x).toBe(0, 'small 1 x');
      expect(result.position.y).toBe(0, 'small 1 y');

      tool.updateUsedArea(usedStock, result, partSmall);

      result = tool.fitPartOntoStock(stock, usedStock, partSmall);
      expect(result.usable).toBeTruthy('small 2 usable');
      expect(result.position.x).toBe(50, 'small 2 x');
      expect(result.position.y).toBe(0, 'small 2 y');

      tool.updateUsedArea(usedStock, result, partSmall);

      const partLarge: Part = {
        count: 1,
        width: 100,
        height: 100,
        stock: stock,
        followGrain: false,
        description: ''
      };

      result = tool.fitPartOntoStock(stock, usedStock, partLarge);

      expect(result).toBeTruthy();
      expect(result.usable).toBeTruthy('usable');
      expect(result.turned).toBeFalsy('turned');
      expect(result.position.x).toBe(0, 'large x');
      expect(result.position.y).toBe(50, 'large y');
    });
  });
});
