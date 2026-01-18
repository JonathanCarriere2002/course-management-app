/**
 * @author Jaocb Beauregard-Tousignant
 */
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { PlanCadresPage } from './plan-cadres.page';
import {MockModule, MockProvider} from 'ng-mocks';
import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PlanCadresService} from '../../../services/planCadres/plan-cadres.service';
import {of} from 'rxjs';
import {QuillModule} from 'ngx-quill';
import {RouterTestingModule} from '@angular/router/testing';
import {CriteresEvaluationsService} from '../../../services/criteresEvaluations/criteres-evaluations.service';
import {ElementCompetenceService} from '../../../services/elementsCompetences/element-competence.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {ProgrammeService} from '../../../services/programmes/programme.service';
import {CompetencesService} from '../../../services/competences/competences.service';
import {ApiResponse} from '../../../models/authentification/api-response';
import {PlanCadres} from '../../../models/planCadres/plan-cadres';
import {SessionsService} from '../../../services/sessions/sessions.service';
import {AuthService} from '../../../services/auth.service';
import {Competence} from '../../../models/competences/competence';
import {ElementCompetence} from '../../../models/elementsCompetences/element-competence';
import {Programme} from '../../../models/programmes/programme';
import {CriteresEvaluations} from '../../../models/critereEvaluation/criteres-evaluations';
import {Session} from '../../../models/sessions/session';
import {Utilisateur} from '../../../models/utilisateurs/utilisateur';
import {LiensPlansCadres} from '../../../models/lienPlansCadres/liens-plans-cadres';
import {LienCompetencesPlansCadres} from '../../../models/lienCompetencesPlansCadres/lien-competences-plans-cadres';
import Spy = jasmine.Spy;
import {TypeSection} from '../../../models/typeSection/type-section';
import {SectionFormulaire} from '../../../models/sectionFormulaire/section-formulaire';
import {RechercheCbo} from '../../../models/RechercheCbo/recherche-cbo';
import {
  RechercheComboBoxRadioComponent
} from '../../partage/components/recherche-combo-box-radio/recherche-combo-box-radio.component';
import {GabaritService} from '../../../services/gabarit/gabarit.service';
import {Gabarit} from '../../../models/gabarit/gabarit';
import {Section} from '../../../models/section/section';


