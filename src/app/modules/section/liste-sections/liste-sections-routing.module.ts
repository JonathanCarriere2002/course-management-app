/**
 * @author Emeric Chauret
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListeSectionsPage } from './liste-sections.page';

const routes: Routes = [
  {
    path: '',
    component: ListeSectionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListeSectionsPageRoutingModule {}
