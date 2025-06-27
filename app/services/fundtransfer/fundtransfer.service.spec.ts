import { TestBed } from '@angular/core/testing';

import { FundtransferService } from './fundtransfer.service';

describe('FundtransferService', () => {
  let service: FundtransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundtransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
