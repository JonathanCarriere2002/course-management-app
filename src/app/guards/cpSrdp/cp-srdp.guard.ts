import {inject} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';

export const CpSrdpGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.getUtilisateur()?.role == 1 || authService.getUtilisateur()?.role == 2 ||
    authService.getUtilisateur()?.role == 3) {
    return true;
  }

  // Si non-autorisé, rediriger vers la page d'erreur pour les pages inaccessibles
  return router.parseUrl('/inaccessible');
};
