import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TableauBordPage } from './tableau-bord.page';

const routes: Routes = [
  {
    path: '',
    component: TableauBordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TableauBordPageRoutingModule {}
