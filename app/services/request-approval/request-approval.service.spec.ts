import { TestBed } from '@angular/core/testing';

import { RequestApprovalService } from './request-approval.service';

describe('RequestApprovalService', () => {
  let service: RequestApprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
