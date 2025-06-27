import { TestBed } from '@angular/core/testing';

import { CreateTreatmentService } from './create-treatment.service';

describe('CreateTreatmentService', () => {
  let service: CreateTreatmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateTreatmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
