import { TestBed, inject } from '@angular/core/testing';

import { StoreFrontService } from './store-front.service';

describe('StoreFrontService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoreFrontService]
    });
  });

  it('should be created', inject([StoreFrontService], (service: StoreFrontService) => {
    expect(service).toBeTruthy();
  }));
});
