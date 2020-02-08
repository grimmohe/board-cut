import { Material, Part, Resultset, Stock, UsedStock } from 'app/app.model';
import { ResultSvg } from 'app/svg/result-svg';

describe('ResultSvg', () => {
  const margin = 50;
  const matHeight = 100;
  const matWidth = 200;
  const matThickness = 12;
  const cutWidth = 4;
  const material: Material = { thickness: matThickness, cuttingWidth: cutWidth };
  const stock: Stock = {
    count: 1,
    height: matHeight,
    width: matWidth,
    material
  };
  const part: Part = { count: 1, height: 45, width: 180, stock, followGrain: false };

  it('should create', () => {
    expect(new ResultSvg());
  });

  it('should render blank for no results', () => {
    const draw = new ResultSvg().render(new Resultset(), false);
    expect(draw).toBeTruthy();
    expect(draw.viewbox().height).toBe(0);
    expect(draw.viewbox().width).toBe(0);
    expect(draw.svg(false)).toBeFalsy();
  });

  it('should create a valid canvas with a rect and 2 parts', () => {
    const part2Y = part.height + cutWidth;
    const resultset = new Resultset();
    resultset.usedStock.push(<UsedStock>{
      stock,
      usedParts: [
        { part, turned: false, position: { x: 0, y: 0 } },
        { part, turned: true, position: { x: 0, y: part2Y } }
      ],
      usedArea: null
    });

    const draw = new ResultSvg().render(resultset, false);
    expect(draw.viewbox().height).toBe(matHeight + 2 * margin);
    expect(draw.viewbox().width).toBe(matWidth + 2 * margin);

    const rects = draw.children().toArray();
    expect(rects.length).toBe(3);

    const rect = rects[0];
    expect(rect.x()).toBe(margin);
    expect(rect.y()).toBe(margin);
    expect(rect.width()).toBe(matWidth);
    expect(rect.height()).toBe(matHeight);

    const part1 = rects[1];
    expect(part1.x()).toBe(margin);
    expect(part1.y()).toBe(margin);
    expect(part1.width()).toBe(part.width);
    expect(part1.height()).toBe(part.height);

    const part2 = rects[2];
    expect(part2.x()).toBe(margin);
    expect(part2.y()).toBe(margin + part2Y);
    expect(part2.width()).toBe(part.height);
    expect(part2.height()).toBe(part.width);

    expect(draw.svg()).toBeTruthy();
  });

  it('should draw multiple mats', () => {
    const resultset = new Resultset();
    resultset.usedStock.push(
      <UsedStock>{
        stock,
        usedParts: [],
        usedArea: null
      },
      <UsedStock>{
        stock,
        usedParts: [],
        usedArea: null
      }
    );

    const draw = new ResultSvg().render(resultset, false);

    const mats = draw.children();
    expect(mats.length).toBe(2);
    mats.forEach((m, index) => {
      expect(m.x()).toBe(margin);
      expect(m.y()).toBe(margin + index * (margin * 2 + stock.height));
    });
  });
});
