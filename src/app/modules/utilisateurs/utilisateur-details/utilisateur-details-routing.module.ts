import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UtilisateurDetailsPage } from './utilisateur-details.page';

// Configuration du routage vers la page de détails pour un utilisateur
const routes: Routes = [
  {
    path: '',
    component: UtilisateurDetailsPage
  }
];

/**
 * Classe permettant de configurer le routage associé à la page de détails pour un utilisateur
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UtilisateurDetailsPageRoutingModule {}
