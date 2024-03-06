import { TestBed } from '@angular/core/testing';

import { ActiveViewersService } from './active-viewers.service';

describe('ActiveViewersService', () => {
  let service: ActiveViewersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveViewersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
