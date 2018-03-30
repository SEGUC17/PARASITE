import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { } from 'jasmine';

import { ActivityService } from './activity.service';

describe('ActivityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivityService]
    });
  });

  it('should be created', inject([ActivityService], (service: ActivityService) => {
    expect(service).toBeTruthy();
  }));
});
