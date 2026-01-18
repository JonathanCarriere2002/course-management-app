import {ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {DetailsSectionApprobationComponent} from './details-section-approbation.component';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';

/**
 * Tests unitaires associés au component pour la modification et suppression de l'approbation d'un plan de cours
 * @author Jonathan Carrière
 */
describe('DetailsSectionApprobationComponent', () => {
  let component: DetailsSectionApprobationComponent;
  let fixture: ComponentFixture<DetailsSectionApprobationComponent>;

  /**
   * Configuration globale des tests pour la page contenant la liste des enseignants
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsSectionApprobationComponent ],
      imports: [IonicModule],
      providers: [MockProvider(HttpClient)]
    }).compileComponents();
    fixture = TestBed.createComponent(DetailsSectionApprobationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si le component pour la modification et la suppression de l'approbation d'un plan de cours se génère correctement
   */
  it('doit générer la section pour la modification et suppression de l\'approbation d\'un plan de cours correctement', () => {
    expect(component).toBeTruthy();
  });

});
