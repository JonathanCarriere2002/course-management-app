import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { ListeSectionsPage } from './liste-sections.page';
import {IonicModule} from '@ionic/angular';
import {of} from 'rxjs';
import {SectionService} from '../../../services/section/section.service';
import {Section} from '../../../models/section/section';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';

describe('ListeSectionsPage', () => {
  let component: ListeSectionsPage;
  let fixture: ComponentFixture<ListeSectionsPage>;
  let sectionService: SectionService;
  const sections: Section[] = [
    {
      'id': 1,
      'titre': 'Introduction',
      'info_suppl': '',
      'aide': 'Vous devez entrer une intro.',
      'obligatoire': true,
      'type_section_id': 1
    },
    {
      'id': 2,
      'titre': 'Médiagraphie',
      'info_suppl': '',
      'aide': 'Vous devez entrer les sources utilisées.',
      'obligatoire': false,
      'type_section_id': 1
    }
  ];

  // Ce qui s'exécute avant chaque test
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeSectionsPage ],
      imports: [IonicModule.forRoot()],
      providers: [
        MockProvider(HttpClient),
        MockProvider(SectionService, {
          obtenirToutesLesSections: () => of({data: sections})
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListeSectionsPage);
    component = fixture.componentInstance;
    sectionService = fixture.debugElement.injector.get(SectionService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('le titre de la page doit être Sections', () => {
    const titre = fixture.nativeElement.querySelector('h1').textContent; // Récupérer le titre de la page
    const titreAttendu = 'Sections'; // Le titre attendu de la page
    // Tests
    expect(titre).toBeTruthy(); // Vérifier qu'il y a un titre dans la page
    expect(titre).toEqual(titreAttendu); // Vérifier que le titre récupéré dans la page est égal au titre attendu
  });

  it('la méthode obtenirToutesLesSections doit être appelée au chargement de la page', () => {
    spyOn(sectionService, 'obtenirToutesLesSections').and.returnValue(of({data: sections}));
    component.ionViewWillEnter();
    expect(sectionService.obtenirToutesLesSections).toHaveBeenCalled();
  });

  it('l\'abonnement pour la liste des sections doit être annulé lorsqu\'on quitte la page', () => {
    component.ionViewWillEnter();
    spyOn(component.observableSections$, 'unsubscribe');
    component.ionViewWillLeave();
    expect(component.observableSections$.unsubscribe).toHaveBeenCalled();
  });

  it('la liste des sections doit être chargée lorsque la page est affichée', () => {
    component.ionViewWillEnter();
    expect(component.sections).toEqual(sections);
  });

  it('la variable maxBreadcrumbs doit être égal à 20 lorsque la méthode expandBreadcrumbs est appelée', () => {
    component.expandBreadcrumbs();
    expect(component.maxBreadcrumbs).toEqual(20);
  });
});
