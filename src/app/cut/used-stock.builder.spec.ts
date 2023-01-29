import { Stock } from 'src/app/app.model';
import { UsedStockBuilder } from 'src/app/cut/used-stock.builder';

describe('getNewUsedStock', () => {
  it('should give new used stock and add to array', () => {
    const stock: Stock = {
      id: 0,
      count: 1,
      countLeft: 1,
      width: 10,
      height: 10,
      material: null,
      description: ''
    };
    const array = [];

    const result = UsedStockBuilder.getNewUsedStock(stock, array);

    expect(result).toBeTruthy();
    expect(result.stock).toBe(stock, 'stock kept');
    expect(array.length).toBe(1, 'array length');
    expect(array[0]).toBe(result, 'the right object');
    expect(stock.countLeft).toBe(0, 'availability dropped');
  });
});
