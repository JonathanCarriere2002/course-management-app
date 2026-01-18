import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsPlanCadrePage } from './details-plan-cadre.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsPlanCadrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsPlanCadrePageRoutingModule {}
