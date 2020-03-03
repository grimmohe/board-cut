import { EventEmitter } from '@angular/core';
import { Direction, Part, Position, Stock, UsedPart, UsedStock } from 'app/app.model';
import { Statistics } from 'app/cut/statistics';
import { UsedAreaCalculation } from 'app/cut/used-area-calculation';
import { Observable } from 'rxjs';

export class PartDistribution {
  private readonly updateOnFullRowEmitter = new EventEmitter<void>();
  get updateOnFullRow(): Observable<void> {
    return this.updateOnFullRowEmitter.asObservable();
  }

  fillStock(partsToDo: Part[], usedStock: UsedStock, parts: Part[], stocks: Stock[]) {
    const best = { partsToDo: [...partsToDo], usedStock: usedStock, usedParts: [], ratio: 0 };

    ['x', 'y'].forEach((direction: Direction) => {
      const partsToDoCopy = [...partsToDo];
      const usedStockCopy: UsedStock = JSON.parse(JSON.stringify(usedStock));
      const usedPartsNew: UsedPart[] = [];

      this.addToRow(partsToDoCopy, usedPartsNew, direction, usedStockCopy);
      UsedAreaCalculation.updateUsedArea(usedStockCopy, usedPartsNew, direction);
      usedStockCopy.usedParts.push(...usedPartsNew);

      if (partsToDoCopy.length < partsToDo.length) {
        this.fillStock(partsToDoCopy, usedStockCopy, parts, stocks);
      }

      const ratio = Statistics.getUsageRatio(usedStockCopy);

      if (
        ratio > best.ratio ||
        (ratio === best.ratio &&
          Statistics.getLeftoverArea(usedStockCopy) > Statistics.getLeftoverArea(best.usedStock))
      ) {
        best.partsToDo = partsToDoCopy;
        best.usedStock = usedStockCopy;
        best.ratio = ratio;
      }
    });

    this.restoreUsedStock(usedStock, best.usedStock, parts, stocks);
    partsToDo.length = 0;
    partsToDo.push(...best.partsToDo);
  }

  private restoreUsedStock(target: UsedStock, source: UsedStock, parts: Part[], stocks: Stock[]) {
    target.usedArea = source.usedArea;
    target.usedParts = source.usedParts;

    target.usedParts.forEach((usedPart) => {
      const copy = usedPart.part;
      usedPart.part = parts.find((p) => p.id === copy.id);
    });
  }

  private addToRow(
    parts: Part[],
    usedParts: UsedPart[],
    direction: Direction,
    usedStock: UsedStock
  ): void {
    const best = { parts: [...parts], usedParts: [...usedParts], usedRatio: 0 };
    const position: Position = this.getNextPartPosition(usedParts, usedStock, direction);
    let rowIsFinished = true;

    parts.forEach((part, partIndex) => {
      if (parts.indexOf(part) < partIndex) {
        return;
      }

      [false, true].forEach((turned) => {
        if (this.hinderTurning(turned, part) || !this.partFits(position, part, usedStock, turned)) {
          return;
        }

        const partsCopy = [...parts];
        partsCopy.splice(partIndex, 1);

        const usedPartsCopy = [...usedParts, <UsedPart>{ part, position, turned }];

        if (partsCopy.length) {
          this.addToRow(partsCopy, usedPartsCopy, direction, usedStock);
          rowIsFinished = false;
        }

        const usedRatio = Statistics.getRowRatio(usedPartsCopy, usedStock.stock);

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
