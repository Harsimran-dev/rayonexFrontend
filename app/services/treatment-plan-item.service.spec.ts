import { TestBed } from '@angular/core/testing';

import { TreatmentPlanItemService } from './treatment-plan-item.service';

describe('TreatmentPlanItemService', () => {
  let service: TreatmentPlanItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreatmentPlanItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
