/**
 * @author Jacob Beauregard-Tousignant
 * Module de gestion du modal pour les erreurs serveurs
 */

import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-modal-erreur-serveur',
  templateUrl: './modal-erreur-serveur.component.html',
  styleUrls: ['./modal-erreur-serveur.component.scss'],
})
export class ModalErreurServeurComponent {

  @Input() public message = '';

  constructor(private modalController: ModalController) { }


  /**
   * Fonction permettant de fermer le modal d'erreur serveur
   */
  fermer() {
    return this.modalController.dismiss(null, 'fermer');
  }


}
