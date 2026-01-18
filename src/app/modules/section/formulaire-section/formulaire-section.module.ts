/**
 * @author Emeric Chauret
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormulaireSectionPageRoutingModule } from './formulaire-section-routing.module';
import { FormulaireSectionPage } from './formulaire-section.page';
import { PartageModule } from '../../partage/partage.module';
import {QuillEditorComponent} from 'ngx-quill';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FormulaireSectionPageRoutingModule,
        PartageModule,
        QuillEditorComponent,
        ReactiveFormsModule
    ],
  declarations: [FormulaireSectionPage]
})
export class FormulaireSectionPageModule {}
