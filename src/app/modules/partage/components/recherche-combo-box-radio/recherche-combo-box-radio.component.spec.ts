import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RechercheComboBoxRadioComponent } from './recherche-combo-box-radio.component';

describe('RechercheComboBoxComponent', () => {
  let component: RechercheComboBoxRadioComponent;
  let fixture: ComponentFixture<RechercheComboBoxRadioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RechercheComboBoxRadioComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RechercheComboBoxRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
