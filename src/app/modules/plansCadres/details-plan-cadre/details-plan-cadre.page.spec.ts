import { ComponentFixture, TestBed} from '@angular/core/testing';
import { DetailsPlanCadrePage } from './details-plan-cadre.page';

import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MockModule, MockProvider} from 'ng-mocks';
import {QuillModule} from 'ngx-quill';
import {RouterTestingModule} from '@angular/router/testing';
import {PlanCadresService} from '../../../services/planCadres/plan-cadres.service';
import {of} from 'rxjs';
import {CriteresEvaluationsService} from '../../../services/criteresEvaluations/criteres-evaluations.service';
import {ElementCompetenceService} from '../../../services/elementsCompetences/element-competence.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {CompetencesService} from '../../../services/competences/competences.service';
import {ProgrammeService} from '../../../services/programmes/programme.service';
import {PlanCadres} from '../../../models/planCadres/plan-cadres';
import {AuthService} from '../../../services/auth.service';
import {Utilisateur} from '../../../models/utilisateurs/utilisateur';
import Spy = jasmine.Spy;

describe('DetailsPlanCadrePage', () => {
  let component: DetailsPlanCadrePage;
  let fixture: ComponentFixture<DetailsPlanCadrePage>;
  let router:Router
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let planCadreService: PlanCadresService;

  // let router:Router

  let titre:string;


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

  const planCadre:PlanCadres = {
    id: 1,
    code: '111-1A1-AA',
    titre: 'Logique de programmation',
    ponderation: '1-1-1',
    unites: 1,
    attitudes: 'Attitudes',
    complet:true,
    ponderationFinale: 60,
    programme:{
      id: 1,
      titre: 'Programme 1',
      code: '111.A1',
      competences: []
    },
    competences: [],
    sections:[],
    entreVigueur:{
      id: 1,
      session: 'Automne',
      annee: 2023,
      limite_abandon:new Date()
    },
    criteresEvaluations:[],
    coursLiesPrealablesRelatifs:[],
    coursLiesPrealablesAbsolus:[],
    coursLiesCorequis:[],
    coursLiesSuivants:[],
    changement:new Date(),
    approbationDepartement:new Date(),
    approbationComite:new Date(),
    depotDirectionEtudes:new Date(),

  }

  let routerEspion: Spy;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [ DetailsPlanCadrePage ],
      imports: [IonicModule, FormsModule, ReactiveFormsModule, MockModule(QuillModule), RouterTestingModule.withRoutes([])],
      providers: [
        AuthService,
        MockProvider(HttpClient),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (id: number) => 1,
              },
            },
          },
        },
        {
          //Configuration des méthodes pour PlanCadreService
          provide: PlanCadresService,
          useValue: {
            getPlanCadre: () => of({
              data:
                planCadre
            }),
            createPlanCadres: () => of({}),
            updatePlanCadres: () => of({}),
            deletePlanCadres: () => of({}),
          },
        },
        {
          //Configuration des methodes de CompetencesService
          provide: CompetencesService,
          useValue: {
            getCompetences: () => of({
              data:{
                id: 1,
                code: 'A001',
                titre: 'Competence 1'
              }
            }),
          },
        },
        {
          //Configuration des méthodes de elementCompetenceService
          provide:ElementCompetenceService,
          useValue: {
            getElementsComptetence:()=>of({
              data:{
                id:1,
                numero:'1',
                texte:'Texte',
                criteresPerformance:[],
                isExpanded:0
              }
            })
          }
        },
        {
          //Configuration des méthodes de ProgrammeServices
          provide: ProgrammeService,
          useValue: {
            getProgramme: () => of({
              data: {
                id: 1,
                code: '111.L1',
                titre: 'Programme 1',
                competences: []
              }
            })
          },
        },
        {
          //Configuration des méthodes de critereEvaluationService
          provide: CriteresEvaluationsService,
          useValue: {
            getCriteresEvaluations:()=>of({
              data:{
                id:1,
                enonce: 'Enonce',
                ponderation:1,
                elementsCompetence:[]
              }
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsPlanCadrePage);
    component = fixture.componentInstance;
    planCadreService = TestBed.inject(PlanCadresService);
    // router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    component.authService = authService;
    component.authService.setUtilisateur(utilisateur);
    component.planCadre = planCadre;
    fixture.detectChanges();

    const app = fixture.nativeElement;
    titre = app.querySelector('h1').textContent.trim();

    /**
     * Espions
     */
    routerEspion = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Titre devrait être le titre du cours donné, soit Logique de programmation:',()=>{
    component.ionViewWillEnter();
    fixture.detectChanges();
    const app = fixture.nativeElement;
    titre = app.querySelector('#titrePlanCadre').textContent.trim();
    expect(titre).toEqual(planCadre.titre);
  });

  it('Le plan cadre du component devrait être le plan cadre fourni, soit le cours de Logique de programmation:',()=>{
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.planCadre).toEqual(planCadre);
  });


  it('ionViewWillLeave devrait bien unsubsribe', ()=>{
    component.ionViewWillEnter();
    const spyUnsubscribe = spyOn(component.observable$, 'unsubscribe');
    component.ionViewWillLeave();
    expect(spyUnsubscribe). toHaveBeenCalled();
  });

  it('expandBreadCrumb devrait bien augmenter le nombre maximal de breadCrumb affiché', ()=>{
    component.expandBreadcrumbs();
    expect(component.maxBreadcrumbs).toEqual(20);
  });


  it('Une redirection se fait bien après delete', ()=>{
    component.delete(1);
    expect(routerEspion).toHaveBeenCalledWith(['/programmes', component.planCadre?.programme.id, 'plans-cadres'])
  });

  it('getPLanCadre devrait assigner le plan cadre à la propriété plan-cadre', ()=>{
    component.getPlanCadre(1);
    expect(component.planCadre).toEqual(planCadre);
  });





});
