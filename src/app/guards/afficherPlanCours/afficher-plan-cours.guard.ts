/**
 * @author Emeric Chauret
 */

import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

export const AfficherPlanCoursGuard = (activatedRouteSnapshot: ActivatedRouteSnapshot) => {

  // injecter les services nécessaires
  const authService = inject(AuthService);
  const router = inject(Router);

  // récupérer l'identifiant du programme dans l'url
  const programme_id = activatedRouteSnapshot.paramMap.get('programme_id') as string;
  // récupérer l'utilisateur actuel
  const utilisateur = authService.getUtilisateur();

  // si l'utilisateur a le rôle 1, 2 ou 3, il a le droit d'accéder (la gate retourne vrai)
  if ([1, 2, 3].includes(parseInt(utilisateur?.role.toString()))) {
    return true;
  }

  // si l'utilisateur a le rôle 4 ou 5 et qu'il fait partie du programme, il a le droit d'accéder (la gate retourne vrai)
  if([4, 5].includes(parseInt(utilisateur?.role.toString())) && utilisateur.programmes?.some(p => p.id == parseInt(programme_id))){
    return true;
  }

  // on redirige l'utilisateur à la page d'accueil s'il n'a pas le droit d'accéder
  return router.parseUrl('/inaccessible');
};
