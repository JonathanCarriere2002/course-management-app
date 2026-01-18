import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ChargementComponent } from './chargement.component';

/**
 * Tests unitaires pour le component de chargement
 * @author Jonathan Carrière
 */
describe('ChargementComponent', () => {
  let component: ChargementComponent;
  let fixture: ComponentFixture<ChargementComponent>;

  /**
   * Configuration globale des tests pour le modal d'approbation
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargementComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();
    fixture = TestBed.createComponent(ChargementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si le component de chargement se génère correctement
   */
  it('doit générer le component de chargement correctement', () => {
    expect(component).toBeTruthy();
  });

});
