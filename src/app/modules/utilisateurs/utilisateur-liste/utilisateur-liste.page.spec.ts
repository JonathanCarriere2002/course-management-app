import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UtilisateurListePage } from './utilisateur-liste.page';
import { IonicModule } from '@ionic/angular';
import { MockProvider } from 'ng-mocks';
import { HttpClient } from '@angular/common/http';

/**
 * Tests unitaires associés à la page contenant la liste des utilisateurs
 * @author Jonathan Carrière
 */
describe('UtilisateurListePage', () => {
  let component: UtilisateurListePage;
  let fixture: ComponentFixture<UtilisateurListePage>;

  /**
   * Configuration globale des tests pour la page contenant la liste des enseignants
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilisateurListePage ],
      imports: [IonicModule],
      providers: [MockProvider(HttpClient)]
    }).compileComponents();
    fixture = TestBed.createComponent(UtilisateurListePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si la page contenant la liste des utilisateurs se génère correctement
   */
  it('doit générer la page contenant la liste des utilisateurs correctement', () => {
    expect(component).toBeTruthy();
  });

});
