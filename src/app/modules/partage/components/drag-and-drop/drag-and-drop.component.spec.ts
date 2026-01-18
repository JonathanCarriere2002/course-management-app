import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DragDropComponent } from './drag-and-drop.component';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';
/* @author lebel */
describe('DragAndDropComponent', () => {
  let component: DragDropComponent;
  let fixture: ComponentFixture<DragDropComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let dragDrop: DragDropComponent;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DragDropComponent],
      imports: [IonicModule.forRoot()],
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
          //Configuration des methodes delete qui sont dans le drag and drop
          provide: DragDropComponent,
          useValue: {
            deleteElementComp: () => of({}),
            deleteCriterePerfo: () => of({}),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DragDropComponent);
    component = fixture.componentInstance;
    dragDrop = TestBed.inject(DragDropComponent);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
