import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SessionFormulairePage } from './session-formulaire.page';

// Configuration du routage vers le formulaire pour les sessions
const routes: Routes = [
  {
    path: '',
    component: SessionFormulairePage
  }
];

/**
 * Classe permettant de configurer le routage associé au formulaire pour les sessions
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionFormulairePageRoutingModule {}
