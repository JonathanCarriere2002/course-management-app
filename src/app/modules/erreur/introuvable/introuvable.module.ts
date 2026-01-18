import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntrouvablePageRoutingModule } from './introuvable-routing.module';

import { IntrouvablePage } from './introuvable.page';
import {PartageModule} from '../../partage/partage.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        IntrouvablePageRoutingModule,
        PartageModule
    ],
  declarations: [IntrouvablePage]
})
export class IntrouvablePageModule {}
