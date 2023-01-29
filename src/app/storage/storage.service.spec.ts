import { TestBed } from '@angular/core/testing';
import { IdService } from 'src/app/id/id.service';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [IdService] }));

  it('should be created', () => {
    const service: StorageService = TestBed.inject(StorageService);
    expect(service).toBeTruthy();
  });
});
