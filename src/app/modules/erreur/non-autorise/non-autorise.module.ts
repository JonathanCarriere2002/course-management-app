import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonAutorisePageRoutingModule } from './non-autorise-routing.module';

import { NonAutorisePage } from './non-autorise.page';
import {PartageModule} from '../../partage/partage.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NonAutorisePageRoutingModule,
        PartageModule
    ],
  declarations: [NonAutorisePage]
})
export class NonAutorisePageModule {}
