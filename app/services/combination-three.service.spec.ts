import { TestBed } from '@angular/core/testing';

import { CombinationThreeService } from './combination-three.service';

describe('CombinationThreeService', () => {
  let service: CombinationThreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CombinationThreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
