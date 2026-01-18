/**
 * @author Jacob Beauregard-Tousignant
 */

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {CriteresEvaluations} from '../../models/critereEvaluation/criteres-evaluations';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth.service';
import {BaseService} from '../base.service';
import {ApiResponse} from '../../models/authentification/api-response';

@Injectable({
  providedIn: 'root'
})
export class CriteresEvaluationsService extends BaseService {


  constructor(private httpClient: HttpClient, private authService: AuthService) {
    super()
  }

  /**
   * Aller chercher l'ensemble des critères d'évaluations dans la base de données
   */
  getCriteresEvaluations(): Observable<ApiResponse<CriteresEvaluations[]>>{
    return this.httpClient.get<ApiResponse<CriteresEvaluations[]>>(`${environment.api}/criteres-evaluation`, { context: this.authService.getContext() });
  }


  /**
   * Méthode pour aller chercher un critère d'évaluation selon son id dans la base de données
   * @param id Id du critère à aller chercher
   */
  getCritereEvaluation(id:number):Observable<ApiResponse<CriteresEvaluations>>{
    return this.httpClient.get<ApiResponse<CriteresEvaluations>>(`${environment.api}/criteres-evaluation/${id}`, { context: this.authService.getContext() })
  }


  /**
   * Méthode pour supprimer un critère d'évaluation de la base de données
   * @param id
   */
  deleteCritereEvaluation(id: number):Observable<ApiResponse<CriteresEvaluations>> {
    return this.httpClient.delete<ApiResponse<CriteresEvaluations>>(`${environment.api}/criteres-evaluation/${id}`, { context: this.authService.getContext() });
  }

  /**
   * Méthode pour ajouter des critères d'évaluation
   * @param critereEvaluation Le critère d'évaluation à ajouter dans la BD
   */
  createCritereEvaluation(critereEvaluation: Partial<CriteresEvaluations>):Observable<ApiResponse<object>>{
    return this.httpClient.post(
      `${environment.api}/criteres-evaluation`, critereEvaluation, {headers: {'Content': 'application/json'}, context: this.authService.getContext() });
  }


  /**
   * Méthode pour modifier un critère d'évaluation dans la BD
   * @param id Id du critère d'évaluation à modifier
   * @param critere La nouvelle version du critère d'évaluation
   */
  updateCritereEvaluation(id:number, critere:Partial<CriteresEvaluations>) {
    return this.httpClient.put(
      `${environment.api}/criteres-evaluation/${id}`, critere, { headers: { 'Content': 'application/json' }, context: this.authService.getContext() });
  }
}
