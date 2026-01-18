import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SessionAfficherPageRoutingModule } from './session-afficher-routing.module';
import { SessionAfficherPage } from './session-afficher.page';
import {PartageModule} from '../../partage/partage.module';

/**
 * Classe permettant d'effectuer la gestion des dépendances du module associé à l'affichage de sessions
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SessionAfficherPageRoutingModule,
    PartageModule
  ],
  declarations: [SessionAfficherPage]
})
export class SessionAfficherPageModule {}
