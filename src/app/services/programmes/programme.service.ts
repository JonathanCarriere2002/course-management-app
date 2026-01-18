/**
 * @author Samir El Haddaji
 */

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Programme} from '../../models/programmes/programme';
import {BaseService} from '../base.service';
import {AuthService} from '../auth.service';
import {ApiResponse} from '../../models/authentification/api-response';

@Injectable({
  providedIn: 'root'
})
export class ProgrammeService extends BaseService {

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    super();
  }

  /**
   * Methode qui recherge la liste de programmes dans l'adresse demandé
   */
  getProgrammes(): Observable<ApiResponse<Programme[]>>{
    return this.httpClient.get<ApiResponse<Programme[]>>(`${environment.api}/programmes`, { context: this.authService.getContext() });
  }

  /**
   * Methoe qui recherche un programme spécifique avec l'id donnnée
   */
  getProgramme(id:number):Observable<ApiResponse<Programme>>{
    return this.httpClient.get<ApiResponse<Programme>>(`${environment.api}/programmes/${id}`, { context: this.authService.getContext() });
  }

  /**
   * Méthode pour supprimer un programme avec l'id donnée
   * @param id
   */
  deleteProgramme(id: number):Observable<ApiResponse<Programme[]>> {
    return this.httpClient.delete<ApiResponse<Programme[]>>(`${environment.api}/programmes/${id}`, { context: this.authService.getContext() });
  }

  /**
   * Méthode pour ajouter un programme à la base de données
   * @param programme le programme à ajouter à la abse de données
   */
  createProgramme(programme: Partial<Programme>): Observable<ApiResponse<object>>{
    return this.httpClient.post(`${environment.api}/programmes`, programme, {headers :{'Content': 'application/json'}, context: this.authService.getContext() });
  }

  /**
   * Méthode pour modifier un programme à la base de données
   * @param programme Le programme à modifier à la base de données
   */
  updateProgramme(id: number, programme: Partial<Programme>): Observable<ApiResponse<object>>{
    return this.httpClient.put(`${environment.api}/programmes/${id}`, programme, { headers: { 'Content': 'application/json' }, context: this.authService.getContext()});
  }

}


