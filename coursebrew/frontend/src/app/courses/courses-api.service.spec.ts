import { TestBed } from '@angular/core/testing';

import { CoursesApiService } from './courses-api.service';

describe('CoursesApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoursesApiService = TestBed.get(CoursesApiService);
    expect(service).toBeTruthy();
  });
});
