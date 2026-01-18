/**
 * @author Emeric Chauret
 */

import {Component, Input} from '@angular/core';
import {SectionFormulaire} from '../../../../models/sectionFormulaire/section-formulaire';
import {FormGroup} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {ModalInfoComponent} from '../modal-info/modal-info.component';

@Component({
  selector: 'app-section-formulaire',
  templateUrl: './section-formulaire.component.html',
  styleUrls: ['./section-formulaire.component.scss'],
})
export class SectionFormulaireComponent {

  @Input() formGroup!: FormGroup;
  @Input() formArrayName!: string;
  @Input() index!: number;
  @Input() section!: SectionFormulaire;
  @Input() planCadre!: boolean;

  constructor(private modalCtrl: ModalController) {}

  /**
   * Méthode qui affiche le modal pour fournir de l'aide sur une section à l'utilisateur.
   * @param aide l'aide de la section (string)
   */
  async ouvrirModaleAide(aide: string){

    // Crée le modal
    const modal = await this.modalCtrl.create({
      component: ModalInfoComponent,
      componentProps: {
        'titre': 'Aide',
        'message' : aide,
      }
    });

    // Affiche le modal
    await modal.present();
  }
}
