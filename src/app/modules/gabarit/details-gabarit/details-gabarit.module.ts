import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetailsGabaritPageRoutingModule } from './details-gabarit-routing.module';
import { DetailsGabaritPage } from './details-gabarit.page';
import {PartageModule} from '../../partage/partage.module';

/**
 * Classe permettant d'effectuer la gestion des dépendances du module associé aux détails d'un gabarit
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsGabaritPageRoutingModule,
    PartageModule
  ],
  declarations: [DetailsGabaritPage]
})
export class DetailsGabaritPageModule {}
