import { TestBed } from '@angular/core/testing';

import { authentifieGuard } from './authentifie.guard';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {CpSrdpGuard} from '../cpSrdp/cp-srdp.guard';

describe('authentifiGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(CpSrdpGuard, ['getUtilisateur']);
    mockRouter = jasmine.createSpyObj(CpSrdpGuard, ['navigate', 'createUrlTree', 'parseUrl'])
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, use: mockRouter},
        {provide: mockAuthService, use: mockAuthService }
      ]
    });
  });

  it('authentifieGuard doit être créé', () => {
    expect(authentifieGuard).toBeTruthy();
  });
});

