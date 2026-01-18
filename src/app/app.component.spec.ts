import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {TestBed, waitForAsync} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {Utilisateur} from './models/utilisateurs/utilisateur';
import {AuthService} from './services/auth.service';

/**
 * Tests unitaires pour l'ensemble de l'application
 * @author Jacob Beauregard-Tousignant
 */
describe('AppComponent', () => {
  let menuIcons: HTMLMenuElement[] = []
  let menuLabels: HTMLMenuElement[] = [];
  let menuItems: HTMLMenuElement[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authService: AuthService;

  // Création d'un faux utilisateur pour les tests de la page
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const utilisateur: Utilisateur = {
    id: 1,
    nom: 'Carrière',
    prenom: 'Jonathan',
    courriel: 'jonathan1234@email.com',
    courriel_verifie: new Date(),
    mot_de_passe: 'password',
    role: 1,
  };

  // Configuration global des tests
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule.withRoutes([]),HttpClientModule],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
    const app = fixture.nativeElement;
    menuLabels = app.querySelectorAll('ion-label');
    menuItems = app.querySelectorAll('ion-item');
  });

  // Test unitaire permettant de valider la génération de l'application
  xit("doit générer l'application", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  /**
   * Suite de test
   */
  // Tests unitaires permettant de valider les éléments du menu
  describe('Éléments Menu', () => {
    xit('le menu devrait contenir 10 éléments', () => {
      expect(menuLabels.length).toEqual(10);
    });


    xit('le second élément du menu doit être Réception', () => {
      expect(menuLabels[1].textContent).toContain('Enseignants');
    });

    beforeEach(waitForAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const app = fixture.nativeElement;
      menuItems = app.querySelectorAll('ion-label')
      menuIcons = app.querySelectorAll('ion-icon')
    }));

    xit('Deuxième label Compétences', () => {
      expect(menuItems[1].textContent).toContain('Enseignants');
    });

    //@Author : SamirEl
    xit('le menu devrait contenir 8 éléments', () => {
      expect(menuLabels.length).toEqual(10);
    });

    /* @author lebel -- verifier si la page element comp est presente*/
    xit('Troisième label est Elements de competence', () => {
      expect(menuItems[2].textContent).toContain('Elements de competence');
    });

    //@Author : SamirEl
    xit('Premier label Enseignants', () => {
      expect(menuItems[1].textContent).toContain('Enseignants');
    });

    //@Author : SamirEl
    xit('Il y a 10 labels', () => {
      expect(menuItems.length).toEqual(10);
    });

    xit('10 icones de menu', () => {
        expect(menuIcons.length).toEqual(10);
    });

  })
})
