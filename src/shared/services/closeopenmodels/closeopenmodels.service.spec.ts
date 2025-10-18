import { TestBed } from '@angular/core/testing';

import { CloseopenmodelsService } from './closeopenmodels.service';

describe('CloseopenmodelsService', () => {
  let service: CloseopenmodelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloseopenmodelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
