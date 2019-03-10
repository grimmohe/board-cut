import { HowToFit, Part, Stock, UsedPart, UsedStock } from 'app/app.model';

export class PartDistribution {
  static getRowFor(partIndex: number, parts: Part[], width: number, height: number): UsedPart[] {
    const usedParts: UsedPart[] = [];

    parts.forEach((part) => {
      usedParts.push({ part: part, position: { x: 0, y: 0 }, turned: false });
    });

    return usedParts;
  }

  static fitPartOntoStock(stock: Stock, usedStock: UsedStock, part: Part): HowToFit {
    const usedX = usedStock ? usedStock.usedArea.x : 0;
    const usedY = usedStock ? usedStock.usedArea.y : 0;

    const cutX = usedX > 0 ? stock.material.cuttingWidth : 0;
    const cutY = usedY > 0 ? stock.material.cuttingWidth : 0;

    const usableFit: HowToFit = {
      usable: true,
      turned: false,
      position: { x: 0, y: 0 }
    };

    if (stock.height >= part.height && usedX + cutX + part.width <= stock.width) {
      usableFit.position.x = usedX + cutX;

      return usableFit;
    }

    if (stock.width >= part.width && usedY + cutY + part.height <= stock.height) {
      usableFit.position.y = usedY + cutY;

      return usableFit;
    }

    if (!part.followGrain) {
      usableFit.turned = true;

      if (stock.height >= part.width && usedX + cutX + part.height <= stock.width) {
        usableFit.position.x = usedX + cutX;

        return usableFit;
      }

      if (stock.width >= part.height && usedY + cutY + part.width <= stock.height) {
        usableFit.position.y = usedY + cutY;
        usableFit.turned = true;

        return usableFit;
      }
    }

    return { usable: false, turned: null, position: null };
  }
}
