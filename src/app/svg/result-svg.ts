import { Rect, SVG, Svg } from '@svgdotjs/svg.js';
import { Resultset, UsedStock } from 'app/app.model';

export class ResultSvg {
  /**
   * margin around every stock in the svg
   */
  stockMargin = 50;

  render(resultset: Resultset): Svg {
    const draw = SVG();
    draw.size(...this.getRequiredSize(resultset.usedStock));

    let currentY = 0;
    resultset.usedStock.forEach((usedStock) => {
      const stockRect: Rect = this.addStock(usedStock, draw, currentY);
      currentY = stockRect.y() + stockRect.height() + this.stockMargin;
    });

    return draw;
  }

  private addStock(usedStock: UsedStock, draw: Svg, currentY: number): Rect {
    const stock = usedStock.stock;
    const rect = draw.rect(stock.width, stock.height);
    rect.x(this.stockMargin);
    rect.y(currentY + this.stockMargin);

    usedStock.usedParts.forEach((usedPart) => {
      const partRect = draw.rect(usedPart.part.width, usedPart.part.height);
      if (usedPart.turned) {
        partRect.rotate(90);
      }
      partRect.x(usedPart.position.x);
      partRect.y(usedPart.position.y);
      partRect.width(usedPart.part.width);
      partRect.height(usedPart.part.height);

      rect.add(partRect);
    });

    return rect;
  }

  private getRequiredSize(usedStock: UsedStock[]) {
    let width = 0;
    let height = 0;

    usedStock.forEach((s) => {
      width = Math.max(width, s.stock.width + 2 * this.stockMargin);
      height += s.stock.height + 2 * this.stockMargin;
    });

    return [width, height];
  }
}
