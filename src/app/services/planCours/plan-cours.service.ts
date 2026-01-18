import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PlanCours} from '../../models/planCours/plan-cours';
import {environment} from '../../../environments/environment';
import {AuthService} from '../auth.service';
import {ApiResponse} from '../../models/authentification/api-response';
import {BaseService} from '../base.service';

/**
 * Service permettant d'effectuer la gestion des plans de cours
 * @author Emeric Chauret
 * @author Jonathan Carrière
 */
@Injectable({
  providedIn: 'root'
})
export class PlanCoursService extends BaseService {

  /**
   * Constructeur
   * @param httpClient service injecté HttpClient
   * @param authService service injecté AuthService
   */
  constructor(private httpClient: HttpClient, private authService: AuthService) {
    super();
  }

  /**
   * Méthode qui permet de récupérer la liste de plans de cours dans le fichier json.
   */
  getPlansCours(programme_id: number): Observable<ApiResponse<PlanCours[]>>{
    return this.httpClient.get<ApiResponse<PlanCours[]>>(`${environment.api}/programmes/${programme_id}/plans-cours`, { context: this.authService.getContext() });
  }

  /**
   * Méthode qui permet de récupérer le plan de cours ayant l'identifiant id dans le fichier json.
   * @param programme_id
   * @param plan_cours_id l'identifiant du plan de cours à récupérer (number)
   */
  getPlanCours(programme_id: number, plan_cours_id: number): Observable<ApiResponse<PlanCours>>{
    return this.httpClient.get<ApiResponse<PlanCours>>(`${environment.api}/programmes/${programme_id}/plans-cours/${plan_cours_id}`, { context: this.authService.getContext() });
  }

  /**
   * Méthode qui permet de créer un nouveau plan de cours dans le fichier json.
   * @param programme_id
   * @param planCours un plan de cours (objet)
   */
  createPlanCours(programme_id: number, planCours: Partial<PlanCours>): Observable<ApiResponse<object>>{
    return this.httpClient.post(`${environment.api}/programmes/${programme_id}/plans-cours`, planCours, {headers :{'Content': 'application/json'}, context: this.authService.getContext() });
  }

  /**
   * Méthode qui permet de supprimer un plan de cours dans le fichier json.
   * @param programme_id
   * @param plan_cours_id l'identifiant du plan de cours à supprimer dans la bd (number)
   */
  deletePlanCours(programme_id: number, plan_cours_id: number): Observable<ApiResponse<PlanCours[]>>{
    return this.httpClient.delete<ApiResponse<PlanCours[]>>(`${environment.api}/programmes/${programme_id}/plans-cours/${plan_cours_id}`, { context: this.authService.getContext() });
  }

  /**
   * Méthode qui permet de modifier un plan de cours dans la bd.
   * @param programme_id
   * @param plan_cours_id l'identifiant du plan de cours à modifier dans la bd (number)
   * @param planCours le plan de cours à modifier dans la bd (objet PlanCours)
   */
  updatePlanCours(programme_id: number, plan_cours_id: number, planCours: Partial<PlanCours>): Observable<ApiResponse<object>>{
    return this.httpClient.put(`${environment.api}/programmes/${programme_id}/plans-cours/${plan_cours_id}`, planCours, { headers: { 'Content': 'application/json' }, context: this.authService.getContext()});
  }

  /**
   * Méthode qui permet de modifier la date d'approbation d'un plan de cours
   * @param id Identifiant du plan de cours
   * @param date Date de l'approbation du plan de cours
   * @author Jonathan Carrière
   */
  updatePlanCoursApprobation(id: number, date: string): Observable<ApiResponse<object>> {
    return this.httpClient.patch(`${environment.api}/plans-cours/approbation/${id}/${date}`, null, { context: this.authService.getContext() });
  }

  /**
   * Méthode qui permet de supprimer la date d'approbation d'un plan de cours
   * @param id Identifiant du plan de cours
   * @author Jonathan Carrière
   */
  deletePlanCoursApprobation(id: number): Observable<ApiResponse<object>> {
    return this.httpClient.patch(`${environment.api}/plans-cours/approbation-supprimer/${id}`, null, { context: this.authService.getContext() });
  }

}
