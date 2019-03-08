import { Resultset, UsedStock } from 'app/app.model';

export class Statistics {
  static getStockArea(usedStock: UsedStock[]): any {
    let stockArea = 0;

    usedStock.forEach((s) => {
      stockArea += s.stock.width * s.stock.height;
    });

    return stockArea;
  }

  static getPartsArea(usedStock: UsedStock[]): any {
    let partsArea = 0;

    usedStock.forEach((s) => {
      s.usedParts.forEach((p) => {
        partsArea += p.part.width * p.part.height;
      });
    });

    return partsArea;
  }

  static getUsageRatio(stockArea: number, partsArea: number): any {
    return partsArea / stockArea;
  }

  static updateStatistics(r: Resultset): void {
    r.stockArea = this.getStockArea(r.usedStock);
    r.partsArea = this.getPartsArea(r.usedStock);
    r.usageRatio = this.getUsageRatio(r.stockArea, r.partsArea);
  }
}
