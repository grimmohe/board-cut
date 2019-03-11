import { Part, Stock, UsedStock } from 'app/app.model';
import { PartDistribution } from 'app/cut/part-distribution';

describe('PartDistribution', () => {
  it('should fit part into top left corner', () => {
    const stock: Stock = {
      count: 1,
      width: 10,
      height: 10,
      material: { cuttingWidth: 4, thickness: 12 }
    };
    const usedStock: UsedStock = { stock: stock, usedParts: [], usedArea: { x: 0, y: 0 } };
    const part: Part = {
      count: 1,
      width: 5,
      height: 5,
      stock: stock,
      followGrain: false
    };

    PartDistribution.addRowFor([part], usedStock);

    expect(usedStock.usedParts.length).toBe(1);
    const usedPart = usedStock.usedParts[0];
    expect(usedPart.position.x).toBe(0, 'x');
    expect(usedPart.position.y).toBe(0, 'y');
    expect(usedPart.turned).toBeFalsy('turned');
  });

  it('should fit part into top right corner', () => {
    const stock: Stock = {
      count: 1,
      width: 10,
      height: 10,
      material: { cuttingWidth: 1, thickness: 2 }
    };
    const usedStock: UsedStock = { stock: stock, usedParts: [], usedArea: { x: 5, y: 0 } };
    const part: Part = {
      count: 1,
      width: 5,
      height: 5,
      stock: stock,
      followGrain: false
    };

    PartDistribution.addRowFor([part], usedStock);

    expect(usedStock.usedParts.length).toBe(1);
    const usedPart = usedStock.usedParts[0];
    expect(usedPart.position.x).toBe(5, 'x');
    expect(usedPart.position.y).toBe(0, 'y');
    expect(usedPart.turned).toBeFalsy('turned');
  });

  it('should fit part into bottom left corner', () => {
    const stock: Stock = {
      count: 1,
      width: 10,
      height: 10,
      material: { cuttingWidth: 1, thickness: 2 }
    };
    const usedStock: UsedStock = { stock: stock, usedParts: [], usedArea: { x: 0, y: 5 } };
    const part: Part = {
      count: 1,
      width: 5,
      height: 5,
      stock: stock,
      followGrain: false
    };

    PartDistribution.addRowFor([part], usedStock);
    const usedParts = usedStock.usedParts;

    expect(usedParts.length).toBe(1);
    expect(usedParts[0].position.x).toBe(0, 'x');
    expect(usedParts[0].position.y).toBe(5, 'y');
    expect(usedParts[0].turned).toBeFalsy('turned');
  });

  it('should not fit part', () => {
    const stock: Stock = {
      count: 1,
      width: 10,
      height: 10,
      material: { cuttingWidth: 1, thickness: 2 },
      description: ''
    };
    const usedStock: UsedStock = { stock: stock, usedParts: [], usedArea: { x: 6, y: 6 } };
    const part: Part = {
      count: 1,
      width: 5,
      height: 5,
      stock: stock,
      followGrain: false
    };

    PartDistribution.addRowFor([part], usedStock);
    const usedParts = usedStock.usedParts;

    expect(usedParts.length).toBe(0);
  });

  it('should add a three parts', () => {
    const stock: Stock = {
      count: 1,
      width: 100,
      height: 150,
      material: { cuttingWidth: 5, thickness: 12 }
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
      followGrain: false
    };
    const partLarge: Part = {
      count: 1,
      width: 100,
      height: 100,
      stock: stock,
      followGrain: false
    };
    const parts = [partSmall, partSmall, partLarge];

    expect(PartDistribution.addRowFor(parts, usedStock)).toBe(1);
    expect(PartDistribution.addRowFor(parts, usedStock)).toBe(1);
    expect(PartDistribution.addRowFor(parts, usedStock)).toBe(1);
    expect(PartDistribution.addRowFor(parts, usedStock)).toBe(0);
    expect(usedStock.usedParts.length).toBe(3);
  });

  describe('row making', () => {
    const defaultStock: Stock = {
      count: 1,
      width: 100,
      height: 100,
      countLeft: 1,
      material: { cuttingWidth: 4, thickness: 12 },
      description: ''
    };
    const usedStock: UsedStock = { stock: defaultStock, usedArea: { x: 0, y: 0 }, usedParts: [] };

    beforeEach(() => {
      usedStock.usedArea.x = 0;
      usedStock.usedArea.y = 0;
      usedStock.usedParts.length = 0;
    });

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

      const count = PartDistribution.addRowFor(parts, usedStock);

      expect(count).toBe(3);
      expect(usedStock.usedParts.length).toBe(3);
    });

    it('should make the row horrizontal', () => {
      const stock: Stock = {
        count: 1,
        width: 100,
        height: 100,
        countLeft: 1,
        material: { cuttingWidth: 4, thickness: 0 }
      };
      const parts: Part[] = [
        { count: 1, width: 48, height: 10, stock: stock, followGrain: false },
        { count: 1, width: 48, height: 10, stock: stock, followGrain: false }
      ];
      usedStock.usedArea.y = 20;

      PartDistribution.addRowFor(parts, usedStock);
      const usedParts = usedStock.usedParts;

      expect(usedParts[0].position.x).toBe(0, '0 x');
      expect(usedParts[0].position.y).toBe(20, '0 y');
      expect(usedParts[1].position.x).toBe(52, '1 x');
      expect(usedParts[1].position.y).toBe(20, '1 y');
    });

    it('should make the row vertival', () => {
      const stock: Stock = {
        count: 1,
        width: 100,
        height: 100,
        countLeft: 1,
        material: { cuttingWidth: 4, thickness: 0 }
      };
      const parts: Part[] = [
        { count: 1, width: 10, height: 48, stock: stock, followGrain: false },
        { count: 1, width: 10, height: 48, stock: stock, followGrain: false }
      ];

      PartDistribution.addRowFor(parts, usedStock);
      const usedParts = usedStock.usedParts;

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
        material: { cuttingWidth: 4, thickness: 0 }
      };
      const parts: Part[] = [
        { count: 1, width: 48, height: 10, stock: stock, followGrain: false },
        { count: 1, width: 50, height: 10, stock: stock, followGrain: false },
        { count: 1, width: 48, height: 10, stock: stock, followGrain: false }
      ];

      PartDistribution.addRowFor(parts, usedStock);
      const usedParts = usedStock.usedParts;
      expect(usedParts.length).toBe(2, 'parts in a row');
      expect(parts.length).toBe(1, 'part left');
    });
  });
});
