import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockProvider } from 'ng-mocks';
import { HttpClient } from '@angular/common/http';
import { UtilisateurDetailsPage } from './utilisateur-details.page';
import { ActivatedRoute } from '@angular/router';
import { UtilisateursService } from '../../../services/utilisateurs/utilisateurs.service';
import { of } from 'rxjs';

/**
 * Tests unitaires associés à la page contenant les détails d'un utilisateur
 * @author Jonathan Carrière
 */
describe('UtilisateurDetailsPage', () => {
  let component: UtilisateurDetailsPage;
  let fixture: ComponentFixture<UtilisateurDetailsPage>;

  /**
   * Configuration globale des tests pour la page contenant les détails d'un utilisateur
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilisateurDetailsPage ],
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
          provide: UtilisateursService,
          useValue: {
            getUtilisateur: () => of([]),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(UtilisateurDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si la page contenant les détails d'un utilisateur se génère correctement
   */
  it('doit générer la page contenant les détails des utilisateurs correctement', () => {
    expect(component).toBeTruthy();
  });

});
