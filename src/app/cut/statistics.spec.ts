import { Resultset } from 'app/app.model';
import { Statistics } from 'app/cut/statistics';

describe('Statistics', () => {
  let statistics: Statistics;

  beforeEach(() => {
    statistics = new Statistics();
  });

  it('should be created', () => {
    expect(statistics).toBeTruthy();
  });

  it('should have updateStatistics Method', () => {
    const r: Resultset = { usedStock: [] };
    statistics.updateStatistics(r);
  });

  it('should sum the stock area', () => {
    const r: Resultset = {
      usedStock: [
        {
          stock: { count: 1, width: 100, height: 25, material: null, description: '' },
          usedParts: [],
          usedArea: null
        }
      ]
    };

    statistics.updateStatistics(r);

    expect(r.stockArea).toBe(2500);
  });
});
