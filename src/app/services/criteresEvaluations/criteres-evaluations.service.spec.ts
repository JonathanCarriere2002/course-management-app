import { TestBed } from '@angular/core/testing';

import { CriteresEvaluationsService } from './criteres-evaluations.service';
import {of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CriteresEvaluations} from '../../models/critereEvaluation/criteres-evaluations';

describe('CriteresEvaluationsService', () => {
  let service: CriteresEvaluationsService;
  const espionHttp = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  const critereEvaluationPourAjouter =
      {
        'enonce': 'Production d’un programme fonctionnel conforme aux normes et standards du cours à partir d’un algorithme ',
        'ponderation': 30,
        'id': 1,
        'elementsCompetence': [
          {
            'numero': 12,
            'texte': 'ewweewrwerewrewr er',
            'id': 6,
            criteresPerformance:[],
            isExpanded:false
          }
        ]
      };

  const critereEvaluationPourMofifier:CriteresEvaluations =
      {
        'enonce': 'Production d’un programme fonctionnel conforme aux normes et standards du cours à partir d’un algorithme ',
        'ponderation': 30,
        'id': 2,
        'elementsCompetence': [
          {
            'numero': 12,
            'texte': 'ewweewrwerewrewr er',
            'id': 6,
            criteresPerformance:[],
            isExpanded:false
          }
        ]
      };


  const criteresEvaluations:CriteresEvaluations[]= [
    critereEvaluationPourAjouter,
    critereEvaluationPourMofifier
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: HttpClient, useValue: espionHttp}]
    });
    service = TestBed.inject(CriteresEvaluationsService);

  });

  /**
   * Test pour être sûr qu'on peut appeler le service
   */
  it('Service est appelé', () => {
    expect(service).toBeTruthy();
  });

  it('getCriteresEvaluations devrait retourner liste de critère d\'évaluataion fournis par l\'api', () => {
    //Spécifier ce que retourne l'espion
    espionHttp.get.and.returnValue(of({data:criteresEvaluations})); //of -> getPlansCadres retourne un observable

    //Appel de la méthode testée et assertion
    service.getCriteresEvaluations().subscribe({
      next: response  => expect(response.data).toEqual(criteresEvaluations)
    });
  });

  it('getCritereEvaluation devrait retourner le critère d\'évaluation dont l\'id est fourni', ()=>{
    //Spécifier ce que retourne l'espion
    espionHttp.get.and.returnValue(of({data:critereEvaluationPourAjouter})); //of -> getCritere retourne un observable

    //Appel de la méthode testée et assertion
    service.getCritereEvaluation(1).subscribe({
      next: response => expect(response.data).toEqual(critereEvaluationPourAjouter)
    });
  });


  //Models des tests suivants pris des test de service de section de Jonathan
  it('createCritereEvaluation devrait créer un critère', ()=>{
    // Spécifier ce que retourne l'espion
    espionHttp.post.and.returnValue({});
    // Appel de la méthode testée
    const result = service.createCritereEvaluation(critereEvaluationPourAjouter);
    // Tester le résultat
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });

  it('deleteCritereEvaluation devrait supprimer un critère', ()=>{
    // Spécifier ce que retourne l'espion
    espionHttp.delete.and.returnValue({});
    // Appel de la méthode testée
    const result = service.deleteCritereEvaluation(criteresEvaluations[0].id);
    // Tester le résultat
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });

  it('updateCritereEvaluation doit modifier une critère', () => {
    // Spécifier ce que retourne l'espion
    espionHttp.put.and.returnValue({});
    // Appel de la méthode testée
    const result = service.updateCritereEvaluation(critereEvaluationPourMofifier.id, critereEvaluationPourMofifier);
    // Tester le résultat
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });



});
