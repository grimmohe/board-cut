import { Part, Stock, UsedStock } from 'src/app/app.model';
import { PartDistribution } from 'src/app/cut/part-distribution';

describe('PartDistribution', () => {
  const defaultStock: Stock = {
    id: 0,
    count: 1,
    width: 100,
    height: 100,
    countLeft: 1,
    material: {
      id: 0,
      cuttingWidth: 4,
      thickness: 12
    },
    description: ''
  };
  const defaultUsedStock: UsedStock = {
    stock: defaultStock,
    usedArea: { x: 0, y: 0 },
    usedParts: []
  };

  beforeEach(() => {
    defaultUsedStock.usedArea.x = 0;
    defaultUsedStock.usedArea.y = 0;
    defaultUsedStock.usedParts.length = 0;
  });

  it('should fit part into top left corner', () => {
    const stock: Stock = {
      id: 0,
      count: 1,
      width: 10,
      height: 10,
      material: { id: 0, cuttingWidth: 4, thickness: 12 }
    };
    const part: Part = {
      id: 0,
      count: 1,
      width: 5,
      height: 5,
      stock: stock,
      followGrain: false
    };

    new PartDistribution().fillStock([part], defaultUsedStock, [part], [defaultStock]);

    expect(defaultUsedStock.usedParts.length).toBe(1);
    const usedPart = defaultUsedStock.usedParts[0];
    expect(usedPart.position.x).toBe(0, 'x');
    expect(usedPart.position.y).toBe(0, 'y');
    expect(usedPart.turned).toBeFalsy('turned');
  });

  it('should fit part into top right corner', () => {
    const stock: Stock = {
      id: 0,
      count: 1,
      width: 10,
      height: 10,
      material: {
        id: 0,
        cuttingWidth: 1,
        thickness: 2
      }
    };
    const usedStock: UsedStock = { stock: stock, usedParts: [], usedArea: { x: 5, y: 0 } };
    const part: Part = {
      id: 0,
      count: 1,
      width: 5,
      height: 5,
      stock: stock,
      followGrain: false
    };

    new PartDistribution().fillStock([part], usedStock, [part], [stock]);

    expect(usedStock.usedParts.length).toBe(1);
    const usedPart = usedStock.usedParts[0];
    expect(usedPart.position.x).toBe(5, 'x');
    expect(usedPart.position.y).toBe(0, 'y');
    expect(usedPart.turned).toBeFalsy('turned');
  });

  it('should fit part into bottom left corner', () => {
    const stock: Stock = {
      id: 0,
      count: 1,
      width: 10,
      height: 10,
      material: {
        id: 0,
        cuttingWidth: 1,
        thickness: 2
      }
    };
    const usedStock: UsedStock = { stock: stock, usedParts: [], usedArea: { x: 0, y: 5 } };
    const part: Part = {
      id: 0,
      count: 1,
      width: 5,
      height: 5,
      stock: stock,
      followGrain: false
    };

    new PartDistribution().fillStock([part], usedStock, [part], [stock]);
    const usedParts = usedStock.usedParts;

    expect(usedParts.length).toBe(1);
    expect(usedParts[0].position.x).toBe(0, 'x');
    expect(usedParts[0].position.y).toBe(5, 'y');
    expect(usedParts[0].turned).toBeFalsy('turned');
  });

  it('should not fit part', () => {
    const stock: Stock = {
      id: 0,
      count: 1,
      width: 10,
      height: 10,
      material: {
        id: 0,
        cuttingWidth: 1,
        thickness: 2
      },
      description: ''
    };
    const usedStock: UsedStock = { stock: stock, usedParts: [], usedArea: { x: 6, y: 6 } };
    const part: Part = {
      id: 0,
      count: 1,
      width: 5,
      height: 5,
      stock: stock,
      followGrain: false
    };

    new PartDistribution().fillStock([part], usedStock, [part], [stock]);
    const usedParts = usedStock.usedParts;

    expect(usedParts.length).toBe(0);
  });

  it('should add a three parts', () => {
    const stock: Stock = {
      id: 0,
      count: 1,
      width: 100,
      height: 150,
      material: {
        id: 0,
        cuttingWidth: 5,
        thickness: 12
      }
    };
    const usedStock: UsedStock = {
      stock: stock,
      usedParts: [],
      usedArea: { x: 0, y: 0 }
    };
    const partSmall: Part = {
      id: 0,
      count: 2,
      width: 45,
      height: 45,
      stock: stock,
      followGrain: false
    };
    const partLarge: Part = {
      id: 1,
      count: 1,
      width: 100,
      height: 100,
      stock: stock,
      followGrain: false
    };
    const parts = [partSmall, partSmall, partLarge];

    new PartDistribution().fillStock(parts, usedStock, [...parts], [stock]);

    expect(usedStock.usedParts.length).toBe(3);
  });

  it('should build a simple row', () => {
    const parts: Part[] = [
      {
        id: 0,
        count: 1,
        width: 10,
        height: 10,
        stock: defaultStock,
        followGrain: false,
        description: ''
      },
      {
        id: 1,
        count: 1,
        width: 10,
        height: 10,
        stock: defaultStock,
        followGrain: false,
        description: ''
      },
      {
        id: 2,
        count: 1,
        width: 10,
        height: 10,
        stock: defaultStock,
        followGrain: false,
        description: ''
      }
    ];

    new PartDistribution().fillStock(parts, defaultUsedStock, [...parts], [defaultStock]);

    expect(defaultUsedStock.usedParts.length).toBe(3);
  });

  it('should make the row horrizontal', () => {
    const stock: Stock = {
      id: 0,
      count: 1,
      width: 100,
      height: 100,
      countLeft: 1,
      material: {
        id: 0,
        cuttingWidth: 4,
        thickness: 0
      }
    };
    const parts: Part[] = [
      { id: 0, count: 1, width: 48, height: 10, stock: stock, followGrain: false },
      { id: 1, count: 1, width: 48, height: 10, stock: stock, followGrain: false }
    ];
    defaultUsedStock.usedArea.y = 20;

    new PartDistribution().fillStock(parts, defaultUsedStock, [...parts], [stock]);
    const usedParts = defaultUsedStock.usedParts;

    expect(usedParts[0].position.x).toBe(0, '0 x');
    expect(usedParts[0].position.y).toBe(20, '0 y');
    expect(usedParts[1].position.x).toBe(52, '1 x');
    expect(usedParts[1].position.y).toBe(20, '1 y');
  });
});
