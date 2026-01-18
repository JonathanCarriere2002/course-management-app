import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { ListeProgrammesPage } from './liste-programmes.page';
import {IonicModule} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {Utilisateur} from '../../../models/utilisateurs/utilisateur';
import {HttpClientModule} from '@angular/common/http';
/**
 * Tests unitaires afin de tester les methodes de la page liste de programme
 * @author Samir El Haddaji
 */
describe('ListeProgrammesPage', () => {
  let component: ListeProgrammesPage;
  let fixture: ComponentFixture<ListeProgrammesPage>;
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

  //BeforeEach avec l'import de RouterTestingModule pour le activated route de la page
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListeProgrammesPage],
      imports: [HttpClientModule, IonicModule],
      providers: [AuthService],
    }).compileComponents();
    fixture = TestBed.createComponent(ListeProgrammesPage);
    component = fixture.componentInstance;
    // Injection du 'AuthService' et définition de l'utilisateur
    authService = TestBed.inject(AuthService);
    component.authService = authService;
    component.authService.setUtilisateur(utilisateur);
    fixture.detectChanges();
  }));


  //Test de création qui vérifie si la page se crée
  it('Doit créer la page', () => {
    expect(component).toBeTruthy();
  });

  //Test qui vérifie si la liste de programme est chargé lors de l'affichage de la page
  it('Doit initialiser liste de programme', () => {
    spyOn(component, 'getProgramme');
    component.ionViewWillEnter();
    expect(component.getProgramme).toHaveBeenCalled();
  });

  //Test qui vérifie si l'abbonement au .subscribe est desactivée lorsqu'on quitte la page
  it('Doit annuler labonnement à la sortie de la page', () => {
    component.observable$ = new Subscription();
    spyOn(component.observable$, 'unsubscribe');
    component.ionViewWillLeave();
    expect(component.observable$.unsubscribe).toHaveBeenCalled();
  });

  //Test qui vérifie si la redirection vers une autre page avec succes
  it('Doit rediriger vers la page formulaire', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component.redirect('formulaire-programme/ajouter');
    expect(router.navigate).toHaveBeenCalledWith(['/formulaire-programme/ajouter']);
  });

  //Test qui vérifie le satut des breadcrumbs
  it('Doit expandBreadcrumbs', () => {
    component.expandBreadcrumbs();
    expect(component.maxBreadcrumbs).toBe(20);
  });
});
