import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SectionFormulaireComponent } from './section-formulaire.component';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {SectionFormulaire} from '../../../../models/sectionFormulaire/section-formulaire';

describe('SectionFormulaireComponent', () => {
  let component: SectionFormulaireComponent;
  let fixture: ComponentFixture<SectionFormulaireComponent>;
  const formGroup : FormGroup = new FormGroup({
    'sections': new FormArray([
      new FormGroup({
        'id': new FormControl(1),
        'texte': new FormControl('')
      })
    ])
  });
  const formArrayName = 'sections';
  const index = 0;
  const section: SectionFormulaire = {
    'id': 1,
    'titre': 'Introduction',
    'info_suppl': '',
    'texte': '',
    'aide': 'Vous devez entrer une intro.',
    'obligatoire': true,
    'type_section_id': 1
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionFormulaireComponent ],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionFormulaireComponent);
    component = fixture.componentInstance;
    component.formGroup = formGroup;
    component.formArrayName = formArrayName;
    component.index = index;
    component.section = section;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
