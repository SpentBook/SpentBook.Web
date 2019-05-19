import { TestBed } from '@angular/core/testing';

import { ServerSideValidationService } from './server-side-validation.service';

describe('ServerSideValidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerSideValidationService = TestBed.get(ServerSideValidationService);
    expect(service).toBeTruthy();
  });
});
