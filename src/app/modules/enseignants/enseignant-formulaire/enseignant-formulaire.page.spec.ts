import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { EnseignantFormulairePage } from './enseignant-formulaire.page';
import {IonicModule} from '@ionic/angular';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {EnseignantsService} from '../../../services/enseignants/enseignants.service';
import {of} from 'rxjs';

/**
 * Tests unitaires associés à la page contenant le formulaire pour les enseignants
 * @author Jonathan Carrière
 */
describe('EnseignantFormulairePage', () => {
  let component: EnseignantFormulairePage;
  let fixture: ComponentFixture<EnseignantFormulairePage>;

  /**
   * Configuration globale des tests pour le formulaire des enseignants
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnseignantFormulairePage ],
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
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EnseignantFormulairePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si la page contenant le formulaire des enseignants se génère correctement
   */
  it('doit générer le formulaire des enseignants correctement', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier si le formulaire des enseignants se retrouve dans la page
   */
  it('doit générer le formulaire des enseignants correctement', () => {
    // Obtenir le formulaire des enseignants et vérifier s'il se génère correctement
    const formAjout = fixture.nativeElement.querySelector('form');
    expect(formAjout).toBeTruthy();
  });

});
