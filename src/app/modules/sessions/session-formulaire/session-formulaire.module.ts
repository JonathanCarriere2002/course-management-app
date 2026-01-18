import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SessionFormulairePageRoutingModule } from './session-formulaire-routing.module';
import { SessionFormulairePage } from './session-formulaire.page';
import {PartageModule} from '../../partage/partage.module';

/**
 * Classe permettant d'effectuer la gestion des dépendances du module associé au formulaire des sessions
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SessionFormulairePageRoutingModule,
    PartageModule,
    ReactiveFormsModule
  ],
  declarations: [SessionFormulairePage]
})
export class SessionFormulairePageModule {}
