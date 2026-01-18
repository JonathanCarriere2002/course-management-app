import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Session} from '../../../models/sessions/session';
import {SessionsService} from '../../../services/sessions/sessions.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiResponse} from '../../../models/authentification/api-response';
import {ModalController} from '@ionic/angular';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
import {ModalConfirmerSuppressionComponent} from '../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';

/**
 * Classe permettant d'effectuer la gestion du formulaire pour les sessions
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-session-formulaire',
  templateUrl: './session-formulaire.page.html',
  styleUrls: ['./session-formulaire.page.scss'],
})
export class SessionFormulairePage implements OnInit {
  // Id de la session
  sessionId  = 0;
  // Formulaire pour un objet de type 'session'
  sessionForm!: FormGroup;
  // Observable permettant d'effectuer la gestion des données de la page
  observable$ : Subscription = new Subscription();
  // Permet de vérifier si le formulaire doit modifier un objet
  formModification= false;
  // Quantité maximale pour les breadcrumbs
  maxBreadCrumbs = 4;
  // Variable permettant d'effectuer la gestion du chargement des données
  chargement = false;

  /**
   * Constructeur de la page associé au formulaire pour les sessions
   * @param sessionsServices Service permettant d'effectuer la gestion des sessions
   * @param formBuilder Constructeur pour le formulaire réactif pour les sessions
   * @param router Routeur permettant d'effectuer une redirection après que le formulaire est soumis
   * @param activatedRoute Routeur permettant d'obtenir des informations sur la route en utilisation
   * @param modalController Contrôleur permettant d'afficher des messages d'erreurs
   */
  constructor(private sessionsServices : SessionsService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private modalController: ModalController) { }

  /**
   * Méthode appeler sur l'initialisation de la page permettant de rendre le formulaire réactif
   */
  ngOnInit() {
    // Rendre le formulaire pour les sessions réactif
    this.sessionForm = this.formBuilder.group( {
      annee: ['', [Validators.required, Validators.min(1967), Validators.max(2099)]],
      session: ['', [Validators.required, Validators.pattern('^(Automne|Hiver|Été)$')]],
      limite_abandon: ['', [Validators.required]]
    });
  }

  /**
   * Méthode permettant d'obtenir les données d'une session spécifique au chargement de la page
   */
  ionViewWillEnter(){
    this.sessionId = parseInt(this.activatedRoute.snapshot.paramMap.get('id') as string);
    if (this.sessionId) {
      this.chargement = true;
      // Obtenir la session spécifique correspondant à la session
      this.getSession(this.sessionId);
    }
  }

  /**
   * Méthode permettant d'arrêter l'abonnement à l'observable contenant les sessions quand la page est fermée
   */
  ionViewWillLeave(){
    this.observable$.unsubscribe()
  }

  /**
   * Méthode permettant d'obtenir une session spécifique selon son identifiant
   * @param id Identifiant de la session à obtenir
   */
  getSession(id: number) {
    // Obtenir la session recherchée via le service
    this.observable$ = this.sessionsServices.getSession(id).subscribe({
      next: (res: ApiResponse<Session>) => {
        // Si le service retourne une session existante
        if (res.data) {
          // Mettre le formulaire en mode modification
          this.formModification = true;
          // Insérer la session trouvée à l'intérieur des champs correspondants dans le formulaire
          this.sessionForm.patchValue(res.data);
          this.chargement = false;
        }
      },
      error: () => {
        this.afficherErreur();
        this.chargement = false;
      }
    });
  }

  /**
   * Méthode permettant de créer une nouvelle session selon les données du formulaire
   */
  createSession() {
    // Créer une nouvelle session puis effectuer une redirection vers la liste des sessions
    this.sessionsServices.createSession(this.sessionForm.value).subscribe( {
      next : () => this.router.navigate(['/sessions']).then(promesse => true),
      error: () => {
        this.afficherErreur();
      }
    });
  }

  /**
   * Méthode permettant d'effectuer la modification d'une session selon les données du formulaire
   */
  updateSession() {
    // Modifier la session selon les données du formulaire puis effectuer une redirection vers la liste des sessions
    this.sessionsServices.updateSession(this.sessionId, this.sessionForm.value).subscribe( {
      next : () => this.router.navigate(['/sessions']).then(promesse => true),
      error: () => {
        this.afficherErreur();
      }
    });
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

  /**
   * Méthode qui affiche le modal pour confirmer l'annulation de la création ou modification de la session
   * @author Emeric Chauret
   */
  async ouvrirModalConfirmerAnnulation() {
    // Crée le modal
    const modal = await this.modalController.create({
      component: ModalConfirmerSuppressionComponent,
      componentProps: {'message' : `Souhaitez-vous vraiment annuler la ${this.formModification ? 'modification' : 'création'} de la session ?`}
    });
    // Affiche le modal
    await modal.present();
    // Récupérer les données du modal avant qu'il disparaisse
    const { role } = await modal.onWillDismiss();
    // Si l'utilisateur a confirmé l'annulation'
    if (role === 'confirm') {
      // rediriger vers la liste des sessions
      this.router.navigate(['/sessions']).then(r => true)
    }
  }

}
