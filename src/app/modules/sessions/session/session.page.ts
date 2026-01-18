import {Component} from '@angular/core';
import {Session} from '../../../models/sessions/session';
import {Subscription} from 'rxjs';
import {SessionsService} from '../../../services/sessions/sessions.service';
import {ModalController} from '@ionic/angular';
import {ApiResponse} from '../../../models/authentification/api-response';
import {AuthService} from '../../../services/auth.service';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';

/**
 * Classe permettant d'effectuer la gestion de la page associée à la liste des sessions
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-session',
  templateUrl: './session.page.html',
  styleUrls: ['./session.page.scss'],
})
export class SessionPage {

  // Initialisation des variables
  sessions : Session[] = []              // Liste des sessions
  observable$! : Subscription;           // Observable permettant d'effectuer la gestion des données de la page
  maxBreadCrumbs = 3;           // Quantité maximale pour les breadcrumbs
  sessionsRecherche: Session[] = [];     // liste contenant le résultat de la recherche pour les sessions
  chargement = false;           // variable permettant d'effectuer la gestion du chargement des données

  /**
   * Constructeur de la page associé à la liste des sessions
   * @param sessionsServices Service permettant d'effectuer la gestion des sessions
   * @param modalController Modal permettant de confirmer la suppression d'une session
   * @param authService Service permettant d'effectuer la gestion de l'authentification
   */
  constructor(private sessionsServices : SessionsService, private modalController: ModalController, public authService : AuthService) { }

  /**
   * Méthode permettant d'obtenir l'ensemble des sessions au chargement de la page
   */
  ionViewWillEnter(){
    this.getSessions();
    this.chargement = this.sessions.length === 0;
  }

  /**
   * Méthode permettant d'arrêter l'observable contenant l'abonnement aux données des sessions quand la page est fermée
   */
  ionViewWillLeave(){
    this.observable$.unsubscribe()
  }

  /**
   * Méthode permettant d'obtenir l'ensemble des sessions
   */
  getSessions() {
    this.observable$ = this.sessionsServices.getSessions().subscribe( {
      next: (res: ApiResponse<Session[]>) => {
        res.data ? this.sessions = res.data : '';
        this.sessionsRecherche = this.sessions.slice();
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
      this.sessionsRecherche = this.sessions.filter(session =>
          session.session.toLowerCase().trim().includes(texteRecherche) || session.annee.toString().trim().includes(texteRecherche)
      );
    }
    // Si la barre de recherche est vidée, la liste complète est affichée à nouveau
    else {
      this.sessionsRecherche = this.sessions.slice();
    }
  }

  /**
   * Méthode permettant d'ajouter des options à l'intérieur des breadcrumbs
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
