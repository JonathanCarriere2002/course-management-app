import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {authentifieGuard} from './guards/authentifie/authentifie.guard';
import {CpSrdpGuard} from './guards/cpSrdp/cp-srdp.guard';
import {AdminGuard} from './guards/admin/admin.guard';
import {gestionEnseignantGuard} from './guards/gestionEnseignant/gestion-enseignant.guard';
import {AfficherPlanCoursGuard} from './guards/afficherPlanCours/afficher-plan-cours.guard';
import {GestionPlanCoursGuard} from './guards/gestionPlanCours/gestion-plan-cours.guard';

/**
 * Variable permettant de définir l'ensemble des routes de notre application
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: 'connexion',
    pathMatch: 'full'
  },
  {
    path: 'enseignants',
    canActivate : [authentifieGuard],
    loadChildren: () => import('./modules/enseignants/enseignant/enseignant.module').then( m => m.EnseignantPageModule)
  },
  {
    path: 'programmes/:programmeId/competence/creer',
    canActivate : [CpSrdpGuard],
    loadChildren: () => import('./modules/competences/competence/competence.module').then( m => m.CompetencePageModule)
  },
  {
    path: 'competence/modifier/:id',
    canActivate : [CpSrdpGuard],
    loadChildren: () => import('./modules/competences/competence/competence.module').then( m => m.CompetencePageModule)
  },
  {
    path: 'competences',
    canActivate : [authentifieGuard],
    loadChildren: () => import('./modules/competences/liste-competence/liste-competence.module').then( m => m.ListeCompetencePageModule)
  },
  //Ajouter plan cadre
  {
    path: 'programmes/:programmeId/plans-cadres/ajouter',
    canActivate : [authentifieGuard],
    loadChildren: () => import('./modules/plansCadres/plan-cadres/plan-cadres.module').then(m => m.PlanCadresPageModule)
  },
  //Modifier plan cadre
  {
    path: 'programmes/:programmeId/plans-cadres/:id/modifier',
    canActivate : [authentifieGuard],
    loadChildren: () => import('./modules/plansCadres/plan-cadres/plan-cadres.module').then(m => m.PlanCadresPageModule)
  },
  //Détail plan cadre
  {
    path: 'programmes/:programmeId/plans-cadres/:id',
    canActivate : [authentifieGuard],
    loadChildren: () => import('./modules/plansCadres/details-plan-cadre/details-plan-cadre.module').then( m => m.DetailsPlanCadrePageModule)
  },
  //Liste des plans cadre
  {
    path: 'programmes/:programmeId/plans-cadres',
    canActivate : [authentifieGuard],
    loadChildren: () => import('./modules/plansCadres/liste-plans-cadres/liste-plans-cadres.module').then( m => m.ListePlansCadresPageModule)
  },
  {
    path: 'sessions',
    canActivate : [authentifieGuard],
    loadChildren: () => import('./modules/sessions/session/session.module').then( m => m.SessionPageModule)
  },
  {
    path: 'programme/:programme_id/plans-cours',
    canActivate:[AfficherPlanCoursGuard],
    loadChildren: () => import('./modules/planCours/liste-plans-cours/liste-plans-cours.module').then(m => m.ListePlansCoursPageModule)
  },
  {
    path: 'programme/:programme_id/plans-cours/creer',
    canActivate:[GestionPlanCoursGuard],
    loadChildren: () => import('./modules/planCours/formulaire-plan-cours/formulaire-plan-cours.module').then( m => m.FormulairePlanCoursPageModule)
  },
  {
    path: 'programme/:programme_id/plans-cours/:plan_cours_id/modifier',
    canActivate:[GestionPlanCoursGuard],
    loadChildren: () => import('./modules/planCours/formulaire-plan-cours/formulaire-plan-cours.module').then( m => m.FormulairePlanCoursPageModule)
  },
  {
    path: 'programme/:programme_id/plans-cours/:plan_cours_id',
    canActivate:[AfficherPlanCoursGuard],
    loadChildren: () => import('./modules/planCours/details-plan-cours/details-plan-cours.module').then( m => m.DetailsPlanCoursPageModule)
  },
  {
    path: 'programmes',
    canActivate:[authentifieGuard],
    loadChildren: () => import('./modules/programmes/liste-programmes/liste-programmes.module').then( m => m.ListeProgrammesPageModule)
  },
  {
    path: 'connexion',
    loadChildren: () => import('./modules/accueil/accueil.module').then( m => m.AccueilPageModule)
  },
  {
    path: 'session/details/:id',
    canActivate : [authentifieGuard],
    loadChildren: () => import('./modules/sessions/session-afficher/session-afficher.module').then( m => m.SessionAfficherPageModule)
  },
  {
    path: 'enseignant/details/:id',
    canActivate : [authentifieGuard],
    loadChildren: () => import('./modules/enseignants/enseignant-afficher/enseignant-afficher.module').then( m => m.EnseignantAfficherPageModule)
  },
  {
    path: 'formulaire-section',
    canActivate : [CpSrdpGuard],
    loadChildren: () => import('./modules/section/formulaire-section/formulaire-section.module').then( m => m.FormulaireSectionPageModule)
  },
  {
    path: 'modifier-section/:id',
    canActivate : [CpSrdpGuard],
    loadChildren: () => import('./modules/section/formulaire-section/formulaire-section.module').then( m => m.FormulaireSectionPageModule)
  },
  {
    path: 'details-section/:id',
    canActivate : [CpSrdpGuard],
    loadChildren: () => import('./modules/section/details-section/details-section.module').then( m => m.DetailsSectionPageModule)
  },
  {
    path: 'liste-sections',
    canActivate : [CpSrdpGuard],
    loadChildren: () => import('./modules/section/liste-sections/liste-sections.module').then( m => m.ListeSectionsPageModule)
  },
  {
    path: 'liste-gabarits',
    canActivate : [CpSrdpGuard],
    loadChildren: () => import('./modules/gabarit/liste-gabarits/liste-gabarits.module').then( m => m.ListeGabaritsPageModule)
  },
  {
    path: 'formulaire-gabarit',
    canActivate : [CpSrdpGuard],
    loadChildren: () => import('./modules/gabarit/formulaire-gabarit/formulaire-gabarit.module').then( m => m.FormulaireGabaritPageModule)
  },
  {
    path: 'modifier-gabarit/:id',
    canActivate : [CpSrdpGuard],
    loadChildren: () => import('./modules/gabarit/formulaire-gabarit/formulaire-gabarit.module').then( m => m.FormulaireGabaritPageModule)
  },
  {
    path: 'accueil',
    canActivate:[authentifieGuard],
    loadChildren: () => import('./modules/tableau-bord/tableau-bord.module').then( m => m.TableauBordPageModule)
  },
  {
    path: 'session/ajouter',
    canActivate : [CpSrdpGuard],
    loadChildren: () => import('./modules/sessions/session-formulaire/session-formulaire.module').then( m => m.SessionFormulairePageModule)
  },
  {
    path: 'session/modifier/:id',
    canActivate : [CpSrdpGuard],
    loadChildren: () => import('./modules/sessions/session-formulaire/session-formulaire.module').then( m => m.SessionFormulairePageModule)
  },
  {
    path: 'enseignant/ajouter',
    canActivate : [gestionEnseignantGuard],
    loadChildren: () => import('./modules/enseignants/enseignant-formulaire/enseignant-formulaire.module').then( m => m.EnseignantFormulairePageModule)
  },
  {
    path: 'enseignant/modifier/:id',
    canActivate : [gestionEnseignantGuard],
    loadChildren: () => import('./modules/enseignants/enseignant-formulaire/enseignant-formulaire.module').then( m => m.EnseignantFormulairePageModule)
  },
  {
    path: 'formulaire-programmes/ajouter',
    canActivate:[CpSrdpGuard],
    loadChildren: () => import('./modules/programmes/formulaire-programmes/formulaire-programmes.module').then( m => m.FormulaireProgrammesPageModule)
  },
  {
    path: 'formulaire-programmes/modifier/:id',
    canActivate:[CpSrdpGuard],
    loadChildren: () => import('./modules/programmes/formulaire-programmes/formulaire-programmes.module').then( m => m.FormulaireProgrammesPageModule)
  },
  {
    path: 'gabarits/details/:id',
    canActivate : [CpSrdpGuard],
    loadChildren: () => import('./modules/gabarit/details-gabarit/details-gabarit.module').then( m => m.DetailsGabaritPageModule)
  },
  {
    path: 'sections/details/:id',
    canActivate : [CpSrdpGuard],
    loadChildren: () => import('./modules/section/details-section/details-section.module').then( m => m.DetailsSectionPageModule)
  },
  {
    path: 'details-programmes/:id',
    canActivate : [authentifieGuard],
    loadChildren: () => import('./modules/programmes/details-programmes/details-programmes.module').then( m => m.DetailsProgrammesPageModule)
  },
  {
    path: 'utilisateurs',
    canActivate : [AdminGuard],
    loadChildren: () => import('./modules/utilisateurs/utilisateur-liste/utilisateur-liste.module').then( m => m.UtilisateurListePageModule)
  },
  {
    path: 'utilisateurs/details/:id',
    canActivate : [AdminGuard],
    loadChildren: () => import('./modules/utilisateurs/utilisateur-details/utilisateur-details.module').then( m => m.UtilisateurDetailsPageModule)
  },
  {
    path: 'utilisateurs/ajouter',
    canActivate : [AdminGuard],
    loadChildren: () => import('./modules/utilisateurs/utilisateur-formulaire/utilisateur-formulaire.module').then( m => m.UtilisateurFormulairePageModule)
  },
  {
    path: 'utilisateurs/modifier/:id',
    canActivate : [AdminGuard],
    loadChildren: () => import('./modules/utilisateurs/utilisateur-formulaire/utilisateur-formulaire.module').then( m => m.UtilisateurFormulairePageModule)
  },
  {
    path: 'mot-de-passe-oublie',
    loadChildren: () => import('./modules/authentification/mot-de-passe-oublie/mot-de-passe-oublie.module').then( m => m.MotDePasseOubliePageModule)
  },
  {
    path: 'inaccessible',
    loadChildren: () => import('./modules/erreur/non-autorise/non-autorise.module').then( m => m.NonAutorisePageModule)
  },
  {
    path: 'password-reset/:token',
    loadChildren: () => import('./modules/authentification/password-reset/password-reset.module').then( m => m.PasswordResetPageModule)
  },

  /**
   * Doit être dernier
   */
  {
    path: '**',
    loadChildren: () => import('./modules/erreur/introuvable/introuvable.module').then( m => m.IntrouvablePageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
