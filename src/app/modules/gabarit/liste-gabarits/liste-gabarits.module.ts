import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListeGabaritsPageRoutingModule } from './liste-gabarits-routing.module';

import { ListeGabaritsPage } from './liste-gabarits.page';
import {PartageModule} from '../../partage/partage.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListeGabaritsPageRoutingModule,
        PartageModule
    ],
  declarations: [ListeGabaritsPage]
})
export class ListeGabaritsPageModule {}
