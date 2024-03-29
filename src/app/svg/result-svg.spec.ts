import { Material, Part, Resultset, Stock, UsedStock } from 'src/app/app.model';
import { ResultSvg } from 'src/app/svg/result-svg';

describe('ResultSvg', () => {
  const margin = 30;
  const matHeight = 100;
  const matWidth = 200;
  const matThickness = 12;
  const cutWidth = 4;
  const material: Material = { id: 0, thickness: matThickness, cuttingWidth: cutWidth };
  const stock: Stock = { id: 0, count: 1, height: matHeight, width: matWidth, material };
  const part: Part = { id: 0, count: 1, height: 45, width: 180, stock, followGrain: false };

  it('should create', () => {
    expect(new ResultSvg());
  });

  it('should render blank for no results', () => {
    const draw = new ResultSvg().render(new Resultset(), false);
    expect(draw).toBeTruthy();
    expect(draw.length).toBe(0);
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

    const drawArray = new ResultSvg().render(resultset, false);
    expect(drawArray.length).toBe(1);
    const draw = drawArray[0];
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
    expect(draw.length).toBe(2);
  });
});
