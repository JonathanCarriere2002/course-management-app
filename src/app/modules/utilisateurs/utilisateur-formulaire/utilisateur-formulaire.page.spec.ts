import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UtilisateurFormulairePage } from './utilisateur-formulaire.page';
import { IonicModule } from '@ionic/angular';
import { MockProvider } from 'ng-mocks';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { UtilisateursService } from '../../../services/utilisateurs/utilisateurs.service';
import { of } from 'rxjs';

/**
 * Tests unitaires associés à la page contenant le formulaire pour les utilisateurs
 * @author Jonathan Carrière
 */
describe('UtilisateurFormulairePage', () => {
  let component: UtilisateurFormulairePage;
  let fixture: ComponentFixture<UtilisateurFormulairePage>;

  /**
   * Configuration globale des tests pour le formulaire des utilisateurs
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilisateurFormulairePage ],
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
    fixture = TestBed.createComponent(UtilisateurFormulairePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si la page contenant le formulaire des utilisateurs se génère correctement
   */
  it('doit générer le formulaire des utilisateurs correctement', () => {
    expect(component).toBeTruthy();
  });

});
