//@Author Samir El Haddaji

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {
  // Formulaire de réinitialisation du mot de passe
  resetForm!: FormGroup;

  // Token et email extraits des paramètres de l'URL
  token!: string;
  email!: string;

  // Champs pour le mot de passe et la confirmation du mot de passe
  password!: string;
  password_confirmation!: string;

  // Messages de succès et d'erreur
  successMessage!: string;
  errorMessage!: string;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Initialisation du formulaire
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });

    // Extraction du token des paramètres de l'URL
    this.route.paramMap.subscribe((paramMap) => {
      this.token = paramMap.get('token') || '';
    });

    // Extraction de l'email des paramètres de l'URL
    this.route.queryParams.subscribe((queryParams) => {
      this.email = queryParams['email'] || '';
      console.log(this.email);
    });
  }

  // Soumission du formulaire
    onSubmit() {
      if (this.resetForm.valid) {
        this.password = this.resetForm.value.password;
        this.password_confirmation = this.resetForm.value.confirmPassword;

        if (this.password === this.password_confirmation) {
          // Appel du service AuthService pour mettre à jour le mot de passe
          this.authService.updatePassword(this.email, this.password, this.password_confirmation, this.token).subscribe(
            (response) => {
              // Mise à jour réussie
              this.successMessage = 'Mot de passe mis à jour avec succès.';
              this.errorMessage = '';
              this.resetForm.reset()
            },
            (error) => {
              // Erreur lors de la mise à jour
              this.errorMessage = 'Erreur lors de la mise à jour du mot de passe.';
              this.successMessage = '';
            }
          );
        } else {
          // Les mots de passe ne correspondent pas
          this.errorMessage = 'Les mots de passe ne correspondent pas.';
          this.successMessage = '';
        }
      }
  }
}
