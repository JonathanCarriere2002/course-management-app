import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';

import { ModalInfoComponent } from './modal-info.component';
import {MockProvider} from 'ng-mocks';

describe('ModalInfoComponent', () => {
  let component: ModalInfoComponent;
  let fixture: ComponentFixture<ModalInfoComponent>;
  const titre = 'Test'
  const message: string[] = [
    'Ceci est un test',
    'test 1',
    'test 2'
  ]

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInfoComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        MockProvider(ModalController)
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ModalInfoComponent);
    component = fixture.componentInstance;
    component.titre = titre;
    component.message = message;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('le titre doit être affiché', () => {
    const titreActuel = fixture.nativeElement.querySelector('ion-title').textContent; // Récupérer le titre du composant
    // test
    expect(titreActuel).toEqual(titre);
  });

  it('la méthode ok doit fermer le modal', () => {
    spyOn(component, 'ok'); // espionner la méthode ok du composant
    const bouton = fixture.nativeElement.querySelector('ion-button'); // Récupérer le bouton ok
    bouton.click(); // simuler un click sur le bouton ok
    // test
    expect(component.ok).toHaveBeenCalled();
  });
});
