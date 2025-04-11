import { TestBed } from '@angular/core/testing';

import { NewsJsonProviderService } from './news.json.provider.service';

describe('NewsJsonProviderService', () => {
  let service: NewsJsonProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsJsonProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
