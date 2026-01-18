import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { FormulaireProgrammesPage } from './formulaire-programmes.page';
import {IonicModule, ModalController} from '@ionic/angular';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';
import {ProgrammeService} from '../../../services/programmes/programme.service';
import {CompetencesService} from '../../../services/competences/competences.service';
import {ApiResponse} from '../../../models/authentification/api-response';
import {Competence} from '../../../models/competences/competence';
import {Programme} from '../../../models/programmes/programme';
/**
 * Tests unitaires afin de tester les methodes du formulaire de programme
 * @author Samir El Haddaji
 */
describe('FormulaireProgrammesPage', () => {
  let component: FormulaireProgrammesPage;
  let fixture: ComponentFixture<FormulaireProgrammesPage>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let programService: ProgrammeService;
  let router: Router;

  /**
   * Configuration globale des tests avec un MockProvider
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormulaireProgrammesPage],
      imports: [IonicModule],
      providers: [
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
          //Configuration des methodes de ProgrammeServices
          provide: ProgrammeService,
          useValue: {
            getProgramme: () => of({ data: { id: 1, code: '111.L1', titre: 'Programme 1', competences: [] } }),
            createProgramme: () => of({}),
            updateProgramme: () => of({}),
          },
        },
        {
          //Configuration des methodes de CompetencesService
          provide: CompetencesService,
          useValue: {
            getCompetences: () => of([{ id: 1, code: 'A001', titre: 'Competence 1' }]),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(FormulaireProgrammesPage);
    component = fixture.componentInstance;
    programService = TestBed.inject(ProgrammeService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  }));

  //Test qui vérifie que la page est crée
  it('Doit créer la page', () => {
    expect(component).toBeTruthy();
  });

  //Test qui vérifie que le formulaire est initiée dans le ngOnInit
  it('Doit initialiser le formulaire', () => {
    component.ngOnInit();
    expect(component.programmeForm).toBeTruthy();
    expect(component.programmeForm.get('titre')).toBeTruthy();
    expect(component.programmeForm.get('code')).toBeTruthy();
  });

  //Test qui vérifie qu'on peut récuperer un programme spécifique avec getProgramme
  it('Doit récuperer un programme spécifique', () => {
    component.getProgramme(1);
    expect(component.programme.id).toBe(1);
    expect(component.programme.code).toBe('111.L1');
    expect(component.programme.titre).toBe('Programme 1');
    expect(component.competencesSelectionnes.length).toBe(0);
  });

  //Test qui vérifie qu'on peut créer un nouveau programme avec createProgramme
  it('Doit créer un nouveau programme', () => {
    const mockProgrammeService = TestBed.inject(ProgrammeService);
    const programData = { id: 1, titre: 'Nouveau Programme', code: 'P002', competences: [] };

    const createApiResponse: ApiResponse<Programme> = {
      data: programData,
    };

    spyOn(mockProgrammeService, 'createProgramme').and.returnValue(of(createApiResponse));

    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component.createProgrammeFormulaire();

    expect(navigateSpy).toHaveBeenCalledWith(['/programmes']);
    expect(mockProgrammeService.createProgramme).toHaveBeenCalled();
  });


  //Test qui vérifie qu'on peut mettre a jour un programme avec updateProgramme
  it('Doit mettre à jour un programme existant', () => {
    const mockProgrammeService = TestBed.inject(ProgrammeService);
    const programData = { id:1, titre: 'Programme MisAJour', code: 'P001', competences: [] };

    const updateApiResponse: ApiResponse<Programme> = {
      data: programData,
    };

    spyOn(mockProgrammeService, 'updateProgramme').and.returnValue(of(updateApiResponse));

    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component.updateProgramme();

    expect(navigateSpy).toHaveBeenCalledWith(['/programmes']);
    expect(mockProgrammeService.updateProgramme).toHaveBeenCalled();
  });


  //Test qui vérifie qu'on peut recuperer la liste de compétences avec getCompetences
  it('Doit récuperer liste compétence', () => {
    const mockCompetencesService = TestBed.inject(CompetencesService);
    const expectedCompetences = [
        {
          id: 1,
          code: 'A001',
          titre:
              'Competence 1',
              'enonce': 'test',
              'annee_devis': 0,
              'pages_devis': 'test',
              'contexte': 'test',
              'programme_id': 0,
              'elementsCompetences': []
        }];

    const apiResponse: ApiResponse<Competence[]> = {data: expectedCompetences};

    spyOn(mockCompetencesService, 'getCompetences').and.returnValue(of(apiResponse));

    component.getCompetences();

    expect(component.lsCompetence.length).toBe(1);
    expect(component.lsCompetence[0].id).toBe(1);
    expect(component.lsCompetence[0].code).toBe('A001');
  });


  //Test qui vérifie quon peut créer un form group competences
  it('Doit créer le form group compétence', () => {
    const competenceFormGroup = component.createCompetenceFormGroup({
      id: 1,
      code: 'C001',
      enonce: 'Enonce 1',
      annee_devis: 2023,
      pages_devis: 'page',
      contexte: 'Contexte 1',
      programme_id : 0,
      elementsCompetences : []
    });

    expect(competenceFormGroup.get('id')?.value).toBe(1);
    expect(competenceFormGroup.get('code')?.value).toBe('C001');
    expect(competenceFormGroup.get('enonce')?.value).toBe('Enonce 1');
    expect(competenceFormGroup.get('annee_devis')?.value).toBe(2023);
    expect(competenceFormGroup.get('pages_devis')?.value).toBe('page');
    expect(competenceFormGroup.get('contexte')?.value).toBe('Contexte 1');
  });


  //Test qui vérifie qu'on peut supprimer une competence du form group avec retirerCompetences
  it('Doit supprimer une compétence du form group', () => {
    component.programmeForm.setControl('competences', component['formBuilder'].array([
      component.createCompetenceFormGroup({
        id: 1,
        code: 'C001',
        enonce: 'Enonce 1',
        annee_devis: 2023,
        pages_devis: '5',
        contexte: 'Contexte 1',
        programme_id : 0,
        elementsCompetences : []
      }),
    ]));

    component.retirerCompetence(0);

    expect(component.competences.controls.length).toBe(0);
  });

  //Sources: https://stackoverflow.com/questions/68108928/in-jest-how-do-i-mock-an-exported-function-to-return-a-promise-rather-than-unde et ChatGPT :)
  //Test qui vérifie qu'on peut ouvrir le modal competence
  it('Doit ouvrir modal competence', async () => {
    const modalCtrl = TestBed.inject(ModalController);

    // eslint-disable-next-line
    const mockModal: any = {
      present: () => Promise.resolve(true),
      dismiss: () => Promise.resolve(true),
      animated: true,
      backdropBreakpoint: 0,
      onWillDismiss: () => Promise.resolve({ data: [1], role: 'confirme' }),
    };

    const modalPromise = new Promise<HTMLIonModalElement>((resolve) => {resolve(mockModal);});

    const modalSpy = spyOn(modalCtrl, 'create').and.returnValue(modalPromise);

    await component.ouvrirModalCompetences();

    expect(modalSpy).toHaveBeenCalled();
    expect(component.competences.controls).toBeDefined();
  });
});
