import { Component } from '@angular/core';
import {PlanCoursService} from '../../../services/planCours/plan-cours.service';
import {PlanCours} from '../../../models/planCours/plan-cours';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ApiResponse} from '../../../models/authentification/api-response';
import {PlanCadres} from '../../../models/planCadres/plan-cadres';
import {ModalConfirmerSuppressionComponent} from '../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';
import {ModalController} from '@ionic/angular';
import {Programme} from '../../../models/programmes/programme';
import {ProgrammeService} from '../../../services/programmes/programme.service';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
import {AuthService} from '../../../services/auth.service';

/**
 * Page permettant d'afficher les détails d'un plan de cours
 * @author Emeric Chauret
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-details-plan-cours',
  templateUrl: './details-plan-cours.page.html',
  styleUrls: ['./details-plan-cours.page.scss'],
})
export class DetailsPlanCoursPage {

  // Initialisation des variables
  maxBreadcrumbs = 5;           // nombre maximum d'objets dans le fil d'arianne
  programmeId = 0;              // l'identifiant du programme
  planCoursId = 0;              // l'identifiant du plan de cours affiché
  planCours: PlanCours  = {              // le plan de cours affiché
    'id': 0,
    'plan_cadre': null,
    'campus': null,
    'session': null,
    'enseignants': [],
    'sections': [],
    'semaines_cours': [],
    'approbation': new Date(),
    'complet': false
  };
  observablePlanCours$!: Subscription;  // un observable pour le plan de cours affiché
  observableProgramme$!: Subscription;  // un observable pour le programme sélectionné
  programme!: Programme;                 // le programme sélectionné

  /**
   * Constructeur
   * @param planCoursService service injecté PlanCoursService
   * @param programmeService service injecté ProgrammeService
   * @param activatedRoute service injecté ActivatedRoute
   * @param router service injecté Router
   * @param modalCtrl service injecté ModalController
   * @param authService service injecté AuthService
   * @author Emeric Chauret
   * @author Jonathan Carrière
   */
  constructor(private planCoursService: PlanCoursService, private programmeService: ProgrammeService, private activatedRoute: ActivatedRoute, private router: Router, private modalCtrl: ModalController, public authService: AuthService) { }

  /**
   * Méthode qui s'exécute avant le chargement de la page.
   * @author Emeric Chauret
   */
  ionViewWillEnter(){
    // Récupérer l'identifiant du programme dans la requête http
    this.programmeId = parseInt((this.activatedRoute.snapshot.paramMap.get('programme_id') as string));
    // Récupérer l'identifiant du plan de cours à afficher dans la requête http
    this.planCoursId = parseInt((this.activatedRoute.snapshot.paramMap.get('plan_cours_id') as string));
    if(this.planCoursId && this.programmeId){
      // Récupérer le programme dans la bd
      this.getProgramme(this.programmeId);
      // Récupérer le plan de cours dans la bd
      this.getPlanCours(this.programmeId, this.planCoursId);
    }
  }

  /**
   * Méthode qui s'exécute lorsqu'on quitte la page.
   * Elle effectue la désinscription des observables.
   * @author Emeric Chauret
   */
  ionViewWillLeave(){
    this.observablePlanCours$.unsubscribe();
  }

  /**
   * Appel la méthode du service des programmes qui
   * permet de récupérer un programme.
   * @param programme_id l'identifiant du programme à récupérer (number)
   * @author Emeric Chauret
   */
  getProgramme(programme_id: number){
    this.observableProgramme$ = this.programmeService.getProgramme(programme_id).subscribe({
      next: (res: ApiResponse<Programme>)=> {
        if(res.data){
          this.programme = res.data;
        }
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargement du plan de cours.');
        this.router.navigate(['/programme', this.programmeId, 'plans-cours']);
      }
    });
  }

  /**
   * Appel la méthode du service des plans de cours qui permet de
   * récupérer le plan de cours ayant l'identifiant id dans la bd.
   * Puis, attends avant de donner une valeur à la variable planCours.
   * @param programme_id l'identifiant du programme (number)
   * @param plan_cours_id l'identifiant du plan de cours à récupérer (number)
   * @author Emeric Chauret
   * @author Jonathan Carrière
   */
  getPlanCours(programme_id: number, plan_cours_id: number){
    this.observablePlanCours$ = this.planCoursService.getPlanCours(programme_id, plan_cours_id).subscribe({
      next: (res: ApiResponse<PlanCours>) => {
        res.data ? this.planCours = res.data : '';
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargement du plan de cours.');
        this.router.navigate(['/programme', this.programmeId, 'plans-cours']);
      }
      });
  }

  /**
   * Appel la méthode du service du plan de cours qui permet de
   * supprimer un plan de cours.
   * Puis, redirige vers la liste des plans de cours du programme.
   * @param plan_cour_id l'identifiant du plan de cours à supprimer (number)
   * @author Emeric Chauret
   * @author Jonathan Carrière
   */
  deletePlanCours(plan_cour_id: number){
    this.planCoursService.deletePlanCours(this.programmeId, plan_cour_id).subscribe({
      next : () => this.router.navigate(['/programme', this.programmeId, 'plans-cours']),
      error: () => this.afficherErreur('Un problème est survenu lors de la suppression du plan de cours.')
    });
  }

  /**
   * Méthode qui affiche le modal pour confirmer la suppression d'un plan de cours.
   * @author Emeric Chauret
   */
  async ouvrirModalConfirmerSuppression() {

    // Crée le modal
    const modal = await this.modalCtrl.create({
      component: ModalConfirmerSuppressionComponent,
      componentProps: {'message' : `Souhaitez-vous vraiment supprimer le plan de cours ${this.assemblerTitrePlanCadre(this.planCours.plan_cadre)}?`}
    });

    // Affiche le modal
    await modal.present();

    // Récupérer les données du modal avant qu'il disparaisse
    const { role } = await modal.onWillDismiss();

    // Si l'utilisateur a confirmé la suppression du plan de cours
    if (role === 'confirm') {
      // supprimer le plan de cours
      this.deletePlanCours(this.planCours.id);
    }
  }

  /**
   * Méthode pour afficher le bon format du titre du plan cadre
   * @param planCadre Le plan cadre duquel afficher le titre formatté
   * @author jacob Beauregard-Tousignant
   */
  public assemblerTitrePlanCadre(planCadre:PlanCadres | null){
    if(planCadre){
      const competences = planCadre.competences.map(competence=>competence.competence.code).join(', ');
      return planCadre.code + ' ' + planCadre.titre +' '+ planCadre.ponderation + ' (' + competences + ')';
    }
    return '';
  }

  /**
   * Fonction pour étendre le fil d'arianne
   * @author Emeric Chauret
   */
  expandBreadcrumbs() {
    this.maxBreadcrumbs = 20;
  }

  /**
   * Méthode permettant d'afficher un modal pour la gestion des erreurs
   * @param message le message d'erreur à afficher (string)
   * @author Jonathan Carrière
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

}
