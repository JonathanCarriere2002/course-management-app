import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthService} from '../auth.service';
import {ApiResponse} from '../../models/authentification/api-response';
import {BaseService} from '../base.service';
import {Role} from '../../models/roles/role';

/**
 * Classe permettant d'effectuer la manipulation des rôles dans la base de données
 * @author Jonathan Carrière
 */
@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService {

  /**
   * Constructeur du service pour les rôles
   * @param httpClient Service permettant d'effectuer des requêtes Http
   * @param authService Service permettant d'effectuer l'authentification
   */
  constructor(private httpClient : HttpClient, private authService: AuthService) {
    super();
  }

  /**
   * Méthode permettant d'obtenir l'ensemble des rôles pour les utilisateurs dans la base de données
   */
  getRoles(): Observable<ApiResponse<Role[]>> {
    return this.httpClient.get<ApiResponse<Role[]>>(`${environment.api}/roles`, { context: this.authService.getContext() })
  }

}
