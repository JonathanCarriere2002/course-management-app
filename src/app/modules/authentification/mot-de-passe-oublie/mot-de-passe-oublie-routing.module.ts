import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MotDePasseOubliePage } from './mot-de-passe-oublie.page';

const routes: Routes = [
  {
    path: '',
    component: MotDePasseOubliePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MotDePasseOubliePageRoutingModule {}
