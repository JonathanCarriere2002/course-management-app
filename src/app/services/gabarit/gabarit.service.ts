/**
 * @author Emeric Chauret
 */

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Gabarit} from '../../models/gabarit/gabarit';
import {environment} from '../../../environments/environment';
import {BaseService} from '../base.service';
import {AuthService} from '../auth.service';
import {ApiResponse} from '../../models/authentification/api-response';

@Injectable({
  providedIn: 'root'
})
export class GabaritService extends BaseService {

  /**
   * Constructeur
   * @param httpClient service injecté HttpClient
   * @param authService service injecté AuthService
   */
  constructor(private httpClient: HttpClient, private authService: AuthService) {
    super();
  }

  /**
   * Méthode qui permet de récupérer la liste des gabarits dans la bd.
   */
  obtenirTousLesGabarits(): Observable<ApiResponse<Gabarit[]>>{
    return this.httpClient.get<ApiResponse<Gabarit[]>>(`${environment.api}/gabarits`, { context: this.authService.getContext() });
  }

  /**
   * Méthode qui permet de récupérer le gabarit ayant l'identifiant id dans la bd.
   * @param id l'identifiant du gabarit à récupérer (number)
   */
  obtenirGabaritParId(id: number): Observable<ApiResponse<Gabarit>>{
    return this.httpClient.get<ApiResponse<Gabarit>>(`${environment.api}/gabarits/${id}`, { context: this.authService.getContext() });
  }

  /**
   * Méthode qui permet de créer un nouveau gabarit dans la bd.
   * @param gabarit le nouveau gabarit à créer (Partial<Gabarit>)
   */
  creerGabarit(gabarit: Partial<Gabarit>): Observable<ApiResponse<object>>{
    return this.httpClient.post(`${environment.api}/gabarits`, gabarit, {headers :{'Content': 'application/json'}, context: this.authService.getContext()});
  }

  /**
   * Méthode qui permet de supprimer un gabarit dans la bd.
   * @param id l'identifiant du gabarit à supprimer (number)
   */
  supprimerGabarit(id: number): Observable<ApiResponse<Gabarit[]>>{
    return this.httpClient.delete<ApiResponse<Gabarit[]>>(`${environment.api}/gabarits/${id}`, { context: this.authService.getContext() });
  }

  /**
   * Méthode qui permet de modifier un gabarit dans la bd.
   * @param id l'identifiant du gabarit à modifier dans la bd (number)
   * @param gabarit le gabarit à modifier dans la bd (Partial<Gabarit>)
   */
  modifierGabarit(id: number, gabarit: Partial<Gabarit>): Observable<ApiResponse<object>>{
    return this.httpClient.put(`${environment.api}/gabarits/${id}`, gabarit, { headers: { 'Content': 'application/json' }, context: this.authService.getContext()});
  }

}
