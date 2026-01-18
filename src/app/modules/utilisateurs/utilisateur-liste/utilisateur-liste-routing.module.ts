import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UtilisateurListePage } from './utilisateur-liste.page';

// Configuration du routage vers la page des utilisateurs
const routes: Routes = [
  {
    path: '',
    component: UtilisateurListePage
  }
];

/**
 * Classe permettant de configurer le routage associé à la page contenant la liste des utilisateurs
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UtilisateurListePageRoutingModule {}
