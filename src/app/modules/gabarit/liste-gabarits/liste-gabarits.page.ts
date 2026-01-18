import {Component} from '@angular/core';
import {Subscription} from 'rxjs';
import {GabaritService} from '../../../services/gabarit/gabarit.service';
import {Gabarit} from '../../../models/gabarit/gabarit';
import {ApiResponse} from '../../../models/authentification/api-response';
import {
  ModalErreurServeurComponent
} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
import {ModalController} from '@ionic/angular';
import {Router} from '@angular/router';

/**
 * Page permettant d'afficher la liste des gabarits
 * @author Emeric Chauret
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-liste-gabarits',
  templateUrl: './liste-gabarits.page.html',
  styleUrls: ['./liste-gabarits.page.scss'],
})
export class ListeGabaritsPage {

  // Initialisation des variables
  maxBreadcrumbs = 3;           // nombre maximum d'objets dans le fil d'arianne
  gabarits: Gabarit[] = [];              // liste des gabarits affichée
  observableGabarits$!: Subscription;    // un observable pour la liste des gabarits
  gabaritsRecherche: Gabarit[] = [];     // liste contenant le résultat de la recherche pour les gabarits
  chargement = false;           // variable permettant d'effectuer la gestion du chargement des données

  /**
   * Constructeur de la page pour la liste des gabarits
   * @param gabaritService service injecté GabaritService
   * @param modalCtrl service injecté ModalController
   * @param router service injecté Router
   * @author Emeric Chauret
   */
  constructor(private gabaritService: GabaritService, private modalCtrl: ModalController, private router: Router) { }

  /**
   * Méthode qui s'exécute avant le chargement de la page.
   * @author Emeric Chauret
   */
  ionViewWillEnter(){
    this.obtenirTousLesGabarits();
    this.chargement = this.gabarits.length === 0;
  }

  /**
   * Méthode qui s'exécute lorsqu'on quitte la page.
   * Elle effectue la désinscription de l'observable.
   * @author Emeric Chauret
   */
  ionViewWillLeave(){
    this.observableGabarits$.unsubscribe();
  }

  /**
   * Appel la méthode du service des gabarits qui permet de récupérer la liste des gabarits.
   * Puis, attends avant de donner une valeur aux variables gabarits.
   * @author Emeric Chauret
   * @author Jonathan Carrière
   */
  obtenirTousLesGabarits(){
    this.observableGabarits$ = this.gabaritService.obtenirTousLesGabarits().subscribe({
      next: (res: ApiResponse<Gabarit[]>) => {
        res.data ? this.gabarits = res.data : '';
        this.gabaritsRecherche = this.gabarits.slice();
        this.chargement = false;
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargement des gabarits.');
        this.chargement = false;
        this.router.navigate(['/accueil']).then(r => true);
      }
    });
  }

  /**
   * Méthode permettant de filtrer la liste d'objets affichée via une barre de recherche
   * @param event Évènement de changement sur la barre de recherche
   * @author Jonathan Carrière
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rechercher(event: any) {
    // Texte se retrouvant dans la barre de recherche
    const texteRecherche = event.target.value.toLowerCase().trim();
    // Vérifier si la barre de recherche n'est pas vide
    if (texteRecherche !== '') {
      // Filtrer la liste affichée selon le texte dans la barre de recherche
      this.gabaritsRecherche = this.gabarits.filter(gabarit =>
        gabarit.nom.toLowerCase().trim().includes(texteRecherche)
      );
    }
    // Si la barre de recherche est vidée, la liste complète est affichée à nouveau
    else {
      this.gabaritsRecherche = this.gabarits.slice();
    }
  }

  /**
   * Méthode permettant d'afficher un modal pour la gestion des erreurs.
   * @param message le message d'erreur à afficher (string)
   * @author Emeric Chauret
   */
  afficherErreur(message:string) {
    const modalErreur = this.modalCtrl.create({
      component: ModalErreurServeurComponent,
      componentProps: {
        message: message
      }
    });
    modalErreur.then(modal => modal.present());
  }

  /**
   * Méthode pour étendre le fil d'arianne
   * @author Emeric Chauret
   */
  expandBreadcrumbs() {
    this.maxBreadcrumbs = 20;
  }

}
