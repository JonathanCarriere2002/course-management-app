import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {Observable, tap} from 'rxjs';
import {HttpClient, HttpContext} from '@angular/common/http';
import {TOKEN} from './interceptors/add-headers.interceptor';
import {Utilisateur} from '../models/utilisateurs/utilisateur';
import {ApiLoginResponse} from '../models/authentification/api-login-response';
import {ApiResponse} from '../models/authentification/api-response';

/**
 * Service permettant d'effectuer la gestion des authentifications de l'application
 * @author Jonathan Carrière
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService{

  // Token de l'utilisateur s'ayant connecté à l'application
  private token = '';

  // Utilisateur s'ayant connecté à l'application
  private utilisateur!: Utilisateur;

  /**
   * Constructeur du service permettant d'effectuer la gestion des authentifications
   * @param httpClient Objet de type 'HttpClient' permettant d'effectuer des requêtes HTTP
   * @authors Jonathan Carrière  et Emeric Chauret
   */
  constructor(private httpClient: HttpClient) {
    super();
    const utilisateur_session = sessionStorage.getItem('utilisateur');
    if(utilisateur_session){
      this.utilisateur = JSON.parse(utilisateur_session);
    }
  }

  /**
   * Méthode permettant de retourner un nouveau context HTTP avec un Token d'authentification
   * @author Jonathan Carrière
   */
  getContext(){
    return new HttpContext().set(TOKEN, this.getToken())
  }

  /**
   * Méthode permettant de définir un nouveau Token d'authentification
   * @param newToken Nouveau Token pour l'authentification
   * @author Jonathan Carrière
   */
  setToken(newToken: string){
    this.token = newToken;
    sessionStorage.setItem('token', this.token)
  }

  /**
   * Méthode permettant de retourner le Token d'authentification en cours d'utilisation
   * @author Jonathan Carrière
   */
  getToken(){
    const token = sessionStorage.getItem('token');
    if (token != null) {
      return token;
    }
    return '';
  }

  /**
   * Méthode permettant à un utilisateur de se connecter à l'application
   * @param email Adresse courriel de l'utilisateur
   * @param password Mot de passe de l'utilisateur
   * @param device_name Nom de l'appareil sur lequel l'utilisateur s'est connecté
   * @author Jonathan Carrière
   */
  // eslint-disable-next-line
  connexion(email:string, password: string, device_name = 'ionic-app'): Observable<any> {
    // Effectuer une requête POST permettant à l'utilisateur de se connecter
    return this.httpClient.post(
      this.url+'/login', {
        'email': email,
        'password': password,
        'device_name' : device_name
      }
    ).pipe(
      // Attendre que la connexion soit réussie
      tap({next : (res:ApiResponse<ApiLoginResponse>) => {
        // Vérifier si la réponse contient des données valides
        if (res.data) {
          // Définir l'utilisateur s'ayant connecté
          this.setUtilisateur(res.data.user);
          // Définir le Token de l'utilisateur
          this.setToken(res.data.token)
        }
      }})
    )
  }

  /**
   * Méthode permettant à un utilisateur de se déconnecter de l'application
   * @author Jonathan Carrière
   */
  logout(){
    return this.httpClient.post(this.url+'/logout', {}, {context: this.getContext()})
      .subscribe(() => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('utilisateur');
      })
  }

  /**
   * Méthode permettant de définir l'utilisateur qui utilise l'application présentement
   * @param utilisateur Utilisateur qui utilise l'application
   * @author Jonathan Carrière  et Emeric Chauret
   */
  setUtilisateur(utilisateur: Utilisateur):void {
    this.utilisateur = utilisateur;
    this.utilisateur.mot_de_passe = '';
    sessionStorage.setItem('utilisateur', JSON.stringify(this.utilisateur));
  }

  /**
   * Méthode permettant de vérifier si l'utilisateur connecté possède un des rôles souhaités
   * @param rolesAutorises Liste des rôles autorisées pour la ressource
   * @authors Jonathan Carrière , Jacob, Lebel
   */
  verifierRoleUtilisateurConnecte(rolesAutorises: number[]): boolean {
    const role = this.getUtilisateur().role;
    return rolesAutorises.includes(parseInt(role.toString()));
  }

  /**
   * Méthode permettant d'envoyer un couriel pour reset le password
   * @param utilisateur l'email de l'utilisateur
   * @author Samir El Haddaji
   */
  envoiNouveauPassword(email: string) {
    return this.httpClient.post(
      this.url+'/forgot-password', {
        'email': email,
      }
    )
  }

  /**
   * Méthode permettant de mettre à jour le mot de passe de l'utilisateur
   * @param email Adresse courriel de l'utilisateur
   * @param token Token de réinitialisation du mot de passe
   * @param password Nouveau mot de passe
   */
  // eslint-disable-next-line
  updatePassword(email: string, password: string, passwordConfirmation: string, token: string,): Observable<any> {
    const requestData = {
      email: email,
      password: password,
      password_confirmation: passwordConfirmation,
      token: token
    };

    return this.httpClient.post(
      this.url + '/reset-password',
      requestData,
      { context: this.getContext() }
    )
  }

  /**
   * Méthode permettant d'obtenir l'utilisateur connecté à l'application
   * @author Lebel
   */
  getUtilisateur():Utilisateur {
    return this.utilisateur;
  }

  /**
   * Vérifie si le current user est connecté à l'application ou non
   */
  estConnecte(): boolean{
    return this.utilisateur !== undefined;
  }

}
