import { TestBed } from '@angular/core/testing';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {gestionEnseignantGuard} from './gestion-enseignant.guard';


describe('Authentifié Guard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(gestionEnseignantGuard, ['getUtilisateur']);
    mockRouter = jasmine.createSpyObj(gestionEnseignantGuard, ['navigate', 'createUrlTree', 'parseUrl'])
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, use: mockRouter},
        {provide: mockAuthService, use: mockAuthService }
      ]
    });
  });

  it('competencesGuard doit être créé', () => {
    expect(gestionEnseignantGuard).toBeTruthy();
  });
});
