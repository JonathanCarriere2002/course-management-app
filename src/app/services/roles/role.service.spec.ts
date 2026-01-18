import { TestBed } from '@angular/core/testing';
import { RoleService } from './role.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import {Role} from '../../models/roles/role';

/**
 * Tests unitaires associés au service des rôles
 * @author Jonathan Carrière
 */
describe('RoleService', () => {
  let service: RoleService;
  const espionHttpJasmine = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  const roles: Role[] = [
    {
      'id': 1,
      'nom': 'Administrateur'
    },
    {
      'id': 2,
      'nom': 'Conseiller Pédagogique'
    },
    {
      'id': 3,
      'nom': 'Service de recherche et de développement pédagogique'
    },
    {
      'id': 4,
      'nom': 'Coordonnateur'
    },
    {
      'id': 5,
      'nom': 'Enseignant'
    }
  ]

  /**
   * Configuration globale des tests pour le service des rôles
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: HttpClient, useValue: espionHttpJasmine}]
    });
    service = TestBed.inject(RoleService);
  });

  /**
   * Test unitaire permettant de vérifier si le service se génère correctement
   */
  it('doit générer le service pour les rôles', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier l'obtention de la liste des rôles
   */
  it('getRoles doit obtenir la liste des rôles', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.get.and.returnValue(of({data: roles}));
    // Obtenir la liste des rôles et vérifier la réponse
    service.getRoles().subscribe({
      next: reponse => expect(reponse).toEqual({data: roles})
    });
  });

});
