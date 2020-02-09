import { TestBed } from '@angular/core/testing';
import { Material, Part, Resultset, Stock } from 'app/app.model';
import { CutService } from 'app/cut/cut.service';
import { StorageService } from 'app/storage/storage.service';

interface ModelCheck {
  stocks: {
    stock: Stock;
    parts: {
      part: Part;
      x?: number;
      y?: number;
      turned?: boolean;
    }[];
  }[];
}

function addMaterial(cuttingWidth: number, thickness: number, description: string) {
  const storage: StorageService = TestBed.inject(StorageService);

  storage.materials.push({
    id: storage.materials.length,
    cuttingWidth: cuttingWidth,
    thickness: thickness,
    description: description
  });
}

function addStock(count: number, width: number, height: number, material?: Material) {
  const storage: StorageService = TestBed.inject(StorageService);

  const stock: Stock = {
    id: storage.stock.length,
    material: material ? material : storage.materials[0],
    count: count,
    width: width,
    height: height,
    description: width + 'x' + height
  };
  storage.stock.push(stock);

  return stock;
}

function allPartsFitStock(result: Resultset) {
  result.usedStock.forEach((usedStock, stockIndex) => {
    usedStock.usedParts.forEach((usedPart, partIndex) => {
      expect(
        usedPart.position.x + (usedPart.turned ? usedPart.part.height : usedPart.part.width)
      ).toBeLessThanOrEqual(
        usedStock.stock.width,
        'width overstepped x:' +
          usedPart.position.x +
          ' width:' +
          usedPart.part.width +
          '(' +
          stockIndex +
          ',' +
          partIndex +
          ')'
      );
      expect(
        usedPart.position.y + (usedPart.turned ? usedPart.part.width : usedPart.part.height)
      ).toBeLessThanOrEqual(
        usedStock.stock.height,
        'height overstepped (' + stockIndex + ',' + partIndex + ')'
      );
    });
  });
}

function addPart(
  count: number,
  width: number,
  height: number,
  followGrain: boolean,
  stock?: Stock
): Part {
  const storage: StorageService = TestBed.inject(StorageService);
  const part = {
    id: storage.parts.length,
    height: height,
    width: width,
    count: count,
    stock: stock ? stock : storage.stock[0],
    followGrain: followGrain,
    description: count + 'x' + width + 'x' + height
  };

  storage.parts.push(part);

  return part;
}

function checkResult(result: Resultset, model: ModelCheck) {
  expect(result.usedStock.length).toBe(model.stocks.length, 'used stock');

  model.stocks.forEach((modelStock, stockIndex) => {
    const usedStock = result.usedStock[stockIndex];
    expect(usedStock.stock).toEqual(modelStock.stock, 'the right stock (' + stockIndex + ')');
    expect(usedStock.usedParts.length).toBe(
      modelStock.parts.length,
      'used parts(' + stockIndex + ')'
    );

    modelStock.parts.forEach((modelPart, partIndex) => {
      const usedPart = usedStock.usedParts[partIndex];
      expect(usedPart.part).toEqual(
        modelPart.part,
        'the right part(' + stockIndex + ',' + partIndex + ')'
      );
      if (modelPart.turned !== undefined) {
        expect(usedPart.turned).toBe(
          !!modelPart.turned,
          'turned(' + stockIndex + ',' + partIndex + ')'
        );
      }
      if (modelPart.x !== undefined) {
        expect(usedPart.position.x).toBe(modelPart.x, 'x(' + stockIndex + ',' + partIndex + ')');
      }
      if (modelPart.y !== undefined) {
        expect(usedPart.position.y).toBe(modelPart.y, 'y(' + stockIndex + ',' + partIndex + ')');
      }
    });
  });
}

