import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PlanCours} from '../../../../models/planCours/plan-cours';
import {PlanCoursService} from '../../../../services/planCours/plan-cours.service';
import {ModalController} from '@ionic/angular';
import {ModalConfirmerApprobationComponent} from '../../../partage/components/modal-confirmer-approbation/modal-confirmer-approbation.component';
import {ModalConfirmerSuppressionComponent} from '../../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';
import {ModalErreurServeurComponent} from '../../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
import {AuthService} from '../../../../services/auth.service';

/**
 * Component contenant la section permettant de modifier ou supprimer l'approbation d'un plan de cours
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-details-section-approbation',
  templateUrl: './details-section-approbation.component.html',
  styleUrls: ['./details-section-approbation.component.scss'],
})
export class DetailsSectionApprobationComponent {

  // Input permettant de recevoir le plan de cours à approuver
  @Input() planCours!: PlanCours;

  // Input permettant de recevoir le titre du plan de cours
  @Input() planCoursTitre!: string;

  // Output permettant d'informer la page que le statut d'approbation d'un plan de cours a été changé
  @Output() planCoursApprobation: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Constructeur pour le component permettant de modifier l'approbation des plans de cours
   * @param planCoursService Service permettant d'effectuer la gestion des plans de cours
   * @param modalCtrl Contrôleur permettant d'afficher le modal pour l'approbation
   * @param authService Service permettant d'effectuer la gestion de l'authentification
   */
  constructor(private planCoursService: PlanCoursService, private modalCtrl: ModalController, public authService : AuthService) { }

  /**
   * Méthode permettant de modifier l'approbation d'un plan de cours via un modal de confirmation
   * @author Jonathan Carrière
   */
  async modificationApprobation() {
    // Date par défaut utilisé dans le modal
    let dateModal = this.nouvelleDateApprobation();
    // Utiliser la date d'approbation du plan de cours si elle existe déjà
    if (this.planCours.approbation != null) {
      dateModal = this.planCours.approbation.toString();
    }
    // Création du modal permettant de modifier l'approbation
    const modal = await this.modalCtrl.create({
      component: ModalConfirmerApprobationComponent,
      componentProps: {'message' : `Souhaitez-vous vraiment modifier la date d'approbation du plan de cours "${this.planCoursTitre}"?`, 'dateInitiale' : dateModal}
    });
    // Attendre pour l'affichage du modal pour la confirmation
    await modal.present();
    const { data: dateInitiale, role } = await modal.onWillDismiss();
    // Si l'approbation est confirmée, mettre à jour la date d'approbation du plan de cours
    if (role === 'confirm') {
      // Mettre à jour la date d'approbation du plan de cours dans la base de données
      this.planCoursService.updatePlanCoursApprobation(this.planCours.id, dateInitiale).subscribe( {
        // Informer la page que l'approbation d'un plan de cours a été effectué
        next : () => this.planCoursApprobation.emit(),
        error: () => {this.afficherErreur();}
      });
    }
  }

  /**
   * Méthode permettant de supprimer la date d'approbation pour un plan de cours
   * @author Jonathan Carrière
   */
  async suppressionApprobation() {
    // Vérifier que la date d'approbation existe
    if (this.planCours.approbation != null) {
      // Création du modal permettant de confirmer la suppression de l'approbation
      const modal = await this.modalCtrl.create({
        component: ModalConfirmerSuppressionComponent,
        componentProps: {'message' : `Souhaitez-vous vraiment supprimer la date d'approbation du plan de cours "${this.planCoursTitre}"?`}
      });
      // Attendre pour l'affichage du modal pour la confirmation
      await modal.present();
      const { role } = await modal.onWillDismiss();
      // Si l'approbation est confirmée, supprimer la date d'approbation du plan de cours
      if (role === 'confirm') {
        //Supprimer la date d'approbation du plan de cours dans la base de données
        this.planCoursService.deletePlanCoursApprobation(this.planCours.id).subscribe( {
          // Informer la page que l'approbation d'un plan de cours a été effectué
          next : () => this.planCoursApprobation.emit(),
          error: () => {this.afficherErreur();}
        });
      }
    }
  }

  /**
   * Méthode permettant de créer une nouvelle date pour l'approbation configurée avec la bonne zone de temps
   * Source (toLocaleString) : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
   * Source (getFullYear, getMonth, getDate) : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
   * @author Jonathan Carrière
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
   * @author Jonathan Carrière
   */
  afficherErreur() {
    const modalErreur = this.modalCtrl.create({
      component: ModalErreurServeurComponent
    });
    modalErreur.then(modal => modal.present());
  }

}
