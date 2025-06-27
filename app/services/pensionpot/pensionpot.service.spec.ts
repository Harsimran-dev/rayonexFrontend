import { TestBed } from '@angular/core/testing';

import { PensionpotService } from './pensionpot.service';

describe('PensionpotService', () => {
  let service: PensionpotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PensionpotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
