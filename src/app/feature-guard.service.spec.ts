import { TestBed, inject } from '@angular/core/testing';

import { FeatureGuardService } from './feature-guard.service';

describe('FeatureGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeatureGuardService]
    });
  });

  it('should be created', inject([FeatureGuardService], (service: FeatureGuardService) => {
    expect(service).toBeTruthy();
  }));
});
