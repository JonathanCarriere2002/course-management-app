import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EnseignantFormulairePageRoutingModule } from './enseignant-formulaire-routing.module';
import { EnseignantFormulairePage } from './enseignant-formulaire.page';
import {PartageModule} from '../../partage/partage.module';

/**
 * Classe permettant d'effectuer la gestion des dépendances du module associé au formulaire des enseignants
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnseignantFormulairePageRoutingModule,
    PartageModule,
    ReactiveFormsModule
  ],
  declarations: [EnseignantFormulairePage]
})
export class EnseignantFormulairePageModule {}
