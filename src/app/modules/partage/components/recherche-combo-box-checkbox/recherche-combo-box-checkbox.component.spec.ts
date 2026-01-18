import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RechercheComboBoxCheckboxComponent } from './recherche-combo-box-checkbox.component';

describe('RechercheComboBoxComponent', () => {
  let component: RechercheComboBoxCheckboxComponent;
  let fixture: ComponentFixture<RechercheComboBoxCheckboxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RechercheComboBoxCheckboxComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RechercheComboBoxCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
