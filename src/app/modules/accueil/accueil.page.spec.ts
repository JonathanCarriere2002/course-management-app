import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { AccueilPage } from './accueil.page';
import {IonicModule} from '@ionic/angular';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';

/**
 * Tests unitaires associés à la page d'accueil
 * @author Jonathan Carrière
 */
describe('AccueilPage', () => {
  let component: AccueilPage;
  let fixture: ComponentFixture<AccueilPage>;

  /**
   * Configuration globale des tests pour la page d'accueil
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccueilPage ],
      imports: [IonicModule],
      providers: [MockProvider(HttpClient)]
    }).compileComponents();
    fixture = TestBed.createComponent(AccueilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si la page d'accueil se génère correctement
   */
  it("doit générer la page d'accueil correctement", () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier si le logo de l'application s'affiche dans la page d'accueil
   */
  it("doit afficher le logo de l'application", () => {

    // Obtenir l'image de la page d'accueil et définir sa source
    const imgLogoApplication = fixture.nativeElement.querySelector('ion-img');
    const srcLogoApplication = 'assets/images/pcpc_logo.png';

    // Vérifier si l'image existe et qu'elle contient la valeur attendue pour sa source
    expect(imgLogoApplication).toBeTruthy();
    expect(imgLogoApplication.src).toContain(srcLogoApplication, `Erreur! La source de l'image est: «${imgLogoApplication.src}»`);

  });

  /**
   * Test unitaire permettant de vérifier si le formulaire de connexion est généré dans la page d'accueil
   */
  it('doit générer le formulaire de connexion', () => {

    // Obtenir le formulaire de connexion de la page d'accueil
    const formConnexion = fixture.nativeElement.querySelector('form');

    // Vérifier si le formulaire de connexion se retrouve à l'intérieur de la page d'accueil
    expect(formConnexion).toBeTruthy();

  });

});
