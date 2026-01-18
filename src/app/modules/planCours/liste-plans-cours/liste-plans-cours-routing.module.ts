/**
 * @author Emeric Chauret
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListePlansCoursPage } from './liste-plans-cours.page';

const routes: Routes = [
  {
    path: '',
    component: ListePlansCoursPage
  }
];

/**
 * @author Emeric Chauret
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListePlansCoursPageRoutingModule {}
