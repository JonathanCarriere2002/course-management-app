import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnseignantPage } from './enseignant.page';

// Configuration du routage vers la page des enseignants
const routes: Routes = [
  {
    path: '',
    component: EnseignantPage
  }
];

/**
 * Classe permettant de configurer le routage associé à la page contenant la liste des enseignants
 * @author Jonathan Carrière
 * @author Samir El Haddaji
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnseignantPageRoutingModule {}
