import {Component, OnInit} from '@angular/core';
import {PlanCours} from '../../../models/planCours/plan-cours';
import {PlanCoursService} from '../../../services/planCours/plan-cours.service';
import {Subscription} from 'rxjs';
import {ModalController} from '@ionic/angular';
import {ApiResponse} from '../../../models/authentification/api-response';
import {PlanCadres} from '../../../models/planCadres/plan-cadres';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
import {ProgrammeService} from '../../../services/programmes/programme.service';
import {Programme} from '../../../models/programmes/programme';
import {AuthService} from '../../../services/auth.service';

/**
 * Page permettant d'afficher la liste des plans de cours
 * @author Emeric Chauret
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-liste-plans-cours',
  templateUrl: './liste-plans-cours.page.html',
  styleUrls: ['./liste-plans-cours.page.scss'],
})
export class ListePlansCoursPage implements OnInit {

  // Initialisation des variables
  maxBreadcrumbs = 4;                           // nombre maximum d'objets dans le fil d'arianne
  programmeId = 0;                              // l'identifiant du programme
  plansCours: PlanCours[] = [];                          // liste des plans de cours
  observablePlansCours$!: Subscription;                  // un observable pour la liste des plans de cours
  selectionFiltragePlansCours = 'tousPlanCours';  // option sélectionnée pour le filtrage des plans de cours
  chargement = false;                           // variable permettant d'effectuer la gestion du chargement des données
  plansCoursAffiches: PlanCours[] = [];                 // la liste des plans de cours à afficher
  recherche!: FormControl;                              // formcontrol pour la barre de recherche
  filtre!: FormControl;                                 // formcontrol pour le filtre
  observableProgramme$!: Subscription;                  // un observable pour le programme sélectionné
  programme!: Programme;

  /**
   * Constructeur
   * @param planCoursService service injecté PlanCoursService
   * @param programmeService service injecté ProgrammeService
   * @param modalCtrl service injecté ModalController
   * @param activatedRoute service injecté ActivatedRoute
   * @param authService service injecté AuthService
   * @param router service injecté Router
   * @author Emeric Chauret
   */
  constructor(private planCoursService: PlanCoursService, private programmeService: ProgrammeService, private modalCtrl: ModalController, private activatedRoute: ActivatedRoute, public authService: AuthService, private router: Router) { }

  ngOnInit(){
    this.recherche = new FormControl('');
    this.filtre = new FormControl('tousPlanCours');
  }

  /**
   * Méthode qui s'exécute avant le chargement de la page.
   * @author Emeric Chauret
   */
  ionViewWillEnter(){
    this.programmeId = parseInt((this.activatedRoute.snapshot.paramMap.get('programme_id') as string)); // Récupérer l'identifiant du programme dans la requête http
    this.getProgramme(this.programmeId);
    this.getPlansCours(this.programmeId); // Récupérer la liste des plans de cours dans la bd
    // Vérifier si les données sont déjà chargées
    this.chargement = this.plansCours.length === 0;
  }

  /**
   * Méthode qui s'exécute lorsqu'on quitte la page.
   * Elle effectue la désinscription de l'observable.
   * @author Emeric Chauret
   */
  ionViewWillLeave(){
    this.observablePlansCours$.unsubscribe();
    this.selectionFiltragePlansCours = 'tousPlanCours';
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
        this.afficherErreur('Un problème est survenu lors du chargement des plans de cours.');
        this.chargement = false;
        this.router.navigate(['/programmes']).then(r => true);
      }
    });
  }

  /**
   * Appel la méthode du service des plans de cours qui permet de
   * récupérer la liste de plans de cours.
   * Puis, attends avant de donner une valeur à la variable plansCours.
   * @param programme_id l'identifiant du programme (number)
   * @author Emeric Chauret
   * @author Jonathan Carrière
   */
  getPlansCours(programme_id: number){
    this.observablePlansCours$ = this.planCoursService.getPlansCours(programme_id).subscribe({
      next: (res: ApiResponse<PlanCours[]>) => {
        // Obtenir la liste des plans de cours du service
        res.data ? this.plansCours = res.data : '';
        // Attribuer la liste des plans de cours à la liste filtrée pour l'affichage
        this.plansCoursAffiches = this.plansCours.slice();
        // désactiver le chargement des données
        this.chargement = false;
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargement des plans de cours.');
        this.chargement = false;
        this.router.navigate(['/programmes']).then(r => true);
      }});
  }

  /**
   * Méthode permettant de filtrer les plans de cours selon le statut d'approbation sélectionné dans le menu déroulant et le texte entré dans la barre de recherche
   * @author Jonathan Carrière  et Emeric Chauret
   */
  filtrerPlansCours() {
    // récupérer le texte entré dans la barre de recherche
    const texteRecherche = this.recherche.value.toLowerCase();
    // filtrer la liste des plans de cours selon le texte entré dans la barre de recherche
    this.plansCoursAffiches = this.plansCours.filter(pc =>
      pc.plan_cadre?.code.toLowerCase().trim().includes(texteRecherche) || pc.plan_cadre?.titre.toLowerCase().trim().includes(texteRecherche) || pc.plan_cadre?.ponderation.toLowerCase().trim().includes(texteRecherche) || pc.plan_cadre?.competences.some(c => c.competence.code.toLowerCase().trim().includes(texteRecherche))
    );
    // filtrer la liste des plans de cours selon l'option sélectionnée dans le menu déroulant
    switch (this.filtre.value) {
      case 'planCoursApprouves':
        this.plansCoursAffiches = this.plansCoursAffiches.filter(pc => pc.approbation !== null);
        break;
      case 'planCoursNonApprouves':
        this.plansCoursAffiches = this.plansCoursAffiches.filter(pc => pc.approbation === null);
        break;
    }
  }

  /**
   * Méthode pour afficher le bon format du titre du plan cadre
   * @param planCadre Le plan cadre duquel afficher le titre formaté
   */
  public assemblerTitrePlanCadre(planCadre:PlanCadres){
    const competences = planCadre.competences.map(competence=>competence.competence.code).join(', ');
    return planCadre.code + ' ' + planCadre.titre + ' ' + planCadre.ponderation + ' (' + competences + ')';
  }

  /**
   * Fonction pour étendre le fil d'arianne
   * @author Emeric Chauret
   */
  expandBreadcrumbs() {
    this.maxBreadcrumbs = 20;
  }

  /**
   * Méthode permettant d'afficher un modal pour la gestion des erreurs.
   * @param message le message d'erreur à afficher (string)
   * @author Jonathan Carrière
   */
  afficherErreur(message: string) {
    const modalErreur = this.modalCtrl.create({
      component: ModalErreurServeurComponent
    });
    modalErreur.then(modal => modal.present());
  }

}
