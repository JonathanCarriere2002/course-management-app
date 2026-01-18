import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { DetailsGabaritPage } from './details-gabarit.page';
import {IonicModule} from '@ionic/angular';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {GabaritService} from '../../../services/gabarit/gabarit.service';
import {of} from 'rxjs';

/**
 * Tests unitaires associés à la page contenant les détails d'un gabarit
 * @author Jonathan Carrière
 */
describe('DetailsGabaritPage', () => {
  let component: DetailsGabaritPage;
  let fixture: ComponentFixture<DetailsGabaritPage>;

  /**
   * Configuration globale des tests pour l'affichage des gabrits
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsGabaritPage ],
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
    fixture = TestBed.createComponent(DetailsGabaritPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si la page contenant les détails d'un gabarit se génère correctement
   */
  it('doit générer la page des détails de gabarit correctement', () => {
    expect(component).toBeTruthy();
  });

});
