/**
 * @author Emeric Chauret
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsPlanCoursPageRoutingModule } from './details-plan-cours-routing.module';

import { DetailsPlanCoursPage } from './details-plan-cours.page';
import {PartageModule} from '../../partage/partage.module';
import {QuillEditorComponent, QuillViewComponent} from 'ngx-quill';
import {
  TableauCalendrierActivitesComponent
} from '../components/tableau-calendrier-activites/tableau-calendrier-activites.component';
import {DetailsSectionApprobationComponent} from '../components/details-section-approbation/details-section-approbation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsPlanCoursPageRoutingModule,
    PartageModule,
    QuillEditorComponent,
    ReactiveFormsModule,
    QuillViewComponent
  ],
  declarations: [
    DetailsPlanCoursPage,
    DetailsSectionApprobationComponent,
    TableauCalendrierActivitesComponent
  ]
})
export class DetailsPlanCoursPageModule {}
