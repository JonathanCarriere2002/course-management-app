import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccueilPage } from './accueil.page';

// Configuration du routage vers la page d'accueil
const routes: Routes = [
  {
    path: '',
    component: AccueilPage
  }
];

/**
 * Classe permettant de configurer le routage associé à la page d'accueil
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccueilPageRoutingModule {}
