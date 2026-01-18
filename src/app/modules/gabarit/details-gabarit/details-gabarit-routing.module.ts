import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsGabaritPage } from './details-gabarit.page';

// Configuration du routage vers la page de détails pour un gabarit
const routes: Routes = [
  {
    path: '',
    component: DetailsGabaritPage
  }
];

/**
 * Classe permettant de configurer le routage associé à la page de détails pour un gabarit
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsGabaritPageRoutingModule {}
