import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompetencePage } from './competence.page';

const routes: Routes = [
  {
    path: '',
    component: CompetencePage
  }
];

/**
 * Classe permettant de configurer le routage associé au module des compétences
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompetencePageRoutingModule {}
