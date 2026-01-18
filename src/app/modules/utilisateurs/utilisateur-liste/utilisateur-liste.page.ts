import {Component} from '@angular/core';
import {Utilisateur} from '../../../models/utilisateurs/utilisateur';
import {UtilisateursService} from '../../../services/utilisateurs/utilisateurs.service';
import {Subscription} from 'rxjs';
import {ModalController} from '@ionic/angular';
import {ApiResponse} from '../../../models/authentification/api-response';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';

/**
 * Classe permettant d'effectuer la gestion de la page associée à la liste des utilisateurs
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-utilisateur-liste',
  templateUrl: './utilisateur-liste.page.html',
  styleUrls: ['./utilisateur-liste.page.scss'],
})
export class UtilisateurListePage {

  // Initialisation des variables
  utilisateurs : Utilisateur[] = []            // Liste des utilisateurs
  observable$! : Subscription;                 // Observable permettant d'effectuer la gestion des données de la page
  maxBreadCrumbs = 3;                 // Quantité maximale pour les breadcrumbs
  utilisateursRecherche: Utilisateur[] = [];   // Liste contenant le résultat de la recherche pour les utilisateurs
  chargement = false;                 // Variable permettant d'effectuer la gestion du chargement des données

  /**
   * Constructeur de la page associé à la liste des utilisateurs
   * @param utilisateursServices Service permettant d'effectuer la gestion des utilisateurs
   * @param modalController Modal permettant de confirmer la suppression d'un utilisateur
   */
  constructor(private utilisateursServices : UtilisateursService, private modalController: ModalController) { }

  /**
   * Méthode permettant d'obtenir l'ensemble des utilisateurs au chargement de la page
   */
  ionViewWillEnter(){
    this.getUtilisateurs();
    // Vérifier si les données sont déjà chargées
    this.chargement = this.utilisateurs.length === 0;
  }

  /**
   * Méthode permettant de se désabonner de l'observable contenant les utilisateurs sur la fermeture de la page
   */
  ionViewWillLeave(){
    this.observable$.unsubscribe()
  }

  /**
   * Méthode permettant d'obtenir l'ensemble des utilisateurs
   */
  getUtilisateurs() {
    this.observable$ = this.utilisateursServices.getUtilisateurs().subscribe( {
      next: (res: ApiResponse<Utilisateur[]>) => {
        res.data ? this.utilisateurs = res.data : '';
        // Instancier la liste pour la recherche et désactiver le chargement des données
        this.utilisateursRecherche = this.utilisateurs.slice();
        this.chargement = false;
      },
      error: () => {
        this.afficherErreur();
        this.chargement = false;
      }
    });
  }

  /**
   * Méthode permettant de filtrer la liste d'objets affichée via une barre de recherche
   * @param event Évènement de changement sur la barre de recherche=
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rechercher(event: any) {
    // Texte se retrouvant dans la barre de recherche
    const texteRecherche = event.target.value.toLowerCase().trim();
    // Vérifier si la barre de recherche n'est pas vide
    if (texteRecherche !== '') {
      // Filtrer la liste affichée selon le texte dans la barre de recherche
      this.utilisateursRecherche = this.utilisateurs.filter(utilisateur =>
          utilisateur.prenom.toLowerCase().trim().includes(texteRecherche) || utilisateur.nom.toLowerCase().trim().includes(texteRecherche)
      );
    }
    // Si la barre de recherche est vidée, la liste complète est affichée à nouveau
    else {
      this.utilisateursRecherche = this.utilisateurs.slice();
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
   */
  afficherErreur() {
    const modalErreur = this.modalController.create({
      component: ModalErreurServeurComponent
    });
    modalErreur.then(modal => modal.present());
  }

}
