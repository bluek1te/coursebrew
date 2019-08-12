import { TestBed } from '@angular/core/testing';

import { InstructorsApiService } from './instructors-api.service';

describe('InstructorsApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InstructorsApiService = TestBed.get(InstructorsApiService);
    expect(service).toBeTruthy();
  });
});
