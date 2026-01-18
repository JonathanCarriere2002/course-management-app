import {Component, OnInit} from '@angular/core';
import {PlanCours} from '../../../models/planCours/plan-cours';
import {Subscription} from 'rxjs';
import {PlanCoursService} from '../../../services/planCours/plan-cours.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {PlanCadresService} from '../../../services/planCadres/plan-cadres.service';
import {PlanCadres} from '../../../models/planCadres/plan-cadres';
import {Enseignant} from '../../../models/enseignants/enseignant';
import {EnseignantsService} from '../../../services/enseignants/enseignants.service';
import {SessionsService} from '../../../services/sessions/sessions.service';
import {Session} from '../../../models/sessions/session';
import {ElementCompetence} from '../../../models/elementsCompetences/element-competence';
import {ElementCompetenceService} from '../../../services/elementsCompetences/element-competence.service';
import {Campus} from '../../../models/campus/campus';
import {CampusService} from '../../../services/campus/campus.service';
import {SectionFormulaire} from '../../../models/sectionFormulaire/section-formulaire';
import {ApiResponse} from '../../../models/authentification/api-response';
import {RechercheComboBoxRadioComponent} from '../../partage/components/recherche-combo-box-radio/recherche-combo-box-radio.component';
import {Gabarit} from '../../../models/gabarit/gabarit';
import {GabaritService} from '../../../services/gabarit/gabarit.service';
import {Section} from '../../../models/section/section';
import {ModalConfirmerSuppressionComponent} from '../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
import {Programme} from '../../../models/programmes/programme';
import {ProgrammeService} from '../../../services/programmes/programme.service';

