import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListeCompetencePage } from './liste-competence.page';

const routes: Routes = [
  {
    path: '',
    component: ListeCompetencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListeCompetencePageRoutingModule {}
