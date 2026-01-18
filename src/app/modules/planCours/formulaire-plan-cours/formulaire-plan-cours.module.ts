import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormulairePlanCoursPageRoutingModule } from './formulaire-plan-cours-routing.module';
import { FormulairePlanCoursPage } from './formulaire-plan-cours.page';
import {PartageModule} from '../../partage/partage.module';
import {QuillEditorComponent} from 'ngx-quill';
import {EnseignantsPlanCoursComponent} from '../components/enseignants-plan-cours/enseignants-plan-cours.component';
import {SemainesCoursComponent} from '../components/semaines-cours/semaines-cours.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormulairePlanCoursPageRoutingModule,
    PartageModule,
    ReactiveFormsModule,
    QuillEditorComponent,
  ],
  declarations: [
    FormulairePlanCoursPage,
    EnseignantsPlanCoursComponent,
    SemainesCoursComponent
  ]
})
export class FormulairePlanCoursPageModule {}
