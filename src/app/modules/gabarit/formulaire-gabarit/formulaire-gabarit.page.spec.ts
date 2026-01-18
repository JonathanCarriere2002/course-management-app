import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { FormulaireGabaritPage } from './formulaire-gabarit.page';
import {IonicModule} from '@ionic/angular';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {GabaritService} from '../../../services/gabarit/gabarit.service';
import {of} from 'rxjs';

/**
 * Tests unitaires associés au formulaire pour les gabarits
 * @author Jonathan Carrière
 */
describe('FormulaireGabaritPage', () => {
  let component: FormulaireGabaritPage;
  let fixture: ComponentFixture<FormulaireGabaritPage>;

  /**
   * Configuration globale des tests pour le formulaire des gabarits
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaireGabaritPage ],
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
          // Envoyer un service pour les gabarits à la page
          provide: GabaritService,
          useValue: {
            obtenirGabaritParId: () => of([]),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(FormulaireGabaritPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si la page contenant le formulaire pour les gabarits se génère correctement
   */
  it('doit générer le formulaire des gabarits correctement', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier si la page contenant le formulaire des gabarits contient des breadcrumbs
   */
  it('doit afficher des breadcrumbs sur le formulaire', () => {
    // Obtenir les breadcrumbs et vérifier s'ils sont affichés correctement
    const breadCrumbs = fixture.nativeElement.querySelector('ion-breadcrumbs');
    expect(breadCrumbs).toBeTruthy();
  });

});
