import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ApprobationProgressbarComponent } from './approbation-progressbar.component';
import { MockProvider } from 'ng-mocks';
import { HttpClient } from '@angular/common/http';
import {PlanCadres} from '../../../../models/planCadres/plan-cadres';
import {SectionFormulaire} from '../../../../models/sectionFormulaire/section-formulaire';
import {CriteresEvaluations} from '../../../../models/critereEvaluation/criteres-evaluations';
import {Programme} from '../../../../models/programmes/programme';
import {LienCompetencesPlansCadres} from '../../../../models/lienCompetencesPlansCadres/lien-competences-plans-cadres';
import {Session} from '../../../../models/sessions/session';

/**
 * Tests unitaires associés au component pour la barre de progrès pour l'approbation d'un plan-cadre
 * @author Jonathan Carrière
 */
describe('ApprobationProgressbarComponent', () => {
  let component: ApprobationProgressbarComponent;
  let fixture: ComponentFixture<ApprobationProgressbarComponent>;

  /**
   * Configuration globale des tests pour le component contenant la barre de progrès
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprobationProgressbarComponent ],
      imports: [IonicModule],
      providers: [MockProvider(HttpClient)]
    }).compileComponents();
    fixture = TestBed.createComponent(ApprobationProgressbarComponent);
    component = fixture.componentInstance;
    // Création d'un plan-cadre
    component.planCadre = {
      id: 1,
      code: '420-1G2-HU',
      titre: 'Logique de programmation',
      ponderation: '100%',
      unites: 3,
      attitudes: 'Attitudes',
      complet: false,
      ponderationFinale: 75,
      sections: [] as SectionFormulaire[],
      approbationDepartement: new Date(),
      approbationComite: new Date(),
      depotDirectionEtudes: new Date(),
      criteresEvaluations: [] as CriteresEvaluations[],
      programme: {} as Programme,
      competences: [] as LienCompetencesPlansCadres[],
      entreVigueur: {} as Session,
    } as PlanCadres;
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si le component pour la barre de progrès se génère correctement
   */
  it('doit générer le component pour la barre de progrès pour l\'approbation correctement', () => {
    expect(component).toBeTruthy();
  });

});
