import { Rect, SVG, Svg } from '@svgdotjs/svg.js';
import { Resultset, Stock, UsedPart, UsedStock } from 'app/app.model';

export class ResultSvg {
  /**
   * margin around every stock in the svg
   */
  stockMargin = 50;
  readonly rectAttr = { fill: '#fff', stroke: '#000', 'stroke-width': 1 };
  readonly fontAttr = { family: 'Helvetica', size: 10 };

  render(resultset: Resultset, addText: boolean): Svg {
    const size = this.getRequiredSize(resultset.usedStock);
    const draw = SVG();
    draw.viewbox(0, 0, size[0], size[1]);

    let currentY = 0;
    resultset.usedStock.forEach((usedStock) => {
      const stockRect: Rect = this.addStock(usedStock, draw, currentY, addText);
      currentY = stockRect.y() + stockRect.height() + this.stockMargin;
    });

    return draw;
  }

  private addStock(usedStock: UsedStock, draw: Svg, currentY: number, addText: boolean): Rect {
    const stock = usedStock.stock;
    const stockRect = draw.rect(stock.width, stock.height);
    stockRect.x(this.stockMargin);
    stockRect.y(currentY + this.stockMargin);
    stockRect.attr(this.rectAttr);

    if (addText) {
      this.addStockText(draw, stockRect, usedStock);
    }

    usedStock.usedParts.forEach((usedPart) => {
      const partRect = draw.rect(
        usedPart.turned ? usedPart.part.height : usedPart.part.width,
        usedPart.turned ? usedPart.part.width : usedPart.part.height
      );
      partRect.x(stockRect.x() + usedPart.position.x);
      partRect.y(stockRect.y() + usedPart.position.y);
      partRect.attr(this.rectAttr);

      if (addText) {
        this.addPartText(draw, partRect, usedPart);
      }
    });

    return stockRect;
  }

  private addStockText(draw: Svg, stockRect: Rect, usedStock: UsedStock) {
    const stockText = draw.plain(this.getStockText(usedStock.stock));
    stockText.font(this.fontAttr);
    stockText.x(stockRect.x());
    stockText.y(stockRect.y() - this.fontAttr.size * 1.5);
  }

  private addPartText(draw: Svg, partRect: Rect, usedPart: UsedPart): void {
    if (usedPart.part.description) {
      const partText = draw.text(usedPart.part.description);
      partText.font(this.fontAttr).build(true);
      partText.x(partRect.x() + partRect.width() / 3);
      partText.y(partRect.y() + partRect.height() / 2 - this.fontAttr.size / 2);
    }

    const widthText = draw.plain(
      String(usedPart.turned ? usedPart.part.height : usedPart.part.width)
    );
    widthText.font(this.fontAttr);
    widthText.x(partRect.x() + this.fontAttr.size);
    widthText.y(partRect.y() + this.fontAttr.size / 2);

    const heightText = draw.plain(
      String(usedPart.turned ? usedPart.part.width : usedPart.part.height)
    );
    heightText.font(this.fontAttr);
    heightText.x(partRect.x());
    heightText.y(partRect.y() + partRect.height() - heightText.text().length * this.fontAttr.size);
    heightText.rotate(-90);
  }

  private getStockText(stock: Stock): string {
    return `${stock.description} ${stock.width}x${stock.height} (${stock.material.description})`;
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
