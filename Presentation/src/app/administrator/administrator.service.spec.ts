import { TestBed, inject } from '@angular/core/testing';

import { AdministratorService } from './administrator.service';

describe('AdministratorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdministratorService]
    });
  });

  it('should be created', inject([AdministratorService], (service: AdministratorService) => {
    expect(service).toBeTruthy();
  }));
});
