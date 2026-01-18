/**
 * @author Emeric Chauret
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsPlanCoursPage } from './details-plan-cours.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsPlanCoursPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsPlanCoursPageRoutingModule {}
