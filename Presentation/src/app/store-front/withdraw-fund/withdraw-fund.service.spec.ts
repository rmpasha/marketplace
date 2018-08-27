import { TestBed, inject } from '@angular/core/testing';

import { WithdrawFundService } from './withdraw-fund.service';

describe('WithdrawFundService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WithdrawFundService]
    });
  });

  it('should be created', inject([WithdrawFundService], (service: WithdrawFundService) => {
    expect(service).toBeTruthy();
  }));
});
