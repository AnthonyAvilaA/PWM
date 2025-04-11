import { TestBed } from '@angular/core/testing';

import { CommentsFirebaseProviderServiceService } from './comments.firebase.provider.service.service';

describe('CommentsFirebaseProviderServiceService', () => {
  let service: CommentsFirebaseProviderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentsFirebaseProviderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
