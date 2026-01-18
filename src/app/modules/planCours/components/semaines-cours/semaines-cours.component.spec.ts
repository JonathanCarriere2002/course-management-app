import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SemainesCoursComponent } from './semaines-cours.component';
import { MockProvider } from 'ng-mocks';
import { HttpClient } from '@angular/common/http';

/**
 * Tests unitaires associés au component pour les semaines de cours
 * @author Jonathan Carrière
 */
describe('SemainesCoursComponent', () => {
  let component: SemainesCoursComponent;
  let fixture: ComponentFixture<SemainesCoursComponent>;

  /**
   * Configuration globale des tests pour le component des semaines de cours
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SemainesCoursComponent ],
      imports: [IonicModule],
      providers: [MockProvider(HttpClient)]
    }).compileComponents();
    fixture = TestBed.createComponent(SemainesCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si le component pour les semaines de cours se génère correctement
   */
  xit('doit générer le component pour les semaines de cours correctement', () => {
    expect(component).toBeTruthy();
  });

});
