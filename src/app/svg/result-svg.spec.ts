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
    const draw = new ResultSvg().render(new Resultset());
    expect(draw).toBeTruthy();
    expect(draw.height()).toBe(0);
    expect(draw.width()).toBe(0);
    expect(draw.svg(false)).toBeFalsy();
  });

  it('should create a valid canvas with a rect and 2 parts', () => {
    const part2Y = part.height + cutWidth;
    const resultset = new Resultset();
    resultset.usedStock.push(<UsedStock>{
      stock,
      usedParts: [
        { part, turned: false, position: { x: 0, y: 0 } },
        { part, turned: false, position: { x: 0, y: part2Y } }
      ],
      usedArea: null
    });

    const draw = new ResultSvg().render(resultset);
    expect(draw.height()).toBe(matHeight + 2 * margin);
    expect(draw.width()).toBe(matWidth + 2 * margin);

    const rects = draw.children();
    expect(rects.length).toBe(1);

    rects.forEach((r) => {
      expect(r.x()).toBe(margin);
      expect(r.y()).toBe(margin);
      expect(r.width()).toBe(matWidth);
      expect(r.height()).toBe(matHeight);

      const parts = r.children().toArray();
      expect(parts.length).toBe(2);

      expect(parts[0].x()).toBe(0);
      expect(parts[0].y()).toBe(0);
      expect(parts[0].width()).toBe(part.width);
      expect(parts[0].height()).toBe(part.height);

      expect(parts[1].x()).toBe(0);
      expect(parts[1].y()).toBe(part2Y);
      expect(parts[1].width()).toBe(part.width);
      expect(parts[1].height()).toBe(part.height);
    });

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

    const draw = new ResultSvg().render(resultset);

    const mats = draw.children();
    expect(mats.length).toBe(2);
    mats.forEach((m, index) => {
      expect(m.x()).toBe(margin);
      expect(m.y()).toBe(margin + index * (margin * 2 + stock.height));
    });
  });
});
