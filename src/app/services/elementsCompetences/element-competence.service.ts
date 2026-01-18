import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ElementCompetence} from '../../models/elementsCompetences/element-competence';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {BaseService} from '../base.service';
import {AuthService} from '../auth.service';
import {ApiResponse} from '../../models/authentification/api-response';
/* @author lebel */

@Injectable({
  providedIn: 'root'
})
export class ElementCompetenceService extends BaseService{

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    super();
  }

  /**
   * Méthode permettant de get la liste des éléments de compétence
   */
  getElementsComptetence(): Observable<ApiResponse<ElementCompetence[]>>{
    return this.httpClient.get<ApiResponse<ElementCompetence[]>>(`${environment.api}/elements-competence`,
      { context: this.authService.getContext() });
  }

  /**
   * Méthode permettant d'obtenir un element de compétence spécifique selon le Id en param
   * @param id Id de l'elements de compétence voulue
   */
  getElementComptetence(id:number):Observable<ApiResponse<ElementCompetence>>{
    return this.httpClient.get<ApiResponse<ElementCompetence>>(`${environment.api}/elements-competence/${id},`,
      { context: this.authService.getContext() });
  }

  /**
   * Méthode permettant de créer un nouvel élément de compétence
   * @param element -> élément de compétence à créer
   */
  createElementComptetence(element: Partial<ElementCompetence>): Observable<ApiResponse<object>>{
    return this.httpClient.post(
      `${environment.api}/elements-competence`, element, {headers : {'Content': 'application/json'},
        context : this.authService.getContext() });
  }

  /**
   * Méthode permettant de supprimer un élément de compétence
   * @param id de l'élément de compétence à supprimer
   */
  deleteElementComptetence(id: number): Observable<ApiResponse<ElementCompetence[]>> {
    return this.httpClient.delete<ApiResponse<ElementCompetence[]>>(`${environment.api}/elements-competence/${id}`,
      {context: this.authService.getContext()});
  }


  /**
   * Méthode permettant de modifier un élément de compétence
   * @param id Id de l'élément de compétence qui sera modifié
   * @param element élément de compétence qui sera mis à jour
   */
  updateElementComptetence(id:number, element:Partial<ElementCompetence>): Observable<ApiResponse<object>> {
    return this.httpClient.put(
        `${environment.api}/elements-competence/${id}`, element, { headers: { 'Content': 'application/json' },
        context : this.authService.getContext() });
  }

}
