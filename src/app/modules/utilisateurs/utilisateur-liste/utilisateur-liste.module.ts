import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UtilisateurListePageRoutingModule } from './utilisateur-liste-routing.module';
import { UtilisateurListePage } from './utilisateur-liste.page';
import { PartageModule } from '../../partage/partage.module';

/**
 * Classe permettant d'effectuer la gestion des dépendances du module associé à la liste des utilisateurs
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UtilisateurListePageRoutingModule,
    PartageModule
  ],
  declarations: [UtilisateurListePage]
})
export class UtilisateurListePageModule {}
