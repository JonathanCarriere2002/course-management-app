/**
 * Tests unitaires pour la page liste-plans-cours
 * @author Emeric Chauret
 */

import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { ListePlansCoursPage } from './liste-plans-cours.page';
import {IonicModule} from '@ionic/angular';
import {PlanCoursService} from '../../../services/planCours/plan-cours.service';
import {PlanCours} from '../../../models/planCours/plan-cours';
import {of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';
import {ProgrammeService} from '../../../services/programmes/programme.service';
import {AuthService} from '../../../services/auth.service';
import {Utilisateur} from '../../../models/utilisateurs/utilisateur';

/**
 * Tests unitaires associés au module plansCours
 * @author Emeric Chauret
 */
describe('ListePlansCoursPage', () => {
  let component: ListePlansCoursPage;
  let fixture: ComponentFixture<ListePlansCoursPage>;
  let planCoursService: PlanCoursService;
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
      'complet':true,
      'ponderationFinale': 60,
      'changement': new Date(),
      'approbationDepartement': new Date(),
      'approbationComite': new Date(),
      'depotDirectionEtudes': new Date(),
      'criteresEvaluations': [],
      'sections':[],
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
      'complet':true,
      'ponderationFinale': 60,
      'changement': new Date(),
      'approbationDepartement': new Date(),
      'approbationComite': new Date(),
      'depotDirectionEtudes': new Date(),
      'criteresEvaluations': [],
      'programme': {
        'id': 2,
        'code': '200.B0',
        'titre': 'Sciences de la nature',
        'competences': []
      },
      'competences': [],
      'sections':[],
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
  }];

  let authService: AuthService;

  const utilisateur: Utilisateur = {
    id: 1,
    nom: 'Carrière',
    prenom: 'Jonathan',
    courriel: 'jonathan1234@email.com',
    courriel_verifie: new Date(),
    mot_de_passe: 'password',
    role: 1,
  };

  // Ce qui s'exécute avant chaque test
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListePlansCoursPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        AuthService,
        MockProvider(HttpClient),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (programme_id: string, plan_cours_id: string) => '1',
              },
            },
          },
        },
        MockProvider(PlanCoursService, {
          getPlansCours: (programme_id: number) => of({data: plansCours})
        }),
        MockProvider(ProgrammeService, {
          getProgramme: (id:number) => of({})
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListePlansCoursPage);
    component = fixture.componentInstance;
    planCoursService = fixture.debugElement.injector.get(PlanCoursService);
    authService = TestBed.inject(AuthService);
    component.authService = authService;
    component.authService.setUtilisateur(utilisateur);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('le titre de la page doit être Plans de cours', () => {
    const titre = fixture.nativeElement.querySelector('h1').textContent; // Récupérer le titre de la page
    const titreAttendu = 'Plans de cours'; // Le titre attendu de la page
    // Tests
    expect(titre).toBeTruthy(); // Vérifier qu'il y a un titre dans la page
    expect(titre).toEqual(titreAttendu); // Vérifier que le titre récupéré dans la page est égal au titre attendu
  });

  it('la méthode getPlansCours doit être appelée au chargement de la page', () => {
    spyOn(planCoursService, 'getPlansCours').withArgs(programmeId).and.returnValue(of({data: plansCours}));
    component.ionViewWillEnter();
    expect(planCoursService.getPlansCours).toHaveBeenCalled();
  });

  it('l\'abonnement pour les plans de cours doit être annulé lorsqu\'on quitte la page', () => {
    component.ionViewWillEnter();
    spyOn(component.observablePlansCours$, 'unsubscribe');
    component.ionViewWillLeave();
    expect(component.observablePlansCours$.unsubscribe).toHaveBeenCalled();
  });

  it('la liste de plans de cours doit être chargée lorsque la page est affichée', () => {
    component.ionViewWillEnter();
    expect(component.plansCours).toEqual(plansCours);
  });
});
