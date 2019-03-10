import { HowToFit, Part, Position, Stock, UsedPart, UsedStock } from 'app/app.model';
import { Statistics } from 'app/cut/statistics';

export class PartDistribution {
  static getRowFor(parts: Part[], width: number, height: number): UsedPart[] {
    const rowParts = [...parts];
    const row: UsedPart[] = [];
    this.addToRow(rowParts, row, 'x', width, height);

    const colParts = [...parts];
    const col: UsedPart[] = [];
    this.addToRow(colParts, col, 'y', width, height);

    parts.length = 0;

    if (
      width - row[row.length - 1].position.x - row[row.length - 1].part.width <
      height - col[col.length - 1].position.y - col[col.length - 1].part.height
    ) {
      parts.push(...rowParts);

      return row;
    } else {
      parts.push(...colParts);

      return col;
    }
  }

  private static addToRow(
    parts: Part[],
    usedParts: UsedPart[],
    direction: 'x' | 'y',
    width: number,
    height: number
  ): void {
    const best = { parts: [...parts], usedParts: [...usedParts], usedRatio: 0 };
    const position = this.getNextPartPosition(usedParts, direction);

    parts.forEach((part, partIndex) => {
      if (position.x + part.width > width || position.y + part.height > height) {
        return;
      }

      const partsCopy = [...parts];
      partsCopy.splice(partIndex, 1);

      const usedPartsCopy = [...usedParts, { part: part, position: position, turned: false }];

      this.addToRow(partsCopy, usedPartsCopy, direction, width, height);

      const usedRatio = Statistics.getRowRatio(
        usedPartsCopy,
        direction === 'x' ? width : 0,
        direction === 'y' ? height : 0
      );

      if (usedRatio > best.usedRatio) {
        best.usedRatio = usedRatio;
        best.usedParts = usedPartsCopy;
        best.parts = partsCopy;
      }
    });

    usedParts.length = 0;
    usedParts.push(...best.usedParts);

    parts.length = 0;
    parts.push(...best.parts);
  }

  private static getNextPartPosition(usedParts: UsedPart[], direction: 'x' | 'y'): Position {
    if (usedParts.length === 0) {
      return { x: 0, y: 0 };
    }
    const last = usedParts[usedParts.length - 1];
    if (direction === 'x') {
      return { x: last.position.x + last.part.width + last.part.stock.material.cuttingWidth, y: 0 };
    } else {
      return {
        x: 0,
        y: last.position.y + last.part.height + last.part.stock.material.cuttingWidth
      };
    }
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
