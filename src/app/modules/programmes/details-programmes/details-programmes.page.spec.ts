import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { DetailsProgrammesPage } from './details-programmes.page';
import {IonicModule} from '@ionic/angular';
import {ProgrammeService} from '../../../services/programmes/programme.service';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';

describe('DetailsProgrammesPage', () => {
  let component: DetailsProgrammesPage;
  let fixture: ComponentFixture<DetailsProgrammesPage>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let programmeService : ProgrammeService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let router: Router;

  //BeforeEach avec l'import de RouterTestingModule pour le activated route de la page
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsProgrammesPage],
      imports: [IonicModule],
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
          //Configuration des methodes de ProgrammeServices
          provide: ProgrammeService,
          useValue: {
            getProgramme: () => of({ data: { id: 1, code: '111.L1', titre: 'Programme 1', competences: [] } }),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DetailsProgrammesPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  }));


  //Test de création qui vérifie si la page se crée
  it('Doit créer la page', () => {
    expect(component).toBeTruthy();
  });
});
