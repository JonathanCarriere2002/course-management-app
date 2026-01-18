import { TestBed } from '@angular/core/testing';
import { CpSrdpGuard } from './cp-srdp.guard';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';


describe('cpSrdpGuard', () => {
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

  it('cpSrdpGuard doit être créé', () => {
    expect(CpSrdpGuard).toBeTruthy();
  });
});
