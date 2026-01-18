import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CompetencePageRoutingModule } from './competence-routing.module';
import { CompetencePage } from './competence.page';
import {PartageModule} from '../../partage/partage.module';
import {QuillEditorComponent} from 'ngx-quill';
import {DragDropModule} from '@angular/cdk/drag-drop';

/**
 * Classe permettant d'effectuer la gestion des dépendances du module associé aux compétences
 * @author Jonathan Carrière
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CompetencePageRoutingModule,
        PartageModule,
        ReactiveFormsModule,
        QuillEditorComponent,
        DragDropModule
    ],
  declarations: [CompetencePage]
})
export class CompetencePageModule {}
