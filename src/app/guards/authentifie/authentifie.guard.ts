/**
 * @author Jérémy Lebel, Jacob Beauregard-Tousignant
 */

import {inject} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';

export const authentifieGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si le user est authentifié on autorise l'accès
  if(authService.estConnecte()) {
    return true;
  }

  // Si non-autorisé, rediriger vers la page d'erreur pour les pages inaccessibles
  return router.parseUrl('/inaccessible');
};
