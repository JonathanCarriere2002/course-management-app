import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormulaireGabaritPageRoutingModule } from './formulaire-gabarit-routing.module';

import { FormulaireGabaritPage } from './formulaire-gabarit.page';
import {PartageModule} from '../../partage/partage.module';
import {QuillEditorComponent} from 'ngx-quill';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FormulaireGabaritPageRoutingModule,
        PartageModule,
        QuillEditorComponent,
        ReactiveFormsModule
    ],
  declarations: [FormulaireGabaritPage]
})
export class FormulaireGabaritPageModule {}
