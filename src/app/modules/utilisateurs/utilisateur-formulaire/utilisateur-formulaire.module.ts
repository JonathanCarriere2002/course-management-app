import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UtilisateurFormulairePageRoutingModule } from './utilisateur-formulaire-routing.module';
import { UtilisateurFormulairePage } from './utilisateur-formulaire.page';
import { PartageModule } from '../../partage/partage.module';

/**
 * Classe permettant d'effectuer la gestion des dépendances du module associé au formulaire des utilisateurs
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UtilisateurFormulairePageRoutingModule,
    PartageModule,
    ReactiveFormsModule
  ],
  declarations: [UtilisateurFormulairePage]
})
export class UtilisateurFormulairePageModule {}
