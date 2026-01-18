import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { PdfPlansCoursComponent } from './pdf-plans-cours.component';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';

/**
 * Tests unitaires associés au component pour l'exportation des plans de cours en PDF
 * @author Jonathan Carrière
 */
describe('PdfPlansCoursComponent', () => {
  let component: PdfPlansCoursComponent;
  let fixture: ComponentFixture<PdfPlansCoursComponent>;

  /**
   * Configuration globale des tests pour le component d'exportation des plans de cours en PDF
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfPlansCoursComponent ],
      imports: [IonicModule],
      providers: [MockProvider(HttpClient)]
    }).compileComponents();
    fixture = TestBed.createComponent(PdfPlansCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si le component pour exporter des plans de cours en PDF fonctionne
   */
  it('doit générer le component pour l\'exportation d\'un plan de cours en PDF', () => {
    expect(component).toBeTruthy();
  });

});
