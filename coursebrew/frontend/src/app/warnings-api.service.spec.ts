import { TestBed } from '@angular/core/testing';

import { WarningsApiService } from './warnings-api.service';

describe('WarningsApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WarningsApiService = TestBed.get(WarningsApiService);
    expect(service).toBeTruthy();
  });
});
