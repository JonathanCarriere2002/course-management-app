/**
 * @author Jaocb Beauregard-Tousignant
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanCadresPage } from './plan-cadres.page';

const routes: Routes = [
  {
    path: '',
    component: PlanCadresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanCadresPageRoutingModule {}
