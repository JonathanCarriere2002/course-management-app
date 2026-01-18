import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EnseignantAfficherPageRoutingModule } from './enseignant-afficher-routing.module';
import { EnseignantAfficherPage } from './enseignant-afficher.page';
import {PartageModule} from '../../partage/partage.module';

/**
 * Classe permettant d'effectuer la gestion des dépendances du module associé à l'affichage d'enseignants
 * @author Jonathan Carrière
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnseignantAfficherPageRoutingModule,
    PartageModule
  ],
  declarations: [EnseignantAfficherPage]
})
export class EnseignantAfficherPageModule {}
