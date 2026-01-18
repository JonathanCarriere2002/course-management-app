import { TestBed } from '@angular/core/testing';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

/**
 * Tests unitaires associés au guard pour les administrateurs
 * @author Jonathan Carrière
 */
describe('AdminGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  /**
   * Configuration globale des tests pour le guard
   */
  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(AdminGuard, ['getUtilisateur']);
    mockRouter = jasmine.createSpyObj(AdminGuard, ['navigate', 'createUrlTree', 'parseUrl'])
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
  it('adminGuard doit se génèrer correctement', () => {
    expect(AdminGuard).toBeTruthy();
  });

});
