import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UtilisateurFormulairePage } from './utilisateur-formulaire.page';

// Configuration du routage vers le formulaire pour les utilisateurs
const routes: Routes = [
  {
    path: '',
    component: UtilisateurFormulairePage
  }
];

/**
 * Classe permettant de configurer le routage associé au formulaire pour les utilisateurs
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UtilisateurFormulairePageRoutingModule {}
