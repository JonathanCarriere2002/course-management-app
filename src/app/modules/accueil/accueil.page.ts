import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ApiLoginResponse} from '../../models/authentification/api-login-response';
import {ApiResponse} from '../../models/authentification/api-response';

/**
 * Classe permettant d'effectuer la gestion de la page d'accueil
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.page.html',
  styleUrls: ['./accueil.page.scss'],
})
export class AccueilPage implements OnInit {
  // Formulaire permettant de se connecter à l'application
  connexionForm!: FormGroup;
  // Message d'erreur affiché si la connexion échoue
  messageErreur = '';

  /**
   * Constructeur de la page d'accueil
   * @param authService Service permettant d'effectuer la gestion de l'authentification
   * @param formBuilder Constructeur pour le formulaire réactif de connexion
   * @param router Routeur permettant d'effectuer une redirection après que le formulaire est rempli
   */
  constructor(private authService : AuthService, private formBuilder: FormBuilder, private router: Router) { }

  /**
   * Méthode appeler sur l'initialisation de la page permettant de rendre le formulaire de connexion réactif
   */
  ngOnInit() {
    this.connexionForm = this.formBuilder.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  /**
   * Méthode permettant à un utilisateur ayant un compte de se connecter à l'application
   */
  connexion(){
    this.messageErreur = '';
    // Fonction permettant d'effectuer une tentative de connexion
    this.authService.connexion(this.connexionForm.get('email')?.value, this.connexionForm.get('password')?.value)
      // Effectuer un abonnement à l'observable pour la connexion
      .subscribe( {
        // Effectuer une redirection vers la liste des programmes si la connexion réussie
        next: (res: ApiResponse<ApiLoginResponse>) => {
          if (res.data?.token) {
            this.connexionForm.reset();
            this.router.navigateByUrl('/accueil').then(r => true);
          }
        },
        // Afficher un message d'erreur si la connexion échoue
        error: () => {
          this.connexionForm.reset();
          this.messageErreur = 'L\'adresse courriel ou le mot de passe que vous avez saisi est incorrect';
        }
      });
  }

}
