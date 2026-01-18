import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnseignantFormulairePage } from './enseignant-formulaire.page';

// Configuration du routage vers le formulaire pour les enseignants
const routes: Routes = [
  {
    path: '',
    component: EnseignantFormulairePage
  }
];

/**
 * Classe permettant de configurer le routage associé au formulaire pour les enseignants
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnseignantFormulairePageRoutingModule {}
