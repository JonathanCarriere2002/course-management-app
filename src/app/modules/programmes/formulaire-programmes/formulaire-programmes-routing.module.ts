import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormulaireProgrammesPage } from './formulaire-programmes.page';

const routes: Routes = [
  {
    path: '',
    component: FormulaireProgrammesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormulaireProgrammesPageRoutingModule {}
