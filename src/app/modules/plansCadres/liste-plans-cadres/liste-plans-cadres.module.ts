/**
 * @author Jacob Beauregard-Tousignant
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListePlansCadresPageRoutingModule } from './liste-plans-cadres-routing.module';
import { ListePlansCadresPage } from './liste-plans-cadres.page';
import {PartageModule} from '../../partage/partage.module';
import {ApprobationBtnPlancadreComponent} from '../components/approbation-btn-plancadre/approbation-btn-plancadre.component';
import {ApprobationProgressbarComponent} from '../components/approbation-progressbar/approbation-progressbar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListePlansCadresPageRoutingModule,
    PartageModule
  ],
  declarations: [
    ListePlansCadresPage,
    ApprobationBtnPlancadreComponent,
    ApprobationProgressbarComponent
  ]
})
export class ListePlansCadresPageModule {}
