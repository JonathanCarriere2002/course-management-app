import {TestBed} from '@angular/core/testing';
import { CompetencesService } from './competences.service';
import {Competence} from '../../models/competences/competence';
import {HttpClient} from '@angular/common/http';
import {MockProvider} from 'ng-mocks';
import {AuthService} from '../auth.service';
import {of} from 'rxjs';
/* @author lebel */
/**
 * Tests unitaires associés au service des compétences
 */
describe('CompetencesService', () => {
  const espionHttp = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  let competenceService: CompetencesService;
  // Initialiser une liste des competences
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const competences: Competence[] =
    [
      {
        'id': 1,
        'code': '00Q1',
        'enonce': "Maîtriser le développement d'applications Web modernes avec les dernières technologies",
        'annee_devis': 2023,
        'pages_devis': '60',
        'contexte': "Ce cours vise à former les étudiants à concevoir et développer des applications Web avancées en utilisant les frameworks les plus récents. Les compétences acquises couvrent la création de sites Web interactifs, la gestion de bases de données, l'authentification utilisateur, et bien plus encore. Les projets pratiques sont basés sur des cas réels de développement d'applications Web.",
        'programme_id': 3,
        'elementsCompetences': [
          {
            'id': 1,
            'numero': 101,
            'texte': 'Maîtrise des langages de programmation',
            'isExpanded': false,
            'criteresPerformance': [
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
              }
            ]
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
      },
      {
        'id': 2,
        'code': '11L2',
        'enonce': 'Créer des interfaces utilisateur intuitives pour des produits numériques',
        'annee_devis': 2023,
        'pages_devis': '50',
        'contexte': "Ce cours se concentre sur la conception d'expérience utilisateur (UX) pour améliorer l'ergonomie et la convivialité des produits numériques. Les étudiants apprendront les principes de base de la conception UX, les méthodes de recherche utilisateur, et comment créer des wireframes et des prototypes interactifs. Ils auront l'occasion de travailler sur des projets concrets pour développer leurs compétences en conception UX.",
        'programme_id': 6,
        'elementsCompetences': [
          {
            'id': 1,
            'numero': 201,
            'texte': 'Maîtrise des langages de programmation',
            'isExpanded': false,
            'criteresPerformance': [
              {
                'id': 1.1,
                'numero': 101,
                'texte': 'Capacité à écrire un code propre et bien documenté',
                'isExpanded': false
              }
            ]
          },
          {
            'id': 2,
            'numero': 202,
            'texte': 'Gestion de projet',
            'isExpanded': false,
            'criteresPerformance': []
          },
          {
            'id': 3,
            'numero': 203,
            'texte': 'Compétences en communication',
            'isExpanded': false,
            'criteresPerformance': [
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
          }
        ]
      },
    ]

  // S'exécute avant chaque test
  beforeEach((() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: espionHttp},
        MockProvider(AuthService)
      ]
    });
    competenceService = TestBed.inject(CompetencesService);
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  it('le service doit être appelé', () => {
    expect(competenceService).toBeTruthy();
  });

  it('getCompetences doit retourner la liste des compétences', () => {
    espionHttp.get.and.returnValue(of({data: competences}));

    competenceService.getCompetences().subscribe({
      next: reponse => expect(reponse).toEqual({data: competences})
    });
  });

  it('getCompetence doit retourner une compétence', () => {
    espionHttp.get.and.returnValue(of({data: competences[0]}));

    competenceService.getCompetence(competences[0].id).subscribe({
      next: reponse => expect(reponse).toEqual({data: competences[0]})
    });
  });

  it('createCompetence doit retourner une erreur', () => {
    const erreur = ({
      error: {
        code: 404,
        message: 'Compétence non trouvé'
      }
    });
     espionHttp.post.and.returnValue(of(erreur))

    competenceService.createCompetence(competences[0]).subscribe({
      next:(reponse) => {
        expect(reponse.error?.code).toEqual(404);
        expect(reponse.error?.message).toContain('Compétence non trouvé');
      }
    })
  })

  it('deleteCompetence doit retourner une erreur', () => {
    const erreur = ({
      error: {
        code: 404,
        message: 'Compétence non trouvé'
      }
    });
    espionHttp.delete.and.returnValue(of(erreur))

    competenceService.deleteCompetence(competences[0].id).subscribe({
      next:(reponse) => {
        expect(reponse.error?.code).toEqual(404);
        expect(reponse.error?.message).toContain('Compétence non trouvé');
      }
    })
  })

  it('updateCompetence doit retourner une erreur', () => {
    const erreur = ({
      error: {
        code: 404,
        message: 'Compétence non trouvé'
      }
    });
    espionHttp.put.and.returnValue(of(erreur))

    competenceService.updateCompetence(competences[0].id, competences[0]).subscribe({
      next:(reponse) => {
        expect(reponse.error?.code).toEqual(404);
        expect(reponse.error?.message).toContain('Compétence non trouvé');
      }
    })
  })

});
