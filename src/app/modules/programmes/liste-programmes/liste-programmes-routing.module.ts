
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListeProgrammesPage } from './liste-programmes.page';

const routes: Routes = [
  {
    path: '',
    component: ListeProgrammesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListeProgrammesPageRoutingModule {}
