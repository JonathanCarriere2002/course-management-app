import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalCritereEvalComponent } from './modal-critere-eval.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MockModule, MockProvider} from 'ng-mocks';
import {QuillModule} from 'ngx-quill';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {CriteresEvaluationsService} from '../../../services/criteresEvaluations/criteres-evaluations.service';
import {of} from 'rxjs';

describe('ModalCritereEvalComponent', () => {
  let component: ModalCritereEvalComponent;
  let fixture: ComponentFixture<ModalCritereEvalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCritereEvalComponent ],
      imports: [IonicModule, FormsModule, ReactiveFormsModule, MockModule(QuillModule), RouterTestingModule.withRoutes([])],
      providers: [
        MockProvider(HttpClient),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (id: number) => 1,
              },
            },
          },
        },
        {
          //Configuration des méthodes de critereEvaluationService
          provide: CriteresEvaluationsService,
          useValue: {
            getCriteresEvaluations:()=>of({
              data:[{
                id:1,
                enonce: 'Enonce',
                ponderation:1,
                elementsCompetence:[]
                }
              ]
            })
          }
        },

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCritereEvalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Titre de la page devrait être Ajouter un critère d\'évaluation puisqu\'aucun critère n\'est fourni', ()=>{
    const titre = document.querySelector('ion-title');
    expect(titre!.textContent).toEqual('Ajouter un critère d\'évaluation')
  })

  describe('Création formulaire critère d\'évaluation', ()=>{
    it('Formulaire de critère d\'évaluation est bien initialisé au chargement du modal', ()=>{
      component.ngOnInit();
      expect(component.critereEvalForm).toBeTruthy()
    });


    it('id est bien initialisé', ()=>{
      component.ngOnInit();
      expect(component.critereEvalForm.get('id')).toBeTruthy();
    });

    it('enonce est bien initialisé', ()=>{
      component.ngOnInit();
      expect(component.critereEvalForm.get('enonce')).toBeTruthy();
    });

    it('ponderation est bien initialisé', ()=>{
      component.ngOnInit();
      expect(component.critereEvalForm.get('ponderation')).toBeTruthy();
    });

    it('FormArray elementsCompetence est bien initialisé', ()=>{
      component.ngOnInit();
      expect(component.critereEvalForm.get('elementsCompetence')).toBeTruthy();
    });
  })
});
