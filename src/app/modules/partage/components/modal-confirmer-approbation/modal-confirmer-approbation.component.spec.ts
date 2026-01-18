import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalConfirmerApprobationComponent } from './modal-confirmer-approbation.component';

/**
 * Tests unitaires pour le modal d'approbation
 * @author Jonathan Carrière
 */
describe('ModalConfirmerApprobationComponent', () => {
  let component: ModalConfirmerApprobationComponent;
  let fixture: ComponentFixture<ModalConfirmerApprobationComponent>;

  /**
   * Configuration globale des tests pour le modal d'approbation
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmerApprobationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();
    fixture = TestBed.createComponent(ModalConfirmerApprobationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si le modal d'approbation se génère correctement
   */
  it('doit générer le modal pour approuver des dates correctement', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier si le modal d'approbation contient un input de type 'date'
   */
  it('doit contenir un input pour les dates', () => {
    // Obtenir l'input pour les dates
    const input = fixture.nativeElement.querySelector('ion-input');
    // Vérifier s'il est généré correctement
    expect(input).toBeTruthy();
    // Vérifier qu'il est de type 'date'
    expect(input.type).toEqual('date');
  });

});
