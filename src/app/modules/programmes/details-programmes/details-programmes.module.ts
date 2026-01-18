import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsProgrammesPageRoutingModule } from './details-programmes-routing.module';

import { DetailsProgrammesPage } from './details-programmes.page';
import {PartageModule} from '../../partage/partage.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DetailsProgrammesPageRoutingModule,
        PartageModule
    ],
  declarations: [DetailsProgrammesPage]
})
export class DetailsProgrammesPageModule {}
