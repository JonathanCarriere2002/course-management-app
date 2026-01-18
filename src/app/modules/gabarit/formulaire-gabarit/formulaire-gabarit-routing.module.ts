import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormulaireGabaritPage } from './formulaire-gabarit.page';

const routes: Routes = [
  {
    path: '',
    component: FormulaireGabaritPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormulaireGabaritPageRoutingModule {}
