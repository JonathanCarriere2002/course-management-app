import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MotDePasseOubliePage } from './mot-de-passe-oublie.page';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { of, throwError } from 'rxjs';

/**
 * Tests unitaires associés à la page de réinitialisation du mot de passe
 * @author Samir El Haddaji
 */
describe('MotDePasseOubliePage', () => {
  let component: MotDePasseOubliePage;
  let fixture: ComponentFixture<MotDePasseOubliePage>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  /**
   * Configuration globale des tests pour la page de réinitialisation du mot de passe
   */
  beforeEach(
    waitForAsync(() => {
      mockAuthService = jasmine.createSpyObj('AuthService', ['envoiNouveauPassword']);

      TestBed.configureTestingModule({
        declarations: [MotDePasseOubliePage],
        imports: [IonicModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: AuthService, useValue: mockAuthService },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MotDePasseOubliePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  /**
   * Test unitaire permettant de vérifier si la page de réinitialisation du mot de passe se génère correctement
   */
  it('doit générer la page de réinitialisation du mot de passe correctement', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier le comportement lors de la soumission du formulaire avec un email valide
   */
  it('doit soumettre le formulaire avec un email valide', () => {
    // Initialiser le formulaire avec un email valide
    const envoiNouveauPasswordSpy = mockAuthService.envoiNouveauPassword.and.returnValue(of({}));

    component.resetForm.controls['email'].setValue('test@example.com');

    // Appeler la méthode onSubmit
    component.onSubmit();

    // Vérifier si la méthode envoiNouveauPassword du service AuthService est appelée avec le bon email
    expect(envoiNouveauPasswordSpy).toHaveBeenCalledWith('test@example.com');
    // Vérifier si le message de succès est correctement défini
    expect(component.successMessage).toBe('Un courrier électronique a été envoyé pour réinitialiser votre mot de passe.');
    // Vérifier si le message d'erreur est vide
    expect(component.errorMessage).toBe('');
    // Vérifier si le formulaire est réinitialisé
    expect(component.resetForm.value.email).toBe(null);
  });

  /**
   * Test unitaire permettant de vérifier le comportement lors de la soumission du formulaire avec un email invalide
   */
  it('doit afficher un message d\'erreur en cas d\'email invalide', () => {
    // Initialiser le formulaire avec un email invalide
    const envoiNouveauPasswordSpy = mockAuthService.envoiNouveauPassword.and.returnValue(of({}));

    component.resetForm.controls['email'].setValue('invalidemail');

    // Appeler la méthode onSubmit
    component.onSubmit();

    // Vérifier si la méthode envoiNouveauPassword du service AuthService n'est pas appelée (car l'email est invalide)
    expect(envoiNouveauPasswordSpy).not.toHaveBeenCalled();
  });

  /**
   * Test unitaire permettant de vérifier le comportement lors de l'échec de l'envoi de l'email
   */
  it('doit afficher un message d\'erreur en cas d\'échec de l\'envoi de l\'email', () => {
    // Initialiser le formulaire avec un email valide
    const envoiNouveauPasswordSpy = mockAuthService.envoiNouveauPassword.and.returnValue(throwError('Erreur'));

    component.resetForm.controls['email'].setValue('test@example.com');

    // Appeler la méthode onSubmit
    component.onSubmit();

    // Vérifier si la méthode envoiNouveauPassword du service AuthService est appelée avec le bon email
    expect(envoiNouveauPasswordSpy).toHaveBeenCalledWith('test@example.com');
    // Vérifier si le message d'erreur est correctement défini
    expect(component.errorMessage).toBe('Erreur lors de l\'envoi de l\'email de réinitialisation du mot de passe.');
    // Vérifier si le message de succès est vide
    expect(component.successMessage).toBe('');
    // Vérifier si le formulaire n'est pas réinitialisé
    expect(component.resetForm.value.email).toBe('test@example.com');
  });
});
