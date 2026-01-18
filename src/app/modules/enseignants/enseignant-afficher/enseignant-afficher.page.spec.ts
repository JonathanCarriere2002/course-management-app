import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { EnseignantAfficherPage } from './enseignant-afficher.page';
import {IonicModule} from '@ionic/angular';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {EnseignantsService} from '../../../services/enseignants/enseignants.service';
import {of} from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {Utilisateur} from '../../../models/utilisateurs/utilisateur';

/**
 * Tests unitaires associés à la page contenant les détails d'un enseignant
 * @author Jonathan Carrière
 */
describe('EnseignantAfficherPage', () => {
  let component: EnseignantAfficherPage;
  let fixture: ComponentFixture<EnseignantAfficherPage>;
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
   * Configuration globale des tests pour l'affichage des enseignants
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        declarations: [ EnseignantAfficherPage ],
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
            // Envoyer un service pour les enseignants à la page
            provide: EnseignantsService,
            useValue: {
              getEnseignant: () => of([]),
            },
          },
          {
            provide: AuthService,
          },
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(EnseignantAfficherPage);
      component = fixture.componentInstance;
      // Injection du 'AuthService' et définition de l'utilisateur
      authService = TestBed.inject(AuthService);
      component.authService = authService;
      component.authService.setUtilisateur(utilisateur);
      fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si la page contenant les détails d'un enseignant se génère correctement
   */
  it("doit générer la page des détails d'enseignant correctement", () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier si la page contenant les détails d'un enseignant affiche un titre
   */
  it('doit afficher un titre sur la page de détails', () => {
    // Obtenir le titre et vérifier s'il est généré correctement
    const titre = fixture.nativeElement.querySelector('h1');
    expect(titre).toBeTruthy();
  });

});
