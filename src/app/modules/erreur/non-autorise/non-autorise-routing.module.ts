import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonAutorisePage } from './non-autorise.page';

const routes: Routes = [
  {
    path: '',
    component: NonAutorisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonAutorisePageRoutingModule {}
