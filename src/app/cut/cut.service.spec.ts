import { TestBed } from '@angular/core/testing';
import { Material, Part, Resultset, Stock, UsedStock } from 'app/app.model';
import { CutService } from 'app/cut/cut.service';
import { StorageService } from 'app/storage.service';

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
  const storage: StorageService = TestBed.get(StorageService);

  storage.materials.push({
    cuttingWidth: cuttingWidth,
    thickness: thickness,
    description: description
  });
}

function addStock(count: number, width: number, height: number, material?: Material) {
  const storage: StorageService = TestBed.get(StorageService);

  const stock: Stock = {
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
  const storage: StorageService = TestBed.get(StorageService);
  const part = {
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

  model.stocks.forEach((s, stockIndex) => {
    const usedStock = result.usedStock[stockIndex];
    expect(usedStock.stock).toBe(s.stock, 'the right stock (' + stockIndex + ')');
    expect(usedStock.usedParts.length).toBe(s.parts.length, 'used parts(' + stockIndex + ')');

    s.parts.forEach((p, partIndex) => {
      const usedPart = usedStock.usedParts[partIndex];
      expect(usedPart.part).toBe(p.part, 'the right part(' + stockIndex + ',' + partIndex + ')');
      expect(usedPart.turned).toBe(!!p.turned, 'turned(' + stockIndex + ',' + partIndex + ')');
      expect(usedPart.position.x).toBe(p.x, 'x(' + stockIndex + ',' + partIndex + ')');
      expect(usedPart.position.y).toBe(p.y, 'y(' + stockIndex + ',' + partIndex + ')');
    });
  });
}

describe('CutService', () => {
  let service: CutService;
  let storage: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.get(CutService);
    storage = TestBed.get(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should run with empty input', () => {
    service.cutParts();

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

    service.cutParts();

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

    service.cutParts();

    allPartsFitStock(storage.result);
    checkResult(storage.result, model);
  });

  it('should cut two pieces out of one stock item', () => {
    const cuttingWidth = 4;
    const partWidthAntHeight = 50;

    addMaterial(cuttingWidth, 8, '');
    const stock = addStock(1, 100, 200);
    const part = addPart(2, partWidthAntHeight, partWidthAntHeight, false);

    const model: ModelCheck = {
      stocks: [
        {
          stock: stock,
          parts: [
            { part: part, x: 0, y: 0 },
            { part: part, x: 0, y: partWidthAntHeight + cuttingWidth }
          ]
        }
      ]
    };

    service.cutParts();

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

    service.cutParts();

    allPartsFitStock(storage.result);
    checkResult(storage.result, model);
  });

  it('should use 3 of 3 stock counts', () => {
    addMaterial(4, 8, '');
    addStock(3, 50, 50);
    addPart(3, 50, 50, false);

    service.cutParts();

    allPartsFitStock(storage.result);

    expect(storage.result.usedStock.length).toBe(3, 'three stock items used');
  });

  it('should fit 3 parts on one stock item (a, b / c)', () => {
    addMaterial(5, 12, '');
    const stock = addStock(1, 100, 150);
    const doublePart = addPart(2, 45, 45, false);
    const longPart = addPart(1, 100, 100, false);

    const model: ModelCheck = {
      stocks: [
        {
          stock: stock,
          parts: [
            { part: doublePart, x: 0, y: 0 },
            { part: doublePart, x: 50, y: 0 },
            { part: longPart, x: 0, y: 50 }
          ]
        }
      ]
    };

    service.cutParts();

    allPartsFitStock(storage.result);
    checkResult(storage.result, model);
  });

  /*it('should fit many parts', () => {
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

    service.cutParts();

    console.log(storage.result);

    allPartsFitStock(storage.result);
    checkResult(storage.result, model);
  });*/

  it('should use one part wisely', () => {
    addMaterial(4, 12, '');
    const stock = addStock(1, 100, 100);
    stock.countLeft = 1;
    const part = addPart(1, 100, 100, false);

    const usedStocks: UsedStock[] = [];

    service.usePart(part, usedStocks, stock);

    expect(stock.countLeft).toBe(0, 'stock count left');
    expect(usedStocks.length).toBe(1, 'used stock count');
    expect(usedStocks[0].stock).toBe(stock, 'stock kept real');
    expect(usedStocks[0].usedArea.x).toBe(100, 'x used');
    expect(usedStocks[0].usedArea.y).toBe(100, 'y used');
    expect(usedStocks[0].usedParts.length).toBe(1, 'used parts length');
    expect(usedStocks[0].usedParts[0].part).toBe(part, 'part kept real');
    expect(usedStocks[0].usedParts[0].position.x).toBe(0, 'part x');
    expect(usedStocks[0].usedParts[0].position.y).toBe(0, 'part y');
    expect(usedStocks[0].usedParts[0].turned).toBeFalsy('part not turned');
  });

  it('should use cut part on stock', () => {
    addMaterial(4, 12, '');
    const stock = addStock(1, 100, 100);
    stock.countLeft = 1;
    const part = addPart(1, 100, 100, false);
    const parts = [part];

    const usedStocks: UsedStock[] = [];

    service.cutForStockItem(stock, parts, usedStocks);

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

    const usedStocks: UsedStock[] = [];

    service.cutForStockItem(stock, parts, usedStocks);

    expect(stock.countLeft).toBe(0, 'stock count left');
    expect(usedStocks.length).toBe(1, 'used stock count');
    expect(usedStocks[0].stock).toBe(stock, 'stock kept real');
    expect(usedStocks[0].usedArea.x).toBe(100, 'x used');
    expect(usedStocks[0].usedArea.y).toBe(50, 'y used');
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
});
