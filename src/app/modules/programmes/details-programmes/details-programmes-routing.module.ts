import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsProgrammesPage } from './details-programmes.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsProgrammesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsProgrammesPageRoutingModule {}
