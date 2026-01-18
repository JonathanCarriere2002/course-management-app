import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Session} from '../../models/sessions/session';
import {environment} from '../../../environments/environment';
import {AuthService} from '../auth.service';
import {ApiResponse} from '../../models/authentification/api-response';
import {BaseService} from '../base.service';

/**
 * Classe permettant d'effectuer la manipulation des sessions dans la base de données
 * @author Jonathan Carrière
 */
@Injectable({
  providedIn: 'root'
})
export class SessionsService extends BaseService {

  /**
   * Constructeur du service pour les enseignants
   * @param httpClient Service permettant d'effectuer des requêtes Http
   * @param authService Service permettant d'effectuer l'authentification
   */
  constructor(private httpClient : HttpClient, private authService: AuthService) {
    super();
  }

  /**
   * Méthode permettant d'obtenir une session spécifique selon son Id
   * @param id Id de la session dont on souhaite obtenir les données
   */
  getSession(id: number): Observable<ApiResponse<Session>> {
    return this.httpClient.get<ApiResponse<Session>>(`${environment.api}/sessions/${id}`, { context: this.authService.getContext() })
  }

  /**
   * Méthode permettant d'obtenir l'ensemble des sessions dans la base de données
   */
  getSessions(): Observable<ApiResponse<Session[]>> {
    return this.httpClient.get<ApiResponse<Session[]>>(`${environment.api}/sessions`, { context: this.authService.getContext() })
  }

  /**
   * Méthode permettant d'ajouter une session dans la base de données
   * @param session Session qui sera ajoutée dans la base de données
   */
  createSession(session: Partial<Session>): Observable<ApiResponse<object>> {
    return this.httpClient.post(`${environment.api}/sessions`, session, {headers : {'Content' : 'application/json'}, context: this.authService.getContext() })
  }

  /**
   * Méthode permettant de modifier une session dans la base de données
   * @param id Id de la session qui sera modifiée
   * @param session Session qui sera mise à jour
   */
  updateSession(id: number, session: Partial<Session>): Observable<ApiResponse<object>> {
    return this.httpClient.put(`${environment.api}/sessions/${id}`, session, { headers: {'Content': 'application/json'}, context: this.authService.getContext() });
  }

  /**
   * Méthode permettant de supprimer une session de la base de données
   * @param id Id de la session qui sera supprimée de la base de données
   */
  deleteSession(id:number): Observable<ApiResponse<Session[]>> {
    return this.httpClient.delete<ApiResponse<Session[]>>(`${environment.api}/sessions/${id}`, { context: this.authService.getContext() })
  }

}
