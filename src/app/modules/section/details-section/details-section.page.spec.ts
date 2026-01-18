/**
 * @author Emeric Chauret
 */

import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { DetailsSectionPage } from './details-section.page';
import {SectionService} from '../../../services/section/section.service';
import {IonicModule} from '@ionic/angular';
import {MockProvider} from 'ng-mocks';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {Section} from '../../../models/section/section';
import {RouterTestingModule} from '@angular/router/testing';

describe('DetailsSectionPage', () => {
  let component: DetailsSectionPage;
  let fixture: ComponentFixture<DetailsSectionPage>;
  let sectionService: SectionService;
  const section: Section = {
    'id': 1,
    'titre': 'INTRODUCTION',
    'info_suppl': '',
    'aide': '',
    'obligatoire': true,
    'type_section_id': 1
  }

  /**
   * Configuration globale des tests pour l'affichage des sections
   */
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsSectionPage ],
      imports: [IonicModule, RouterTestingModule.withRoutes([])],
      providers: [
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
        MockProvider(SectionService, {
          obtenirSectionParId: (id:number) => of({data: section})
        })
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DetailsSectionPage);
    component = fixture.componentInstance;
    sectionService = fixture.debugElement.injector.get(SectionService);
    fixture.detectChanges();
  }));

  it('doit générer la page des détails de section correctement', () => {
    expect(component).toBeTruthy();
  });

  xit('le titre de la page doit être INTRODUCTION', () => {

    fixture.detectChanges();
    const titre = fixture.nativeElement.querySelector('h1:first-child').textContent; // Récupérer le titre de la page
    const titreAttendu= 'INTRODUCTION'; // Le titre qui est attendu
    // Tests
    expect(titre).toBeTruthy(); // Vérifier que le titre existe
    expect(titre).toEqual(titreAttendu); // Vérifier que le titre est égal à celui qui est attendu
  });

  it('la variable sectionId doit être égal à 1 au chargement de la page', () => {

    expect(component.sectionId).toEqual(1);
  });

  it('la variable section doit être égale au plan de cours ayant l\'identifiant 1', () => {

    expect(component.section).toEqual(section);
  });

  xit('la méthode obtenirSectionParId de la page doit avoir été appelée au chargement de la page', () => {
    spyOn(component, 'obtenirSectionParId');

    expect(component.obtenirSectionParId).toHaveBeenCalledWith(1);
  });

  xit('la méthode obtenirSectionParId du service des sections doit avoir été appelée au chargement de la page', () => {
    // Référence : https://stackoverflow.com/questions/16198353/any-way-to-modify-jasmine-spies-based-on-arguments
    spyOn(sectionService, 'obtenirSectionParId').withArgs(1).and.returnValue(of({data: section}));
    expect(sectionService.obtenirSectionParId).toHaveBeenCalledWith(1);
  });

  xit('l\'abonnement pour la section à afficher doit être annulé lorsqu\'on quitte la page', () => {
    spyOn(component.observableSection$, 'unsubscribe');
    component.ionViewWillLeave();
    expect(component.observableSection$.unsubscribe).toHaveBeenCalled();
  });

  it('la variable maxBreadcrumbs doit être égale à undefined lorsque le breadcrumbs est étendu', () => {
    component.expandBreadcrumbs();
    expect(component.maxBreadCrumbs).toEqual(undefined);
  });
});
