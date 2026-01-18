import { TestBed } from '@angular/core/testing';

import { BaseService } from './base.service';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';

describe('BaseService', () => {
  let service: BaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(HttpClient)]
    });
    service = TestBed.inject(BaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
