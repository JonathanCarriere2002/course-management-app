/**
 * @author Emeric Chauret
 */

import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import {GestionPlanCoursGuard} from './gestion-plan-cours.guard';

/**
 * Tests unitaires associés au guard pour les administrateurs
 * @author Jonathan Carrière
 */
describe('GestionPlanCoursGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  /**
   * Configuration globale des tests pour le guard
   */
  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(GestionPlanCoursGuard, ['getUtilisateur']);
    mockRouter = jasmine.createSpyObj(GestionPlanCoursGuard, ['navigate', 'createUrlTree', 'parseUrl'])
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
  it('GestionPlanCoursGuard doit se génèrer correctement', () => {
    expect(GestionPlanCoursGuard).toBeTruthy();
  });
});