/**
 * Page pour le formulaire d'ajout ainsi que de modification pour les plans de cours
 * @author Emeric Chauret
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-formulaire-liste-plans-cours',
  templateUrl: './formulaire-plan-cours.page.html',
  styleUrls: ['./formulaire-plan-cours.page.scss'],
})
export class FormulairePlanCoursPage implements OnInit {

  // Initialisation des variables
  maxBreadcrumbs = 6;                                  // nombre maximum d'objets dans le fil d'arianne
  plansCadres: PlanCadres[] = [];                              // la liste des plans-cadres
  sessions: Session[] = [];                                    // la liste des sessions
  campus: Campus[] = [];                                       // la liste des campus
  lsEnseignants: Enseignant[] = [];                            // la liste des enseignants
  lsElementsCompetences: ElementCompetence[] = [];             // la liste des éléments de compétences
  observablePlanCours$!: Subscription;                         // un observable pour le plan de cours à modifier
  observablePlansCadres$!: Subscription;                       // un observable pour la liste des plans-cadres
  observableEnseignants$!: Subscription;                       // un observable pour la liste des enseignants
  observableElementsCompetences$!: Subscription;               // un observable pour la liste des éléments de compétences
  observableSessions$!: Subscription;                          // un observable pour la liste des sessions
  observableCampus$!: Subscription;                            // un observable pour la liste des campus
  observableGabarit$!: Subscription;                           // un observable pour le gabarit
  planCoursForm!: FormGroup;                                   // formulaire complet du plan de cours
  programmeId = 0;                                    // l'identifiant du programme
  planCoursId = 0;                                    // l'identifiant du plan de cours à modifier
  formModif = false;                                  // indique si le formulaire est en mode modification
  planCadreSelectionne = false                        // indique si un plan-cadre est sélectionné pour le plan de cours
  planCours: PlanCours  = {                                    // le plan de cours à créer ou modifier
    'id': 0,
    'plan_cadre': null,
    'campus': null,
    'session': null,
    'enseignants': [],
    'sections': [],
    'semaines_cours': [],
    'approbation': null,
    'complet': false
  };
  elementsCompetencesSelectionnes: ElementCompetence[] = [];   // liste des éléments de compétences sélectionnés via le modal de sélection
  observableProgramme$!: Subscription;                         // un observable pour le programme sélectionné
  programme! : Programme;

  /**
   * Constructeur de la page pour le formulaire des plans de cours
   * @param planCoursService service associé aux plans de cours
   * @param planCadresService service associé aux plans-cadres
   * @param elementsCompetencesService service associé aux éléments de compétences
   * @param enseignantsService service associé aux enseignants
   * @param sessionsService service associé aux sessions
   * @param campusService service associé aux campus
   * @param gabaritService service associé aux gabarits
   * @param programmeService service associé aux programmes
   * @param formBuilder constructeur pour le formulaire
   * @param activatedRoute router permettant d'obtenir des données sur la route en utilisation
   * @param modalCtrl contrôleur pour le modal de sélection
   * @param router router permettant de gérer la navigation
   * @author Emeric Chauret
   */
  constructor(private planCoursService: PlanCoursService, private planCadresService: PlanCadresService, private elementsCompetencesService: ElementCompetenceService, private enseignantsService: EnseignantsService, private sessionsService: SessionsService, private campusService: CampusService, private gabaritService: GabaritService, private programmeService: ProgrammeService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private modalCtrl: ModalController, private router: Router) { }

  /**
   * Méthode appeler sur l'initialisation de la page permettant de construire le formulaire et charger les données
   * @author Emeric Chauret
   */
  ngOnInit() {
    // Création du formulaire pour le plan de cours
    this.planCoursForm = this.formBuilder.group({
      plan_cadre: ['', Validators.required],
      session: ['', Validators.required],
      campus: ['', Validators.required],
      enseignants: this.formBuilder.array([]),
      sections: this.formBuilder.array([]),
      semaines_cours: this.formBuilder.array([])
    });
  }

  // Méthodes qui permettent de récupérer les controls dans le formulaire
  // @author Emeric Chauret
  get champPlanCadre() { return this.planCoursForm.get('plan_cadre'); }
  get champCampus() { return this.planCoursForm.get('campus'); }
  get champSession() { return this.planCoursForm.get('session'); }

  /**
   * Méthode qui s'exécute avant le chargement de la page.
   */
  ionViewWillEnter(){
    this.getPlansCadres();         // Récupérer la liste des plans-cadres
    this.getEnseignants();         // Récupérer la liste des enseignants
    this.getSessions();            // Récupérer la liste des sessions
    this.obtenirTousLesCampus();   // Récupérer la liste des campus
    this.getElementsCompetences(); // Récupérer la liste des éléments de compétences

    // Récupérer l'identifiant du programme et du plan de cours dans l'url
    this.programmeId = parseInt((this.activatedRoute.snapshot.paramMap.get('programme_id') as string)); // Récupérer l'identifiant du programme dans la requête http
    this.planCoursId = parseInt((this.activatedRoute.snapshot.paramMap.get('plan_cours_id') as string)); // Récupérer l'identifiant du plan de cours à modifier dans la requête http
    if (this.planCoursId && this.programmeId) {
      this.getPlanCours(this.programmeId, this.planCoursId); // Récupérer le plan de cours dans la bd
      this.formModif = true;
    }
    if(!this.formModif){
      this.obtenirGabaritParId(1); // Récupérer le gabarit pour les plans de cours
    }
    this.getProgramme(this.programmeId); // Récupérer le programme dans la bd
  }

  /**
   * Méthode qui s'exécute lorsqu'on quitte la page.
   * Elle effectue la désinscription des observables.
   */
  ionViewWillLeave(){
    if(this.observablePlanCours$){
      this.observablePlanCours$.unsubscribe();
    }
    this.observablePlansCadres$.unsubscribe();
    this.observableEnseignants$.unsubscribe();
    this.observableSessions$.unsubscribe();
    this.observableCampus$.unsubscribe();
    this.observableElementsCompetences$.unsubscribe();
  }

  /**
   * Méthode qui détermine si une option est sélectionnée en comparant les propriétés de l'option dans le select à celles du modèle.
   * @param a la valeur du modèle (Campus)
   * @param b la valeur de l'option dans le select (Campus)
   */
  comparerCampus(a:Campus, b:Campus){
    return a?.id === b.id;
  }

  /**
   * Méthode qui détermine si une option est sélectionnée en comparant les propriétés de l'option dans le select à celles du modèle.
   * @param a la valeur du modèle (Session)
   * @param b la valeur de l'option dans le select (Session)
   */
  comparerSession(a:Session, b:Session){
    return a?.id === b.id;
  }

  /**
   * Appel la méthode du service des programmes qui
   * permet de récupérer un programme.
   * @param programme_id l'identifiant du programme à récupérer (number)
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
   * Appel la méthode du service des enseignants qui permet de
   * récupérer la liste des enseignants dans la bd.
   * Puis, attends avant de donner une valeur à la variable lsEnseignants.
   * @author Jonathan Carrière
   * @author Emeric Chauret
   */
  getEnseignants() {
    this.observableEnseignants$ = this.enseignantsService.getEnseignants().subscribe( {
      next: (res: ApiResponse<Enseignant[]>) => {
        res.data ? this.lsEnseignants = res.data : '';
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargement du plan de cours.');
        this.router.navigate(['/programme', this.programmeId, 'plans-cours']);
      }
    });
  }

  /**
   * Obtenir la liste des éléments de compétences directement du service
   * @author Jonathan Carrière  + lebel
   */
  getElementsCompetences() {
    // Obtenir la liste des éléments de compétences du service
    this.observableElementsCompetences$ = this.elementsCompetencesService.getElementsComptetence().subscribe({
      next: (res : ApiResponse<ElementCompetence[]>) => {
        res.data ? this.lsElementsCompetences = res.data : '';
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargement du plan de cours.');
        this.router.navigate(['/programme', this.programmeId, 'plans-cours']);
      }
    });
  }

  /**
   * Appel la méthode du service des sessions qui permet de
   * récupérer la liste des campus dans la bd.
   * Puis, attends avant de donner une valeur à la variable campus.
   * @author Emeric Chauret
   */
  obtenirTousLesCampus() {
    this.observableCampus$ = this.campusService.obtenirTousLesCampus().subscribe({
      next: (res: ApiResponse<Campus[]>) => {
        res.data ? this.campus = res.data : '';
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargement du plan de cours.');
        this.router.navigate(['/programme', this.programmeId, 'plans-cours']);
      }})
  }

  /**
   * Appel la méthode du service des sessions qui permet de
   * récupérer la liste des sessions dans la bd.
   * Puis, attends avant de donner une valeur à la variable session.
   * @author Jonathan Carrière
   * @author Emeric Chauret
   */
  getSessions() {
    this.observableSessions$ = this.sessionsService.getSessions().subscribe( {
      next: (res: ApiResponse<Session[]>) => {
        res.data ? this.sessions = res.data : '';
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargement du plan de cours.');
        this.router.navigate(['/programme', this.programmeId, 'plans-cours']);
      }
    });
  }

  /**
   * Appel la méthode du service des plans de cadres qui permet de
   * récupérer la liste des plans-cadres dans la bd.
   * Puis, attends avant de donner une valeur à la variable plansCadres.
   * @author Emeric Chauret
   */
  getPlansCadres() {
    this.observablePlansCadres$ = this.planCadresService.getPlanCadres().subscribe({
      next: res => {
        if(res.data) {
          this.plansCadres = res.data
        }
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargement du plan de cours.');
        this.router.navigate(['/programme', this.programmeId, 'plans-cours']).then(r => true);
      }
    });
  }

  /**
   * Appel la méthode du service des gabarits qui permet de récupérer le gabarit ayant l'identifiant id dans la bd
   * @param id l'identifiant du gabarit à récupérer
   * @author Emeric Chauret
   */
  obtenirGabaritParId(id: number) {
    this.observableGabarit$ = this.gabaritService.obtenirGabaritParId(id).subscribe({
      next: (res: ApiResponse<Gabarit>) => {
        if (res.data) {
          res.data.sections.forEach((s: Section) => {
            const section = {
              id: s.id,
              titre: s.titre,
              info_suppl: s.info_suppl ?? '',
              aide: s.aide ?? '',
              texte: '',
              obligatoire: s.obligatoire,
              type_section_id: s.type_section_id
            }
            this.planCours.sections.push(section);
            this.creerSectionFormGroup(section);
          });
        }
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargement du plan de cours.');
        this.router.navigate(['/programme', this.programmeId, 'plans-cours']).then(r => true)
      }
    });
  }

  /**
   * Appel la méthode du service du plan de cours qui permet de
   * récupérer le plan de cours ayant l'identifiant id dans la bd.
   * Puis, attends avant de donner une valeur à la variable planCours.
   * @param programme_id l'identifiant du programme (number)
   * @param plan_cours_id l'identifiant du plan de cours à récupérer (number)
   * @author Emeric Chauret
   * @author Jonathan Carrière
   */
  getPlanCours(programme_id: number, plan_cours_id: number) {
    this.observablePlanCours$ = this.planCoursService.getPlanCours(programme_id, plan_cours_id).subscribe({
      next: (res: ApiResponse<PlanCours>) => {
        // Insérer les données du plan de cours dans le formulaire
        if (res.data) {
          this.planCours = res.data;
          this.formModif = true;
          this.planCadreSelectionne = true;
          this.champPlanCadre?.setValue(this.planCours.plan_cadre);
          this.planCoursForm.patchValue(this.planCours);
          this.planCours.sections.map((section: SectionFormulaire) => this.creerSectionFormGroup(section));
          // Mettre à jour la liste des éléments de compétences selon le plan-cadre du plan de cours
          if (this.planCours.plan_cadre != null) {
            this.updateListeElementsCompetences(this.planCours.plan_cadre);
          }
        }
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargement du plan de cours.');
        this.router.navigate(['/programme', this.programmeId, 'plans-cours']);
      }
    });
  }

  /**
   * Méthode qui récupère le form array sections dans le formulaire
   * @author Emeric Chauret
   */
  get formArraySections() {
    return this.planCoursForm.get('sections') as FormArray;
  }

  /**
   * Méthode qui créer un form group dans le form array sections.
   * Elle lie les informations de la section en paramètre aux valeurs des form control
   * @param section la section à mapper à un form group (SectionFormulaire)
   * @author Emeric Chauret
   */
  creerSectionFormGroup(section: SectionFormulaire){
    this.formArraySections.push(this.formBuilder.group({
      id: [section.id, Validators.required],
      texte: [section.texte],
    }));
  }

  /**
   * Appel la méthode du service des plans de cours qui permet de
   * créer un nouveau plan de cours.
   * Puis, redirige vers la liste des plans de cours.
   * @author Emeric Chauret
   */
  createPlanCours(){
    this.planCoursService.createPlanCours(this.programmeId, this.planCoursForm.value).subscribe({
      next: () => this.router.navigate(['/programme', this.programmeId, 'plans-cours']),
      error: () => {
        this.afficherErreur('Un problème est survenu lors de la création du plan de cours.');
      }
    });
  }

  /**
   * Appel la méthode du service des plans de cours qui permet de
   * modifier un plan de cours dans la bd.
   * Puis, redirige vers la liste des plans de cours.
   * @author Emeric Chauret
   */
  updatePlanCours(){
    this.planCoursService.updatePlanCours(this.programmeId, this.planCoursId, this.planCoursForm.value).subscribe({
      next: () => this.router.navigate(['/programme', this.programmeId, 'plans-cours']),
      error: () => {
        this.afficherErreur('Un problème est survenu lors de la modification du plan de cours.');
      }
    });
  }

  /**
   * Méthode qui appelle le modal pour choisir un plan-cadre à lier au plan de cours.
   * @author Emeric Chauret
   * @author Jonathan Carrière
   */
  async ouvrirModalPlansCadres() {
    // Crée le modal
    const modal = await this.modalCtrl.create({
      component: RechercheComboBoxRadioComponent,
      componentProps: {
        'titre' : 'Plans-cadres',
        'objetsRecherche' : this.plansCadres.map(pc => ({ text: `(${pc.code}) ${pc.titre}`, value: pc.id })),
        'valeurActuelle' : this.champPlanCadre?.value ? this.champPlanCadre?.value['id'] : ''
      }
    });
    // Affiche le modal
    await modal.present();
    // Récupérer les données du modal avant qu'il disparaisse
    const { data, role } = await modal.onWillDismiss();
    // Si l'utilisateur a confirmé
    if (role === 'confirme') {
      const planCadre = this.plansCadres.find(pc => pc.id === data.value);
      // Si le plan-cadre a été trouvé par le service
      if (planCadre) {
        // Attribué la valeur du plan-cadre trouvé au champ dans le formulaire
        this.champPlanCadre?.setValue(planCadre);
        // Mettre à jour la liste des éléments de compétences
        this.updateListeElementsCompetences(planCadre);
      }
      this.planCadreSelectionne = true;
    }
    this.champPlanCadre?.markAsTouched();
  }

  /**
   * Méthode permettant de mettre à jour la liste des éléments de compétences pouvant être sélectionnés pour les semaines de cours selon le plan-cadre sélectionné
   * @param planCadre Plan-cadre sélectionné pour le plan de cours dans le formulaire
   * @author Jonathan Carrière
   */
  updateListeElementsCompetences(planCadre: PlanCadres) {
    // Vérifier que la liste des éléments de compétences du plan-cadre est existante
    if (planCadre.elementsCompetences != undefined) {
      // Liste contenant les identifiants des éléments de compétences du plan-cadre sélectionné
      const listeIdElementsCompetencesPlanCadre = planCadre.elementsCompetences.map(lienElementCompetence => lienElementCompetence.elementCompetence.id);
      // Liste de formArray des semaines de cours dans le formulaire du plan de cours
      const semainesCoursFormArray = this.planCoursForm.get('semaines_cours') as FormArray;
      // Parcourir la liste de formArray des semaines de cours dans le formulaire du plan de cours
      for (let semaineCoursIndex = 0; semaineCoursIndex < semainesCoursFormArray.length; semaineCoursIndex++) {
        // Obtenir le formArray des éléments de compétences pour une semaine de cours spécifique
        const elementsCompetencesFormArray = semainesCoursFormArray.at(semaineCoursIndex).get('elementsCompetences') as FormArray;
        // Filtrer le formArray pour les éléments compétences afin de retirer les éléments de compétences qui ne sont pas associés au plan-cadre sélectionné
        const listeElementsCompetencesFiltrer = elementsCompetencesFormArray.controls.filter(control => {
          const elementCompetenceId = control.get('id')?.value;
          return listeIdElementsCompetencesPlanCadre.includes(elementCompetenceId);
        });
        // Mettre à jour le formArray pour les éléments de compétences du formArray pour la semaine de cours
        elementsCompetencesFormArray.clear();
        listeElementsCompetencesFiltrer.forEach(filteredElementCompetence => elementsCompetencesFormArray.push(filteredElementCompetence));
      }
      // Mettre à jour la liste des éléments de compétences disponibles à sélectionner
      this.lsElementsCompetences = planCadre.elementsCompetences.map(lienElementCompetence => ({
          id: lienElementCompetence.elementCompetence.id,
          numero: lienElementCompetence.elementCompetence.numero,
          texte: lienElementCompetence.elementCompetence.texte,
          criteresPerformance: lienElementCompetence.elementCompetence.criteresPerformance,
          isExpanded: false
      }));
    }
  }

  /**
   * Méthode qui affiche le modal pour confirmer l'annulation de la création ou modification du plan de cours'.
   * @author Emeric Chauret
   */
  async ouvrirModalConfirmerAnnulation() {

    // Crée le modal
    const modal = await this.modalCtrl.create({
      component: ModalConfirmerSuppressionComponent,
      componentProps: {'message' : `Souhaitez-vous vraiment annuler la ${this.formModif ? 'modification' : 'création'} du plan de cours ?`}
    });

    // Affiche le modal
    await modal.present();

    // Récupérer les données du modal avant qu'il disparaisse
    const { role } = await modal.onWillDismiss();

    // Si l'utilisateur a confirmé l'annulation'
    if (role === 'confirm') {
      // rediriger vers la liste des plans de cours du programme
      this.router.navigate(['/programme', this.programmeId, 'plans-cours']).then(r => true)
    }
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
