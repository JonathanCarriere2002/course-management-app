/**
 * @author Emeric Chauret
 */

import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormulaireSectionPage} from './formulaire-section.page';
import {IonicModule} from '@ionic/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {MockProvider} from 'ng-mocks';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';
import {Section} from '../../../models/section/section';
import {SectionService} from '../../../services/section/section.service';
import {TypeSectionService} from '../../../services/typeSection/type-section.service';

describe('FormulaireSectionPage', () => {
  let component: FormulaireSectionPage;
  let fixture: ComponentFixture<FormulaireSectionPage>;
  let router: Router;
  let sectionService: SectionService;
  const section: Section = {
    'id': 1,
    'titre': 'Introduction',
    'info_suppl': '',
    'aide': 'Vous devez entrer une intro.',
    'obligatoire': true,
    'type_section_id': 1
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaireSectionPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        MockProvider(HttpClient),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (name: string) => '1',
              },
            },
          },
        },
        MockProvider(TypeSectionService, {
          obtenirTousLesTypesSection: () => of({})
        }),
        MockProvider(SectionService, {
          obtenirSectionParId: (id:number) => of({data: section})
        }),
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(FormulaireSectionPage);
    component = fixture.componentInstance;
    sectionService = fixture.debugElement.injector.get(SectionService);
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('le titre de la page doit être Modifier une section', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const titre = fixture.nativeElement.querySelector('h1').textContent; // Récupérer le titre de la page
    const titreAttendu = 'Modifier une section'; // Le titre attendu de la page
    // Tests
    expect(titre).toBeTruthy(); // Vérifier qu'il y a un titre dans la page
    expect(titre).toEqual(titreAttendu); // Vérifier que le titre récupéré dans la page est égal au titre attendu
  });

  it('la variable sectionId doit être égal à 1 au chargement de la page', () => {
    component.ionViewWillEnter();
    fixture.detectChanges()
    expect(component.sectionId).toEqual(1);
  });

  it('l\'abonnement pour la section à modifier doit être annulé lorsqu\'on quitte la page', () => {
    component.ionViewWillEnter();
    spyOn(component.observableSection$, 'unsubscribe');
    component.ionViewWillLeave();
    expect(component.observableSection$.unsubscribe).toHaveBeenCalled();
  });

  it('l\'abonnement pour la liste des types de section doit être annulé lorsqu\'on quitte la page', () => {
    component.ionViewWillEnter();
    spyOn(component.observableTypesSection$, 'unsubscribe');
    component.ionViewWillLeave();
    expect(component.observableTypesSection$.unsubscribe).toHaveBeenCalled();
  });

  it('la méthode creerSection de la page doit appeler la méthode creerSection du service des sections', () => {
    spyOn(sectionService, 'creerSection').withArgs(component.sectionForm.value).and.returnValue(of({}))
    spyOn(router, 'navigate').withArgs(['/liste-sections']).and.returnValue(Promise.resolve(true));
    component.creerSection();
    expect(sectionService.creerSection).toHaveBeenCalledWith(component.sectionForm.value);
  });

  it('la méthode modifierSection de la page doit appeler la méthode modifierSection du service des sections', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    spyOn(sectionService, 'modifierSection').withArgs(component.sectionId, component.sectionForm.value).and.returnValue(of({}))
    spyOn(router, 'navigate').withArgs(['/liste-sections']).and.returnValue(Promise.resolve(true));
    component.modifierSection();
    expect(sectionService.modifierSection).toHaveBeenCalledWith(component.sectionId, component.sectionForm.value);
  });

  it('la variable maxBreadcrumbs doit être égal à 20 lorsque la méthode expandBreadcrumbs est appelée', () => {
    component.expandBreadcrumbs();
    expect(component.maxBreadCrumbs).toEqual(20);
  });
});
