import { TestBed, inject } from '@angular/core/testing';

import { YoutubeApiService } from './youtube-api.service';

describe('YoutubeApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YoutubeApiService]
    });
  });

  it('should be created', inject([YoutubeApiService], (service: YoutubeApiService) => {
    expect(service).toBeTruthy();
  }));
});
