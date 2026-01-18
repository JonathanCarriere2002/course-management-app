import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsSectionPage } from './details-section.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsSectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsSectionPageRoutingModule {}
