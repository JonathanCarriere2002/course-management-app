import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListeCompetencePageRoutingModule } from './liste-competence-routing.module';

import { ListeCompetencePage } from './liste-competence.page';
import {PartageModule} from '../../partage/partage.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListeCompetencePageRoutingModule,
        PartageModule
    ],
  declarations: [ListeCompetencePage]
})
export class ListeCompetencePageModule {}
