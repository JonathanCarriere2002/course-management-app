import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CriterePerformance} from '../../models/criteresPerformances/critere-performance';
import {environment} from '../../../environments/environment';
import {ApiResponse} from '../../models/authentification/api-response';
import {AuthService} from '../auth.service';
import {BaseService} from '../base.service';
/* @author lebel */
@Injectable({
  providedIn: 'root'
})
export class CriterePerformanceService extends BaseService{

  constructor(private httpClient: HttpClient,  private authService: AuthService) {
    super();
  }

  /**
   * Permet d'obternir la liste des critère de performance
   */
  getCriteresPerformance(): Observable<ApiResponse<CriterePerformance[]>>{
    return this.httpClient.get<ApiResponse<CriterePerformance[]>>(`${environment.api}/criteres-performance`,
      { context: this.authService.getContext() });
  }

  /**
   * Méthode permettant d'obtenir un critère de performance spécifique selon le Id en param
   * @param id Id du critère de performance voulu
   */
  getCriterePerformance(id:number):Observable<ApiResponse<CriterePerformance>>{
    return this.httpClient.get<ApiResponse<CriterePerformance>>(`${environment.api}/criteres-performance/${id}`,
      { context: this.authService.getContext() })
  }

  /**
   * M/thode qui permet de supprimer un critère de performance selon son Id
   * @param id voulant être supprimé
   */
  deleteCriterePerformance(id: number): Observable<ApiResponse<CriterePerformance[]>>{
    return this.httpClient.delete<ApiResponse<CriterePerformance[]>>(`${environment.api}/criteres-performance/${id}`,
      { context: this.authService.getContext() });
  }

  /**
   * Méthode permettant de créer un nouveau critère de performance
   * @param critereP l'objet critère de performance à supprimer
   */
  createCriterePerformance(critereP: Partial<CriterePerformance>): Observable<ApiResponse<object>>{
    return this.httpClient.post(
      `${environment.api}/criteres-performance`, critereP,{headers: {'Content': 'application/json'},
        context: this.authService.getContext() });
  }

  /**
   * Méthode permettant de modifier un crtière de performance
   * @param id Id du critère de performance qui sera modifié
   * @param critereP critère de performance qui sera mis à jour
   */
  updateCriterePerformance(id:number, critereP:Partial<CriterePerformance>): Observable<ApiResponse<object>> {
    return this.httpClient.put(
        `${environment.api}/criteres-performance/${id}`, critereP, { headers: { 'Content': 'application/json' },
        context: this.authService.getContext()
      });
  }


}
