import { Rect, SVG, Svg } from '@svgdotjs/svg.js';
import { Resultset, UsedStock } from 'app/app.model';

export class ResultSvg {
  /**
   * margin around every stock in the svg
   */
  stockMargin = 50;
  readonly rectAttr = { fill: '#fff', stroke: '#000', 'stroke-width': 1 };

  render(resultset: Resultset): Svg {
    const size = this.getRequiredSize(resultset.usedStock);
    const draw = SVG();
    draw.viewbox(0, 0, size[0], size[1]);

    let currentY = 0;
    resultset.usedStock.forEach((usedStock) => {
      const stockRect: Rect = this.addStock(usedStock, draw, currentY);
      currentY = stockRect.y() + stockRect.height() + this.stockMargin;
    });

    return draw;
  }

  private addStock(usedStock: UsedStock, draw: Svg, currentY: number): Rect {
    const stock = usedStock.stock;
    const stockRect = draw.rect(stock.width, stock.height);
    stockRect.x(this.stockMargin);
    stockRect.y(currentY + this.stockMargin);
    stockRect.attr(this.rectAttr);

    usedStock.usedParts.forEach((usedPart) => {
      const partRect = draw.rect(
        usedPart.turned ? usedPart.part.height : usedPart.part.width,
        usedPart.turned ? usedPart.part.width : usedPart.part.height
      );
      partRect.x(stockRect.x() + usedPart.position.x);
      partRect.y(stockRect.y() + usedPart.position.y);
      partRect.attr(this.rectAttr);
    });

    return stockRect;
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
