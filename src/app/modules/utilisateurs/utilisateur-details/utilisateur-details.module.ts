import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UtilisateurDetailsPageRoutingModule } from './utilisateur-details-routing.module';
import { UtilisateurDetailsPage } from './utilisateur-details.page';
import { PartageModule } from '../../partage/partage.module';

/**
 * Classe permettant d'effectuer la gestion des dépendances du module associé aux détails d'un utilisateur
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UtilisateurDetailsPageRoutingModule,
    PartageModule
  ],
  declarations: [UtilisateurDetailsPage]
})
export class UtilisateurDetailsPageModule {}
