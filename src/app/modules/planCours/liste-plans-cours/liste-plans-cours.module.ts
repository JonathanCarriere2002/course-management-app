import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListePlansCoursPageRoutingModule } from './liste-plans-cours-routing.module';

import { ListePlansCoursPage } from './liste-plans-cours.page';
import {PartageModule} from '../../partage/partage.module';

/**
 * @author Emeric Chauret
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListePlansCoursPageRoutingModule,
        PartageModule,
        ReactiveFormsModule
    ],
  declarations: [ListePlansCoursPage]
})
export class ListePlansCoursPageModule {}
