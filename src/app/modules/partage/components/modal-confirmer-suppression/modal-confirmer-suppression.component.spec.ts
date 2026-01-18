import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalConfirmerSuppressionComponent } from './modal-confirmer-suppression.component';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';

/**
 * Tests unitaires pour le modal de suppression
 * @author Jeremy Lebel
 * @author Emeric Chauret
 * @author Jonathan Carrière
 */
describe('ModalConfirmerSuppressionComponent', () => {
  let component: ModalConfirmerSuppressionComponent;
  let fixture: ComponentFixture<ModalConfirmerSuppressionComponent>;

  /**
   * Configuration globale des tests pour le menu
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmerSuppressionComponent ],
      imports: [IonicModule],
      providers: [MockProvider(HttpClient)]
    }).compileComponents();
    fixture = TestBed.createComponent(ModalConfirmerSuppressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si le modal de suppression se génère correctement
   */
  it('doit générer le modal de suppression correctement', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier que le modal de suppression contient deux boutons
   */
  it("doit contenir un bouton de confirmation ainsi que d'annulation", () => {
    // Obtenir le nombre de boutons ainsi que leur texte
    const boutonsModal = fixture.nativeElement.querySelectorAll('ion-button');
    const quantiteBtnAttendu = 2;
    const textBtnAnnuler = 'Annuler';
    const textBtnConfirmer = 'Confirmer';

    // Vérifier la quantité de bouton dans le modal ainsi que le texte de chacun
    expect(boutonsModal.length).toEqual(quantiteBtnAttendu, `Erreur! Le modal contient «${boutonsModal.length}» boutons`);
    expect(boutonsModal[0].textContent).toContain(textBtnAnnuler);
    expect(boutonsModal[1].textContent).toContain(textBtnConfirmer);
  });

});
