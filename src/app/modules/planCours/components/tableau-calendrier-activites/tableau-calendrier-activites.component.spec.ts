import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TableauCalendrierActivitesComponent } from './tableau-calendrier-activites.component';

describe('TableauCalendrierActivitesComponent', () => {
  let component: TableauCalendrierActivitesComponent;
  let fixture: ComponentFixture<TableauCalendrierActivitesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableauCalendrierActivitesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TableauCalendrierActivitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
