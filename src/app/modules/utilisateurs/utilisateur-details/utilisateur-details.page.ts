import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Utilisateur} from '../../../models/utilisateurs/utilisateur';
import {UtilisateursService} from '../../../services/utilisateurs/utilisateurs.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiResponse} from '../../../models/authentification/api-response';
import {ModalController} from '@ionic/angular';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
import {ModalConfirmerSuppressionComponent} from '../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';

/**
 * Classe permettant d'effectuer la gestion de la page associée aux détails d'un utilisateur
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-utilisateur-details',
  templateUrl: './utilisateur-details.page.html',
  styleUrls: ['./utilisateur-details.page.scss'],
})
export class UtilisateurDetailsPage implements OnInit {
  // Id de l'utilisateur qui sera affiché
  utilisateurId  = 0;
  // Utilisateur qui sera affiché
  utilisateur: Utilisateur = {
    id: 0,
    nom : 'nom',
    prenom : 'prenom',
    courriel : 'utilisateur@email.qc.ca',
    courriel_verifie : new Date(),
    mot_de_passe : '',
    role : 0,
    bureau : '',
    poste : 1.000,
    programmes: [],
    created_at : new Date(),
    updated_at : new Date()
  };
  // Observable permettant d'effectuer la gestion des données de la page
  observable$! : Subscription;
  // Variable permettant d'effectuer la gestion du chargement des données
  chargement = false;
  // Quantité maximale pour les breadcrumbs
  maxBreadCrumbs = 4;

  /**
   * Constructeur de la page associé à l'affichage des utilisateurs
   * @param utilisateursServices Service permettant d'effectuer la gestion des utilisateurs
   * @param activatedRoute Routeur permettant d'obtenir des informations sur la route en utilisation, comme les données des paramètres
   * @param router Routeur permettant d'effectuer une redirection
   * @param modalController Contrôleur permettant d'afficher des messages d'erreurs
   */
  constructor(private utilisateursServices : UtilisateursService, private activatedRoute: ActivatedRoute, private router: Router, private modalController: ModalController) { }

  /**
   * Méthode appeler sur l'initialisation de la page permettant d'envoyer les données de l'utilisateur à la page
   */
  ngOnInit() {
    // Obtenir l'Id de l'utilisateur à afficher des paramètres de l'URL
    this.utilisateurId = parseInt((this.activatedRoute.snapshot.paramMap.get('id') as string));
    // Obtenir l'utilisateur à afficher selon son Id et l'envoyer dans la page
    this.utilisateursServices.getUtilisateur(this.utilisateurId).subscribe( {
      next: (res: ApiResponse<Utilisateur>) => {
        res.data ? this.utilisateur = res.data : '';
        // Désactiver le chargement des données
        this.chargement = false;
      },
      error: () => {
        this.afficherErreur();
        this.chargement = false;
      }
    });
  }

  /**
   * Méthode permettant d'obtenir l'ensemble des utilisateurs au chargement de la page
   */
  ionViewWillEnter(){
    // Vérifier si les données sont déjà chargées
    this.chargement = this.utilisateur.id === 0;
  }

  /**
   * Méthode permettant d'arrêter l'abonnement à l'observable contenant les utilisateurs quand la page est fermée
   */
  ionViewWillLeave(){
    this.observable$.unsubscribe()
  }

  /**
   * Méthode permettant de supprimer un utilisateur
   * @param id Id de l'utilisateur à supprimer
   */
  delete(id: number) {
    this.utilisateursServices.deleteUtilisateur(id).subscribe( {
      next : () => this.router.navigateByUrl('/utilisateurs').then(r => true),
      error: () => {
        this.afficherErreur();
      }
    });
  }

  /**
   * Méthode permettant d'invoquer un modal pour confirmer la suppression d'un utilisateur
   * @param utilisateur Utilisateur dont les données seront affichées dans le modal
   */
  async confirmSuppression(utilisateur : Utilisateur) {
    // Création du modal de suppression
    const modal = await this.modalController.create({
      component: ModalConfirmerSuppressionComponent,
      componentProps: {'message' : `Souhaitez-vous vraiment supprimer l'utilisateur ${utilisateur?.nom}, ${utilisateur?.prenom}?`}
    });
    // Attendre pour l'affichage du modal de suppression
    await modal.present();
    const { role } = await modal.onWillDismiss();
    // Si la confirmation est effectuée, supprimer l'utilisateur
    if (role === 'confirm') {
      this.delete(utilisateur.id);
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
