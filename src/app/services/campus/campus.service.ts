/**
 * @author Emeric Chauret
 */

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Campus} from '../../models/campus/campus';
import {environment} from '../../../environments/environment';
import {BaseService} from '../base.service';
import {ApiResponse} from '../../models/authentification/api-response';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CampusService extends BaseService{

  /**
   * Constructeur
   * @param httpClient service injecté HttpClient
   * @param authService service injecté AuthService
   */
  constructor(private httpClient: HttpClient, private authService: AuthService) {
    super()
  }

  /**
   * Méthode qui permet de récupérer la liste des campus dans la bd.
   */
  obtenirTousLesCampus(): Observable<ApiResponse<Campus[]>>{
    return this.httpClient.get<ApiResponse<Campus[]>>(`${environment.api}/campus`, { context: this.authService.getContext() });
  }

  /**
   * Méthode qui permet de récupérer le campus ayant l'identifiant id dans la bd.
   * @param id l'identifiant du campus à récupérer (number)
   */
  obtenirCampusParId(id: number): Observable<ApiResponse<Campus>>{
    return this.httpClient.get<ApiResponse<Campus>>(`${environment.api}/campus/${id}`, { context: this.authService.getContext() });
  }

  /**
   * Méthode qui permet de créer un nouveau campus dans la bd.
   * @param campus le nouveau campus à créer (Partial<Campus>)
   */
  creerCampus(campus: Partial<Campus>): Observable<ApiResponse<object>>{
    return this.httpClient.post(`${environment.api}/campus`, campus, {headers :{'Content': 'application/json'}, context: this.authService.getContext() });
  }

  /**
   * Méthode qui permet de supprimer un campus dans la bd.
   * @param id l'identifiant du campus à supprimer (number)
   */
  supprimerCampus(id: number): Observable<ApiResponse<Campus[]>>{
    return this.httpClient.delete<ApiResponse<Campus[]>>(`${environment.api}/campus/${id}`, { context: this.authService.getContext() });
  }

  /**
   * Méthode qui permet de modifier un campus dans la bd.
   * @param id l'identifiant du campus à modifier dans la bd (number)
   * @param campus le campus à modifier dans la bd (Partial<Campus>)
   */
  modifierCampus(id: number, campus: Partial<Campus>): Observable<ApiResponse<object>>{
    return this.httpClient.put(`${environment.api}/campus/${id}`, campus, { headers: { 'Content': 'application/json' }, context: this.authService.getContext() });
  }

}
