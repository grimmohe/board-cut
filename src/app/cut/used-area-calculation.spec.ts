import { HowToFit, Part, UsedStock } from 'app/app.model';
import { UsedAreaCalculation } from 'app/cut/used-area-calculation';

describe('UsedAreaCalculation', () => {
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

    UsedAreaCalculation.updateUsedArea(usedStock, htf, part);

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

    UsedAreaCalculation.updateUsedArea(usedStock, htf, part);

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

    UsedAreaCalculation.updateUsedArea(usedStock, htf, part);

    expect(usedStock.usedArea.x).toBe(50, 'x');
    expect(usedStock.usedArea.y).toBe(100, 'y');
  });
});
