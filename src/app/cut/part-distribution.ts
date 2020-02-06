import { EventEmitter } from '@angular/core';
import { Part, Position, UsedPart, UsedStock } from 'app/app.model';
import { Statistics } from 'app/cut/statistics';
import { UsedAreaCalculation } from 'app/cut/used-area-calculation';
import { Observable } from 'rxjs';

export class PartDistribution {
  private readonly updateOnFullRowEmitter = new EventEmitter<void>();
  get updateOnFullRow(): Observable<void> {
    return this.updateOnFullRowEmitter.asObservable();
  }

  addRowFor(parts: Part[], usedStock: UsedStock): number {
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

  private addToRow(
    parts: Part[],
    usedParts: UsedPart[],
    direction: 'x' | 'y',
    usedStock: UsedStock
  ): void {
    const best = { parts: [...parts], usedParts: [...usedParts], usedRatio: 0 };
    const position = this.getNextPartPosition(usedParts, usedStock, direction);
    let rowIsFinished = true;

    parts.forEach((part, partIndex) => {
      if (parts.indexOf(part) < partIndex) {
        return;
      }

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

        if (partsCopy.length) {
          this.addToRow(partsCopy, usedPartsCopy, direction, usedStock);
          rowIsFinished = false;
        }

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

    if (rowIsFinished) {
      this.updateOnFullRowEmitter.next();
    }
  }

  private partFits(
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

  private hinderTurning(turning: boolean, part: Part): boolean {
    return (turning && part.followGrain) || (turning && part.width === part.height);
  }

  private getNextPartPosition(
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
}
