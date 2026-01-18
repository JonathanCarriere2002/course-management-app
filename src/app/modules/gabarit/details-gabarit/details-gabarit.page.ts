import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiResponse} from '../../../models/authentification/api-response';
import {Gabarit} from '../../../models/gabarit/gabarit';
import {GabaritService} from '../../../services/gabarit/gabarit.service';
import {ModalController} from '@ionic/angular';
import {ModalConfirmerSuppressionComponent} from '../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';

/**
 * Page permettant d'afficher les détails d'un gabarit
 * @author Jonathan Carrière
 * @author Emeric Chauret
 */
@Component({
  selector: 'app-details-gabarit',
  templateUrl: './details-gabarit.page.html',
  styleUrls: ['./details-gabarit.page.scss'],
})
export class DetailsGabaritPage implements OnInit {
  gabaritId= 0;                                    // Id du gabarit qui sera affiché
  gabarit: Gabarit = { id: 0, nom : '', sections: [] };     // Gabarit qui sera affiché
  observable$! : Subscription;                              // Observable permettant d'effectuer la gestion des données de la page
  maxBreadCrumbs = 4;                              // Quantité maximale pour les breadcrumbs
  charge = false;

  /**
   * Constructeur de la page associé à l'affichage des gabarits
   * @param gabaritService Service permettant d'effectuer la gestion des gabarits
   * @param activatedRoute Routeur permettant d'obtenir des informations sur la route en utilisation, comme les données des paramètres
   * @param router Routeur permettant d'effectuer une redirection
   * @param modalCtrl service injecté ModalController
   * @author Jonathan Carrière
   */
  constructor(private gabaritService : GabaritService, private activatedRoute: ActivatedRoute, private router: Router, private modalCtrl: ModalController) { }

  /**
   * Méthode appeler sur l'initialisation de la page permettant d'envoyer les données du gabarit à la page
   * @author Jonathan Carrière
   */
  ngOnInit() {
    // Obtenir l'Id du gabarit à afficher des paramètres de l'URL
    this.gabaritId = parseInt((this.activatedRoute.snapshot.paramMap.get('id') as string));
    // Obtenir le gabarit à afficher selon son Id et l'envoyer dans la page
    this.gabaritService.obtenirGabaritParId(this.gabaritId).subscribe( {
      next: (res: ApiResponse<Gabarit>) => {
        res.data ? this.gabarit = res.data : '';
        this.charge = true;
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargement du gabarit.');
        this.router.navigate(['/liste-gabarits']).then(r => true);
      }
    });
  }

  /**
   * Méthode permettant d'arrêter de se désabonner de l'observable contenant le gabarit quand la page est fermée
   * @author Jonathan Carrière
   */
  ionViewWillLeave(){
    this.observable$.unsubscribe()
  }

  /**
   * Appel la méthode du service des gabarits qui permet de supprimer un gabarit.
   * Puis, attends avant de récupérer la liste des gabarits.
   * @param id l'identifiant du gabarit à supprimer (number)
   * @author Emeric Chauret
   */
  supprimerGabarit(id: number){
    this.gabaritService.supprimerGabarit(id).subscribe({
      next : () => this.router.navigateByUrl('/liste-gabarits').then(r => true),
      error : () => this.afficherErreur('Un problème est survenu lors de la suppression du gabarit.')
    });
  }

  /**
   * Méthode qui affiche le modal pour confirmer la suppression d'un gabarit.
   * @param gabarit le gabarit que l'utilisateur veut supprimer (Gabarit)
   * @author Emeric Chauret
   */
  async ouvrirModalConfirmerSuppression(gabarit: Gabarit) {
    // Crée le modal
    const modal = await this.modalCtrl.create({
      component: ModalConfirmerSuppressionComponent,
      componentProps: {'message' : `Souhaitez-vous vraiment supprimer le gabarit ${gabarit.nom}?`}
    });
    // Affiche le modal
    await modal.present();
    // Récupérer les données du modal avant qu'il disparaisse
    const { role } = await modal.onWillDismiss();
    // Si l'utilisateur a confirmé la suppression du gabarit
    if (role === 'confirm') {
      // supprimer le gabarit
      this.supprimerGabarit(gabarit.id);
    }
  }

  /**
   * Méthode permettant d'ajouter des options à l'intérieur des breadcrumbs
   * @author Jonathan Carrière
   */
  expandBreadcrumbs() {
    this.maxBreadCrumbs = 20;
  }

  /**
   * Méthode permettant d'afficher un modal pour la gestion des erreurs
   * @param message le message d'erreur à afficher (string)
   * @author Jonathan Carrière
   */
  afficherErreur(message: string) {
    const modalErreur = this.modalCtrl.create({
      component: ModalErreurServeurComponent,
      componentProps : {
        message: message
      }
    });
    modalErreur.then(modal => modal.present());
  }

}
