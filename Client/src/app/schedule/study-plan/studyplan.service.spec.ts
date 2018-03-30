import { TestBed, inject } from '@angular/core/testing';

import { StudyplanService } from './studyplan.service';

describe('StudyplanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudyplanService]
    });
  });

  it('should be created', inject([StudyplanService], (service: StudyplanService) => {
    expect(service).toBeTruthy();
  }));
});
