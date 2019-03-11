import { Direction, UsedPart, UsedStock } from 'app/app.model';

export class UsedAreaCalculation {
  static updateUsedArea(usedStock: UsedStock, newUsedParts: UsedPart[], direction: Direction) {
    newUsedParts.forEach((usedPart) => {
      if (direction === 'x') {
        usedStock.usedArea.y = Math.max(
          usedStock.usedArea.y,
          usedPart.position.y + usedPart.part.height + usedStock.stock.material.cuttingWidth
        );
      } else {
        usedStock.usedArea.x = Math.max(
          usedStock.usedArea.x,
          usedPart.position.x + usedPart.part.width + usedStock.stock.material.cuttingWidth
        );
      }
    });
  }
}
