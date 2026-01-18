import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {PlanCadres} from '../../models/planCadres/plan-cadres';
import {AuthService} from '../auth.service';
import {BaseService} from '../base.service';
import {ApiResponse} from '../../models/authentification/api-response';

/**
 * Service permettant d'effectuer la gestion des plans-cadre
 * @author Jacob Beauregard-Tousignant
 * @author Samir El Haddaji
 * @author Jonathan Carrière
 */
@Injectable({
  providedIn: 'root'
})
export class PlanCadresService extends BaseService {

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    super();
  }

  /**
   * Aller chercher l'esnemble des plans-cadres dans la base de données
   */
  getPlanCadres(): Observable<ApiResponse<PlanCadres[]>>{
    return (this.httpClient.get<ApiResponse<PlanCadres[]>>(`${environment.api}/plans-cadres`, { context: this.authService.getContext() }));
  }

  /**
   * Aller chercher un plan-cadre particulier via son id dans la base de données
   */
  getPlanCadre(id:number):Observable<ApiResponse<PlanCadres>>{
      return this.httpClient.get<ApiResponse<PlanCadres>>(`${environment.api}/plans-cadres/${id}`, { context: this.authService.getContext() });
  }

  /**
   * Méthode pour aller chercher tous les plans cadres d'un programme
   * @param idProgramme
   */
  getPlansCadresParProgramme(idProgramme:string):Observable<ApiResponse<PlanCadres[]>>{
    return this.httpClient.get<ApiResponse<PlanCadres[]>>(`${environment.api}/plans-cadres/programme/${idProgramme}`, { context: this.authService.getContext() });
  }


    /**
   * Méthode pour supprimer un plan-cadre de la base de données
   * @param id
   */
  deletePlanCadres(id: number):Observable<PlanCadres[]> {
    return this.httpClient.delete<PlanCadres[]>(`${environment.api}/plans-cadres/${id}`, { context: this.authService.getContext() });
  }

  /**
   * Méthode pour ajouter un plan-cadre à la BD
   * @param planCadre Le plan-cadre à ajouter à la BD
   */
  createPlanCadres(planCadre: Partial<PlanCadres>):Observable<object>{
    return this.httpClient.post(
      `${environment.api}/plans-cadres`, planCadre, {headers: {'Content': 'application/json'}, context: this.authService.getContext() });
  }

  /**
   * Méthode pour modifier un plan-cadre à la BD
   * @param id Id du plan-cadre à modifier
   * @param planCadre Le plan-cadre à modifier à la BD
   */
  updatePlanCadres(id:number, planCadre:Partial<PlanCadres>):Observable<ApiResponse<PlanCadres>> {
      return this.httpClient.put(
          `${environment.api}/plans-cadres/${id}`, planCadre, { headers: { 'Content': 'application/json' }, context: this.authService.getContext() } );
  }

  /**
   * Méthode qui permet de modifier une date d'approbation d'un plan-cadre
   * @param id Identifiant du plan-cadre
   * @param date Date de l'approbation du plan-cadre
   * @param statut Statut de l'approbation qui sera mis à jour
   * @author Jonathan Carrière
   */
  updatePlanCadreApprobation(id: number, date: string, statut: string): Observable<ApiResponse<object>> {
    return this.httpClient.patch(`${environment.api}/plans-cadres/approbation/${id}/${date}/${statut}`, null, { context: this.authService.getContext() });
  }

  /**
   * Méthode qui permet de supprimer une date d'approbation d'un plan-cadre
   * @param id Identifiant du plan-cadre
   * @param statut Statut de l'approbation qui sera supprimé
   * @author Jonathan Carrière
   */
  deletePlanCadreApprobation(id: number, statut: string): Observable<ApiResponse<object>> {
    return this.httpClient.patch(`${environment.api}/plans-cadres/approbation-supprimer/${id}/${statut}`, null, { context: this.authService.getContext() });
  }




}
