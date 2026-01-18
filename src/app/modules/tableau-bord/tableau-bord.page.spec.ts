import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TableauBordPage } from './tableau-bord.page';
import { AuthService } from '../../services/auth.service';
import { Utilisateur } from '../../models/utilisateurs/utilisateur';
import { HttpClientModule } from '@angular/common/http';

/**
 * Tests unitaires associés à la page contenant le tableau de bord
 * @author Samir El Haddaji
 * @author Jonathan Carrière
 */
describe('TableauBordPage', () => {
  let component: TableauBordPage;
  let fixture: ComponentFixture<TableauBordPage>;
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
   * @author Jonathan Carrière
   */
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableauBordPage],
      imports: [HttpClientModule],
      providers: [AuthService],
    }).compileComponents();
    fixture = TestBed.createComponent(TableauBordPage);
    component = fixture.componentInstance;
    // Injection du 'AuthService' et définition de l'utilisateur
    authService = TestBed.inject(AuthService);
    component.authService = authService;
    component.authService.setUtilisateur(utilisateur);
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier que la page contenant le tableau de bord se crée
   * @author Samir El Haddaji
   */
  it('doit créer le tableau de bord', () => {
    expect(component).toBeTruthy();
  });

});
