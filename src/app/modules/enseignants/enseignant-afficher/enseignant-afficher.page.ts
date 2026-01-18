import {Component, OnInit} from '@angular/core';
import {Enseignant} from '../../../models/enseignants/enseignant';
import {Subscription} from 'rxjs';
import {EnseignantsService} from '../../../services/enseignants/enseignants.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiResponse} from '../../../models/authentification/api-response';
import {ModalController} from '@ionic/angular';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
import {ModalConfirmerSuppressionComponent} from '../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';
import {AuthService} from '../../../services/auth.service';

/**
 * Classe permettant d'effectuer la gestion de la page associée aux détails d'un enseignant
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-enseignant-afficher',
  templateUrl: './enseignant-afficher.page.html',
  styleUrls: ['./enseignant-afficher.page.scss'],
})
export class EnseignantAfficherPage implements OnInit {
  // Liste des enseignants
  enseignants : Enseignant[] = []
  // Id de l'enseignant qui sera affiché
  enseignantId  = 0;
  // Enseignant qui sera affiché
  enseignant: Enseignant = { id: 0, prenom: '', nom: '', courriel: '', bureau: '', poste: 0 };
  // Observable permettant d'effectuer la gestion des données de la page
  observable$! : Subscription;
  // Effectuer la gestion du chargement de la page
  chargement = false;
  // Quantité maximale pour les breadcrumbs
  maxBreadCrumbs = 4;

  /**
   * Constructeur de la page associé à l'affichage des enseignants
   * @param enseignantsServices Service permettant d'effectuer la gestion des enseignants
   * @param activatedRoute Routeur permettant d'obtenir des informations sur la route en utilisation, comme les données des paramètres
   * @param router Routeur permettant d'effectuer une redirection
   * @param modalController Contrôleur permettant d'afficher des messages d'erreurs
   * @param authService Service permettant d'effectuer la gestion de l'authentification
   */
  constructor(private enseignantsServices : EnseignantsService, private activatedRoute: ActivatedRoute, private router: Router, private modalController: ModalController, public authService : AuthService) { }

  /**
   * Méthode appeler sur l'initialisation de la page permettant d'envoyer les données de l'enseignant à la page
   */
  ngOnInit() {
    // Obtenir l'Id de l'enseignant à afficher des paramètres de l'URL
    this.enseignantId = parseInt((this.activatedRoute.snapshot.paramMap.get('id') as string));
    // Obtenir l'enseignant à afficher selon son Id et l'envoyer dans la page
    this.enseignantsServices.getEnseignant(this.enseignantId).subscribe( {
      next: (res: ApiResponse<Enseignant>) => {
        res.data ? this.enseignant = res.data : '';
        this.chargement = false;
      },
      error: () => {
        this.afficherErreur();
        this.chargement = false;
      }
    });
  }

  /**
   * Méthode au chargement de la page
   */
  ionViewWillEnter(){
    this.chargement = this.enseignant.id === 0;
  }

  /**
   * Méthode permettant de se désabonner de l'observable contenant les enseignants quand la page est fermée
   */
  ionViewWillLeave(){
    this.observable$.unsubscribe()
  }

  /**
   * Méthode permettant de supprimer un enseignant
   * @param id Id de l'enseignant à supprimer
   * @author Jonathan Carrière
   */
  delete(id: number) {
    this.enseignantsServices.deleteEnseignant(id).subscribe( {
      next : () => this.router.navigateByUrl('/enseignants').then(r => true),
      error: () => {
        this.afficherErreur();
      }
    });
  }

  /**
   * Méthode permettant d'invoquer un modal pour confirmer la suppression d'un enseignant
   * @param enseignant Enseignant dont les données seront affichées dans le modal
   * @author Jonathan Carrière
   * @author Samir El Haddaji
   */
  async confirmSuppression(enseignant : Enseignant) {
    // Création du modal de suppression
    const modal = await this.modalController.create({
      component: ModalConfirmerSuppressionComponent,
      componentProps: {'message' : `Souhaitez-vous vraiment supprimer l'enseignant ${enseignant?.nom}, ${enseignant?.prenom}?`}
    });
    // Attendre pour l'affichage du modal de suppression
    await modal.present();
    const { role } = await modal.onWillDismiss();
    // Si la confirmation est effectuée, supprimer l'enseignant
    if (role === 'confirm') {
      this.delete(enseignant.id);
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
