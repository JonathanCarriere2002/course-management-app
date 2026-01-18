import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PasswordResetPage } from './password-reset.page';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import {AuthService} from '../../../services/auth.service';

/**
 * Tests unitaires associés à la page de réinitialisation du mot de passe
 * @author Samir El Haddaji
 */
describe('PasswordResetPage', () => {
  let component: PasswordResetPage;
  let fixture: ComponentFixture<PasswordResetPage>;
  // eslint-disable-next-line
  let mockAuthService: any;
  // eslint-disable-next-line
  let mockActivatedRoute: any;

  /**
   * Configuration globale des tests pour la page de réinitialisation du mot de passe
   */
  beforeEach(
    waitForAsync(() => {
      mockAuthService = jasmine.createSpyObj('AuthService', ['updatePassword']);
      mockActivatedRoute = {
        paramMap: of(convertToParamMap({ token: 'testToken' })),
        queryParams: of({ email: 'test@example.com' }),
      };

      TestBed.configureTestingModule({
        declarations: [PasswordResetPage],
        imports: [IonicModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: AuthService, useValue: mockAuthService },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(PasswordResetPage);
      component = fixture.componentInstance;
      mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
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
   * Test unitaire permettant de vérifier le comportement lors de la soumission du formulaire avec des mots de passe correspondants
   */
  it('doit soumettre le formulaire avec des mots de passe correspondants', () => {
    // Initialiser le formulaire avec des mots de passe valides
    const updatePasswordSpy = mockAuthService.updatePassword.and.returnValue(of({}));

    component.resetForm.controls['password'].setValue('testPassword');
    component.resetForm.controls['confirmPassword'].setValue('testPassword');

    // Appeler la méthode onSubmit
    component.onSubmit();

    // Vérifier si la méthode updatePassword du service AuthService est appelée avec les bons paramètres
    expect(updatePasswordSpy).toHaveBeenCalledWith(
      'test@example.com',
      'testPassword',
      'testPassword',
      'testToken'
    );
  });
});
