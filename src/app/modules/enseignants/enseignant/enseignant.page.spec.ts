import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {EnseignantPage} from './enseignant.page';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from '../../../services/auth.service';
import {Utilisateur} from '../../../models/utilisateurs/utilisateur';
import {IonicModule} from '@ionic/angular';

/**
 * Tests unitaires associés à la page contenant la liste des enseignants
 * @author Jonathan Carrière
 */
describe('EnseignantPage', () => {
  let component: EnseignantPage;
  let fixture: ComponentFixture<EnseignantPage>;
  let authService: AuthService;

  // Création d'un faux utilisateur pour les tests de la page
  const utilisateur: Utilisateur = {
    id: 1,
    nom: 'Carrière',
    prenom: 'Jonathan',
    courriel: 'jonathan1234@email.com',
    courriel_verifie: new Date(),
    mot_de_passe: 'password',
    role: 1,
  };

  /**
   * Configuration pour les tests de cette page avec l'injection d'un utilisateur
   */
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnseignantPage],
      imports: [HttpClientModule, IonicModule],
      providers: [AuthService],
    }).compileComponents();
    fixture = TestBed.createComponent(EnseignantPage);
    component = fixture.componentInstance;
    // Injection du 'AuthService' et définition de l'utilisateur
    authService = TestBed.inject(AuthService);
    component.authService = authService;
    component.authService.setUtilisateur(utilisateur);
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si la page contenant la liste des enseignants se génère correctement
   */
  it('doit générer la page des enseignants correctement', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier si le h1 de la page s'affiche correctement
   */
  it('doit afficher le titre de la page', () => {

    // Obtenir le titre de la page et définir sa valeur
    const titrePage = fixture.nativeElement.querySelector('h1');
    const titrePageAttendu = 'Enseignants';

    // Vérifier si le titre de la page est valide
    expect(titrePage).toBeTruthy();
    expect(titrePage.textContent).toEqual(titrePageAttendu, `Erreur! Le titre de la page est: «${titrePage.textContent}»`);

  });

});
