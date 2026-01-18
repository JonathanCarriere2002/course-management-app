import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormulaireProgrammesPageRoutingModule } from './formulaire-programmes-routing.module';

import { FormulaireProgrammesPage } from './formulaire-programmes.page';
import {PartageModule} from '../../partage/partage.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FormulaireProgrammesPageRoutingModule,
        PartageModule,
        ReactiveFormsModule
    ],
  declarations: [FormulaireProgrammesPage]
})
export class FormulaireProgrammesPageModule {}
