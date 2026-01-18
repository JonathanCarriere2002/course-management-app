import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormulairePlanCoursPage } from './formulaire-plan-cours.page';


const routes: Routes = [
  {
    path: '',
    component: FormulairePlanCoursPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormulairePlanCoursPageRoutingModule {}
