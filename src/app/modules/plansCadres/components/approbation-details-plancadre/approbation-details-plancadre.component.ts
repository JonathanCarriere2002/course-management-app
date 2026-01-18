import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PlanCadres} from '../../../../models/planCadres/plan-cadres';
import {PlanCadresService} from '../../../../services/planCadres/plan-cadres.service';
import {ModalController} from '@ionic/angular';
import {ModalConfirmerApprobationComponent} from '../../../partage/components/modal-confirmer-approbation/modal-confirmer-approbation.component';
import {ModalConfirmerSuppressionComponent} from '../../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';
import {ModalErreurServeurComponent} from '../../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
import {AuthService} from '../../../../services/auth.service';

/**
 * Component permettant d'effectuer l'approbation d'un plan-cadre sur la page de détails
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-approbation-details-plancadre',
  templateUrl: './approbation-details-plancadre.component.html',
  styleUrls: ['./approbation-details-plancadre.component.scss'],
})
export class ApprobationDetailsPlancadreComponent {

  // Input permettant de recevoir le plan-cadre à approuver
  @Input() planCadre!: PlanCadres;

  // Input permettant de recevoir le titre du plan-cadre
  @Input() planCadreTitre!: string;

  // Input contenant la valeur utilisée pour la barre de progrès
  @Input() valeurProgressBar = 0;

  // Output permettant d'informer la page qu'un plan-cadre a été approuvé
  @Output() planCadreApprobation: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Constructeur pour le component permettant d'approuver des plans-cadres
   * @param planCadresService Service permettant d'effectuer la gestion des plans-cadres
   * @param modalCtrl Contrôleur permettant d'afficher le modal pour l'approbation
   * @param authService Service permettant d'effectuer la gestion de l'authentification
   */
  constructor(private planCadresService: PlanCadresService, private modalCtrl: ModalController, public authService : AuthService) { }

  /**
   * Méthode permettant d'approuver un plan-cadre via un modal de confirmation
   * @param message Message qui sera affiché dans le modal de confirmation
   * @param action Verbe utilisé dans le message du modal d'approbation
   */
  async confirmationApprobation(message: string, action: string) {
    // Modal permettant de confirmer l'approbation du plan-cadre
    const modal = await this.modalCtrl.create({
      component: ModalConfirmerApprobationComponent,
      componentProps: {'message' : `Souhaitez-vous vraiment ${action} le plan-cadre "${this.planCadreTitre}" ${message}?`, 'dateInitiale' : this.nouvelleDateApprobation()}
    });
    // Attendre que le modal de confirmation s'affiche
    await modal.present();
    const { data: dateInitiale, role } = await modal.onWillDismiss();
    // Lorsque la confirmation est effectuée via le modal, le plan-cadre est mis à jour dans la base de données
    if (role === 'confirm') {
      // Vérifier si le plan-cadre peut être approuvé par le département
      if (this.planCadre.approbationDepartement == null) {
        // Mettre à jour la date d'approbation par le département dans la base de données
        this.planCadresService.updatePlanCadreApprobation(this.planCadre.id, dateInitiale, 'departement').subscribe( {
          next : () => this.planCadreApprobation.emit(),
          error: () => {this.afficherErreur();}
        });
        this.updateProgressBarApprobation(0.33);
      }
      // Vérifier si le plan-cadre peut être approuvé par le comité de programme
      else if (this.planCadre.approbationComite == null && dateInitiale >= this.planCadre.approbationDepartement) {
        // Mettre à jour la date d'approbation par le comité de programme dans la base de données
        this.planCadresService.updatePlanCadreApprobation(this.planCadre.id, dateInitiale, 'comite').subscribe( {
          next : () => this.planCadreApprobation.emit(),
          error: () => {this.afficherErreur();}
        });
        this.updateProgressBarApprobation(0.66);
      }
      // Vérifier si le plan-cadre peut être approuvé par la direction des études
      else if (this.planCadre.depotDirectionEtudes == null && dateInitiale >= this.planCadre.approbationDepartement && dateInitiale >= this.planCadre.approbationComite) {
        // Mettre à jour la date d'approbation par la direction des études dans la base de données
        this.planCadresService.updatePlanCadreApprobation(this.planCadre.id, dateInitiale, 'direction').subscribe( {
          next : () => this.planCadreApprobation.emit(),
          error: () => {this.afficherErreur();}
        });
        this.updateProgressBarApprobation(1);
      }
    }
  }

  /**
   * Méthode permettant de modifier l'approbation d'un plan-cadre via un modal de confirmation
   * @param message Message qui sera affiché dans le modal de confirmation
   * @param statut Statut de l'approbation du plan-cadre
   */
  async modificationApprobation(message: string, statut: string) {
    // Date par défaut utilisée dans le modal
    let dateModal = this.nouvelleDateApprobation();
    // Utiliser la date d'approbation du plan-cadre si elle existe déjà
    if (this.planCadre.approbationDepartement != null && statut == 'departement') { dateModal = this.planCadre.approbationDepartement.toString(); }
    else if (this.planCadre.approbationComite != null && statut == 'comite') { dateModal = this.planCadre.approbationComite.toString(); }
    else if (this.planCadre.depotDirectionEtudes != null && statut == 'direction') { dateModal = this.planCadre.depotDirectionEtudes.toString(); }
    // Modal permettant de confirmer l'approbation du plan-cadre
    const modal = await this.modalCtrl.create({
      component: ModalConfirmerApprobationComponent,
      componentProps: {'message' : `Souhaitez-vous vraiment modifier la date ${message} du plan-cadre "${this.planCadreTitre}"?`, 'dateInitiale' : dateModal}
    });
    // Attendre que le modal de confirmation s'affiche
    await modal.present();
    const { data: dateInitiale, role } = await modal.onWillDismiss();
    // Lorsque la confirmation est effectuée via le modal, le plan-cadre est mis à jour dans la base de données
    if (role === 'confirm') {
      // Vérifier si le plan-cadre peut être approuvé par le département
      if (statut == 'departement' && this.planCadre.approbationDepartement != null && (this.planCadre.approbationComite === null || dateInitiale <= this.planCadre.approbationComite) && (this.planCadre.depotDirectionEtudes === null || dateInitiale <= this.planCadre.depotDirectionEtudes)) {
        // Mettre à jour la date d'approbation par le département dans la base de données
        this.planCadresService.updatePlanCadreApprobation(this.planCadre.id, dateInitiale, 'departement').subscribe( {
          next : () => this.planCadreApprobation.emit(),
          error: () => {this.afficherErreur();}
        });
      }
      // Vérifier si le plan-cadre peut être approuvé par le comité de programme
      else if (statut == 'comite' && this.planCadre.approbationComite != null && dateInitiale >= this.planCadre.approbationDepartement && (this.planCadre.depotDirectionEtudes === null || dateInitiale <= this.planCadre.depotDirectionEtudes)) {
        // Mettre à jour la date d'approbation par le comité de programme dans la base de données
        this.planCadresService.updatePlanCadreApprobation(this.planCadre.id, dateInitiale, 'comite').subscribe( {
          next : () => this.planCadreApprobation.emit(),
          error: () => {this.afficherErreur();}
        });
      }
      // Vérifier si le plan-cadre peut être approuvé par la direction des études
      else if (statut == 'direction' && this.planCadre.depotDirectionEtudes != null && dateInitiale >= this.planCadre.approbationDepartement && dateInitiale >= this.planCadre.approbationComite) {
        // Mettre à jour la date d'approbation par la direction des études dans la base de données
        this.planCadresService.updatePlanCadreApprobation(this.planCadre.id, dateInitiale, 'direction').subscribe( {
          next : () => this.planCadreApprobation.emit(),
          error: () => {this.afficherErreur();}
        });
      }
    }
  }

  /**
   * Méthode permettant de supprimer la date d'approbation pour un plan-cadre
   * @param message Message qui sera affiché dans le modal de confirmation
   * @param statut Statut dont la date sera supprimée
   */
  async suppressionApprobation(message: string, statut: string){
    // Création du modal permettant de confirmer la suppression de l'approbation
    const modal = await this.modalCtrl.create({
      component: ModalConfirmerSuppressionComponent,
      componentProps: {'message' : `Souhaitez-vous vraiment supprimer la date ${message} du plan-cadre "${this.planCadreTitre}"?`}
    });
    // Attendre pour l'affichage du modal pour la confirmation
    await modal.present();
    const { role } = await modal.onWillDismiss();
    // Si l'approbation est confirmée, effectuer la vérification de quelle date d'approbation doit être supprimée
    if (role === 'confirm') {
      // Vérifier si la date d'approbation par le département doit être supprimée
      if (statut == 'departement' && this.planCadre.approbationDepartement != null && this.planCadre.approbationComite == null && this.planCadre.depotDirectionEtudes == null) {
        // Supprimer la date d'approbation dans la base de données
        this.planCadresService.deletePlanCadreApprobation(this.planCadre.id, 'departement').subscribe( {
          next : () => this.planCadreApprobation.emit(),
          error: () => {this.afficherErreur();}
        });
        this.updateProgressBarApprobation(0);
      }
      // Vérifier si la date d'approbation par le comité de programme doit être supprimée
      else if (statut == 'comite' && this.planCadre.approbationDepartement != null && this.planCadre.approbationComite != null && this.planCadre.depotDirectionEtudes == null) {
        // Supprimer la date d'approbation dans la base de données
        this.planCadresService.deletePlanCadreApprobation(this.planCadre.id, 'comite').subscribe( {
          next : () => this.planCadreApprobation.emit(),
          error: () => {this.afficherErreur();}
        });
        this.updateProgressBarApprobation(0.33);
      }
      // Vérifier si la date d'approbation par la direction des études doit être supprimée
      else if (statut == 'direction' && this.planCadre.approbationDepartement != null && this.planCadre.approbationComite != null && this.planCadre.depotDirectionEtudes != null) {
        // Supprimer la date d'approbation dans la base de données
        this.planCadresService.deletePlanCadreApprobation(this.planCadre.id, 'direction').subscribe( {
          next : () => this.planCadreApprobation.emit(),
          error: () => {this.afficherErreur();}
        });
        this.updateProgressBarApprobation(0.66);
      }
    }
  }

  /**
   * Méthode permettant de mettre à jour la barre de progrès pour l'approbation d'un plan-cadre suite à l'approbation
   * @param valeur Valeur qui sera affichée dans la barre de progrès
   */
  updateProgressBarApprobation(valeur: number) {
    // Modifier la valeur de la barre de progrès
    this.valeurProgressBar = valeur;
  }

  /**
   * Méthode permettant de créer une nouvelle date pour l'approbation configurée avec la bonne zone de temps
   * Source (toLocaleString) : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
   * Source (getFullYear, getMonth, getDate) : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
   */
  public nouvelleDateApprobation() {
    // Créer une nouvelle date et la convertir dans la zone de temps local
    const nouvelleDateLocale = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }));
    // Obtenir l'année, le mois ainsi que le jour de cette nouvelle date
    const annee = nouvelleDateLocale.getFullYear();
    const mois = nouvelleDateLocale.getMonth() + 1;
    const jour = nouvelleDateLocale.getDate();
    // Construire une date valide à afficher dans le modal et la retourner
    return  annee + '-' + mois + '-' + jour;
  }

  /**
   * Méthode permettant d'afficher un modal pour la gestion des erreurs
   */
  afficherErreur() {
    const modalErreur = this.modalCtrl.create({
      component: ModalErreurServeurComponent
    });
    modalErreur.then(modal => modal.present());
  }

}
