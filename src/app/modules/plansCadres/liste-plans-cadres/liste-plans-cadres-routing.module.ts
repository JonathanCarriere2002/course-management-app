import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListePlansCadresPage } from './liste-plans-cadres.page';

const routes: Routes = [
  {
    path: '',
    component: ListePlansCadresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListePlansCadresPageRoutingModule {}
