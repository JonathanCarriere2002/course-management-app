import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccueilPageRoutingModule } from './accueil-routing.module';
import { AccueilPage } from './accueil.page';
import {PartageModule} from '../partage/partage.module';

/**
 * Classe permettant d'effectuer la gestion des dépendances du module associé à la page d'accueil
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccueilPageRoutingModule,
    PartageModule,
    ReactiveFormsModule
  ],
  declarations: [AccueilPage]
})
export class AccueilPageModule {}
