import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { ListePlansCadresPage } from './liste-plans-cadres.page';
import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MockModule, MockProvider} from 'ng-mocks';
import {QuillModule} from 'ngx-quill';
import {RouterTestingModule} from '@angular/router/testing';
import {PlanCadresService} from '../../../services/planCadres/plan-cadres.service';
import {CriteresEvaluationsService} from '../../../services/criteresEvaluations/criteres-evaluations.service';
import {ElementCompetenceService} from '../../../services/elementsCompetences/element-competence.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Observable, of} from 'rxjs';
import {PlanCadres} from '../../../models/planCadres/plan-cadres';
import {ProgrammeService} from '../../../services/programmes/programme.service';
import {Programme} from '../../../models/programmes/programme';


/**
 * @author Jacob Beauregard-Tousignant
 */

describe('ListePlansCadresPage', () => {
  let component: ListePlansCadresPage;
  let fixture: ComponentFixture<ListePlansCadresPage>;

  let planCadre1: PlanCadres;
  let planCadre2: PlanCadres;


  const programme1: Programme = {
    id: 1,
    code: '111.L1',
    titre: 'Programme 1',
    competences: []
  };

  const programme2: Programme = {
    id: 1,
    code: '111.L1',
    titre: 'Programme 1',
    competences: []
  };

  const listProgrammes = [programme1, programme2];




  beforeEach(waitForAsync(() => {

    planCadre1 = {
      id: 1,
      code: '111-1A1-AA',
      titre: 'Plan cadre 1',
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
        entreVigueur:{
      id: 1,
        session: 'Automne',
        annee: 2023,
        limite_abandon: new Date('2023-09-01')
    },
      criteresEvaluations:[],
        coursLiesPrealablesRelatifs:[],
      coursLiesPrealablesAbsolus:[],
      coursLiesCorequis:[],
      coursLiesSuivants:[],
      sections:[],
      changement:new Date('2023-01-01'),
      approbationComite: new Date(),
      approbationDepartement: new Date(),
      depotDirectionEtudes: new Date()

    }

    planCadre2 = {
      id: 2,
      code: '111-1A1-AA',
      titre: 'Plan cadre 1',
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
      entreVigueur:{
        id: 1,
        session: 'Automne',
        annee: 2023,
        limite_abandon: new Date('2023-09-01')
      },
      criteresEvaluations:[],
      coursLiesPrealablesRelatifs:[],
      coursLiesPrealablesAbsolus:[],
      coursLiesCorequis:[],
      coursLiesSuivants:[],
      sections:[],
      changement:new Date('2023-01-01'),
      approbationComite: new Date(),
      approbationDepartement: new Date(),
      depotDirectionEtudes: new Date()

    };



    TestBed.configureTestingModule({
      declarations: [ ListePlansCadresPage ],
      imports: [IonicModule, FormsModule, ReactiveFormsModule, MockModule(QuillModule), RouterTestingModule.withRoutes([])],
      providers: [
        MockProvider(HttpClient),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (id: number, programmeId:number) => 1,
              },
            },
          },
        },
        MockProvider(PlanCadresService),
        // {
        //   // Envoyer un paramètre pour l'id à la page
        //   provide: PlanCadresService,
        //   useValue: {
        //     snapshot: {
        //       paramMap: {
        //         get: (id: number) => 1,
        //       },
        //     },
        //   },
        // },
        {
          //Configuration des méthodes pour PlanCadreService
          provide: PlanCadresService,
          useValue: {
            snapshot: {
              paramMap: {
                get: (id: number) => 1,
              },
            },
            getPlanCadre: () => of({
              data:
                planCadre1
            }),
            getPlanCadres:()=> of([{
              data:
                planCadre1
            },
              {
                data:
                  planCadre2
              }
            ]),
            getPlansCadresParProgramme: () => of({
              data:
                [
                  planCadre1,
                  planCadre2
                ]
            }),
            createPlanCadres: () => of({}),
            updatePlanCadres: () => of({}),
          },
        },
        {
          //Configuration des méthodes de ProgrammeServices
          provide: ProgrammeService,
          useValue: {
            getProgramme: () => of({
              data: programme1
            }),
            getProgrammes: ()=>of({
              data:listProgrammes
            })
          },
        },
        MockProvider(CriteresEvaluationsService),
        MockProvider(ElementCompetenceService)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListePlansCadresPage);
    component = fixture.componentInstance;
    component.chargement = false;
    fixture.detectChanges();

    // const app = fixture.nativeElement;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Quitter devrait mettre le filtrage à tousPlanCadres', ()=>{
    component.observable$ = new Observable().subscribe();
    component.ionViewWillLeave();
    expect(component.selectionFiltragePlansCadre).toEqual('tousPlanCadres');
  });

  describe('getPlanCadre avec programmeId', ()=>{
    beforeEach(waitForAsync(() => {
      component.programmeId = planCadre1.programme.id;
      component.getPlanCadre();
    }));


    it('getPlanCadre devrait mettre le chargement à false', async () => {
      expect(component.chargement).toEqual(false);
    });
  });




  it('expandBreadCrumb devrait bien augmenter le nombre maximal de breadCrumb affiché', ()=>{
    component.expandBreadcrumbs();
    expect(component.maxBreadcrumbs).toEqual(20);
  });




});
