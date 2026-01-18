/**
 * @author Jacob Beauregard-Tousignant
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanCadresPageRoutingModule } from './plan-cadres-routing.module';

import { PlanCadresPage } from './plan-cadres.page';
import {PartageModule} from '../../partage/partage.module';
import {QuillEditorComponent} from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanCadresPageRoutingModule,
    PartageModule,
    ReactiveFormsModule,
    QuillEditorComponent
  ],
  declarations: [PlanCadresPage]
})
export class PlanCadresPageModule {}
