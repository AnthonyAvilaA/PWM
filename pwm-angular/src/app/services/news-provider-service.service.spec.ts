import { TestBed } from '@angular/core/testing';

import { NewsProviderServiceService } from './news-provider-service.service';

describe('NewsProviderServiceService', () => {
  let service: NewsProviderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsProviderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
