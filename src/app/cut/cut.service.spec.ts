import { TestBed } from '@angular/core/testing';
import { Material, Stock } from 'app/app.model';
import { CutService } from 'app/cut/cut.service';
import { StorageService } from 'app/storage.service';

function addMeterial(cuttingWidth: number, thickness: number, description: string) {
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

function addPart(
  count: number,
  width: number,
  height: number,
  followGrain: boolean,
  stock?: Stock
) {
  const storage: StorageService = TestBed.get(StorageService);

  storage.parts.push({
    height: height,
    width: width,
    count: count,
    stock: stock ? stock : storage.stock[0],
    followGrain: followGrain,
    description: count + 'x' + width + 'x' + height
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

    expect(storage.results.length).toBe(0);
  });

  it('should cut one piece out of one stock item', () => {
    addMeterial(4, 8, '');
    addStock(1, 100, 200);
    addPart(1, 100, 100, false);

    service.cutParts();

    expect(storage.results.length).toBe(1, 'result count');
    expect(storage.results[0].usedStock.length).toBe(1, 'usedStock');

    const usedStock = storage.results[0].usedStock[0];
    expect(usedStock.stock).toBe(storage.stock[0], 'the right stock item');
    expect(usedStock.usedParts.length).toBe(1, 'usedParts count');

    const usedPart = usedStock.usedParts[0];
    expect(usedPart.part).toBe(storage.parts[0], 'the right part');
    expect(usedPart.position.x).toBe(0, 'x position');
    expect(usedPart.position.y).toBe(0, 'y position');
    expect(usedPart.turned).toBeFalsy();
  });

  it('should cut one turned piece out of one stock item', () => {
    addMeterial(4, 8, '');
    addStock(1, 100, 200);
    addPart(1, 200, 100, false);

    service.cutParts();

    const usedPart = storage.results[0].usedStock[0].usedParts[0];
    expect(usedPart.turned).toBeTruthy();
  });

  it('should cut two pieces out of one stock item', () => {
    const cuttingWidth = 4;
    const partWidth = 50;

    addMeterial(cuttingWidth, 8, '');
    addStock(1, 100, 200);
    addPart(2, partWidth, 50, false);

    service.cutParts();

    const usedParts = storage.results[0].usedStock[0].usedParts;
    expect(usedParts.length).toBe(2, 'count usedParts');

    const usedPart1 = usedParts[0];
    expect(usedPart1.part).toBe(storage.parts[0], 'the right part 1');
    expect(usedPart1.turned).toBe(false, 'part 1 not turned');
    expect(usedPart1.position.x).toBe(0, 'part 1 position x');
    expect(usedPart1.position.y).toBe(0, 'part 1 position y');

    const usedPart2 = usedParts[1];
    expect(usedPart2.part).toBe(storage.parts[0], 'the right part 2');
    expect(usedPart2.turned).toBe(false, 'part 2 not turned');
    expect(usedPart2.position.x).toBe(partWidth + cuttingWidth, 'part 2 position x');
    expect(usedPart2.position.y).toBe(0, 'part 2 position y');
  });

  it('should use two stock items for two parts', () => {
    addMeterial(4, 8, '');

    addPart(1, 50, 50, false, addStock(1, 50, 50));
    addPart(1, 50, 50, false, addStock(1, 50, 50));

    service.cutParts();

    expect(storage.results.length).toBe(1, 'one result');
    expect(storage.results[0].usedStock.length).toBe(2, 'two stock items used');

    const usedStock1 = storage.results[0].usedStock[0];
    expect(usedStock1.usedParts.length).toBe(1, 'one part per stock fits');
    expect(usedStock1.usedParts[0].position.x).toBe(0, 'stock 1 part position x');
    expect(usedStock1.usedParts[0].position.y).toBe(0, 'stock 1 part position y');
    expect(usedStock1.stock).toBe(usedStock1.usedParts[0].part.stock, 'stock 1 matches part stock');

    const usedStock2 = storage.results[0].usedStock[0];
    expect(usedStock2.usedParts.length).toBe(1, 'one part per stock fits');
    expect(usedStock2.usedParts[0].position.x).toBe(0, 'stock 2 part position x');
    expect(usedStock2.usedParts[0].position.y).toBe(0, 'stock 2 part position y');
    expect(usedStock2.stock).toBe(usedStock2.usedParts[0].part.stock, 'stock 2 matches part stock');
  });

  it('should use 3 of 3 stock counts', () => {
    addMeterial(4, 8, '');
    addStock(3, 50, 50);
    addPart(3, 50, 50, false);

    service.cutParts();

    expect(storage.results.length).toBe(1, 'one result');
    expect(storage.results[0].usedStock.length).toBe(3, 'three stock items used');
  });
});
