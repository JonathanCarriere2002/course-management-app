import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PlanCours} from '../../../../models/planCours/plan-cours';
import {PlanCoursService} from '../../../../services/planCours/plan-cours.service';
import {ModalController} from '@ionic/angular';
import {ModalConfirmerApprobationComponent} from '../../../partage/components/modal-confirmer-approbation/modal-confirmer-approbation.component';
import {ModalErreurServeurComponent} from '../../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
import {AuthService} from '../../../../services/auth.service';

/**
 * Component contenant le bouton permettant de confirmer l'approbation d'un plan de cours
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-btn-confirmation-approbation',
  templateUrl: './btn-confirmation-approbation.component.html',
  styleUrls: ['./btn-confirmation-approbation.component.scss'],
})
export class BtnConfirmationApprobationComponent {

  // Input permettant de recevoir le plan de cours à approuver
  @Input() planCours!: PlanCours;

  // Input permettant de recevoir le titre du plan de cours
  @Input() planCoursTitre!: string;

  // Output permettant d'informer la page qu'un plan de cours a été approuvé
  @Output() planCoursApprobation: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Constructeur pour le component permettant d'approuver des plans de cours
   * @param planCoursService Service permettant d'effectuer la gestion des plans de cours
   * @param modalCtrl Contrôleur permettant d'afficher le modal pour l'approbation
   * @param authService Service permettant d'effectuer la gestion de l'authentification
   */
  constructor(private planCoursService: PlanCoursService, private modalCtrl: ModalController, public authService : AuthService) { }

  /**
   * Méthode permettant d'approuver un plan de cours via un modal de confirmation
   * @author Jonathan Carrière
   */
  async confirmationApprobation() {
    // Création du modal permettant de confirmer l'approbation
    const modal = await this.modalCtrl.create({
      component: ModalConfirmerApprobationComponent,
      componentProps: {'message' : `Souhaitez-vous vraiment approuver le plan de cours "${this.planCoursTitre}"?`, 'dateInitiale' : this.nouvelleDateApprobation()}
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
   */
  afficherErreur() {
    const modalErreur = this.modalCtrl.create({
      component: ModalErreurServeurComponent
    });
    modalErreur.then(modal => modal.present());
  }

}
