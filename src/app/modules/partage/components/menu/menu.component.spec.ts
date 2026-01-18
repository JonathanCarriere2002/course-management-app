import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu.component';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

/**
 * Tests unitaires pour le menu de l'application
 * @author Jonathan Carrière
 */
describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  /**
   * Configuration globale des tests pour l'affichage d'une session
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuComponent ],
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
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si le menu se génère correctement
   */
  it('doit générer le menu correctement', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier si le menu contient une image
   */
  it('doit afficher une image dans le menu', () => {
    // Obtenir le titre et vérifier s'il est généré correctement
    const image = fixture.nativeElement.querySelector('ion-img');
    expect(image).toBeTruthy();
  });

});
