/**
 * @author Emeric Chauret
 */

import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import {AfficherPlanCoursGuard} from './afficher-plan-cours.guard';

/**
 * Tests unitaires associés au guard pour les administrateurs
 * @author Jonathan Carrière
 */
describe('AfficherPlanCoursGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  /**
   * Configuration globale des tests pour le guard
   */
  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(AfficherPlanCoursGuard, ['getUtilisateur']);
    mockRouter = jasmine.createSpyObj(AfficherPlanCoursGuard, ['navigate', 'createUrlTree', 'parseUrl'])
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
  it('AfficherPlanCoursGuard doit se génèrer correctement', () => {
    expect(AfficherPlanCoursGuard).toBeTruthy();
  });
});
