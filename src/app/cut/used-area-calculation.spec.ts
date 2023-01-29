import { Part, Stock, UsedStock } from 'src/app/app.model';
import { UsedAreaCalculation } from 'src/app/cut/used-area-calculation';

describe('UsedAreaCalculation', () => {
  it('should substract a row', () => {
    const stock: Stock = {
      id: 0,
      count: 1,
      width: 100,
      height: 100,
      material: { id: 0, cuttingWidth: 4, thickness: 12 }
    };
    const part: Part = { id: 0, count: 3, width: 10, height: 10, stock: stock, followGrain: false };
    const usedStock: UsedStock = {
      usedArea: { x: 0, y: 0 },
      usedParts: [
        { part: part, turned: false, position: { x: 0, y: 0 } },
        { part: part, turned: false, position: { x: 14, y: 0 } },
        { part: part, turned: false, position: { x: 28, y: 0 } }
      ],
      stock: stock
    };

    UsedAreaCalculation.updateUsedArea(usedStock, usedStock.usedParts, 'x');

    expect(usedStock.usedArea.x).toBe(0, 'x');
    expect(usedStock.usedArea.y).toBe(14, 'y');
  });
});
