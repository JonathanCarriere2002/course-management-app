/**
 * @author Emeric Chauret
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListeSectionsPageRoutingModule } from './liste-sections-routing.module';

import { ListeSectionsPage } from './liste-sections.page';
import {PartageModule} from '../../partage/partage.module';
import {QuillEditorComponent} from 'ngx-quill';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListeSectionsPageRoutingModule,
        PartageModule,
        QuillEditorComponent,
        ReactiveFormsModule
    ],
  declarations: [ListeSectionsPage]
})
export class ListeSectionsPageModule {}
