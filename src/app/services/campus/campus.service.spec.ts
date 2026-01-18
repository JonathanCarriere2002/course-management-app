/**
 * Tests unitaires pour le service des campus.
 * @author Emeric Chauret
 */

import { TestBed } from '@angular/core/testing';

import { CampusService } from './campus.service';
import {Campus} from '../../models/campus/campus';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';

describe('CampusService', () => {
  let service: CampusService;
  const espionHttp = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  const lsCampus: Campus[] = [
    {
      'id': 1,
      'nom': 'Gabriel-Roy',
    },
    {
      'id': 2,
      'nom': 'Félix Leclerc',
    }
  ]

  // S'exécute avant chaque test
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: espionHttp}
      ]
    });
    service = TestBed.inject(CampusService);
  });

  it('Service est appelé', () => {
    expect(service).toBeTruthy();
  });

  it('la méthode obtenirTousLesCampus doit retourner la liste des campus', () => {
    // Spécifier ce que retourne l'espion
    espionHttp.get.and.returnValue(of({data: lsCampus}));
    // Appel de la méthode testée et assertion
    service.obtenirTousLesCampus().subscribe({
      next: reponse => expect(reponse).toEqual({data: lsCampus})
    });
  });

  it('la méthode obtenirCampusParId doit retourner un campus', () => {
    // Spécifier ce que retourne l'espion
    espionHttp.get.and.returnValue(of({data :lsCampus[0]}));
    // Appel de la méthode testée et assertion
    service.obtenirCampusParId(lsCampus[0].id).subscribe({
      next: reponse => expect(reponse).toEqual({data: lsCampus[0]})
    });
  });

  it('la méthode creerCampus doit retourner l\'erreur de l\'api', () => {
    // Construction de l'erreur retournée
    const error = ({
      error : {
        code: 404,
        message: 'Campus non trouvé'
      }
    });
    // Spécifier ce que retourne l'espion
    espionHttp.post.and.returnValue(of(error));
    // Appel de la méthode testée et assertion
    service.creerCampus(lsCampus[0]).subscribe({
      next: (reponse) => {
        expect(reponse.error?.message).toContain('Campus non trouvé');
        expect(reponse.error?.code).toEqual(404);
      }
    });
  });

  it('la méthode supprimerCampus doit retourner l\'erreur de l\'api', () => {
    // Construction de l'erreur retournée
    const error = ({
      error : {
        code: 404,
        message: 'Campus non trouvé'
      }
    });
    // Spécifier ce que retourne l'espion
    espionHttp.delete.and.returnValue(of(error));
    // Appel de la méthode testée et assertion
    service.supprimerCampus(lsCampus[0].id).subscribe({
      next: (reponse) => {
        expect(reponse.error?.message).toContain('Campus non trouvé');
        expect(reponse.error?.code).toEqual(404);
      }
    });
  });

  it('la méthode modifierCampus doit retourner l\'erreur de l\'api', () => {
    // Construction de l'erreur retournée
    const error = ({
      error : {
        code: 404,
        message: 'Campus non trouvé'
      }
    });
    // Spécifier ce que retourne l'espion
    espionHttp.put.and.returnValue(of(error));
    // Appel de la méthode testée et assertion
    service.modifierCampus(lsCampus[0].id, lsCampus[0]).subscribe({
      next: (reponse) => {
        expect(reponse.error?.message).toContain('Campus non trouvé');
        expect(reponse.error?.code).toEqual(404);
      }
    });
  });
});
