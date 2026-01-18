import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnseignantAfficherPage } from './enseignant-afficher.page';

// Configuration du routage vers la page de détails pour un enseignant
const routes: Routes = [
  {
    path: '',
    component: EnseignantAfficherPage
  }
];

/**
 * Classe permettant de configurer le routage associé à la page de détails pour un enseignant
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnseignantAfficherPageRoutingModule {}
