import { TestBed, inject } from '@angular/core/testing';

import { PsychologistService } from './psychologist.service';

describe('AddPsychRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PsychologistService]
    });
  });

  it('should be created', inject([PsychologistService], (service: PsychologistService) => {
    expect(service).toBeTruthy();
  }));
});
