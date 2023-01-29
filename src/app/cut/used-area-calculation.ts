import { Direction, UsedPart, UsedStock } from 'src/app/app.model';

export class UsedAreaCalculation {
  static updateUsedArea(usedStock: UsedStock, newUsedParts: UsedPart[], direction: Direction) {
    newUsedParts.forEach((usedPart) => {
      const partWidth = usedPart.turned ? usedPart.part.height : usedPart.part.width;
      const partHeight = usedPart.turned ? usedPart.part.width : usedPart.part.height;

      if (direction === 'x') {
        usedStock.usedArea.y = Math.max(
          usedStock.usedArea.y,
          usedPart.position.y + partHeight + usedStock.stock.material.cuttingWidth
        );
      } else {
        usedStock.usedArea.x = Math.max(
          usedStock.usedArea.x,
          usedPart.position.x + partWidth + usedStock.stock.material.cuttingWidth
        );
      }
    });
  }
}
