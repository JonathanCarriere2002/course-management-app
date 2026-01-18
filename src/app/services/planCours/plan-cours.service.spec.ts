import { TestBed } from '@angular/core/testing';
import { PlanCoursService } from './plan-cours.service';
import {HttpClient} from '@angular/common/http';
import { PlanCours } from '../../models/planCours/plan-cours';
import {of} from 'rxjs';

/**
 * Tests unitaires pour le service PlanCoursService.
 * @author Emeric Chauret
 */
describe('PlanCoursService', () => {
  let service: PlanCoursService;
  const espionHttp = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  const programmeId = 1;
  const plansCours: PlanCours[] = [{
    'id': 1,
    'plan_cadre': {
      'id': 1,
      'code': '420-1G2-HU',
      'titre': 'Logique de programmation',
      'ponderation': '3-4-4',
      'unites': 3.66,
      'attitudes': 'Rigueur',
      'ponderationFinale': 60,
      'changement': new Date(),
      'approbationDepartement': new Date(),
      'approbationComite': new Date(),
      'depotDirectionEtudes': new Date(),
      'criteresEvaluations': [],
      'complet':true,
      'programme': {
        'id': 1,
        'code': '420.B0',
        'titre': 'Programmation et sécurité',
        'competences': []
      },
      'competences': [],
      'entreVigueur': {
        'id': 1,
        'annee': 2023,
        'session': 'Automne',
        'limite_abandon': new Date(),
        'plansCadres': [],
        'plansCours': []
      },
      'coursLiesPrealablesRelatifs': [],
      'coursLiesPrealablesAbsolus': [],
      'coursLiesCorequis': [],
      'coursLiesSuivants': [],
      'sections':[],
    },
    'campus': {
      'id': 1,
      'nom': 'Gabrielle-Roy'
    },
    'session': {
      'id': 1,
      'annee': 2023,
      'session': 'Automne',
      'limite_abandon': new Date(),
      'plansCadres': [],
      'plansCours': []
    },
    'enseignants': [],
    'sections': [],
    'semaines_cours': [],
    'approbation': new Date(),
    'complet': false
    },
    {
      'id': 2,
      'plan_cadre': {
        'id': 2,
        'code': '420-2G2-HU',
        'titre': 'Programmation orientée objet',
        'ponderation': '3-4-4',
        'unites': 3.66,
        'attitudes': 'Rigueur, autonomie, son initiative et sa débrouillardise',
        'ponderationFinale': 60,
        'changement': new Date(),
        'approbationDepartement': new Date(),
        'approbationComite': new Date(),
        'depotDirectionEtudes': new Date(),
        'criteresEvaluations': [],
        'complet':true,
        'programme': {
          'id': 2,
          'code': '200.B0',
          'titre': 'Sciences de la nature',
          'competences': []
        },
        'competences': [],
        'entreVigueur': {
          'id': 2,
          'annee': 2023,
          'session': 'Été',
          'limite_abandon': new Date(),
          'plansCadres': [],
          'plansCours': []
        },
        'coursLiesPrealablesRelatifs': [],
        'coursLiesPrealablesAbsolus': [],
        'coursLiesCorequis': [],
        'coursLiesSuivants': [],
        'sections':[],
      },
      'campus': {
        'id': 2,
        'nom': 'Félix-Leclerc'
      },
      'session': {
        'id': 2,
        'annee': 2023,
        'session': 'Été',
        'limite_abandon': new Date(),
        'plansCadres': [],
        'plansCours': []
      },
      'enseignants': [],
      'sections': [],
      'semaines_cours': [],
      'approbation': new Date(),
      'complet': false
    }
  ];

  // S'exécute avant chaque test
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: espionHttp}
      ]
    });
    service = TestBed.inject(PlanCoursService);
  });

  it('Service est appelé', () => {
    expect(service).toBeTruthy();
  });

  it('la méthode getPlansCours doit retourner la liste des plans de cours', () => {
    // Spécifier ce que retourne l'espion
    espionHttp.get.and.returnValue(of({data: plansCours}));
    // Appel de la méthode testée et assertion
    service.getPlansCours(programmeId).subscribe({
      next: reponse => expect(reponse).toEqual({data: plansCours})
    });
  });

  it('la méthode getPlanCours doit retourner un plan de cours', () => {
    // Spécifier ce que retourne l'espion
    espionHttp.get.and.returnValue(of({data: plansCours[0]}));
    // Appel de la méthode testée et assertion
    service.getPlanCours(programmeId, plansCours[0].id).subscribe({
      next: reponse => expect(reponse).toEqual({data: plansCours[0]})
    });
  });

  it('la méthode createPlanCours doit retourner l\'erreur de l\'api', () => {
    // Construction de l'erreur retournée
    const error = ({
      error : {
        code: 404,
        message: 'Plan de cours non trouvé'
      }
    });
    // Spécifier ce que retourne l'espion
    espionHttp.post.and.returnValue(of(error));
    // Appel de la méthode testée et assertion
    service.createPlanCours(programmeId, plansCours[0]).subscribe({
      next: (reponse) => {
        expect(reponse.error?.message).toContain('Plan de cours non trouvé');
        expect(reponse.error?.code).toEqual(404);
      }
    });
  });

  it('la méthode deletePlanCours doit retourner l\'erreur de l\'api', () => {
    // Construction de l'erreur retournée
    const error = ({
      error : {
        code: 404,
        message: 'Plan de cours non trouvé'
      }
    });
    // Spécifier ce que retourne l'espion
    espionHttp.delete.and.returnValue(of(error));
    // Appel de la méthode testée et assertion
    service.deletePlanCours(programmeId, plansCours[0].id).subscribe({
      next: (reponse) => {
        expect(reponse.error?.message).toContain('Plan de cours non trouvé');
        expect(reponse.error?.code).toEqual(404);
      }
    });
  });

  it('la méthode updatePlanCours doit retourner l\'erreur de l\'api', () => {
    // Construction de l'erreur retournée
    const error = ({
      error : {
        code: 404,
        message: 'Plan de cours non trouvé'
      }
    });
    // Spécifier ce que retourne l'espion
    espionHttp.put.and.returnValue(of(error));
    // Appel de la méthode testée et assertion
    service.updatePlanCours(programmeId, plansCours[0].id, plansCours[0]).subscribe({
      next: (reponse) => {
        expect(reponse.error?.message).toContain('Plan de cours non trouvé');
        expect(reponse.error?.code).toEqual(404);
      }
    });
  });
});
