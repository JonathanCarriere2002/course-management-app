import {inject} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';

/**
 * Guard permettant aux utilisateurs possèdant le rôle d'admin à accèder à une ressource
 * @constructor Constructeur du guard
 * @author Jonathan Carrière
 */
export const AdminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Vérifier le rôle de l'utilisateur connecté à l'application
  if (authService.getUtilisateur()?.role == 1) {
    // Autoriser l'accès à la ressource si l'utilisateur est un admin
    return true;
  }

  // Effectuer une redirection si l'utilisateur ne possède pas le rôle approprié
  return router.parseUrl('/inaccessible');

};
