import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Utilisateur} from '../../models/utilisateurs/utilisateur';
import {environment} from '../../../environments/environment';
import {AuthService} from '../auth.service';
import {ApiResponse} from '../../models/authentification/api-response';
import {BaseService} from '../base.service';

/**
 * Classe permettant d'effectuer la manipulation des utilisateurs dans la base de données
 * @author Jonathan Carrière
 */
@Injectable({
  providedIn: 'root'
})
export class UtilisateursService extends BaseService {

  /**
   * Constructeur du service pour les utilisateurs
   * @param httpClient Service permettant d'effectuer des requêtes Http
   * @param authService Service permettant d'effectuer l'authentification
   */
  constructor(private httpClient : HttpClient, private authService: AuthService) {
    super();
  }

  /**
   * Méthode permettant d'obtenir un utilisateur spécifique selon son Id
   * @param id Id de l'utilisateur dont on souhaite obtenir les données
   */
  getUtilisateur(id: number): Observable<ApiResponse<Utilisateur>> {
    return this.httpClient.get<ApiResponse<Utilisateur>>(`${environment.api}/utilisateurs/${id}`, { context: this.authService.getContext() });
  }

  /**
   * Méthode permettant d'obtenir l'ensemble des utilisateurs dans la base de données
   */
  getUtilisateurs(): Observable<ApiResponse<Utilisateur[]>> {
    return this.httpClient.get<ApiResponse<Utilisateur[]>>(`${environment.api}/utilisateurs`, { context: this.authService.getContext() })
  }

  /**
   * Méthode permettant d'ajouter un utilisateur dans la base de données
   * @param utilisateur Utilisateur qui sera ajouté dans la base de données
   */
  createUtilisateur(utilisateur: Partial<Utilisateur>): Observable<ApiResponse<object>> {
    return this.httpClient.post(`${environment.api}/utilisateurs`, utilisateur, {headers : {'Content' : 'application/json'}, context: this.authService.getContext() })
  }

  /**
   * Méthode permettant de modifier un utilisateur dans la base de données
   * @param id Id de l'utilisateur qui sera modifié
   * @param utilisateur Utilisateur qui sera mise à jour
   */
  updateUtilisateur(id: number, utilisateur: Partial<Utilisateur>): Observable<ApiResponse<object>> {
    return this.httpClient.put(`${environment.api}/utilisateurs/${id}`, utilisateur, { headers: {'Content': 'application/json'}, context: this.authService.getContext() });
  }

  /**
   * Méthode permettant de supprimer un utilisateur de la base de données
   * @param id Id de l'utilisateur qui sera supprimé de la base de données
   */
  deleteUtilisateur(id: number): Observable<ApiResponse<Utilisateur[]>> {
    return this.httpClient.delete<ApiResponse<Utilisateur[]>>(`${environment.api}/utilisateurs/${id}`, { context: this.authService.getContext() })
  }

}
