import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsPlanCadrePageRoutingModule } from './details-plan-cadre-routing.module';

import { DetailsPlanCadrePage } from './details-plan-cadre.page';
import {PartageModule} from '../../partage/partage.module';
import {ApprobationDetailsPlancadreComponent} from '../components/approbation-details-plancadre/approbation-details-plancadre.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DetailsPlanCadrePageRoutingModule,
        PartageModule
    ],
  declarations: [
    DetailsPlanCadrePage,
    ApprobationDetailsPlancadreComponent
  ]
})
export class DetailsPlanCadrePageModule {}
