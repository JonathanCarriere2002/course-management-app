import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {SectionService} from '../../../services/section/section.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiResponse} from '../../../models/authentification/api-response';
import {Section} from '../../../models/section/section';
import {ModalConfirmerSuppressionComponent} from '../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';
import {ModalController} from '@ionic/angular';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';

/**
 * Classe permettant d'effectuer la gestion de la page associée aux détails d'une section
 * @author Jonathan Carrière
 * @author Emeric Chauret
 */
@Component({
  selector: 'app-details-section',
  templateUrl: './details-section.page.html',
  styleUrls: ['./details-section.page.scss'],
})
export class DetailsSectionPage implements OnInit {

  maxBreadCrumbs: number | undefined = 4;    // nombre maximum d'objets dans le fil d'arianne
  sectionId = 0;                    // l'identifiant de la section à afficher
  observableSection$!: Subscription;         // un observable pour la section à afficher
  section: Section = {                       // la section à afficher
    'id': 0,
    'titre': '',
    'info_suppl': '',
    'aide': '',
    'obligatoire': false,
    'type_section_id': 0
  }

  /**
   * Constructeur de la page associé à l'affichage des sections
   * @param sectionService Service permettant d'effectuer la gestion des sections
   * @param activatedRoute Routeur permettant d'obtenir des informations sur la route en utilisation, comme les données des paramètres
   * @param router Routeur permettant d'effectuer une redirection
   * @param modalCtrl service injecté ModalController
   * @author Jonathan Carrière
   */
  constructor(private sectionService: SectionService, private activatedRoute: ActivatedRoute, private router: Router, private modalCtrl: ModalController) { }

  /**
   * Méthode appeler sur l'initialisation de la page permettant d'envoyer les données de la section à la page
   * @author Jonathan Carrière
   */
  ngOnInit() {
    // Obtenir l'Id de la section à afficher des paramètres de l'URL
    this.sectionId = parseInt((this.activatedRoute.snapshot.paramMap.get('id') as string));
    // Obtenir la section à afficher selon son Id et l'envoyer dans la page
    this.sectionService.obtenirSectionParId(this.sectionId).subscribe( {
      next: (res: ApiResponse<Section>) => {
        res.data ? this.section = res.data : '';
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargement de la section.');
        this.router.navigate(['/liste-sections']).then(r => true);
      }
    });
  }

  /**
   * Méthode qui s'exécute lorsqu'on quitte la page. Elle effectue la désinscription de l'observable
   * @author Emeric Chauret
   */
  ionViewWillLeave(){
    if (this.observableSection$) {
      this.observableSection$.unsubscribe();
    }
  }

  /**
   * Appel la méthode du service des sections qui permet de récupérer la section ayant l'identifiant id dans la bd.
   * @param id l'identifiant de la section à récupérer (number)
   * @author Emeric Chauret
   */
  obtenirSectionParId(id: number) {
    this.observableSection$ = this.sectionService.obtenirSectionParId(id).subscribe({
      next: (res: ApiResponse<Section>) =>
        res.data ? this.section = res.data : '',
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargement de la section.');
        this.router.navigate(['/liste-sections']).then(r => true);
      }
    });
  }

  /**
   * Supprimer une section
   * @param id l'identifiant de la section à supprimer (number)
   * @author Emeric Chauret
   */
  supprimerSection(id: number){
    this.sectionService.supprimerSection(id).subscribe({
      next : () => this.router.navigateByUrl('/liste-sections').then(r => true),
      error: () => this.afficherErreur('Un problème est survenu lors de la suppression de la section.')
    });
  }

  /**
   * Méthode qui affiche le modal pour confirmer la suppression d'une section.
   * @param section la section que l'utilisateur veut supprimer (Section)
   * @author Emeric Chauret
   */
  async ouvrirModalConfirmerSuppression(section: Section) {
    // Crée le modal
    const modal = await this.modalCtrl.create({
      component: ModalConfirmerSuppressionComponent,
      componentProps: {'message' : `Souhaitez-vous vraiment supprimer la section ${section.titre}?`}
    });
    // Affiche le modal
    await modal.present();
    // Récupérer les données du modal avant qu'il disparaisse
    const { role } = await modal.onWillDismiss();
    // Si l'utilisateur a confirmé la suppression de la section
    if (role === 'confirm') {
      // supprimer la section
      this.supprimerSection(section.id);
    }
  }

  /**
   * Méthode permettant d'afficher un modal pour la gestion des erreurs.
   * @param message le message d'erreur à afficher (string)
   * @author Jonathan Carrière
   */
  afficherErreur(message: string) {
    const modalErreur = this.modalCtrl.create({
      component: ModalErreurServeurComponent,
      componentProps: {
        message: message
      }
    });
    modalErreur.then(modal => modal.present());
  }

  /**
   * Fonction pour étendre le fil d'arianne
   * @author Emeric Chauret
   */
  expandBreadcrumbs() {
    this.maxBreadCrumbs = undefined;
  }

}
