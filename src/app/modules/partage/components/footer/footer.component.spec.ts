import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from './footer.component';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';

/**
 * Tests unitaires pour le footer de l'application
 * @author Jonathan Carrière
 */
describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  /**
   * Configuration globale des tests pour le footer
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterComponent ],
      imports: [IonicModule],
      providers: [MockProvider(HttpClient)]
    }).compileComponents();
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si le footer se génère correctement
   */
  it('doit générer le footer correctement', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier que le footer contient le texte attendu
   */
  it('doit contenir le texte attendu', () => {
    // Obtenir le texte du footer et définir la valeur attendue
    const footerTexte = fixture.nativeElement.querySelector('p');
    const footerTexteAttendu = 'Plan-Cadre – Plan Cours';

    // Vérifier si le texte du footer existe et qu'il contient la valeur attendue
    expect(footerTexte).toBeTruthy();
    expect(footerTexte.textContent).toContain(footerTexteAttendu, `Erreur! La source de l'image est: «${footerTexte.textContent}»`);
  });

});
