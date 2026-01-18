import { TestBed } from '@angular/core/testing';
import { CoordonnateurGuard } from './coordonnateur.guard';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

/**
 * Tests unitaires associés au guard pour les coordonnateurs
 * @author Jonathan Carrière
 */
describe('CoordonateurGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  /**
   * Configuration globale des tests pour le guard
   */
  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(CoordonnateurGuard, ['getUtilisateur']);
    mockRouter = jasmine.createSpyObj(CoordonnateurGuard, ['navigate', 'createUrlTree', 'parseUrl'])
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, use: mockRouter},
        {provide: mockAuthService, use: mockAuthService }
      ]
    });
  });

  /**
   * Test unitaire permettant de vérifier que le guard se génère correctement
   */
  it('coordonnateurGuard doit se génèrer correctement', () => {
    expect(CoordonnateurGuard).toBeTruthy();
  });

});
