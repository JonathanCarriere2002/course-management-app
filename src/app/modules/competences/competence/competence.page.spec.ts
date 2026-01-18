import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CompetencePage} from './competence.page';
import {IonicModule} from '@ionic/angular';
import {MockProvider} from 'ng-mocks';
import {CompetencesService} from '../../../services/competences/competences.service';
import {of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiResponse} from '../../../models/authentification/api-response';
import {Competence} from '../../../models/competences/competence';
/* @author lebel */

/**
 * Tests unitaires associés à la page des compétences
 */
describe('FormulaireCompetencePage', () => {
  let component: CompetencePage;
  let fixture: ComponentFixture<CompetencePage>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let competenceService: CompetencesService;
  let router: Router;

  /**
   * Configuration globale des tests pour le formulaire des competences
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetencePage ],
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
          // Configuration des méthodes de ProgrammeServices
          provide: CompetencesService,
          useValue: {
            getCompetence: () => of({data: {id: 1,
                code: '00Q1',
                enonce: 'Maîtriser le développement d\'applications Web modernes avec les dernières technologies',
                annee_devis: 1999, pages_devis: '22-33', contexte: 'Contexte test', programme_id: 0,
                elementsCompetences: [
                  {
                    id: 1,
                    numero : 1,
                    texte: 'Élément de compétence',
                    isExpanded: false,
                    criteresPerformance : [
                      {
                        id: 1,
                        numero: 1.1,
                        texte: 'Critère de performance',
                        isExpanded: false
                      }
                    ]
                  }
                ]}}),
            createCompetence: () => of({}),
            updateCompetence: () => of({}),
            getCompetences: () => of({ data:
        {id: 1,
          code: '00Q1',
          enonce: 'Maîtriser le développement d\'applications Web modernes avec les dernières technologies',
          annee_devis: 1999, pages_devis: '22-33', contexte: 'Contexte test', programme_id: 0,
          elementsCompetences: [
            {
              id: 1,
              numero : 1,
              texte: 'Élément de compétence',
              isExpanded: false,
              criteresPerformance : [
                {
                  id: 1,
                  numero: 1.1,
                  texte: 'Critère de performance',
                  isExpanded: false
                }
              ]
            }
            ]}
            })
          },
        }
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CompetencePage);
    component = fixture.componentInstance;
    competenceService = TestBed.inject(CompetencesService);
    router = TestBed.inject(Router)
    fixture.detectChanges();
  }));

  it('doit générer le formulaire de competence correctement', () => {
    expect(component).toBeTruthy();
  });

    it('Doit afficher les breadcrumbs dans la page', () => {
        // Voir si les breadcrumbs sont affiches
        const breadCrumbs = fixture.nativeElement.querySelector('ion-breadcrumbs');
        expect(breadCrumbs).toBeTruthy();
    });

  it('Doit initialiser le formulaire de competence correctement', () => {
    component.ngOnInit();
    // Input données de bases de compétence
    expect(component.competenceForm).toBeTruthy();
    expect(component.competenceForm.get('enonce')).toBeTruthy();
    expect(component.competenceForm.get('code')).toBeTruthy();
    expect(component.competenceForm.get('annee_devis')).toBeTruthy();
    expect(component.competenceForm.get('pages_devis')).toBeTruthy();
    expect(component.competenceForm.get('contexte')).toBeTruthy();
  });

  it('Doit récuperer une compétence spécifique', () => {
    component.getCompetence(1);
    // Tester information de base de la comp
    expect(component.competence.id).toBe(1);
    expect(component.competence.code).toBe('00Q1');
    expect(component.competence.enonce).toBe('Maîtriser le développement d\'applications Web modernes avec les dernières technologies');
    expect(component.competence.annee_devis).toBe(1999);
    expect(component.competence.pages_devis).toBe('22-33');
    expect(component.competence.contexte).toBe('Contexte test');
    expect(component.competence.programme_id).toBe(0);
    expect(component.competence.elementsCompetences.length).toBe(1);
    // Tester info d'un élément de compétence de la compétence
    expect(component.competence.elementsCompetences[0].id).toEqual(1);
    expect(component.competence.elementsCompetences[0].numero).toEqual(1);
    expect(component.competence.elementsCompetences[0].texte).toEqual('Élément de compétence');
    expect(component.competence.elementsCompetences[0].isExpanded).toEqual(false);
    expect(component.competence.elementsCompetences[0].criteresPerformance.length).toEqual(1);
    // Tester le cirtere de perfo du premier élément de compétence
    expect(component.competence.elementsCompetences[0].criteresPerformance[0].id).toEqual(1);
    expect(component.competence.elementsCompetences[0].criteresPerformance[0].numero).toEqual(1.1);
    expect(component.competence.elementsCompetences[0].criteresPerformance[0].texte).toEqual('Critère de performance');
    expect(component.competence.elementsCompetences[0].criteresPerformance[0].isExpanded).toEqual(false);
  });

  it('Doit créer une nouvelle compétence', () => {
    const mockCompetenceService = TestBed.inject(CompetencesService);
    const competenceData = { id: 2, code: '00Q2',
      enonce: 'Maîtriser le développement d\'applications Web modernes avec les dernières technologies',
      annee_devis: 2018, pages_devis: '27', contexte: 'Pour des problèmes dont la solution est simple. À l’aide ' +
        'd’algorithmes de base.\n À l’aide d’un débogueur et d’un plan de tests fonctionnels.', programme_id: 1,
      elementsCompetences: [
        {
          id: 1,
          numero : 1,
          texte: 'Élément de compétence',
          isExpanded: false,
          criteresPerformance : [
            {
              id: 1,
              numero: 1.1,
              texte: 'Critère de performance',
              isExpanded: false
            }
          ]
        }
      ] };

    const createApiResponse: ApiResponse<Competence> = {
      data: competenceData,
    };

    spyOn(mockCompetenceService, 'createCompetence').and.returnValue(of(createApiResponse));

    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component.createCompetence();

    expect(navigateSpy).toHaveBeenCalledWith(['/competences']);
    expect(mockCompetenceService.createCompetence).toHaveBeenCalled();
  });

  it('Doit mettre à jour une competence existante', () => {
    const mockCompetenceService = TestBed.inject(CompetencesService);
    const competenceData = {id: 1, code: '99Q1',
      enonce: 'Maîtriser le développement d\'applications Web modernes avec les dernières technologies',
      annee_devis: 1999, pages_devis: '99', contexte: 'Contexte test modifie', programme_id: 0,
      elementsCompetences: [{
        id: 1,
        numero : 8,
        texte: 'Élément de compétence modifié',
        isExpanded: false,
        criteresPerformance : [
          {
            id: 1,
            numero: 1.5,
            texte: 'Critère de performance modifié',
            isExpanded: false
          }
        ]
      }
      ]};

    const updateApiResponse: ApiResponse<Competence> = {
      data: competenceData,
    };

    spyOn(mockCompetenceService, 'updateCompetence').and.returnValue(of(updateApiResponse));

    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component.updateCompetence();

    expect(navigateSpy).toHaveBeenCalledWith(['/competences']);
    expect(mockCompetenceService.updateCompetence).toHaveBeenCalled();
  });
});
