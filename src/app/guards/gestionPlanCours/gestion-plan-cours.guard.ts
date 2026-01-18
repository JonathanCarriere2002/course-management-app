/**
 * @author Emeric Chauret
 */

import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {PlanCoursService} from '../../services/planCours/plan-cours.service';
import {firstValueFrom} from 'rxjs';

export const GestionPlanCoursGuard = async (activatedRouteSnapshot: ActivatedRouteSnapshot) => {

  // injecter les services nécessaires
  const authService = inject(AuthService);
  const router = inject(Router);
  const planCoursService = inject(PlanCoursService);

  // récupérer l'identifiant du programme dans l'url
  const programme_id = parseInt(activatedRouteSnapshot.paramMap.get('programme_id') as string);
  // récupérer l'utilisateur actuel
  const utilisateur = authService.getUtilisateur();

  // si l'utilisateur a le rôle 1, il a le droit d'accéder
  if (utilisateur?.role == 1) {
    return true;
  }

  // si l'utilisateur a le rôle 4 ou 5 et qu'il fait partie du programme
  if ([4, 5].includes(parseInt(utilisateur?.role.toString())) && utilisateur.programmes?.some(p => p.id == programme_id)) {

    // si l'utilisateur veut modifier un plan de cours
    if (activatedRouteSnapshot.routeConfig?.path?.includes('modifier')) {

      // récupérer l'identifiant du plan de cours dans l'url
      const plan_cours_id = parseInt(activatedRouteSnapshot.paramMap.get('plan_cours_id') as string);

      // Récupérer le plan de cours ayant l'identifiant plan_cours_id dans la bd
      const res = await firstValueFrom(planCoursService.getPlanCours(programme_id, plan_cours_id));
      const plan_cours = res.data;

      // si le plan de cours existe et que l'utilisateur est le créateur, il a le droit d'accéder
      if (plan_cours && plan_cours.cree_par?.id == utilisateur.id) {
        return true;
      }
    }
    // Sinon, il a le droit d'accéder
    else {
      return true;
    }
  }

  // on redirige l'utilisateur à la page d'accueil s'il n'a pas le droit d'accéder
  return router.parseUrl('/inaccessible');
};
