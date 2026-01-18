import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SectionDetailsComponent } from './section-details.component';
import {SectionFormulaire} from '../../../../models/sectionFormulaire/section-formulaire';

describe('SectionsDetailsComponent', () => {
  let component: SectionDetailsComponent;
  let fixture: ComponentFixture<SectionDetailsComponent>;
  const section: SectionFormulaire = {
    'id': 1,
    'titre': 'Introduction',
    'info_suppl': '',
    'texte': '',
    'aide': 'Vous devez entrer une intro.',
    'obligatoire': true,
    'type_section_id': 1
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionDetailsComponent);
    component = fixture.componentInstance;
    component.section = section;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
