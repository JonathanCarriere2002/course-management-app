/**
 * @author Emeric Chauret
 */

import { Injectable } from '@angular/core';
import {BaseService} from '../base.service';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth.service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../../models/authentification/api-response';
import {TypeSection} from '../../models/typeSection/type-section';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeSectionService extends BaseService {

  /**
   * Constructeur
   * @param httpClient service injecté HttpClient
   * @param authService service injecté AuthService
   */
  constructor(private httpClient: HttpClient, private authService: AuthService) {
    super()
  }

  /**
   * Méthode qui permet de récupérer la liste des types de section dans la bd.
   */
  obtenirTousLesTypesSection(): Observable<ApiResponse<TypeSection[]>>{
    return this.httpClient.get<ApiResponse<TypeSection[]>>(`${environment.api}/types-section`, { context: this.authService.getContext() });
  }
}