describe('CutService', () => {
  let service: CutService;
  let storage: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(CutService);
    storage = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should run with empty input', () => {
    service.cut();

    expect(storage.result).toBeDefined();
  });

  it('should cut one piece out of one stock item', () => {
    addMaterial(4, 8, '');

    const model: ModelCheck = {
      stocks: [
        {
          stock: addStock(1, 100, 200),
          parts: [{ part: addPart(1, 100, 100, false), x: 0, y: 0 }]
        }
      ]
    };

    service.cut();

    allPartsFitStock(storage.result);
    checkResult(storage.result, model);
  });

  it('should cut one turned piece out of one stock item', () => {
    addMaterial(4, 8, '');

    const model: ModelCheck = {
      stocks: [
        {
          stock: addStock(1, 100, 200),
          parts: [{ part: addPart(1, 200, 100, false), x: 0, y: 0, turned: true }]
        }
      ]
    };

    service.cut();

    allPartsFitStock(storage.result);
    checkResult(storage.result, model);
  });

  it('should cut two pieces out of one stock item', () => {
    const cuttingWidth = 4;
    const partWidthAndHeight = 50;

    addMaterial(cuttingWidth, 8, '');
    const stock = addStock(1, 100, 200);
    const part = addPart(2, partWidthAndHeight, partWidthAndHeight, false);

    const model: ModelCheck = {
      stocks: [
        {
          stock: stock,
          parts: [
            { part: part, x: 0, y: 0 },
            { part: part, x: 0, y: partWidthAndHeight + cuttingWidth }
          ]
        }
      ]
    };

    service.cut();

    allPartsFitStock(storage.result);
    checkResult(storage.result, model);
  });

  it('should use two stock items for two parts', () => {
    addMaterial(4, 8, '');
    const stock1 = addStock(1, 50, 50);
    const stock2 = addStock(1, 50, 50);

    const model: ModelCheck = {
      stocks: [
        { stock: stock1, parts: [{ part: addPart(1, 50, 50, false, stock1), x: 0, y: 0 }] },
        { stock: stock2, parts: [{ part: addPart(1, 50, 50, false, stock2), x: 0, y: 0 }] }
      ]
    };

    service.cut();

    allPartsFitStock(storage.result);
    checkResult(storage.result, model);
  });

  it('should use 3 of 3 stock counts', () => {
    addMaterial(4, 8, '');
    addStock(3, 50, 50);
    addPart(3, 50, 50, false);

    service.cut();

    allPartsFitStock(storage.result);

    expect(storage.result.usedStock.length).toBe(3, 'three stock items used');
  });

  it('should fit 3 parts on one stock item (a / b, c)', () => {
    addMaterial(5, 12, '');
    const stock = addStock(1, 100, 150);
    const doublePart = addPart(2, 45, 45, false);
    const longPart = addPart(1, 100, 100, false);

    const model: ModelCheck = {
      stocks: [
        {
          stock: stock,
          parts: [
            { part: longPart, x: 0, y: 0 },
            { part: doublePart, x: 0, y: 105 },
            { part: doublePart, x: 50, y: 105 }
          ]
        }
      ]
    };

    service.cut();

    allPartsFitStock(storage.result);
    checkResult(storage.result, model);
  });

  it('should use cut part on stock', () => {
    addMaterial(4, 12, '');
    const stock = addStock(1, 100, 100);
    stock.countLeft = 1;
    const part = addPart(1, 100, 100, false);
    const parts = [part];

    const usedStocks = service.cutForStockItem(stock, parts);

    expect(usedStocks.length).toBe(1, 'used stock');
    expect(usedStocks[0].stock).toBe(stock, 'stock kept real');
    expect(usedStocks[0].usedParts.length).toBe(1, 'used part');
    expect(usedStocks[0].usedParts[0].part).toBe(part, 'part kept real');
  });

  it('should use cut two parts on stock', () => {
    addMaterial(4, 12, '');
    const stock = addStock(1, 100, 50);
    stock.countLeft = 1;
    const part = addPart(2, 48, 50, false);
    const parts = [part, part];

    const usedStocks = service.cutForStockItem(stock, parts);

    expect(stock.countLeft).toBe(0, 'stock count left');
    expect(usedStocks.length).toBe(1, 'used stock count');
    expect(usedStocks[0].stock).toBe(stock, 'stock kept real');
    expect(usedStocks[0].usedParts.length).toBe(2, 'used parts length');
    expect(usedStocks[0].usedParts[0].part).toBe(part, 'part kept real');
    expect(usedStocks[0].usedParts[0].position.x).toBe(0, 'part x');
    expect(usedStocks[0].usedParts[0].position.y).toBe(0, 'part y');
    expect(usedStocks[0].usedParts[0].turned).toBeFalsy('part not turned');
    expect(usedStocks[0].usedParts[1].part).toBe(part, 'part kept real');
    expect(usedStocks[0].usedParts[1].position.x).toBe(52, 'part x');
    expect(usedStocks[0].usedParts[1].position.y).toBe(0, 'part y');
    expect(usedStocks[0].usedParts[1].turned).toBeFalsy('part not turned');
  });

  it('should fit many parts', () => {
    addMaterial(4, 12, '');
    const model: ModelCheck = {
      stocks: [
        {
          stock: addStock(1, 2780, 2070),
          parts: [
            { part: addPart(2, 1975, 389, false) },
            { part: addPart(2, 762, 374, false) },
            { part: addPart(2, 862, 389, false) },
            { part: addPart(2, 862, 374, false) },
            { part: addPart(6, 862, 369, false) }
          ]
        }
      ]
    };

    service.cut();

    allPartsFitStock(storage.result);
  });

  it('should fit 4 parts', () => {
    addMaterial(4, 12, '');
    const stock = addStock(1, 700, 500);
    const part = addPart(4, 200, 300, false);
    const model: ModelCheck = {
      stocks: [
        {
          stock,
          parts: [
            { part, turned: true },
            { part, turned: true },
            { part, turned: true },
            { part, turned: true }
          ]
        }
      ]
    };

    service.cut();

    allPartsFitStock(storage.result);
    checkResult(storage.result, model);
  });
});
