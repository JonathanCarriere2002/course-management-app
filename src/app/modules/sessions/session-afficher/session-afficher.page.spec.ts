import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { SessionAfficherPage } from './session-afficher.page';
import {IonicModule} from '@ionic/angular';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {SessionsService} from '../../../services/sessions/sessions.service';
import {AuthService} from '../../../services/auth.service';
import {Utilisateur} from '../../../models/utilisateurs/utilisateur';

/**
 * Tests unitaires associés à la page contenant les détails d'une session
 * @author Jonathan Carrière
 */
describe('SessionAfficherPage', () => {
  let component: SessionAfficherPage;
  let fixture: ComponentFixture<SessionAfficherPage>;
  let authService: AuthService;

  // Création d'un faux utilisateur pour les tests de la page
  const utilisateur: Utilisateur = {
    id: 1,
    nom: 'Carrière',
    prenom: 'Jonathan',
    courriel: 'jonathan1234@email.com',
    courriel_verifie: new Date(),
    mot_de_passe: 'password',
    role: 1,
  };

  /**
   * Configuration globale des tests pour l'affichage d'une session
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionAfficherPage ],
      imports: [IonicModule],
      providers: [
        // Créer un MockProvider afin de pouvoir passer un service et des paramètres à la page
        MockProvider(HttpClient),
        {
          // Envoyer un paramètre pour l'id à la page
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
          // Envoyer un service pour les sessions à la page
          provide: SessionsService,
          useValue: {
            getSession: () => of([]),
          },
        },
        {
          provide: AuthService,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SessionAfficherPage);
    component = fixture.componentInstance;
    // Injection du 'AuthService' et définition de l'utilisateur
    authService = TestBed.inject(AuthService);
    component.authService = authService;
    component.authService.setUtilisateur(utilisateur);
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si la page contenant les détails d'une session se génère correctement
   */
  it("doit générer la page des détails d'une session correctement", () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier si la page contenant les détails d'une session affiche un titre
   */
  it('doit afficher un titre sur la page de détails', () => {
    // Obtenir le titre et vérifier s'il est généré correctement
    const titre = fixture.nativeElement.querySelector('h1');
    expect(titre).toBeTruthy();
  });

});
