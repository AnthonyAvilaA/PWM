import { TestBed } from '@angular/core/testing';

import { NewsFirebaseProviderServiceService } from './news.firebase.provider.service.service';

describe('NewsFirebaseProviderServiceService', () => {
  let service: NewsFirebaseProviderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsFirebaseProviderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
