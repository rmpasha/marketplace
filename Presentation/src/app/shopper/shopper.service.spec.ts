import { TestBed, inject } from '@angular/core/testing';

import { ShopperService } from './shopper.service';

describe('ShopperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShopperService]
    });
  });

  it('should be created', inject([ShopperService], (service: ShopperService) => {
    expect(service).toBeTruthy();
  }));
});
