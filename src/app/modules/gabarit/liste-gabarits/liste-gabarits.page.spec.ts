import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { ListeGabaritsPage } from './liste-gabarits.page';
import {IonicModule} from '@ionic/angular';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {GabaritService} from '../../../services/gabarit/gabarit.service';
import {of} from 'rxjs';

/**
 * Tests unitaires associés à la liste des gabarits
 * @author Jonathan Carrière
 */
describe('ListeGabaritsPage', () => {
  let component: ListeGabaritsPage;
  let fixture: ComponentFixture<ListeGabaritsPage>;

  /**
   * Configuration globale des tests pour la liste des gabrits
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeGabaritsPage ],
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
    fixture = TestBed.createComponent(ListeGabaritsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si la page contenant la liste des gabarits se génère correctement
   */
  it('doit générer la liste des gabarits correctement', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier que la liste de gabarits possède une barre de recherche
   */
  it('doit afficher la barre de recherche', () => {
    // Obtenir la barre de recherche et vérifier si elle est générée correctement
    const barreRecherche = fixture.nativeElement.querySelector('ion-searchbar');
    expect(barreRecherche).toBeTruthy();
  });

});
