import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { ListeCompetencePage } from './liste-competence.page';
import {IonicModule} from '@ionic/angular';
import {Competence} from '../../../models/competences/competence';
import {CompetencesService} from '../../../services/competences/competences.service';
import {of, Subscription} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from '../../../services/auth.service';
import {Utilisateur} from '../../../models/utilisateurs/utilisateur';
import {Router} from '@angular/router';
/* @author lebel */
describe('ListeCompetencePage', () => {
  let component: ListeCompetencePage;
  let fixture: ComponentFixture<ListeCompetencePage>;
  let competenceService: CompetencesService;
  let authService: AuthService;

  const competences: Competence[] = [
    { id: 2, code: '00Q2',
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
      ]},
      { id: 1, code: '00Q1',
        enonce: 'Effectuer l’installation et la gestion d’ordinateurs',
        annee_devis: 2018, pages_devis: '45', contexte: 'Pour différents systèmes d’exploitation. À partir d’une demande. À l’aide d’ordinateurs, ' +
          'de périphériques, de composants internes amovibles, etc. À l’aide de la documentation technique. ' +
          'À l’aide de systèmes d’exploitation, d’applications, d’utilitaires, de pilotes, de modules d’extension, ' +
          'etc.',
        programme_id: 1,
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
        ]},
  ];

  // Création d'un utilisateur pour accéder au fonctionnalités
  const utilisateur: Utilisateur = {
    id: 1,
    nom: 'Bob',
    prenom: 'Bisson',
    courriel: 'bobisson@email.com',
    courriel_verifie: new Date(),
    mot_de_passe: 'password1',
    role: 1,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListeCompetencePage],
      imports: [IonicModule.forRoot(),
        RouterTestingModule, HttpClientModule],
      providers: [AuthService]
    }).compileComponents();
    fixture = TestBed.createComponent(ListeCompetencePage);
    component = fixture.componentInstance;
    // Définir le user
    authService = TestBed.inject(AuthService);
    component.authService = authService;
    component.authService.setUtilisateur(utilisateur)
    competenceService = fixture.debugElement.injector.get(CompetencesService)
    fixture.detectChanges();
  }));

  // Initialiser la liste des competences
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Competences: Competence[] =
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

    it('Doit créer la page listeCompétence', () => {
        expect(component).toBeTruthy();
    });

    it('Doit afficher le titre de la page', () =>{
      const titre = fixture.nativeElement.querySelector('h1').textContent;
      const titreAttendu = 'Compétences';

      expect(titre).toBeTruthy();
      expect(titre).toEqual(titreAttendu);
    })

    it('Doit initialiser liste de compétences', () => {
        spyOn(component, 'getCompetences');
        component.ionViewWillEnter();
        expect(component.getCompetences).toHaveBeenCalled();
    });

    it('Doit annuler abonnement (subscribe) a la sortie de la page', () => {
        component.observable$ = new Subscription();
        spyOn(component.observable$, 'unsubscribe');
        component.ionViewWillLeave();
        expect(component.observable$.unsubscribe).toHaveBeenCalled();
    });

    it('La méthode getsCompetences doit être appelée au chargement de la page', () => {
      spyOn(competenceService, 'getCompetences').and.returnValue(of({data: competences}));
      component.ionViewWillEnter();
      expect(competenceService.getCompetences).toHaveBeenCalled();
    })

    it('Doit rediriger vers le formulaire de compétence', () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      component.redirect(`competence/modifier/:${1}`);
      expect(router.navigate).toHaveBeenCalledWith([`/competence/modifier/:${1}`]);
    })

    it('Doit expandBreadcrumbs', () => {
        component.expandBreadcrumbs();
        expect(component.maxBreadcrumbs).toBe(20);
    });

});

