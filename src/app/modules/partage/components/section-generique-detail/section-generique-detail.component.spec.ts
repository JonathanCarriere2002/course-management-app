import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SectionGeneriqueDetailComponent } from './section-generique-detail.component';

describe('SectionGeneriqueDetailComponent', () => {
  let component: SectionGeneriqueDetailComponent;
  let fixture: ComponentFixture<SectionGeneriqueDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionGeneriqueDetailComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionGeneriqueDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
