import { TestBed, inject } from '@angular/core/testing';

import { AddPsychRequestService } from './add-psych-request.service';

describe('AddPsychRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddPsychRequestService]
    });
  });

  it('should be created', inject([AddPsychRequestService], (service: AddPsychRequestService) => {
    expect(service).toBeTruthy();
  }));
});
