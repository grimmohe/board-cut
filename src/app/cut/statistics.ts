import { Resultset, Stock, UsedPart, UsedStock } from 'app/app.model';

export class Statistics {
  static getStockArea(usedStock: UsedStock[]): number {
    let stockArea = 0;

    usedStock.forEach((s) => {
      stockArea += s.stock.width * s.stock.height;
    });

    return stockArea;
  }

  static getPartsArea(usedStock: UsedStock[]): number {
    let partsArea = 0;

    usedStock.forEach((s) => {
      s.usedParts.forEach((p) => {
        partsArea += p.part.width * p.part.height;
      });
    });

    return partsArea;
  }

  static getUsageRatio(usedStock: UsedStock): number {
    const partsArea = this.getPartsArea([usedStock]);
    const stockArea = this.getStockArea([usedStock]);

    return partsArea / stockArea;
  }

  static updateStatistics(r: Resultset): void {
    r.stockArea = this.getStockArea(r.usedStock);
    r.partsArea = this.getPartsArea(r.usedStock);
    r.usageRatio = r.partsArea / r.stockArea;
  }

  static getRowRatio(usedParts: UsedPart[], stock: Stock): number {
    if (usedParts.length === 0) {
      return 0;
    }

    const min = Object.assign({}, usedParts[0].position);
    const max = Object.assign({}, usedParts[0].position);
    let partArea = 0;

    usedParts.forEach((usedPart) => {
      const width = usedPart.turned ? usedPart.part.height : usedPart.part.width;
      const height = usedPart.turned ? usedPart.part.width : usedPart.part.height;

      partArea += width * height;
      if (usedPart.position.x < min.x) {
        min.x = usedPart.position.x;
      }
      if (usedPart.position.y < min.y) {
        min.y = usedPart.position.y;
      }

      if (usedPart.position.x + width > max.x) {
        max.x = usedPart.position.x + width;
      }
      if (usedPart.position.y + height > max.y) {
        max.y = usedPart.position.y + height;
      }
    });

    const partOnStockArea = (max.x - min.x) * (max.y - min.y);
    const stockArea = stock.width * stock.height;

    return partArea / stockArea + partArea / partOnStockArea;
  }

  static getLeftoverArea(usedStock: UsedStock): number {
    return (
      (usedStock.stock.width - usedStock.usedArea.x) *
      (usedStock.stock.height - usedStock.usedArea.y)
    );
  }
}
