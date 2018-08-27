import { TestBed, inject } from '@angular/core/testing';

import { StoreOwnerService } from './store-owner.service';

describe('StoreOwnerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoreOwnerService]
    });
  });

  it('should be created', inject([StoreOwnerService], (service: StoreOwnerService) => {
    expect(service).toBeTruthy();
  }));
});
