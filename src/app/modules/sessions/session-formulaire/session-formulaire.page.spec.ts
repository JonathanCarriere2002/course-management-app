import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {SessionFormulairePage} from './session-formulaire.page';
import {IonicModule} from '@ionic/angular';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {SessionsService} from '../../../services/sessions/sessions.service';

/**
 * Tests unitaires associés à la page contenant le formulaire pour les sessions
 * @author Jonathan Carrière
 */
describe('SessionFormulairePage', () => {
  let component: SessionFormulairePage;
  let fixture: ComponentFixture<SessionFormulairePage>;

  /**
   * Configuration globale des tests pour le formulaire des sessions
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionFormulairePage ],
      imports: [IonicModule],
      providers: [
        // Créer un MockProvider afin de pouvoir passer un service et des paramètres à la page
        MockProvider(HttpClient), {
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
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SessionFormulairePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si la page contenant le formulaire des sessions se génère correctement
   */
  it('doit générer le formulaire des sessions correctement', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier si le formulaire des sessions se retrouve dans la page
   */
  it('doit générer le formulaire des sessions correctement', () => {
    // Obtenir le formulaire de modification et vérifier s'il se génère correctement
    const formAjout = fixture.nativeElement.querySelector('form');
    expect(formAjout).toBeTruthy();
  });

});
