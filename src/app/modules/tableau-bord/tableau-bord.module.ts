import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TableauBordPageRoutingModule } from './tableau-bord-routing.module';

import { TableauBordPage } from './tableau-bord.page';
import {PartageModule} from '../partage/partage.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TableauBordPageRoutingModule,
        PartageModule
    ],
  declarations: [TableauBordPage]
})
export class TableauBordPageModule {}
