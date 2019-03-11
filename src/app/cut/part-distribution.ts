import { HowToFit, Part, Position, Stock, UsedPart, UsedStock } from 'app/app.model';
import { Statistics } from 'app/cut/statistics';
import { UsedAreaCalculation } from 'app/cut/used-area-calculation';

export class PartDistribution {
  static addRowFor(parts: Part[], usedStock: UsedStock): number {
    const rowParts = [...parts];
    const row: UsedPart[] = [];
    this.addToRow(rowParts, row, 'x', usedStock);

    const colParts = [...parts];
    const col: UsedPart[] = [];
    this.addToRow(colParts, col, 'y', usedStock);

    parts.length = 0;
    const freeX = usedStock.stock.width - usedStock.usedArea.x;
    const freeY = usedStock.stock.height - usedStock.usedArea.y;

    if (Statistics.getRowRatio(row, freeX, 0) > Statistics.getRowRatio(col, 0, freeY)) {
      parts.push(...rowParts);
      usedStock.usedParts.push(...row);
      UsedAreaCalculation.updateUsedArea(usedStock, row, 'x');

      return row.length;
    } else {
      parts.push(...colParts);
      usedStock.usedParts.push(...col);
      UsedAreaCalculation.updateUsedArea(usedStock, col, 'y');

      return col.length;
    }
  }

  private static addToRow(
    parts: Part[],
    usedParts: UsedPart[],
    direction: 'x' | 'y',
    usedStock: UsedStock
  ): void {
    const best = { parts: [...parts], usedParts: [...usedParts], usedRatio: 0 };
    const position = this.getNextPartPosition(usedParts, usedStock, direction);

    parts.forEach((part, partIndex) => {
      [false, true].forEach((turning) => {
        if (
          this.hinderTurning(turning, part) ||
          !this.partFits(position, part, usedStock, turning)
        ) {
          return;
        }

        const partsCopy = [...parts];
        partsCopy.splice(partIndex, 1);

        const usedPartsCopy = [...usedParts, { part: part, position: position, turned: turning }];

        this.addToRow(partsCopy, usedPartsCopy, direction, usedStock);

        const usedRatio = Statistics.getRowRatio(
          usedPartsCopy,
          direction === 'x' ? usedStock.stock.width : 0,
          direction === 'y' ? usedStock.stock.height : 0
        );

        if (usedRatio > best.usedRatio) {
          best.usedRatio = usedRatio;
          best.usedParts = usedPartsCopy;
          best.parts = partsCopy;
        }
      });
    });

    usedParts.length = 0;
    usedParts.push(...best.usedParts);

    parts.length = 0;
    parts.push(...best.parts);
  }

  private static partFits(
    position: Position,
    part: Part,
    usedStock: UsedStock,
    turning: boolean
  ): boolean {
    const width = turning ? part.height : part.width;
    const height = turning ? part.width : part.height;

    return (
      position.x + width <= usedStock.stock.width && position.y + height <= usedStock.stock.height
    );
  }

  private static hinderTurning(turning: boolean, part: Part): boolean {
    return (turning && part.followGrain) || (turning && part.width === part.height);
  }

  private static getNextPartPosition(
    usedParts: UsedPart[],
    usedStock: UsedStock,
    direction: 'x' | 'y'
  ): Position {
    const cuttingWidth = usedStock.stock.material.cuttingWidth;
    const newPosition = Object.assign({}, usedStock.usedArea);

    if (usedParts.length > 0) {
      const last = usedParts[usedParts.length - 1];
      const width = last.turned ? last.part.height : last.part.width;
      const height = last.turned ? last.part.width : last.part.height;
      if (direction === 'x') {
        newPosition.x = last.position.x + width + cuttingWidth;
      } else {
        newPosition.y = last.position.y + height + cuttingWidth;
      }
    }

    return newPosition;
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
