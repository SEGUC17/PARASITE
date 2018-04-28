import { TestBed, inject } from '@angular/core/testing';

import { PsychRequestsService } from './psych-requests.service';

describe('PsychRequestsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PsychRequestsService]
    });
  });

  it('should be created', inject([PsychRequestsService], (service: PsychRequestsService) => {
    expect(service).toBeTruthy();
  }));
});