describe('PlanCadresPage', () => {
  let component: PlanCadresPage;
  let fixture: ComponentFixture<PlanCadresPage>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let planCadreService: PlanCadresService;
  let router:Router
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

  // const planCadreServiceEspion = jasmine.createSpyObj('PlanCadresService', ['getPlansCours']);

  const idUrl = 1;


  const competence1: Competence = {
    id: 1,
    code: '00Q1',
    enonce: 'Texte',
    elementsCompetences: [],
    annee_devis: 2020,
    pages_devis: '1 et 2',
    contexte: 'contexte',
    programme_id: null
  }
  const competence2: Competence = {
    id: 2,
    code: '00Q2',
    enonce: 'Texte',
    elementsCompetences: [],
    annee_devis: 2020,
    pages_devis: '1 et 2',
    contexte: 'contexte',
    programme_id: null
  }
  const listCompetences = [competence1, competence2];


  const elementCompetence1: ElementCompetence = {
    id:1,
    numero:1,
    texte:'Texte',
    criteresPerformance:[],
    isExpanded:false
  }
  const elementCompetence2: ElementCompetence = {
    id:2,
    numero:1,
    texte:'Texte',
    criteresPerformance:[],
    isExpanded:false
  };
  const listelementsCompetence = [elementCompetence1, elementCompetence2]

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

  const critereEvaluation1: CriteresEvaluations = {
    id:1,
    enonce: 'Enonce',
    ponderation:1,
    elementsCompetence:[]
  };

  const critereEvaluation2: CriteresEvaluations = {
    id:2,
    enonce: 'Enonce',
    ponderation:1,
    elementsCompetence:[]
  };

  const listCriteresEvaluation = [critereEvaluation1, critereEvaluation2];


  const session1: Session ={
    id: 1,
    session: 'Été',
    annee: 2023,
    limite_abandon: new Date('2023-06-01'),
  };

  const session2: Session ={
    id: 2,
    session: 'Été',
    annee: 2023,
    limite_abandon: new Date('2023-06-01'),
  };

  const listSessions = [session1, session2];


  const typeSection1:TypeSection = {
    id: 1,
    type: 'Texte riche'
  }

  const section1:Section = {
    id: 1,
    aide: 'Aide',
    info_suppl: 'Info supplémentaire',
    obligatoire: false,
    titre: 'Titre',
    type_section_id: typeSection1.id
  };

  const section2:Section = {
    id: 2,
    aide: 'Aide',
    info_suppl: 'Info supplémentaire',
    obligatoire: false,
    titre: 'Titre',
    type_section_id: typeSection1.id
  };

  const gabarit1:Gabarit ={
    id: 1,
    nom: 'Gabarit 1',
    sections: [section1, section2]

  }

  const sectionFormulaire1:SectionFormulaire = {
    id: 1,
    aide: 'Aide',
    info_suppl: 'Info supplémentaire',
    obligatoire: false,
    texte: 'Texte',
    titre: 'Titre',
    type_section_id: typeSection1.id
  };

  const sectionFormulaire2:SectionFormulaire = {
    id: 2,
    aide: 'Aide',
    info_suppl: 'Info supplémentaire',
    obligatoire: false,
    texte: 'Texte',
    titre: 'Titre',
    type_section_id: typeSection1.id
  };

  const listSectionsFormulaire = [sectionFormulaire1, sectionFormulaire2];

  const planCadre1: PlanCadres = {
    id: 1,
    code: '111-1A1-AA',
    titre: 'Plan cadre 1',
    ponderation: '1-1-1',
    unites: 1,
    attitudes: 'Attitudes',

    ponderationFinale: 60,
    programme:programme1,
    competences: [],
    entreVigueur:session1,
    sections: listSectionsFormulaire,
    criteresEvaluations:[],
    coursLiesPrealablesRelatifs:[],
    coursLiesPrealablesAbsolus:[],
    coursLiesCorequis:[],
    coursLiesSuivants:[],
    changement:new Date('2023-01-01'),
    approbationComite: new Date(),
    approbationDepartement: new Date(),
    depotDirectionEtudes: new Date(),
    complet: false,

  };

  const planCadre2: PlanCadres = {
    id: 2,
    code: '111-1A1-AA',
    titre: 'Plan cadre 1',
    ponderation: '1-1-1',
    unites: 1,
    attitudes: 'Attitudes',

    ponderationFinale: 60,
    programme:programme1,
    competences: [],
    entreVigueur:session1,
    sections: [],
    criteresEvaluations:[],
    coursLiesPrealablesRelatifs:[],
    coursLiesPrealablesAbsolus:[],
    coursLiesCorequis:[],
    coursLiesSuivants:[],
    changement:new Date('2023-01-01'),
    approbationComite: new Date(),
    approbationDepartement: new Date(),
    depotDirectionEtudes: new Date(),
    complet: false,

  };

  const listPlansCadres = [planCadre1, planCadre2];

  const lienPlansCadres1:LiensPlansCadres ={
    id:1,
    planCadre1: planCadre1,
    planCadre2: planCadre2,
  };

  const lienPlansCadres2:LiensPlansCadres ={
    id:2,
    planCadre1: planCadre2,
    planCadre2: planCadre1,
  }

  planCadre1.coursLiesPrealablesAbsolus = [lienPlansCadres1];
  planCadre2.coursLiesPrealablesAbsolus = [lienPlansCadres2];

  planCadre1.coursLiesPrealablesRelatifs = [lienPlansCadres1];
  planCadre2.coursLiesPrealablesRelatifs = [lienPlansCadres2];

  planCadre1.coursLiesCorequis = [lienPlansCadres1];
  planCadre2.coursLiesCorequis = [lienPlansCadres2];

  planCadre1.coursLiesSuivants = [lienPlansCadres1];
  planCadre2.coursLiesSuivants = [lienPlansCadres2];


  const lienCompetencePlanCadre1 : LienCompetencesPlansCadres = {
    id: 1,
    atteinte: 'Atteinte',
    competence: competence1,
    contexteLocal: 'Contexte local',
    planCadre: planCadre1,
    progression: 'Progression',
  };

  const lienCompetencePlanCadre2 : LienCompetencesPlansCadres = {
    id: 2,
    atteinte: 'Atteinte',
    competence: competence2,
    contexteLocal: 'Contexte local',
    planCadre: planCadre1,
    progression: 'Progression',
  };

  const lienCompetencePlanCadre3 : LienCompetencesPlansCadres = {
    id: 3,
    atteinte: 'Atteinte',
    competence: competence1,
    contexteLocal: 'Contexte local',
    planCadre: planCadre2,
    progression: 'Progression',
  };

  const lienCompetencePlanCadre4 : LienCompetencesPlansCadres = {
    id: 4,
    atteinte: 'Atteinte',
    competence: competence2,
    contexteLocal: 'Contexte local',
    planCadre: planCadre2,
    progression: 'Progression',
  };

  planCadre1.competences = [lienCompetencePlanCadre1, lienCompetencePlanCadre2];

  planCadre2.competences = [lienCompetencePlanCadre3, lienCompetencePlanCadre4];


  const listProgrammeRechercheCBO: RechercheCbo[] = listProgrammes.map(programme=> {
    const rechercheCBO:RechercheCbo = {
      text: programme.titre,
      value: programme.id.toString()

    }
    return rechercheCBO
  })


  /**
   * Espions
   */
  let spyCreerCompFormGroup: Spy;
  let spyCreerSectionFormGroup: Spy;


  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      declarations: [ PlanCadresPage ],
      imports: [IonicModule, FormsModule, ReactiveFormsModule, MockModule(QuillModule), RouterTestingModule.withRoutes([])],
      providers: [
        AuthService,
        RechercheComboBoxRadioComponent,
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
              data: planCadre1
            }),
            getPlanCadres:()=> of([{
              data: listPlansCadres
            }]),
            getPlansCadresParProgramme: () => of([{
              data: listPlansCadres
            }]),
            createPlanCadres: () => of({}),
            updatePlanCadres: () => of({}),
          },
        },
        {
          //Configuration des methodes de CompetencesService
          provide: CompetencesService,
          useValue: {
            getCompetences: () => of({
              data:listCompetences
            }),
          },
        },
        {
          //Configuration des méthodes de elementCompetenceService
          provide:ElementCompetenceService,
          useValue: {
            getElementsComptetence:()=>of({
              data:listelementsCompetence
            })
          }
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
        {
          //Configuration des méthodes de critereEvaluationService
          provide: CriteresEvaluationsService,
          useValue: {
            getCriteresEvaluations:()=>of({
              data:listCriteresEvaluation
            })
          }
        },
        {
          //Configuration des methodes de CompetencesService
          provide: SessionsService,
          useValue: {
            getSessions: () => of({
              data: listSessions,
            })
          },
        },
        {
          //Configuration des methodes de CompetencesService
          provide: GabaritService,
          useValue: {
            obtenirGabaritParId: () => of({
              data: gabarit1,
            })
          },
        }

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanCadresPage);
    component = fixture.componentInstance;
    planCadreService = TestBed.inject(PlanCadresService);
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    component.authService = authService;
    component.authService.setUtilisateur(utilisateur);

    component.programmesRecherche = listProgrammeRechercheCBO;

    fixture.detectChanges();

    // const app = fixture.nativeElement;

    spyCreerSectionFormGroup = spyOn(component, 'creerSectionFormGroup' as never);
  }));


  it('La page devrait créée', () => {
    expect(component).toBeTruthy();
  });

  describe('testIonViewWillEnter modification plan-cadre', ()=>{
    beforeEach(()=>{
      spyCreerCompFormGroup = spyOn(component, 'creerCompetenceFormGroupModification' as never);
      component.ionViewWillEnter();
    });
    it('PlanCadreId devrait être celui envoyé dans l\'URL', ()=>{
      expect(component.planCadreId).toEqual(idUrl);
    });

    it('PlanCadre devrait être celui ayant le ID de URL', ()=>{
      expect(component.planCadre).toEqual(planCadre1);
    });

    it('isEditing doit être true, puisque modification puisque ID dans URL', ()=>{
      expect(component.isEditing).toEqual(true);
    });

    it('programmeId devrait être celui du programme du plan-cadre', ()=>{
      expect(component.programmeId).toEqual(planCadre1.programme.id)
    });


    it('fonction pour créer des formGroup de compétence est appelé.', ()=>{
      expect(spyCreerCompFormGroup).toHaveBeenCalled();
    });

    it('fonction pour créer des formGroup de compétence est appelé', ()=>{
      expect(spyCreerSectionFormGroup).toHaveBeenCalled();
    });

    it('La liste des sections devrait être de la même longueur que la liste des sections du plan-cadre', ()=>{
      expect(component.lsSection.length).toEqual(planCadre1.sections.length)
    });

  });



  it('ionViewWillLeave devrait bien unsubsribe', ()=>{
    component.ionViewWillEnter();
    const spyUnsubscribe = spyOn(component.observable$, 'unsubscribe');
    component.ionViewWillLeave();
    expect(spyUnsubscribe). toHaveBeenCalled();
  });


  describe('Initialisation du formulaire', ()=>{
    it('Formulaire plan cadre est bien initialisé au chargement de la page', ()=>{
      component.ngOnInit();
      expect(component.planCadreForm).toBeTruthy()
    });


    it('Code est bien initialisé', ()=>{
      component.ngOnInit();
      expect(component.planCadreForm.get('code')).toBeTruthy();
    });

    it('Titre est bien initialisé', ()=>{
      component.ngOnInit();
      expect(component.planCadreForm.get('titre')).toBeTruthy();
    });

    it('ponderation est bien initialisé', ()=>{
      component.ngOnInit();
      expect(component.planCadreForm.get('ponderation')).toBeTruthy();
    });

    it('unites est bien initialisé', ()=>{
      component.ngOnInit();
      expect(component.planCadreForm.get('unites')).toBeTruthy();
    });



    it('ponderationFinale est bien initialisé', ()=>{
      component.ngOnInit();
      expect(component.planCadreForm.get('ponderationFinale')).toBeTruthy();
    });

    it('criteresEvaluations est bien initialisé', ()=>{
      component.ngOnInit();
      expect(component.planCadreForm.get('criteresEvaluations')).toBeTruthy();
    });



    it('programmeAffichage est bien initialisé', ()=>{
      component.ngOnInit();
      expect(component.planCadreForm.get('programmeAffichage')).toBeTruthy();
    });

    it('programme est bien initialisé', ()=>{
      component.ngOnInit();
      expect(component.planCadreForm.get('programme')).toBeTruthy();
    });


  })

  it('Fonction pour créer un plan cadre doit bien en créé un', () => {
    const mockPlanCadreService = TestBed.inject(PlanCadresService);


    const planCadreData:PlanCadres = {
      id: 2,
      code : '987-9A9-AS',
      titre : 'Titre',
      ponderation:'1-2-1',
      unites:2.33,
      attitudes:'attitudes',
      complet:true,
      ponderationFinale:60,
      competences:[],
      sections:[],
      programme:{
        id: 2,
        code: '222.L2',
        titre: 'Programme 2',
        competences: []
      },
      entreVigueur:{
        id:2,
        annee:2023,
        session:'Hiver',
        limite_abandon:new Date()
      },
      approbationDepartement:new Date(),
      approbationComite:new Date(),
      depotDirectionEtudes:new Date(),
      criteresEvaluations:[]
    };

    const createApiResponse: ApiResponse<PlanCadres> = {
      data: planCadreData,
    };
    component.programmeId = planCadreData.programme.id;

    spyOn(mockPlanCadreService, 'createPlanCadres').and.returnValue(of(createApiResponse));

    const routerEspion = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component.createPlanCadre();


    expect(routerEspion).toHaveBeenCalledWith([`/programmes/${planCadreData.programme.id}/plans-cadres`])
    //Vérifier que la méthode pour créer à bien été appelée
    expect(mockPlanCadreService.createPlanCadres).toHaveBeenCalled();
  });


  it('Fonction pour modifier un plan cadre doit bien en modifier un', () => {
    const mockPlanCadreService = TestBed.inject(PlanCadresService);


    const planCadreData:PlanCadres = {
      id: 2,
      code : '987-9A9-AS',
      titre : 'Titre',
      ponderation:'1-2-1',
      unites:2.33,
      attitudes:'attitudes',
      ponderationFinale:60,
      complet:true,
      competences:[],
      sections:[],
      programme:{
        id: 2,
        code: '222.L2',
        titre: 'Programme 2',
        competences: []
      },
      entreVigueur:{
        id:2,
        annee:2023,
        session:'Hiver',
        limite_abandon:new Date()
      },
      approbationDepartement:new Date(),
      approbationComite:new Date(),
      depotDirectionEtudes:new Date(),
      criteresEvaluations:[]
    };

    const updateApiResponse: ApiResponse<PlanCadres> = {
      data: planCadreData,
    };
    component.programmeId = planCadreData.programme.id;
    component.planCadreId = planCadreData.id

    spyOn(mockPlanCadreService, 'updatePlanCadres').and.returnValue(of(updateApiResponse));

    const routerEspion = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component.editPlanCadre();


    expect(routerEspion).toHaveBeenCalledWith([`/programmes/${planCadreData.programme.id}/plans-cadres/${planCadreData.id}`])
    //Vérifier que la méthode pour créer à bien été appelée
    expect(mockPlanCadreService.updatePlanCadres).toHaveBeenCalled();
  });


  describe('Méthode pour comparer les sessions', ()=>{
    it('Méthode pour comparer des sessions devrait retourner True si on donne 2 fois la même session', ()=>{
      expect(component.comparerSession(session1, session1)).toBeTrue();
    });

    it('Méthode pour comparer des sessions devrait retourner False si on donne pas la même session', ()=>{
      expect(component.comparerSession(session1, session2)).toBeFalse();
    });
  });



  describe('ObtenirGabaritParId', ()=>{
    beforeEach(()=>{
      component.obtenirGabaritParId(gabarit1.id);
    });
    it('Appelle bien la méthode pour créer les formGroup des sections', ()=>{
      expect(spyCreerSectionFormGroup).toHaveBeenCalled()
    });
    it('Liste des sections bien remplies', ()=>{
      expect(component.lsSection.length).toEqual(gabarit1.sections.length);
    });

  });



});
