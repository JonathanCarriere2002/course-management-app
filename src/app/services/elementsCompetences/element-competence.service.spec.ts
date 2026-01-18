import {TestBed} from '@angular/core/testing';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {ElementCompetenceService} from './element-competence.service';
import {ElementCompetence} from '../../models/elementsCompetences/element-competence';
/* @author lebel */

describe('ElementCompetenceService', () => {
    let service: ElementCompetenceService;
    const espionHttp = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete'])
    // Element de comp ajouter
    const elementCompAjouter: ElementCompetence = {
        'id': 89,
        'numero': 1234,
        'texte': 'Element comp ajouter',
        'isExpanded': false,
        'criteresPerformance': []
    }
    // Element de comp modifie
    const elementCompModifier: ElementCompetence ={
        'id': 1,
        'numero': 2999,
        'texte': 'Maîtrise des langages bob modifier',
        'isExpanded': false,
        'criteresPerformance': []
    }
    // Liste d'element de comp
    const elementsComp: ElementCompetence[] =
    [
        {
            'id': 1,
            'numero': 101,
            'texte': 'Maîtrise des langages de programmation',
            'isExpanded': false,
            'criteresPerformance': []
        },
        {
            'id': 2,
            'numero': 102,
            'texte': 'Gestion de projet',
            'isExpanded': false,
            'criteresPerformance': [
                {
                    'id': 2.1,
                    'numero': 101,
                    'texte': 'Capacité à écrire un code propre et bien documenté',
                    'isExpanded': false
                }
            ]
        },
        {
            'id': 3,
            'numero': 103,
            'texte': 'Compétences en communication',
            'isExpanded': false,
            'criteresPerformance': []
        }
    ]

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MockProvider(HttpClient),
                {provide: HttpClient, useValue: espionHttp}
            ]
        });
        service = TestBed.inject(ElementCompetenceService);
    });

    it('Le service doit être appelé', () => {
        expect(service).toBeTruthy();
    });

    it('getElementsComptetence devrait retourner liste des elements de competence fournis par l\'api', () => {
        //Spécifier ce que retourne l'espion
        espionHttp.get.and.returnValue(of({data:elementsComp}));

        //Appel de la méthode testée et assertion
        service.getElementsComptetence().subscribe({
            next: response  => expect(response.data).toEqual(elementsComp)
        });
    });

    it('getElementComptetence devrait retourner l\'elements de competencee dont l\'id est fournit', ()=>{
        //Spécifier ce que retourne l'espion
        espionHttp.get.and.returnValue(of({data:elementCompAjouter})); //of -> getCritere retourne un observable

        //Appel de la méthode testée et assertion
        service.getElementComptetence(89).subscribe({
            next: response => expect(response.data).toEqual(elementCompAjouter)
        });
    });

    it('createElementComptetence devrait créer un element de competence', ()=>{
        // Spécifier ce que retourne l'espion
        espionHttp.post.and.returnValue({});
        // Appel de la méthode testée
        const result = service.createElementComptetence(elementCompAjouter);
        // Tester le résultat
        expect(result).toEqual(Object({}));
        expect(result).toBeDefined();
    });

    it('deleteElementComptetence devrait supprimer un element de competence', ()=>{
        // Spécifier ce que retourne l'espion
        espionHttp.delete.and.returnValue({});
        // Appel de la méthode testée
        const result = service.deleteElementComptetence(elementsComp[0].id);
        // Tester le résultat
        expect(result).toEqual(Object({}));
        expect(result).toBeDefined();
    });

    it('updateElementComptetence doit modifier un element de competencee', () => {
        // Spécifier ce que retourne l'espion
        espionHttp.put.and.returnValue({});
        // Appel de la méthode testée
        const result = service.updateElementComptetence(elementCompModifier.id, elementCompModifier);
        // Tester le résultat
        expect(result).toEqual(Object({}));
        expect(result).toBeDefined();
    });

});
