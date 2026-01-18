import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EnseignantPageRoutingModule } from './enseignant-routing.module';
import { EnseignantPage } from './enseignant.page';
import {PartageModule} from '../../partage/partage.module';

/**
 * Classe permettant d'effectuer la gestion des dépendances du module associé à la liste des enseignants
 * @author Jonathan Carrière
 * @author Samir El Haddaji
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EnseignantPageRoutingModule,
        PartageModule
    ],
    exports: [
        EnseignantPage
    ],
    declarations: [EnseignantPage]
})
export class EnseignantPageModule {}
