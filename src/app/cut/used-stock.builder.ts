import { Stock, UsedStock } from 'app/app.model';

export class UsedStockBuilder {
  static getNewUsedStock(stock: Stock, usedStocks: UsedStock[]): UsedStock {
    const usedStock: UsedStock = {
      stock: stock,
      usedParts: [],
      usedArea: { x: 0, y: 0 }
    };
    usedStocks.push(usedStock);

    stock.countLeft -= 1;

    return usedStock;
  }
}
