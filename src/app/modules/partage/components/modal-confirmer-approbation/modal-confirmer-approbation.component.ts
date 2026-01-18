import {Component, Input} from '@angular/core';
import { ModalController } from '@ionic/angular';

/**
 * Classe permettant d'effectuer la gestion du modal d'approbation
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-modal-confirmer-approbation',
  templateUrl: './modal-confirmer-approbation.component.html',
  styleUrls: ['./modal-confirmer-approbation.component.scss'],
})
export class ModalConfirmerApprobationComponent {
  // Message qui sera affiché dans le modal
  @Input() public message = '';
  // Date initiale qui sera utilisée par le modal
  @Input() public dateInitiale = '';

  /**
   * Constructeur pour le modal d'approbation
   * @param modalController Contrôleur pour le modal d'approbation
   */
  constructor(private modalController: ModalController) { }

  /**
   * Méthode permettant de fermer le modal d'approbation
   */
  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

  /**
   * Méthode permettant de confirmer la sélection de la date via le modal
   */
  confirm() {
    // Vérifier si la date sélectionnée est valide
    if (this.validationDateChoisie()) {
      return this.modalController.dismiss(this.dateInitiale, 'confirm');
    }
    // Sinon, empêcher l'approbation
    else { return null; }
  }

  /**
   * Méthode permettant d'obtenir la date choisie via le modal
   * @param event Évènement qui se produit lorsque la date choisie change
   */
  // eslint-disable-next-line
  updateDateChoisie(event: any) {
    this.dateInitiale = event.target.value;
  }

  /**
   * Méthode permettant de valider la date sélectionnée via le modal
   */
  validationDateChoisie() {
    // Convertir la date sélectionnée en date
    const dateSelectionnee = new Date(this.dateInitiale);
    // Définir une date minimum pour la validation
    const dateMin = new Date('1967-01-01');
    // Définir la date actuelle comme date maximum pour la validation et obtenir celle-ci pour la zone de temps 'America/Toronto'
    const dateMax = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }));
    // L'heure des dates utilisées pour la comparaison doivent être mise à zéro pour éviter des problèmes avec les zones de temps
    dateMin.setHours(0, 0, 0, 0);
    dateMax.setHours(0, 0, 0, 0);
    // Vérifier si la date choisie respecte le maximum et minimum
    return dateSelectionnee >= dateMin && dateSelectionnee <= dateMax;
  }

}
