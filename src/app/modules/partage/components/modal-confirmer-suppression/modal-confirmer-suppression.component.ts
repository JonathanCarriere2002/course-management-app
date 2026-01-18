import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';

/**
 * Classe permettant d'effectuer la gestion du modal de suppression
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-modal-confirmer-suppression',
  templateUrl: './modal-confirmer-suppression.component.html',
  styleUrls: ['./modal-confirmer-suppression.component.scss'],
})
export class ModalConfirmerSuppressionComponent {

  @Input() public message  = '';

  /**
   * Constructeur pour le modal de suppression
   * @param modalController Contrôleur pour le modal de suppression
   */
  constructor(private modalController: ModalController) { }

  /**
   * Fonction permettant de fermer le modal de suppression
   */
  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

  /**
   * Fonction permettant de confirmer la suppression via le modal
   */
  confirm() {
    return this.modalController.dismiss(null, 'confirm');
  }

}
