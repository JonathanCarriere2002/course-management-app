//@Author Samir El Haddaji
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mot-de-passe-oublie',
  templateUrl: './mot-de-passe-oublie.page.html',
  styleUrls: ['./mot-de-passe-oublie.page.scss'],
})
export class MotDePasseOubliePage implements OnInit {

  // Formulaire de réinitialisation du mot de passe
  resetForm!: FormGroup;

  // Messages de succès et d'erreur
  successMessage!: string;
  errorMessage!: string;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    // Initialisation du formulaire
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Soumission du formulaire
  onSubmit() {
    if (this.resetForm.valid) {
      // Extraction de l'email depuis le formulaire
      const email: string = this.resetForm.value.email;

      // Appel de la méthode du service AuthService pour l'envoi de l'email
      this.authService.envoiNouveauPassword(email).subscribe(
        (response) => {
          // Succès : message de succès et réinitialisation du formulaire
          this.successMessage = 'Un courrier électronique a été envoyé pour réinitialiser votre mot de passe.';
          this.errorMessage = '';
          this.resetForm.reset();
        },
        (error) => {
          // Erreur : message d'erreur
          this.errorMessage = 'Erreur lors de l\'envoi de l\'email de réinitialisation du mot de passe.';
          this.successMessage = '';
        }
      );
    }
  }

}
