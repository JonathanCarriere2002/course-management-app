import {Component} from '@angular/core';
import {Subscription} from 'rxjs';
import {ModalController} from '@ionic/angular';
import {SectionService} from '../../../services/section/section.service';
import {Section} from '../../../models/section/section';
import {ApiResponse} from '../../../models/authentification/api-response';
import {
  ModalErreurServeurComponent
} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
import {Router} from '@angular/router';

/**
 * Page permettant d'afficher la liste des sections
 * @author Emeric Chauret
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-liste-sections',
  templateUrl: './liste-sections.page.html',
  styleUrls: ['./liste-sections.page.scss'],
})
export class ListeSectionsPage {

  // Initialisation des variables
  maxBreadcrumbs = 3;           // nombre maximum d'objets dans le fil d'arianne
  sections: Section[] = [];              // liste des sections affichées
  observableSections$!: Subscription;    // un observable pour la liste des sections
  sectionsRecherche: Section[] = [];     // liste contenant le résultat de la recherche pour les sections
  chargement = false;           // variable permettant d'effectuer la gestion du chargement des données

  /**
   * Constructeur de la page pour la liste des sections
   * @param sectionService service injecté SectionService
   * @param modalCtrl service injecté ModalController
   * @param router service injecté Router
   * @author Emeric Chauret
   */
  constructor(private sectionService: SectionService, private modalCtrl: ModalController, private router: Router) { }

  /**
   * Méthode qui s'exécute avant le chargement de la page.
   * @author Emeric Chauret
   */
  ionViewWillEnter(){
    this.obtenirToutesLesSections();
    this.chargement = this.sections.length === 0;
  }

  /**
   * Méthode qui s'exécute lorsqu'on quitte la page.
   * Elle effectue la désinscription de l'observable.
   * @author Emeric Chauret
   */
  ionViewWillLeave(){
    this.observableSections$.unsubscribe();
  }

  /**
   * Appel la méthode du service des sections qui permet de récupérer la liste des sections.
   * Puis, attends avant de donner une valeur aux variables sections et à la liste.
   * @author Emeric Chauret
   * @author Jonathan Carrière
   */
  obtenirToutesLesSections(){
    this.observableSections$ = this.sectionService.obtenirToutesLesSections().subscribe({
      next: (res: ApiResponse<Section[]>) => {
        res.data ? this.sections = res.data : '';
        this.sectionsRecherche = this.sections.slice();
        this.chargement = false;
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargement des sections.');
        this.chargement = false;
        this.router.navigate(['/accueil']).then(r => true);
      }
    })
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
      this.sectionsRecherche = this.sections.filter(section =>
        section.titre.toLowerCase().trim().includes(texteRecherche)
      );
    }
    // Si la barre de recherche est vidée, la liste complète est affichée à nouveau
    else {
      this.sectionsRecherche = this.sections.slice();
    }
  }

  /**
   * Méthode permettant d'afficher un modal pour la gestion des erreurs
   * @param message le message d'erreur à afficher (string)
   * @author Emeric Chauret
   */
  afficherErreur(message:string) {
    const modalErreur = this.modalCtrl.create({
      component: ModalErreurServeurComponent
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
