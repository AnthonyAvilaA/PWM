import { TestBed } from '@angular/core/testing';

import { UsersFirebaseProviderServiceService } from './users.firebase.provider.service.service';

describe('UsersFirebaseProviderServiceService', () => {
  let service: UsersFirebaseProviderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersFirebaseProviderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
