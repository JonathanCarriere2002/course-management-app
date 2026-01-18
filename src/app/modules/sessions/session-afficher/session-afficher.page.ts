import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Session} from '../../../models/sessions/session';
import {SessionsService} from '../../../services/sessions/sessions.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiResponse} from '../../../models/authentification/api-response';
import {PlanCadres} from '../../../models/planCadres/plan-cadres';
import {ModalController} from '@ionic/angular';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
import {ModalConfirmerSuppressionComponent} from '../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';
import {AuthService} from '../../../services/auth.service';

/**
 * Classe permettant d'effectuer la gestion de la page associée aux détails d'une session
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-session-afficher',
  templateUrl: './session-afficher.page.html',
  styleUrls: ['./session-afficher.page.scss'],
})
export class SessionAfficherPage implements OnInit {
  sessionId  = 0;                                                             // Id de la session qui sera affichée
  observable$! : Subscription;                                                         // Observable permettant d'effectuer la gestion des données de la page
  maxBreadCrumbs = 4;                                                         // Quantité maximale pour les breadcrumbs
  chargement = false;                                                         // Variable permettant d'effectuer la gestion du chargement des données
  session: Session = { id: 0, annee : 0, session : '', limite_abandon : new Date() };  // Session qui sera affichée

  /**
   * Constructeur de la page associé à l'affichage des sessions
   * @param sessionsServices Service permettant d'effectuer la gestion des sessions
   * @param activatedRoute Routeur permettant d'obtenir des informations sur la route en utilisation, comme les données des paramètres
   * @param router Routeur permettant d'effectuer une redirection
   * @param modalController Contrôleur permettant d'afficher des messages d'erreurs
   * @param authService Service permettant d'effectuer la gestion de l'authentification
   */
  constructor(private sessionsServices : SessionsService, private activatedRoute: ActivatedRoute, private router: Router, private modalController: ModalController, public authService : AuthService) { }

  /**
   * Méthode appeler sur l'initialisation de la page permettant d'envoyer les données de la session à la page
   */
  ngOnInit() {
    // Obtenir l'Id de la session à afficher des paramètres de l'URL
    this.sessionId = parseInt((this.activatedRoute.snapshot.paramMap.get('id') as string));
    // Obtenir la session à afficher selon son Id et l'envoyer dans la page
    this.sessionsServices.getSession(this.sessionId).subscribe( {
      next: (res: ApiResponse<Session>) => {
        res.data ? this.session = res.data : '';
        this.chargement = false;
      },
      error: () => {
        this.afficherErreur();
        this.chargement = false;
      }
    });
  }

  /**
   * Méthode pour afficher le bon format du titre d'un plan-cadre ou plan de cours
   * @param planCadre Le plan cadre duquel afficher le titre formaté
   * @author Jacob Beauregard-Tousignant
   */
  public assemblerTitrePlanCadrePlanCours(planCadre:PlanCadres){
    const competences = planCadre.competences.map(competence=>competence.competence.code).join(', ');
    return planCadre.code + ' ' + planCadre.titre + ' '+ planCadre.ponderation + ' (' + competences + ')' ;
  }

  /**
   * Méthode au chargement de la page
   */
  ionViewWillEnter(){
    this.chargement = this.session.id === 0;
  }

  /**
   * Méthode permettant d'arrêter de se désabonner de l'observable contenant les sessions quand la page est fermée
   */
  ionViewWillLeave(){
    this.observable$.unsubscribe()
  }

  /**
   * Méthode permettant de supprimer une session
   * @param id Id de la session à supprimer
   */
  delete(id: number) {
    this.sessionsServices.deleteSession(id).subscribe( {
      next : () => this.router.navigateByUrl('/sessions').then(r => true),
      error: () => {
        this.afficherErreur();
      }
    });
  }

  /**
   * Méthode permettant d'invoquer un modal pour confirmer la suppression d'une session
   * @param session Session dont les données seront affichées dans le modal
   */
  async confirmSuppression(session : Session) {
    // Création du modal de suppression
    const modal = await this.modalController.create({
      component: ModalConfirmerSuppressionComponent,
      componentProps: {'message' : `Souhaitez-vous vraiment supprimer la session ${session?.session} ${session?.annee}?`}
    });
    // Attendre pour l'affichage du modal de suppression
    await modal.present();
    const { role } = await modal.onWillDismiss();
    // Si la confirmation est effectuée, supprimer l'enseignant
    if (role === 'confirm') {
      this.delete(session.id);
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
