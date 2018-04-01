import { TestBed, inject } from '@angular/core/testing';

import { ProductRequestsService } from './product-requests.service';

describe('ProductRequestsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductRequestsService]
    });
  });

  it('should be created', inject([ProductRequestsService], (service: ProductRequestsService) => {
    expect(service).toBeTruthy();
  }));
});
