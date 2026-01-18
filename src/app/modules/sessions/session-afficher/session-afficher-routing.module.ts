import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SessionAfficherPage } from './session-afficher.page';

// Configuration du routage vers la page de détails pour une session
const routes: Routes = [
  {
    path: '',
    component: SessionAfficherPage
  }
];

/**
 * Classe permettant de configurer le routage associé à la page de détails pour une session
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionAfficherPageRoutingModule {}
