import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Competence} from '../../models/competences/competence';
import {ApiResponse} from '../../models/authentification/api-response';
import {AuthService} from '../auth.service';
import {BaseService} from '../base.service';
/* @author lebel */

@Injectable({
  providedIn: 'root'
})
export class CompetencesService extends BaseService{
  constructor(private httpClient: HttpClient, private authService: AuthService) {
    super();
  }

  /**
   * Fonction permettant d'obtenir l'ensemble des compétences
   */
  getCompetences() : Observable<ApiResponse<Competence[]>> {
    return this.httpClient.get<ApiResponse<Competence[]>>( `${environment.api}/competences`, { context: this.authService.getContext() });
  }

  /**
   * Méthode permettant d'obtenir une compétence spécifique selon le Id en param
   * @param id Id de la compétence voulue
   */
  getCompetence(id: number):Observable<ApiResponse<Competence>>{
    return this.httpClient.get<ApiResponse<Competence>>(`${environment.api}/competences/${id}`, { context: this.authService.getContext() });
  }

  /**
   * Fonction permettant de supprimer une compétence
   * @param id de la compétence à supprimer
   */
  deleteCompetence(id: number): Observable<ApiResponse<Competence[]>>{
    return this.httpClient.delete<ApiResponse<Competence[]>>( `${environment.api}/competences/${id}`, {context: this.authService.getContext() });
  }

  /**
   * Fonction permettant de créer une compétence
   * @param competence compétence à créer
   */
  createCompetence(competence: Partial<Competence>): Observable<ApiResponse<object>> {
    return  this.httpClient.post(`${environment.api}/competences`,
      competence, {headers : {'Content': 'application/json'},
        context: this.authService.getContext()
      });
  }

  /**
   * Méthode permettant de modifier une compétence
   * @param id Id de la compétence qui sera modifié
   * @param competence competence qui sera mise à jour
   */
  updateCompetence(id:number, competence:Partial<Competence>): Observable<ApiResponse<object>> {
    return this.httpClient.put(
        `${environment.api}/competences/${id}`, competence, { headers: { 'Content': 'application/json' },  context: this.authService.getContext() });
  }
}
