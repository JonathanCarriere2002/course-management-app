import { Component, Input, OnChanges } from '@angular/core';
import { LoadingController } from '@ionic/angular';

/**
 * Classe permettant d'effectuer la gestion du component pour le chargement des données
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-chargement',
  templateUrl: './chargement.component.html',
  styleUrls: ['./chargement.component.scss']
})
export class ChargementComponent implements OnChanges {
  // Input permettant d'effectuer la gestion de l'état du chargement
  @Input() etatChargement = false;
  // Variable permettant d'effectuer la gestion du chargement
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private chargement: any;

  /**
   * Constructeur pour le component de chargement
   * @param loadingController Contrôleur permettant d'effectuer la gestion du chargement
   */
  constructor(private loadingController: LoadingController) { }

  /**
   * Méthode permettant de surveiller la valeur de l'input 'etatChargement'
   */
  ngOnChanges() {
    // Vérifier l'état du chargement et afficher l'animation de chargement au besoin
    if (this.etatChargement) {
      this.effectuerChargement();
    }
    // Sinon, arrêter l'animation de chargement
    else {
      this.arreterChargement();
    }
  }

  /**
   * Méthode permettant d'effectuer l'animation pour le chargement des données
   */
  async effectuerChargement() {
    // Créer une animation pour le chargement en spécifiant un message ainsi qu'un spinner
    this.chargement = await this.loadingController.create({
      message: 'Chargement des données...',
      spinner: 'crescent',
    });
    // Attendre que le component est prêt puis l'afficher sur la page
    await this.chargement.present();
  }

  /**
   * Méthode permettant d'arrêter l'animation pour le chargement des données
   */
  arreterChargement() {
    // Vérifier si une animation pour le chargement est en cours puis l'arrêter
    if (this.chargement) {
      this.chargement.dismiss();
    }
  }

}
