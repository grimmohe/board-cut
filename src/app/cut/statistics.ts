import { Resultset, UsedPart, UsedStock } from 'app/app.model';

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

  static getRowRatio(usedParts: UsedPart[], width: number, height: number): number {
    if (usedParts.length === 0) {
      return 0;
    }

    const min = Object.assign({}, usedParts[0].position);
    const max = Object.assign({}, usedParts[0].position);
    let partArea = 0;

    usedParts.forEach((usedPart) => {
      partArea += usedPart.part.width * usedPart.part.height;
      if (usedPart.position.x < min.x) {
        min.x = usedPart.position.x;
      }
      if (usedPart.position.y < min.y) {
        min.y = usedPart.position.y;
      }

      if (usedPart.position.x + usedPart.part.width > max.x) {
        max.x = usedPart.position.x + usedPart.part.width;
      }
      if (usedPart.position.y + usedPart.part.height > max.y) {
        max.y = usedPart.position.y + usedPart.part.height;
      }
    });

    const minMaxArea = Math.max(width, max.x - min.x) * Math.max(height, max.y - min.y);

    return partArea / minMaxArea;
  }
}
