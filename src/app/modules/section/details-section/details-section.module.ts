import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsSectionPageRoutingModule } from './details-section-routing.module';

import { DetailsSectionPage } from './details-section.page';
import {PartageModule} from '../../partage/partage.module';
import {QuillViewComponent} from 'ngx-quill';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DetailsSectionPageRoutingModule,
        PartageModule,
        QuillViewComponent
    ],
  declarations: [DetailsSectionPage]
})
export class DetailsSectionPageModule {}
