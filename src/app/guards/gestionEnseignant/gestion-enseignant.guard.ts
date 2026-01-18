import {inject} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';

export const gestionEnseignantGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si le user est authentifié on autorise l'accès
  if(authService.getUtilisateur()?.role == 1 || authService.getUtilisateur()?.role == 2 ||
    authService.getUtilisateur()?.role == 3 || authService.getUtilisateur()?.role == 4) {
    return true;
  }

  // Sinon on redirige ou on veut
  return router.parseUrl('/inaccessible');
};
