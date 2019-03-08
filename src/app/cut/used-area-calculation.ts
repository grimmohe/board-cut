import { HowToFit, Part, UsedStock } from 'app/app.model';

export class UsedAreaCalculation {
  static updateUsedArea(usedStock: UsedStock, howToFit: HowToFit, part: Part) {
    usedStock.usedArea.x = Math.max(
      usedStock.usedArea.x,
      howToFit.position.x + (howToFit.turned ? part.height : part.width)
    );
    usedStock.usedArea.y = Math.max(
      usedStock.usedArea.y,
      howToFit.position.y + (howToFit.turned ? part.width : part.height)
    );
  }
}
