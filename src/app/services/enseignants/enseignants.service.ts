import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Enseignant} from '../../models/enseignants/enseignant';
import {environment} from '../../../environments/environment';
import {AuthService} from '../auth.service';
import {ApiResponse} from '../../models/authentification/api-response';
import {BaseService} from '../base.service';

/**
 * Classe permettant d'effectuer la manipulation des enseignants dans la base de données
 * @author Jonathan Carrière
 * @author Samir El Haddaji
 */
@Injectable({
  providedIn: 'root'
})
export class EnseignantsService extends BaseService {

  /**
   * Constructeur du service pour les enseignants
   * @param httpClient Service permettant d'effectuer des requêtes Http
   * @param authService Service permettant d'effectuer l'authentification
   */
  constructor(private httpClient : HttpClient, private authService: AuthService) {
    super();
  }

  /**
   * Méthode permettant d'obtenir un enseignant spécifique selon son Id
   * @param id Id de l'enseignant dont on souhaite obtenir les données
   */
  getEnseignant(id: number): Observable<ApiResponse<Enseignant>> {
    return this.httpClient.get<ApiResponse<Enseignant>>(`${environment.api}/enseignants/${id}`, { context: this.authService.getContext() });
  }

  /**
   * Méthode permettant d'obtenir l'ensemble des enseignants dans la base de données
   */
  getEnseignants(): Observable<ApiResponse<Enseignant[]>> {
    return this.httpClient.get<ApiResponse<Enseignant[]>>(`${environment.api}/enseignants`, { context: this.authService.getContext() })
  }

  /**
   * Méthode permettant d'ajouter un enseignant dans la base de données
   * @param enseignant Enseignant qui sera ajouté dans la base de données
   */
  createEnseignant(enseignant: Partial<Enseignant>): Observable<ApiResponse<object>> {
    return this.httpClient.post(`${environment.api}/enseignants`, enseignant, {headers : {'Content' : 'application/json'}, context: this.authService.getContext() })
  }

  /**
   * Méthode permettant de modifier un enseignant dans la base de données
   * @param id Id de l'enseignant qui sera modifié
   * @param enseignant Enseignant qui sera mise à jour
   */
  updateEnseignant(id: number, enseignant: Partial<Enseignant>): Observable<ApiResponse<object>> {
    return this.httpClient.put(`${environment.api}/enseignants/${id}`, enseignant, { headers: {'Content': 'application/json'}, context: this.authService.getContext() });
  }

  /**
   * Méthode permettant de supprimer un enseignant de la base de données
   * @param id Id de l'enseignant qui sera supprimé de la base de données
   */
  deleteEnseignant(id: number): Observable<ApiResponse<Enseignant[]>> {
    return this.httpClient.delete<ApiResponse<Enseignant[]>>(`${environment.api}/enseignants/${id}`, { context: this.authService.getContext() })
  }

}
