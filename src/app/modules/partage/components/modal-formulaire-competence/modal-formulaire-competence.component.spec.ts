import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalFormulaireCompetenceComponent } from './modal-formulaire-competence.component';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup} from '@angular/forms';
/* @author lebel */
describe('ModalFormulaireCompetenceComponent', () => {
  let component: ModalFormulaireCompetenceComponent;
  let fixture: ComponentFixture<ModalFormulaireCompetenceComponent>;
  const form: FormGroup = new FormGroup({
    'numero': new FormControl([]),
    'texte': new FormControl([]),
    'isEpanded': new FormControl([])
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(HttpClient)
      ],
      declarations: [ ModalFormulaireCompetenceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFormulaireCompetenceComponent);
    component = fixture.componentInstance;
    component.formModal = form;
    fixture.detectChanges();
  }));

  it('Doit créer', () => {
    expect(component).toBeTruthy();
  });

  xit('Doit initialiser le formulaire correctement', () => {
    component.ngOnInit();
    // Input données de bases de compétence
    expect(component.formModal.get('numero')).toBeTruthy();
    expect(component.formModal.get('texte')).toBeTruthy();
    expect(component.formModal.get('isExpanded')).toBeTruthy();
  });
});
