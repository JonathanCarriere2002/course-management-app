import {TestBed} from '@angular/core/testing';
import { CriterePerformanceService } from './critere-performance.service';
import {CriterePerformance} from '../../models/criteresPerformances/critere-performance';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
/* @author lebel */
describe('CriterePerformanceService', () => {
  let service: CriterePerformanceService;
  const espionHttp = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete'])
  // Critere ajoute
  const criteresPerfoAjoute: CriterePerformance =
    {
      'id': 6.4,
      'numero': 606,
      'texte': 'Critere ajoutes',
      'isExpanded': false
    }

  // Critere modifie
  const criteresPerfoModifie: CriterePerformance =
    {
      'id': 1.1,
      'numero': 9090,
      'texte': 'Capacité à écrire un code propre et bien documenté modifie',
      'isExpanded': false
    }

  // Initialiser une liste de criteres de performance
  const criteresPerfos: CriterePerformance[] =
      [
        {
          'id': 1.1,
          'numero': 101,
          'texte': 'Capacité à écrire un code propre et bien documenté',
          'isExpanded': false
        },
        {
          'id': 1.2,
          'numero': 102,
          'texte': 'Connaissance avancée de plusieurs langages de programmation',
          'isExpanded': false
        },
        {
          'id': 1.3,
          'numero': 103,
          'texte': 'Capacité à résoudre des problèmes complexes de programmation',
          'isExpanded': false
        },
        {
          'id': 2.1,
          'numero': 101,
          'texte': 'Capacité à écrire un code propre et bien documenté',
          'isExpanded': false
        },
        {
          'id': 3.1,
          'numero': 101,
          'texte': 'Capacité à écrire un code propre et bien documenté',
          'isExpanded': false
        },
        {
          'id': 3.2,
          'numero': 102,
          'texte': 'Connaissance avancée de plusieurs langages de programmation',
          'isExpanded': false
        },
        {
          'id': 3.3,
          'numero': 103,
          'texte': 'Capacité à résoudre des problèmes complexes de programmation',
          'isExpanded': false
        }
      ]

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          MockProvider(HttpClient),
          {provide: HttpClient, useValue: espionHttp}
        ]
    });
    service = TestBed.inject(CriterePerformanceService);
  });

    it('Le service doit être appelé', () => {
        expect(service).toBeTruthy();
    });

    it('getCriteresPerformance devrait retourner liste des criteres de performance fournis par l\'api', () => {
        //Spécifier ce que retourne l'espion
        espionHttp.get.and.returnValue(of({data:criteresPerfos}));

        //Appel de la méthode testée et assertion
        service.getCriteresPerformance().subscribe({
            next: response  => expect(response.data).toEqual(criteresPerfos)
        });
    });

    it('getCriterePerformance devrait retourner le critere de performance dont l\'id est fournit', ()=>{
        //Spécifier ce que retourne l'espion
        espionHttp.get.and.returnValue(of({data:criteresPerfoAjoute})); //of -> getCritere retourne un observable

        //Appel de la méthode testée et assertion
        service.getCriterePerformance(6.4).subscribe({
            next: response => expect(response.data).toEqual(criteresPerfoAjoute)
        });
    });

    it('createCriterePerformance devrait créer un critere de performance', ()=>{
        // Spécifier ce que retourne l'espion
        espionHttp.post.and.returnValue({});
        // Appel de la méthode testée
        const result = service.createCriterePerformance(criteresPerfoAjoute);
        // Tester le résultat
        expect(result).toEqual(Object({}));
        expect(result).toBeDefined();
    });

    it('deleteCriterePerformance devrait supprimer un critere de performance', ()=>{
        // Spécifier ce que retourne l'espion
        espionHttp.delete.and.returnValue({});
        // Appel de la méthode testée
        const result = service.deleteCriterePerformance(criteresPerfos[0].id);
        // Tester le résultat
        expect(result).toEqual(Object({}));
        expect(result).toBeDefined();
    });

    it('updateCriterePerformance doit modifier un critère de performance', () => {
        // Spécifier ce que retourne l'espion
        espionHttp.put.and.returnValue({});
        // Appel de la méthode testée
        const result = service.updateCriterePerformance(criteresPerfoModifie.id, criteresPerfoModifie);
        // Tester le résultat
        expect(result).toEqual(Object({}));
        expect(result).toBeDefined();
    });

});
