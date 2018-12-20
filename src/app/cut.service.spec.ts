import { TestBed } from '@angular/core/testing';

import { CutService } from './cut.service';

describe('CutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CutService = TestBed.get(CutService);
    expect(service).toBeTruthy();
  });
});
