import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ApprobationDetailsPlancadreComponent } from './approbation-details-plancadre.component';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from '../../../../services/auth.service';
import {Utilisateur} from '../../../../models/utilisateurs/utilisateur';

/**
 * Tests unitaires associés au component pour l'approbation d'un plan-cadre sur la page de détails
 * @author Jonathan Carrière
 */
describe('ApprobationDetailsPlancadreComponent', () => {
  let component: ApprobationDetailsPlancadreComponent;
  let fixture: ComponentFixture<ApprobationDetailsPlancadreComponent>;
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
      declarations: [ApprobationDetailsPlancadreComponent],
      imports: [HttpClientModule, IonicModule],
      providers: [AuthService],
    }).compileComponents();
    fixture = TestBed.createComponent(ApprobationDetailsPlancadreComponent);
    component = fixture.componentInstance;
    // Injection du 'AuthService' et définition de l'utilisateur
    authService = TestBed.inject(AuthService);
    component.authService = authService;
    component.authService.setUtilisateur(utilisateur);
    fixture.detectChanges();
  }));

  /**
   * Test unitaire permettant de vérifier si le component pour l'approbation d'un plan-cadre sur la page de détails se génère correctement
   */
  it('doit générer le component pour l\'approbation d\'un plan-cadre sur la page de détails correctement', () => {
    expect(component).toBeTruthy();
  });

});
