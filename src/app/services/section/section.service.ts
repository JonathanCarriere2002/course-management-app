/**
 * @author Emeric Chauret
 */

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Section} from '../../models/section/section';
import {environment} from '../../../environments/environment';
import {BaseService} from '../base.service';
import {AuthService} from '../auth.service';
import {ApiResponse} from '../../models/authentification/api-response';

@Injectable({
  providedIn: 'root'
})
export class SectionService extends BaseService {

  /**
   * Constructeur
   * @param httpClient service injecté HttpClient
   * @param authService service injecté AuthService
   */
  constructor(private httpClient: HttpClient, private authService: AuthService) {
    super();
  }

  /**
   * Méthode qui permet de récupérer la liste des sections dans la bd.
   */
  obtenirToutesLesSections(): Observable<ApiResponse<Section[]>>{
    return this.httpClient.get<ApiResponse<Section[]>>(`${environment.api}/sections`, { context: this.authService.getContext() });
  }

  /**
   * Méthode qui permet de récupérer la section ayant l'identifiant id dans la bd.
   * @param id l'identifiant de la section à récupérer (number)
   */
  obtenirSectionParId(id: number): Observable<ApiResponse<Section>>{
    return this.httpClient.get<ApiResponse<Section>>(`${environment.api}/sections/${id}`, { context: this.authService.getContext() });
  }

  /**
   * Méthode qui permet de créer une nouvelle section dans la bd.
   * @param section la nouvelle section à créer (Partial<Section>)
   */
  creerSection(section: Partial<Section>): Observable<ApiResponse<object>>{
    return this.httpClient.post(`${environment.api}/sections`, section, {headers :{'Content': 'application/json'}, context: this.authService.getContext() });
  }

  /**
   * Méthode qui permet de supprimer une section dans la bd.
   * @param id l'identifiant de la section à supprimer (number)
   */
  supprimerSection(id: number): Observable<ApiResponse<Section[]>>{
    return this.httpClient.delete<ApiResponse<Section[]>>(`${environment.api}/sections/${id}`, { context: this.authService.getContext() });
  }

  /**
   * Méthode qui permet de modifier une section dans la bd.
   * @param id l'identifiant de la section à modifier dans la bd (number)
   * @param section la section à modifier dans la bd (Partial<Section>)
   */
  modifierSection(id: number, section: Partial<Section>): Observable<ApiResponse<object>>{
    return this.httpClient.put(`${environment.api}/sections/${id}`, section, { headers: { 'Content': 'application/json' }, context: this.authService.getContext() });
  }

}
