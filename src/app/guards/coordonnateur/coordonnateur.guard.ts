import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Guard permettant aux utilisateurs possèdant le rôle de coordonnateur à accèder à une ressource
 * @constructor Constructeur du guard
 * @author Jonathan Carrière
 */
export const CoordonnateurGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Vérifier le rôle de l'utilisateur connecté à l'application
  if (authService.getUtilisateur()?.role == 1 || authService.getUtilisateur()?.role == 4) {
    // Autoriser l'accès à la ressource si l'utilisateur est un admin ou un coordonnateur
    return true;
  }

  // Effectuer une redirection si l'utilisateur ne possède pas le rôle approprié
  return router.parseUrl('/inaccessible');

};
