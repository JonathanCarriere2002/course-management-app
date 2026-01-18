import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SessionPage } from './session.page';

// Configuration du routage vers la liste des sessions
const routes: Routes = [
  {
    path: '',
    component: SessionPage
  }
];

/**
 * Classe permettant de configurer le routage associé à la liste des sessions
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionPageRoutingModule {}
