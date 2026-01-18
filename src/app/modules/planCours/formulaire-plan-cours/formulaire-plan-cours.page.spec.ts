/**
 * Tests unitaires pour la page formulaire-plan-cours
 * @author Emeric Chauret
 */

import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import { FormulairePlanCoursPage } from './formulaire-plan-cours.page';
import {IonicModule, ModalController} from '@ionic/angular';
import {MockProvider} from 'ng-mocks';
import {RouterTestingModule} from '@angular/router/testing';
import {EnseignantsService} from '../../../services/enseignants/enseignants.service';
import {PlanCadresService} from '../../../services/planCadres/plan-cadres.service';
import {SessionsService} from '../../../services/sessions/sessions.service';
import {ElementCompetenceService} from '../../../services/elementsCompetences/element-competence.service';
import {of, throwError} from 'rxjs';
import {PlanCours} from '../../../models/planCours/plan-cours';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {CampusService} from '../../../services/campus/campus.service';
import {GabaritService} from '../../../services/gabarit/gabarit.service';
import {PlanCoursService} from '../../../services/planCours/plan-cours.service';
import {ProgrammeService} from '../../../services/programmes/programme.service';
import {Utilisateur} from '../../../models/utilisateurs/utilisateur';
import {AuthService} from '../../../services/auth.service';
import {Campus} from '../../../models/campus/campus';
import {Session} from '../../../models/sessions/session';
import {Programme} from '../../../models/programmes/programme';

describe('FormulairePlanCoursPage', () => {
  let component: FormulairePlanCoursPage;
  let fixture: ComponentFixture<FormulairePlanCoursPage>;
  let programmeService: ProgrammeService;
  let enseignantService: EnseignantsService;
  let campusService: CampusService;
  let sessionService: SessionsService;
  let planCoursService: PlanCoursService;
  const programme: Programme = {
    'id': 1,
    'code': '111.L1',
    'titre': 'Programme e',
    'competences': []
  };
  const utilisateur: Utilisateur = {
      id: 1,
      nom: 'Chauret',
      prenom: 'Emeric',
      courriel: 'emeric@email.qc.ca',
      courriel_verifie: new Date(),
      mot_de_passe: 'password123',
      role: 1,
  };
  const planCours: PlanCours = {
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
      'complet':true,
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
        declarations: [ FormulairePlanCoursPage ],
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
                getPlanCours: (id:number) => of({data: planCours})
            }),
            MockProvider(PlanCadresService, {
                getPlanCadres: () => of({})
            }),
            MockProvider(EnseignantsService, {
                getEnseignants: () => of({})
            }),
            MockProvider(SessionsService, {
               getSessions: () => of({})
            }),
            MockProvider(CampusService, {
                obtenirTousLesCampus: () => of({})
            }),
            MockProvider(GabaritService, {
                obtenirGabaritParId: (id:number) => of({})
            }),
            MockProvider(ElementCompetenceService, {
                getElementsComptetence: () => of({})
            }),
          MockProvider(ProgrammeService, {
            getProgramme: (id:number) => of({})
          }),
          MockProvider(AuthService, {
            getUtilisateur: () => utilisateur
          }),
          MockProvider(Router),
          MockProvider(ModalController)
        ]
    }).compileComponents();
    fixture = TestBed.createComponent(FormulairePlanCoursPage);
    component = fixture.componentInstance;
    programmeService = fixture.debugElement.injector.get(ProgrammeService);
    enseignantService = fixture.debugElement.injector.get(EnseignantsService);
    campusService = fixture.debugElement.injector.get(CampusService);
    sessionService = fixture.debugElement.injector.get(SessionsService);
    planCoursService = fixture.debugElement.injector.get(PlanCoursService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('le titre de la page doit être Modifier un plan de cours', () => {
      component.ionViewWillEnter();
      fixture.detectChanges();
      const titre = fixture.nativeElement.querySelector('h1')?.textContent; // Récupérer le titre de la page
      const titreAttendu = 'Modifier un plan de cours'; // Le titre attendu de la page
      // Tests //
      expect(titre).toBeTruthy(); // Vérifier qu'il y a un titre dans la page
      expect(titre).toEqual(titreAttendu, `Titre actuel: «${titre}»`); // Vérifier que le titre récupéré dans la page est égal au titre attendu
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

    it('l\'abonnement pour les plans-cadres doit être annulé lorsqu\'on quitte la page', () => {
        component.ionViewWillEnter();
        spyOn(component.observablePlansCadres$, 'unsubscribe');
        component.ionViewWillLeave();
        expect(component.observablePlansCadres$.unsubscribe).toHaveBeenCalled();
    });

    it('l\'abonnement pour les enseignants doit être annulé lorsqu\'on quitte la page', () => {
        component.ionViewWillEnter();
        spyOn(component.observableEnseignants$, 'unsubscribe');
        component.ionViewWillLeave();
        expect(component.observableEnseignants$.unsubscribe).toHaveBeenCalled();
    });

    it('l\'abonnement pour les enseignants doit être annulé lorsqu\'on quitte la page', () => {
        component.ionViewWillEnter();
        spyOn(component.observableSessions$, 'unsubscribe');
        component.ionViewWillLeave();
        expect(component.observableSessions$.unsubscribe).toHaveBeenCalled();
    });

    it('l\'abonnement pour les sessions doit être annulé lorsqu\'on quitte la page', () => {
        component.ionViewWillEnter();
        spyOn(component.observableSessions$, 'unsubscribe');
        component.ionViewWillLeave();
        expect(component.observableSessions$.unsubscribe).toHaveBeenCalled();
    });

    it('l\'abonnement pour les campus doit être annulé lorsqu\'on quitte la page', () => {
        component.ionViewWillEnter();
        spyOn(component.observableCampus$, 'unsubscribe');
        component.ionViewWillLeave();
        expect(component.observableCampus$.unsubscribe).toHaveBeenCalled();
    });

    it('la variable maBreadcrumbs doit être égal à 20 lorsque la méthode expandBreadcrumbs est appelée', () => {
        component.expandBreadcrumbs()
        expect(component.maxBreadcrumbs).toEqual(20);
    });

    it('la méthode comparerCampus doit doit retourner false si deux campus n\'ont pas le même id', () => {
        const campus1: Campus = {
            'id': 1,
            'nom': 'Campus 1'
        };
        const campus2: Campus = {
            'id': 2,
            'nom': 'Campus 2'
        };
        expect(component.comparerCampus(campus1, campus2)).toBeFalse();
    });

    it('la méthode comparerSession doit doit retourner true si deux sessions ont le même id', () => {
        const session1: Session = {
            'id': 1,
            'annee': 2023,
            'session': 'Automne',
            'limite_abandon': new Date(),
            'plansCadres': [],
            'plansCours': []
        };
        const session2: Session = {
            'id': 1,
            'annee': 2023,
            'session': 'Automne',
            'limite_abandon': new Date(),
            'plansCadres': [],
            'plansCours': []
        };
        expect(component.comparerSession(session1, session2)).toBeTruthy();
    });

    it('la méthode afficherErreur doit être appelée lorsque que la requête pour récupérer un programme rencontre une erreur', () => {
        spyOn(component, 'afficherErreur');
        spyOn(programmeService, 'getProgramme').withArgs(5).and.returnValue(throwError('Programme non trouvé.'));
        component.getProgramme(5);
        expect(component.afficherErreur).toHaveBeenCalled();
    });

    it('la méthode afficherErreur doit être appelée lorsque que la requête pour récupérer les enseignants rencontre une erreur', () => {
        spyOn(component, 'afficherErreur');
        spyOn(enseignantService, 'getEnseignants').and.returnValue(throwError('Aucun enseignant trouvé.'));
        component.getEnseignants();
        expect(component.afficherErreur).toHaveBeenCalled();
    });

    it('la méthode afficherErreur doit être appelée lorsque que la requête pour récupérer les campus rencontre une erreur', () => {
        spyOn(component, 'afficherErreur');
        spyOn(campusService, 'obtenirTousLesCampus').and.returnValue(throwError('Aucun campus trouvé.'));
        component.obtenirTousLesCampus();
        expect(component.afficherErreur).toHaveBeenCalled();
    });

    it('la méthode afficherErreur doit être appelée lorsque que la requête pour récupérer les sessions rencontre une erreur', () => {
        spyOn(component, 'afficherErreur');
        spyOn(sessionService, 'getSessions').and.returnValue(throwError('Aucune session trouvée.'));
        component.getSessions();
        expect(component.afficherErreur).toHaveBeenCalled();
    });

    it('la méthode afficherErreur doit être appelée lorsque que la requête pour récupérer un plan de cours rencontre une erreur', () => {
        spyOn(component, 'afficherErreur');
        spyOn(planCoursService, 'getPlanCours').withArgs(programme.id, 5).and.returnValue(throwError('Aucun plan de cours trouvé.'));
        component.getPlanCours(programme.id, 5);
        expect(component.afficherErreur).toHaveBeenCalled();
    });
});
