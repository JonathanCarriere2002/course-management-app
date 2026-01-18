/**
 * Tests unitaires pour la page details-plan-cours
 * @author Emeric Chauret
 */

import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { DetailsPlanCoursPage } from './details-plan-cours.page';
import {IonicModule, ModalController} from '@ionic/angular';
import { MockProvider} from 'ng-mocks';
import {RouterTestingModule} from '@angular/router/testing';
import {PlanCoursService} from '../../../services/planCours/plan-cours.service';
import {PlanCours} from '../../../models/planCours/plan-cours';
import {of, throwError} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ProgrammeService} from '../../../services/programmes/programme.service';
import {Programme} from '../../../models/programmes/programme';
import {AuthService} from '../../../services/auth.service';
import {Utilisateur} from '../../../models/utilisateurs/utilisateur';

describe('DetailsPlanCoursPage', () => {

  let component: DetailsPlanCoursPage;
  let fixture: ComponentFixture<DetailsPlanCoursPage>;
  let programmeService: ProgrammeService;
  let planCoursService: PlanCoursService;
  const utilisateur: Utilisateur = {
    id: 1,
    nom: 'Chauret',
    prenom: 'Emeric',
    courriel: 'emeric@email.qc.ca',
    courriel_verifie: new Date(),
    mot_de_passe: 'password123',
    role: 1,
  };
  const programme: Programme = {
    'id': 1,
    'code': '111.L1',
    'titre': 'Programme e',
    'competences': []
  }
  const planCours: PlanCours = {
    'id': 1,
    'cree_par': {
      id: 2,
      nom: 'Carrière',
      prenom: 'Jonathan',
      courriel: 'jonathan1234@email.com',
      courriel_verifie: new Date(),
      mot_de_passe: 'password',
      role: 1,
    },
    'plan_cadre': {
      'id': 1,
      'code': '420-1G2-HU',
      'titre': 'Logique de programmation',
      'ponderation': '3-4-4',
      'unites': 3.66,
      'attitudes': 'Rigueur',
      'ponderationFinale': 60,
      'complet':true,
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
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsPlanCoursPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
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
          getPlanCours: (programme_id: number, plan_cours_id: number) => of({data: planCours})
        }),
        MockProvider(ProgrammeService, {
          getProgramme: (id: number) => of({data: programme})
        }),
        MockProvider(Router),
        MockProvider(ModalController),
        MockProvider(AuthService, {
          getUtilisateur: () => utilisateur
        })
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(DetailsPlanCoursPage);
    component = fixture.componentInstance;
    programmeService = fixture.debugElement.injector.get(ProgrammeService);
    planCoursService = fixture.debugElement.injector.get(PlanCoursService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("le dernier ion-breadcrumb dans le ion-breadcrumbs doit avoir le texte Détails d'un plan de cours", () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const detailsPlanCoursElement: HTMLElement = fixture.nativeElement;
    const texte = detailsPlanCoursElement.querySelector('ion-breadcrumbs ion-breadcrumb:last-child')?.textContent; // Récupérer le texte du dernier ion-breadcrumb
    const texteAttendu = planCours.plan_cadre?.code; // Le texte attendu
    // Tests //
    expect(texte).toBeTruthy(); // Vérifier que le dernier ion-breadcrumb dans le ion-breadcrumbs existe
    expect(texte).toEqual(texteAttendu); // Vérifier que le texte récupéré est égal au texte attendu
  });

  it('la variable planCoursId doit être égal à 1 au chargement de la page', () => {
    component.ionViewWillEnter();
    expect(component.planCoursId).toEqual(1);
  });

  it('la variable planCours doit être égale au plan de cours ayant l\'identifiant 1', () => {
    component.ionViewWillEnter();
    expect(component.planCours).toEqual(planCours);
  });

  it('l\'abonnement pour le plan de cours doit être annulé lorsqu\'on quitte la page', () => {
    component.ionViewWillEnter();
    spyOn(component.observablePlanCours$, 'unsubscribe');
    component.ionViewWillLeave();
    expect(component.observablePlanCours$.unsubscribe).toHaveBeenCalled();
  });

  it('la méthode getPlanCours doit être appelée au chargement de la page', () => {
    spyOn(planCoursService, 'getPlanCours').withArgs(programme.id, planCours.id).and.returnValue(of({data: planCours}));
    component.ionViewWillEnter();
    expect(planCoursService.getPlanCours).toHaveBeenCalled();
  });

  it('la méthode afficherErreur doit être appelée lorsque que la requête pour récupére un plan de cours rencontre une erreur', () => {
    spyOn(component, 'afficherErreur');
    spyOn(planCoursService, 'getPlanCours').withArgs(programme.id, 5).and.returnValue(throwError('Plan de cours non trouvé.'));
    component.getPlanCours(programme.id,5);
    expect(component.afficherErreur).toHaveBeenCalled();
  });

  it('la méthode getProgramme doit être appelée au chargement de la page', () => {
    spyOn(programmeService, 'getProgramme').withArgs(programme.id).and.returnValue(of({data: programme}));
    component.ionViewWillEnter();
    expect(programmeService.getProgramme).toHaveBeenCalled();
  });

  it('la méthode afficherErreur doit être appelée lorsque que la requête pour récupérer un programme rencontre une erreur', () => {
    spyOn(component, 'afficherErreur');
    spyOn(programmeService, 'getProgramme').withArgs(5).and.returnValue(throwError('Programme non trouvé.'));
    component.getProgramme(5);
    expect(component.afficherErreur).toHaveBeenCalled();
  });

  it('la variable maBreadcrumbs doit être égal à 20 lorsque la méthode expandBreadcrumbs est appelée', () => {
    component.expandBreadcrumbs()
    expect(component.maxBreadcrumbs).toEqual(20);
  });

  it('la méthode deletePlanCours doit appelée la méthode deletePlanCours du service des plans de cours', () => {
    component.programmeId = programme.id;
    spyOn(planCoursService, 'deletePlanCours').withArgs(programme.id, planCours.id).and.returnValue(of({}));
    component.deletePlanCours(planCours.id);
    expect(planCoursService.deletePlanCours).toHaveBeenCalled();
  });

  it('la méthode afficherErreur doit être appelée lorsque que la requête pour supprimer un plan de cours rencontre une erreur', () => {
    component.programmeId = programme.id;
    spyOn(component, 'afficherErreur');
    spyOn(planCoursService, 'deletePlanCours').withArgs(programme.id, 5).and.returnValue(throwError('Plan de cours non trouvé.'));
    component.deletePlanCours(5);
    expect(component.afficherErreur).toHaveBeenCalled();
  });

  it('la méthode assemblerTitrePlanCadre retourne une chaine vide si le plan-cadre est null', () => {
    expect(component.assemblerTitrePlanCadre(null)).toEqual('');
  });
});
