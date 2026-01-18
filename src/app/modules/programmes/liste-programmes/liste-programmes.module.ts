import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListeProgrammesPageRoutingModule } from './liste-programmes-routing.module';

import { ListeProgrammesPage } from './liste-programmes.page';
import {PartageModule} from '../../partage/partage.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListeProgrammesPageRoutingModule,
        PartageModule,
        ReactiveFormsModule
    ],
  declarations: [ListeProgrammesPage]
})
export class ListeProgrammesPageModule {}
