import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SessionPage} from './session.page';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from '../../../services/auth.service';
import {Utilisateur} from '../../../models/utilisateurs/utilisateur';
import {IonicModule} from '@ionic/angular';

/**
 * Tests unitaires associés à la page contenant la liste des sessions
 * @author Jonathan Carrière
 */
describe('SessionPage', () => {
  let component: SessionPage;
  let fixture: ComponentFixture<SessionPage>;
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
      declarations: [SessionPage],
      imports: [HttpClientModule, IonicModule],
      providers: [AuthService],
    }).compileComponents();
    fixture = TestBed.createComponent(SessionPage);
    component = fixture.componentInstance;
    // Injection du 'AuthService' et définition de l'utilisateur
    authService = TestBed.inject(AuthService);
    component.authService = authService;
    component.authService.setUtilisateur(utilisateur);
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si la page contenant la liste des sessions se génère correctement
   */
  it('doit générer la page des sessions correctement', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier si le h1 de la page s'affiche correctement
   */
  it('doit afficher le tire de la page', () => {

    // Obtenir le titre de la page et définir sa valeur
    const titrePage = fixture.nativeElement.querySelector('h1');
    const titrePageAttendu = 'Sessions';

    // Vérifier si le titre de la page est valide
    expect(titrePage).toBeTruthy();
    expect(titrePage.textContent).toEqual(titrePageAttendu, `Erreur! Le titre de la page est: «${titrePage.textContent}»`);

  });

});
