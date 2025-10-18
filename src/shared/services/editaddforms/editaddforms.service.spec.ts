import { TestBed } from '@angular/core/testing';

import { EditaddformsService } from './editaddforms.service';

describe('EditaddformsService', () => {
  let service: EditaddformsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditaddformsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
