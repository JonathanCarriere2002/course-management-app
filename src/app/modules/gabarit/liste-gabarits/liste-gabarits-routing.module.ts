import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListeGabaritsPage } from './liste-gabarits.page';

const routes: Routes = [
  {
    path: '',
    component: ListeGabaritsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListeGabaritsPageRoutingModule {}
