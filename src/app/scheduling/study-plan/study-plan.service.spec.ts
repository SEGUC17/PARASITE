import { TestBed, inject } from '@angular/core/testing';

import { StudyPlanService } from './study-plan.service';

describe('StudyPlanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudyPlanService]
    });
  });

  it('should be created', inject([StudyPlanService], (service: StudyPlanService) => {
    expect(service).toBeTruthy();
  }));
});
