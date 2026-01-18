import { TestBed } from '@angular/core/testing';

import { PlanCadresService } from './plan-cadres.service';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';
import {PlanCadres} from '../../models/planCadres/plan-cadres';
import {of} from 'rxjs';

describe('PlanCadresService', () => {
  let service: PlanCadresService;
  const espionHttp = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  const planCadreAjouter:PlanCadres =
    {
      'code': '420-1G2-HU',
      'titre': 'Logique de programmation',
      'ponderation': '3-4-4',
      'unites': 3.66,
      'attitudes': 'Rigueur',
      'ponderationFinale': 60,
      'complet':true,
      'sections':[],
      'programme': {
        'id': 1,
        'titre': 'Programmation et sécurité',
        'code': '420.B0',
        'competences': [
          {
            'id': 2,
            'code': 'OHNO',
            'enonce': 'convallis nulla neque libero convallis eget eleifend luctus ultricies',
            'annee_devis': 2012,
            'pages_devis': '46',
            'contexte': 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.',
            'programme_id':1,
            'elementsCompetences':[]
          }
        ]
      },
      'competences': [
        {
          'id': 1,
          'competence': {
            'id': 2,
            'code': 'OHNO',
            'enonce': 'convallis nulla neque libero convallis eget eleifend luctus ultricies',
            'annee_devis': 2012,
            'pages_devis': '46',
            'contexte': 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.',
            'programme_id':1,
            'elementsCompetences':[],
          },
          'planCadre': {
            'code': '420-1G2-HU',
            'titre': 'Logique de programmation',
            'ponderation': '3-4-4',
            'unites': 3.66,
            'attitudes': 'Rigueur',
            'ponderationFinale': 60,
            'complet':true,
            'competences': [],
            'sections':[],
            'programme': {
              'id': 1,
              'titre': 'Programmation et sécurité',
              'code': '420.B0',
              'competences': [
                {
                  'id': 2,
                  'code': 'OHNO',
                  'enonce': 'convallis nulla neque libero convallis eget eleifend luctus ultricies',
                  'annee_devis': 2012,
                  'pages_devis': '46',
                  'contexte': 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.',
                  'programme_id':1,
                  'elementsCompetences':[]
                }
              ]
            },
            'criteresEvaluations': [],
            'entreVigueur': {
              'annee': 2021,
              'session': 'Automne',
              'limite_abandon': new Date(),
              'id': 21
            },
            'changement': new Date(),
            'approbationDepartement': new Date(),
            'approbationComite': new Date(),
            'depotDirectionEtudes':new Date(),
            'id': 1
          },
          'atteinte': 'Complète'
        }
      ],
      'criteresEvaluations': [
        {
          'id': 1,
          'enonce': 'Analyse d’un problème et production d’un algorithme adéquat',
          'ponderation': 30
        },
        {
          'id': 2,
          'enonce': 'Production d’un programme fonctionnel conforme aux normes et standards du cours à partir d’un algorithme ',
          'ponderation': 30
        },
        {
          'id': 3,
          'enonce': 'Repérage complet des erreurs et corrections pertinentes au code fourni ',
          'ponderation': 20
        },
        {
          'id': 4,
          'enonce': 'Production de tests adéquats selon le plan de tests fourni ',
          'ponderation': 10
        },
        {
          'id': 5,
          'enonce': 'Production d’une documentation de qualité respectueuse des normes du cours et des règles d’orthographe et de grammaire',
          'ponderation': 10
        }
      ],
      'entreVigueur': {
        'annee': 2021,
        'session': 'Automne',
        'limite_abandon': new Date(),
        'id': 21
      },
      'changement': new Date(),
      'approbationDepartement': new Date(),
      'approbationComite': new Date(),
      'depotDirectionEtudes':new Date(),
      'id': 1
    };

  const planCadreModifier:PlanCadres =
    {
      'code': '420-1G2-HU',
      'titre': 'Logique de programmation',
      'ponderation': '3-4-4',
      'unites': 3.66,
      'attitudes': 'Rigueur',
      'ponderationFinale': 60,
      'complet':true,
      'sections':[],
      'programme': {
        'id': 1,
        'titre': 'Programmation et sécurité',
        'code': '420.B0',
        'competences': [
          {
            'id': 2,
            'code': 'OHNO',
            'enonce': 'convallis nulla neque libero convallis eget eleifend luctus ultricies',
            'annee_devis': 2012,
            'pages_devis': '46',
            'contexte': 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.',
            'programme_id':1,
            'elementsCompetences':[]
          }
        ]
      },
      'competences': [
        {
          'id': 1,
          'competence': {
            'id': 2,
            'code': 'OHNO',
            'enonce': 'convallis nulla neque libero convallis eget eleifend luctus ultricies',
            'annee_devis': 2012,
            'pages_devis': '46',
            'contexte': 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.',
            'programme_id':1,
            'elementsCompetences':[],
          },
          'planCadre': {
            'code': '420-1G2-HU',
            'titre': 'Logique de programmation',
            'ponderation': '3-4-4',
            'unites': 3.66,
            'attitudes': 'Rigueur',
            'ponderationFinale': 60,
            'complet':true,
            'competences': [],
            'programme': {
              'id': 1,
              'titre': 'Programmation et sécurité',
              'code': '420.B0',
              'competences': [
                {
                  'id': 2,
                  'code': 'OHNO',
                  'enonce': 'convallis nulla neque libero convallis eget eleifend luctus ultricies',
                  'annee_devis': 2012,
                  'pages_devis': '46',
                  'contexte': 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.',
                  'programme_id':1,
                  'elementsCompetences':[]
                }
              ]
            },
            'sections':[],
            'criteresEvaluations': [],
            'entreVigueur': {
              'annee': 2021,
              'session': 'Automne',
              'limite_abandon': new Date(),
              'id': 21
            },
            'changement': new Date(),
            'approbationDepartement': new Date(),
            'approbationComite': new Date(),
            'depotDirectionEtudes':new Date(),
            'id': 1
          },
          'atteinte': 'Complète'
        }
      ],
      'criteresEvaluations': [
        {
          'id': 1,
          'enonce': 'Analyse d’un problème et production d’un algorithme adéquat',
          'ponderation': 30
        },
        {
          'id': 2,
          'enonce': 'Production d’un programme fonctionnel conforme aux normes et standards du cours à partir d’un algorithme ',
          'ponderation': 30
        },
        {
          'id': 3,
          'enonce': 'Repérage complet des erreurs et corrections pertinentes au code fourni ',
          'ponderation': 20
        },
        {
          'id': 4,
          'enonce': 'Production de tests adéquats selon le plan de tests fourni ',
          'ponderation': 10
        },
        {
          'id': 5,
          'enonce': 'Production d’une documentation de qualité respectueuse des normes du cours et des règles d’orthographe et de grammaire',
          'ponderation': 10
        }
      ],
      'entreVigueur': {
        'annee': 2021,
        'session': 'Automne',
        'limite_abandon': new Date(),
        'id': 21
      },
      'changement': new Date(),
      'approbationDepartement': new Date(),
      'approbationComite': new Date(),
      'depotDirectionEtudes':new Date(),
      'id': 2
    };

  const plansCadre:PlanCadres[] = [
    planCadreAjouter,
    planCadreModifier
  ]

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(HttpClient),
        {provide: HttpClient, useValue: espionHttp}
      ]
    });

    service = TestBed.inject(PlanCadresService);
  });

  /**
   * Test pour être sûr qu'on peut appeler le service
   */
  it('Service est appelé', () => {
    expect(service).toBeTruthy();
  });


  it('getPlanCadres devrait retourner liste des plans cadres fournis par l\'api', () => {
    //Spécifier ce que retourne l'espion
    espionHttp.get.and.returnValue(of({data:plansCadre})); //of -> getPlansCadres retourne un observable

    //Appel de la méthode testée et assertion
    service.getPlanCadres().subscribe({
      next: response  => expect(response.data).toEqual(plansCadre)
    });
  });

  it('getPlanCadre devrait retourner le plan cadre dont l\'id est fourni', ()=>{
    //Spécifier ce que retourne l'espion
    espionHttp.get.and.returnValue(of({data:planCadreAjouter})); //of -> getCritere retourne un observable

    //Appel de la méthode testée et assertion
    service.getPlanCadre(2).subscribe({
      next: response => expect(response.data).toEqual(planCadreAjouter)
    });
  });


  it('getPlansCadresParProgramme devrait retourner les plans cadres du programme', ()=>{
    espionHttp.get.and.returnValue(of({data:plansCadre}));

    service.getPlansCadresParProgramme('1').subscribe((response)=>{
      expect(response.data).toEqual(plansCadre);
    });
  });



  //Models des tests suivants pris des test de service de section de Jonathan
  it('createPlanCadres devrait créer un plan cadre', ()=>{
    // Spécifier ce que retourne l'espion
    espionHttp.post.and.returnValue({});
    // Appel de la méthode testée
    const result = service.createPlanCadres(planCadreAjouter);
    // Tester le résultat
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });

  it('deletePlanCadres devrait supprimer un plan cadre', ()=>{
    // Spécifier ce que retourne l'espion
    espionHttp.delete.and.returnValue({});
    // Appel de la méthode testée
    const result = service.deletePlanCadres(plansCadre[0].id);
    // Tester le résultat
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });

  it('updatePlanCadres doit modifier une critère', () => {
    // Spécifier ce que retourne l'espion
    espionHttp.put.and.returnValue({});
    // Appel de la méthode testée
    const result = service.updatePlanCadres(planCadreModifier.id, planCadreModifier);
    // Tester le résultat
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });



});
