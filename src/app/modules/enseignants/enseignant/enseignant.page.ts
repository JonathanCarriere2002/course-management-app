import { Component } from '@angular/core';
import {Enseignant} from '../../../models/enseignants/enseignant';
import {EnseignantsService} from '../../../services/enseignants/enseignants.service';
import {Subscription} from 'rxjs';
import {ModalController} from '@ionic/angular';
import {ApiResponse} from '../../../models/authentification/api-response';
import {AuthService} from '../../../services/auth.service';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';

/**
 * Classe permettant d'effectuer la gestion de la page associée à la liste des enseignants
 * @author Jonathan Carrière
 * @author Samir El Haddaji
 */
@Component({
  selector: 'app-enseignant',
  templateUrl: './enseignant.page.html',
  styleUrls: ['./enseignant.page.scss'],
})
export class EnseignantPage {

  enseignants : Enseignant[] = []              // Liste des enseignants
  observable$! : Subscription;                 // Observable permettant d'effectuer la gestion des données de la page
  maxBreadCrumbs = 3;                 // Quantité maximale pour les breadcrumbs
  enseignantsRecherche: Enseignant[] = [];     // liste contenant le résultat de la recherche pour les enseignants
  chargement = false;                 // variable permettant d'effectuer la gestion du chargement des données

  /**
   * Constructeur de la page associé à la liste des enseignants
   * @param enseignantsServices Service permettant d'effectuer la gestion des enseignants
   * @param modalController Modal permettant de confirmer la suppression d'un enseignant
   * @param authService Service permettant d'effectuer la gestion de l'authentification
   * @author Jonathan Carrière
   */
  constructor(private enseignantsServices : EnseignantsService, private modalController: ModalController, public authService : AuthService) { }

  /**
   * Méthode permettant d'obtenir l'ensemble des enseignants au chargement de la page
   * @author Jonathan Carrière
   * @author Samir El Haddaji
   */
  ionViewWillEnter(){
    this.getEnseignants();
    // Vérifier si les données sont déjà chargées
    this.chargement = this.enseignants.length === 0;
  }

  /**
   * Méthode permettant d'arrêter de se désabonner de l'observable contenant les enseignants quand la page est fermée
   * @author Samir El Haddaji
   */
  ionViewWillLeave(){
    this.observable$.unsubscribe()
  }

  /**
   * Méthode permettant d'obtenir l'ensemble des enseignants
   * @author Jonathan Carrière
   */
  getEnseignants() {
    this.observable$ = this.enseignantsServices.getEnseignants().subscribe( {
      next: (res: ApiResponse<Enseignant[]>) => {
        res.data ? this.enseignants = res.data : '';
        // Instancier la liste pour la recherche et désactiver le chargement des données
        this.enseignantsRecherche = this.enseignants.slice();
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
      this.enseignantsRecherche = this.enseignants.filter(enseignant =>
          enseignant.prenom.toLowerCase().trim().includes(texteRecherche) || enseignant.nom.toLowerCase().trim().includes(texteRecherche)
      );
    }
    // Si la barre de recherche est vidée, la liste complète est affichée à nouveau
    else {
      this.enseignantsRecherche = this.enseignants.slice();
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
   * @author Jonathan Carrière
   */
  afficherErreur() {
    const modalErreur = this.modalController.create({
      component: ModalErreurServeurComponent
    });
    modalErreur.then(modal => modal.present());
  }

}
