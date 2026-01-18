/**
 * @author Jaocb Beauregard-Tousignant & Samir El Haddaji
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import {PlanCadresService} from '../../../services/planCadres/plan-cadres.service';
import {PlanCadres} from '../../../models/planCadres/plan-cadres';
import {Subscription} from 'rxjs';
import {IonModal, ModalController} from '@ionic/angular';
import {
  ModalConfirmerSuppressionComponent
} from '../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CriteresEvaluationsService} from '../../../services/criteresEvaluations/criteres-evaluations.service';
import {RechercheCbo} from '../../../models/RechercheCbo/recherche-cbo';
import {ActivatedRoute, Router} from '@angular/router';

import {ElementCompetenceService} from '../../../services/elementsCompetences/element-competence.service';
import {ElementCompetence} from '../../../models/elementsCompetences/element-competence';
import {CriteresEvaluations} from '../../../models/critereEvaluation/criteres-evaluations';
import {ModalCritereEvalComponent} from '../modal-critere-eval/modal-critere-eval.component';
import {ApiResponse} from '../../../models/authentification/api-response';
import {Programme} from '../../../models/programmes/programme';
import {
  RechercheComboBoxRadioComponent
} from '../../partage/components/recherche-combo-box-radio/recherche-combo-box-radio.component';
import {ProgrammeService} from '../../../services/programmes/programme.service';
import {CompetencesService} from '../../../services/competences/competences.service';
import {Session} from '../../../models/sessions/session';
import {SessionsService} from '../../../services/sessions/sessions.service';
import {
  RechercheComboBoxCheckboxComponent
} from '../../partage/components/recherche-combo-box-checkbox/recherche-combo-box-checkbox.component';
import {GabaritService} from '../../../services/gabarit/gabarit.service';
import {Gabarit} from '../../../models/gabarit/gabarit';
import {Section} from '../../../models/section/section';
import {SectionFormulaire} from '../../../models/sectionFormulaire/section-formulaire';
import {Competence} from '../../../models/competences/competence';
import {LienCompetencesPlansCadres} from '../../../models/lienCompetencesPlansCadres/lien-competences-plans-cadres';
import {AuthService} from '../../../services/auth.service';
import {
  ModalErreurServeurComponent
} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';



@Component({
  selector: 'app-plan-cadres',
  templateUrl: './plan-cadres.page.html',
  styleUrls: ['./plan-cadres.page.scss'],
})
export class PlanCadresPage implements OnInit {

  // Variable pour suivre si le formulaire est en mode édition
  isEditing = false;
  // Id du plan-cadre qui va etre modifié selon le plan-cadre selectionée
  planCadreId: number | undefined;
  planCadre: PlanCadres | undefined;

  planCadres: PlanCadres[] = [];
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild(IonModal) modalSelection!: IonModal;

  observable$!: Subscription;
  planCadreForm!: FormGroup;

  ponderationMinimaleExamenFinal = 40;

  elementsCompetencesRecherche: RechercheCbo[] = [];

  elementsCompetences: ElementCompetence[] = [];

  criteresEvaluation: CriteresEvaluations[] = [];

  planCadrePrealableSelectionne: string[] = [];

  programmesRecherche: RechercheCbo[] = [];

  sessions: Session[] = [];

  // @author lebel Liste des compétences du programme
  lsCompetenceRecherche : RechercheCbo[] = [];
  lsCompetencesSelectionnes: Competence[] = [];
  competences: Competence[] = [];
  lsLienElementCompetencePlanCadre: LienCompetencesPlansCadres[] = [];

  //Pour la sélection des plans cadres
  lsPlansCadresProgrammeRecherche: RechercheCbo[] = [];
  lsPrealablesSelectionnes: PlanCadres[] = [];
  lsCorequisSelectionnes: PlanCadres[] = [];
  flagPremierAppelLiaisonRelatif = true;
  flagPremierAppelLiaisonAbsolu = true;
  flagPremierAppelLiaisonCompetence = true;
  flagPremierAppelLiaisonCorequis = true;


  lsSection: SectionFormulaire[] = [];

  programmeId = 0;


  constructor(private planCadresService: PlanCadresService, private critereEvaluationService: CriteresEvaluationsService, private sessionService: SessionsService,
              private elementCompetenceService: ElementCompetenceService, private programmeService: ProgrammeService, private competenceService: CompetencesService,
              public modalCtrl: ModalController, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute,
              private gabaritService: GabaritService, public authService: AuthService
  ) {}


  /**
   * Quand on crée la page
   */
  ngOnInit() {
    //Form control vient des notes de cours
    this.planCadreForm = this.formBuilder.group({
      //Façon "en ligne" de créer des FormControl
      code: ['', [Validators.required, Validators.pattern('^\\d{3}-\\d[A-Z]\\d-[A-Z]{2}$')]],
      titre: ['', Validators.required],
      ponderation: ['', [Validators.required, Validators.pattern('^\\d-\\d-\\d$')]],
      unites: ['', [Validators.min(0)]],
      attitudes: [''],

      ponderationFinale: ['', [Validators.min(this.ponderationMinimaleExamenFinal), Validators.max(100)]],
      criteresEvaluations: this.formBuilder.array([]),
      programmeAffichage: [''],
      programme: [''],
      entreVigueur: [''],
      coursLiesPrealables: this.formBuilder.array([]),
      coursLiesPrealablesAbsolus: this.formBuilder.array([]),
      coursLiesPrealablesRelatifs: this.formBuilder.array([]),
      coursLiesCorequis: this.formBuilder.array([]),
      competences: this.formBuilder.array([]),
      sections: this.formBuilder.array([]),
    });


  }


  /**
   * Quand on s'apprête à entrer dans une page
   */
  async ionViewWillEnter(): Promise<void> {

    //Partie pour modifier un plan cadre @Author Samir.el et Jacob

    //Verification de si on reçoit un id de plan cadre en paramètre et donc que c'est une modification
    this.planCadreId = parseInt((this.activatedRoute.snapshot.paramMap.get('id') as string));
    if (!isNaN(this.planCadreId)) {
      //Rechercher le plan-cadre grace a l'Id et la methode getPlanCadre
      this.observable$ = this.planCadresService.getPlanCadre(this.planCadreId).subscribe((planCadre: ApiResponse<PlanCadres>) => {
        if (planCadre) {
          this.planCadre = planCadre.data;
          if (this.planCadre) {
            //Mettre le isEditing a True pour changer le contenue du formulaire
            this.isEditing = true;
            //Mettre les valeurs du plan-cadre dans les chmamps de texte
            this.planCadreForm.patchValue({
              code: this.planCadre.code,
              titre: this.planCadre.titre,
              ponderation: this.planCadre.ponderation,
              unites: this.planCadre.unites,
              attitudes: this.planCadre.attitudes,

              ponderationFinale: this.planCadre.ponderationFinale,
              // anneesdevisIntentionsEducatives: this.planCadre.anneesdevisIntentionsEducatives,
              // pagesdevisIntentionsEducatives: this.planCadre.pagesdevisIntentionsEducatives,
              programmeAffichage: this.planCadre.programme.titre + '(' + this.planCadre.programme.code + ')',
              programme: this.planCadre.programme.id,
              entreVigueur: this.planCadre.entreVigueur

            });
            this.programmeId = this.planCadre.programme.id;


            if (this.planCadre.coursLiesPrealablesAbsolus) {
              for (const prealable of this.planCadre.coursLiesPrealablesAbsolus) {
                this.creerPrealableAbsoluFormGroup(prealable.planCadre2 as PlanCadres);
                this.lsPrealablesSelectionnes.push(prealable.planCadre2 as PlanCadres);
              }
            }

            /**
             * Ajouter les préalables relatifs du plan-cadre de base dans le formulaire
             */
            if (this.planCadre.coursLiesPrealablesRelatifs) {
              for (const prealable of this.planCadre.coursLiesPrealablesRelatifs) {
                this.creerPrealableRelatifFormGroup(prealable.planCadre2 as PlanCadres);
                this.lsPrealablesSelectionnes.push(prealable.planCadre2 as PlanCadres);
              }
            }

            /**
             * Ajouter les corequis du plan-cadre de base dans le formulaire
             */
            if(this.planCadre.coursLiesCorequis){
              for (const corequis of this.planCadre.coursLiesCorequis){
                //Vérifier si le cours corequis dans la liaison est le premier ou le second
                if(this.planCadre?.id == corequis.planCadre1.id){
                  //Si le premier de la liaison est le même que le plan-cadre duquel on affiche les détails, afficher le second
                  this.creerCorequisFormGroup(corequis.planCadre2 as PlanCadres);
                  this.lsCorequisSelectionnes.push(corequis.planCadre2 as PlanCadres);
                }
                else {
                  //Si le second de la liaison est le même que le plan-cadre duquel on affiche les détails, afficher le premier
                  this.creerCorequisFormGroup(corequis.planCadre1 as PlanCadres);
                  this.lsCorequisSelectionnes.push(corequis.planCadre1 as PlanCadres);
                }

              }
            }


            /**
             * Ajouter les compétences déjà présentes
             */
            if(this.planCadre.competences){
              for (const competence of this.planCadre.competences){
                this.creerCompetenceFormGroupModification(competence);
              }
            }



            this.getCriteresEvaluations(this.planCadre);
            this.getPlanCadre();
            this.getElementsCompetencesRecherche();
            this.getProgrammesRecherche();
            this.getPlansCadresRecherche();


            this.planCadre.sections.forEach((section: SectionFormulaire)=>{
              this.creerSectionFormGroup(section);
              this.lsSection.push(section);
            })

            this.getCompetenceRecherche();


          }
        }

      },
        (error) => {
          // Erreur : message d'erreur
          this.afficherErreur('Un problème est survenu lors du chargement du plan-cadre.');
          //Rediriger vers la liste
          this.router.navigate(['/programmes', this.programmeId, 'plans-cadres']);
        });
    }

    //Si c'est un ajout de plan cadre
    else {
      //Aller chercher le programme dans l'url
      this.activatedRoute.paramMap.subscribe(params => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.programmeId = +params.get('programmeId')
        this.getPlanCadre();
      },
        (error) => {
          // Erreur : message d'erreur
          this.afficherErreur('Un problème est survenu lors du chargement du plan-cadre.');
          //Rediriger vers la liste
          this.router.navigate(['/programmes', this.programmeId, 'plans-cadres']);
        });
      if (this.programmeId) {
        this.observable$ = this.programmeService.getProgramme(this.programmeId).subscribe((programmeReponse) => {
          const programme = programmeReponse.data;
          //Mettre le programme trouvé dans le formulaire comme programme par défaut
          if (programme) {
            this.planCadreForm.patchValue({
              programmeAffichage: programme.titre + '(' + programme.code + ')',
              programme: programme.id,
            })
            this.programmeId = programme.id;
          }
          this.getPlanCadre();
          this.getElementsCompetencesRecherche();
          this.getProgrammesRecherche();
          this.getPlansCadresRecherche();

          this.obtenirGabaritParId(2); // Récupérer le gabarit pour les plans-cadres

          this.getCompetenceRecherche();
        },
          (error) => {
            // Erreur : message d'erreur
            // Erreur : message d'erreur
            this.afficherErreur('Un problème est survenu lors du chargement du plan-cadre.');
            //Rediriger vers la liste
            this.router.navigate(['/programmes', this.programmeId, 'plans-cadres']);
          });

      }
    }

    this.getSessions();

  }





  /**
   * Méthode s'axécutant juste avant de quitter la page
   * @author Jacob Beauregard-Tousignant
   */
  ionViewWillLeave(): void {
    this.observable$.unsubscribe();
  }


  /**
   * Méthode qui va chercher tous les éléments de compétences
   * et les formate pour pouvoir les utiliser dans le modal de recherche pour lier une élément à un critère d'évaluation
   */
  async getElementsCompetencesRecherche(): Promise<void> {
    this.observable$ = this.elementCompetenceService.getElementsComptetence().subscribe({
        next: (res: ApiResponse<ElementCompetence[]>) => {
          res.data ? this.elementsCompetences = res.data : '';
          for (const element of this.elementsCompetences) {
            const elementRecherche: RechercheCbo = {
              text: '(' + element.numero + ') ' + element.texte,
              value: element.id.toString(),
            };
            this.elementsCompetencesRecherche.push(elementRecherche);
          }
        },
        error: () => {
          // Erreur : message d'erreur
          this.afficherErreur('Un problème est survenu lors du chargement du plan-cadre.');
          //Rediriger vers la liste
          this.router.navigate(['/programmes', this.programmeId, 'plans-cadres']);
        }
      }
    );
  }


  /**
   * @author lebel
   * Méthode pour récupérer les compétence et les formatter un élément de recherche
   */
  async getCompetenceRecherche(): Promise<void> {
    this.observable$ = this.competenceService.getCompetences().subscribe({
      next: (res: ApiResponse<Competence[]>) => {
        res.data ? this.competences = res.data : '';
        // Si le data reçu n'est pas vide
        if(this.competences){
          for(const comp of this.competences){
            // Créer les objets de recherche pour les compétences du programme
            const competenceRechercheCbo: RechercheCbo = {
              text: '(' + comp.code + ')' + ' ' + comp.enonce,
              value: comp.id.toString()
            }
            this.lsCompetenceRecherche.push(competenceRechercheCbo);
          }
        }
      },
      error: () => {
        // Erreur : message d'erreur
        this.afficherErreur('Un problème est survenu lors du chargement du plan-cadre.');
        //Rediriger vers la liste
        this.router.navigate(['/programmes', this.programmeId, 'plans-cadres']);
      }
    })
  }


  /**
   * Méthode pour aller chercher les programmes et les formatter pour la recherche
   */
  async getProgrammesRecherche(): Promise<void> {
    this.observable$ = this.programmeService.getProgrammes().subscribe({
      next: (res: ApiResponse<Programme[]>) => {
        if (res.data) {
          for (const programme of res.data) {
            //Créer l'objet de recherche avec chaque programme
            const programmeRecherche: RechercheCbo = {
              text: programme.titre + ' ' + '(' + programme.code + ')',
              value: programme.id.toString()
            }
            this.programmesRecherche.push(programmeRecherche);
          }
        }
      },
      error: () => {
        // Erreur : message d'erreur
        this.afficherErreur('Un problème est survenu lors du chargement du plan-cadre.');
        //Rediriger vers la liste
        this.router.navigate(['/programmes', this.programmeId, 'plans-cadres']);
      }
    })
  }


  /**
   * Méthode qui détermine si une option est sélectionnée en comparant les propriétés de l'option dans le select à celles du modèle.
   * @param a la valeur du modèle (Session)
   * @param b la valeur de l'option dans le select (Session)
   * @author Emeric Chauret
   */
  comparerSession(a: Session, b: Session) {
    return a?.id === b.id;
  }

  /**
   * Appel la méthode du service des sessions qui permet de
   * récupérer la liste des sessions dans la bd.
   * Puis, attends avant de donner une valeur à la variable session.
   * @author Jonathan Carrière
   * @author Emeric Chauret
   */
  getSessions() {
    this.observable$ = this.sessionService.getSessions().subscribe({
      next: (res: ApiResponse<Session[]>) => {
        res.data ? this.sessions = res.data : '';
      },
      error: () => {
        // Erreur : message d'erreur
        this.afficherErreur('Un problème est survenu lors du chargement du plan-cadre.');
        //Rediriger vers la liste
        this.router.navigate(['/programmes', this.programmeId, 'plans-cadres']);
      }
    });
  }

  get champSession() {
    return this.planCadreForm.get('session');
  }


  /**
   * Méthode qui va chercher tous les plans-cadres de la source de données
   */
  getPlanCadre(): void {
    if (this.programmeId) {
      this.observable$ = this.planCadresService.getPlansCadresParProgramme(this.programmeId.toString()).subscribe({
        next: res => {
          if (res.data) {
            this.planCadres = res.data
          }
        },
        error: () => {
          // Erreur : message d'erreur
          this.afficherErreur('Un problème est survenu lors du chargement du plan-cadre.');
          //Rediriger vers la liste
          this.router.navigate(['/programmes', this.programmeId, 'plans-cadres']);
        }
      }
      );
    }

  }


  /**
   * Appel la méthode du service des plan-cadres, puis attend avant d'aller rechercher la liste
   * @param id
   */
  delete(id: number): void {
    this.observable$ = this.planCadresService.deletePlanCadres(id).subscribe({
      next: () => this.getPlanCadre(),
      error: () => {
        // Erreur : message d'erreur
        this.afficherErreur('Un problème est survenu lors de la suppression du plan-cadre.');
      }
    });
  }

  /**
   * Méthode pour créer de nouveaux plans-cadres
   * @author Jacob Beauregard-Tousignant
   */
  createPlanCadre(): void {

    const nouveauPlanCadre = this.planCadreForm.value;

    nouveauPlanCadre.criteresEvaluations = this.criteresEvaluation;


    nouveauPlanCadre.coursLiesPrealablesAbsolus = [];
    nouveauPlanCadre.coursLiesPrealablesRelatifs = [];
    //Assigner les plans cadres absolus et relatif
    for (const prealable of nouveauPlanCadre.coursLiesPrealables) {
      if (prealable.typePrealable === 'Absolu') {
        nouveauPlanCadre.coursLiesPrealablesAbsolus.push(prealable);
      } else {
        nouveauPlanCadre.coursLiesPrealablesRelatifs.push(prealable);
      }
    }
    this.observable$ = this.planCadresService.createPlanCadres(nouveauPlanCadre).subscribe((planCadre: ApiResponse<PlanCadres>) => {
      this.getPlanCadre();
      this.reinitialiserFormulaire();
      this.router.navigate([`/programmes/${this.programmeId}/plans-cadres`]).then(promesse => true);
    },
       (error) => {
      // Erreur : message d'erreur
      this.afficherErreur('Un problème est survenu lors du chargement du plan-cadre.');
      //Rediriger vers la liste
      this.router.navigate(['/programmes', this.programmeId, 'plans-cadres']);
    });

  }

  /**
   * Méthode pour modifier un plan-cadre existant
   * @author Samir El Haddaji
   */
  editPlanCadre() {
    const nouvelleVersionPlanCadre = this.planCadreForm.value;
    nouvelleVersionPlanCadre.criteresEvaluations = this.criteresEvaluation;

    nouvelleVersionPlanCadre.coursLiesPrealablesAbsolus = [];
    nouvelleVersionPlanCadre.coursLiesPrealablesRelatifs = [];
    //Assigner les plans cadres absolus et relatif
    for (const prealable of nouvelleVersionPlanCadre.coursLiesPrealables) {
      if (prealable.typePrealable === 'Absolu') {
        nouvelleVersionPlanCadre.coursLiesPrealablesAbsolus.push(prealable);
      } else {
        nouvelleVersionPlanCadre.coursLiesPrealablesRelatifs.push(prealable);
      }
    }
    nouvelleVersionPlanCadre.coursLiesPrealables = []
    nouvelleVersionPlanCadre.criteresEvaluations = this.criteresEvaluation;
    if (this.planCadreId) {
      let planCadre: PlanCadres
      this.observable$ = this.planCadresService.updatePlanCadres(this.planCadreId, nouvelleVersionPlanCadre).subscribe({
        next: res => {
          if (res.data) {
            planCadre = res.data
            this.getPlanCadre();
            this.reinitialiserFormulaire();
            this.router.navigate([`/programmes/${this.programmeId}/plans-cadres/${planCadre.id}`]).then(promesse => true);
          }
        },
        error: () => {
          // Erreur : message d'erreur
          this.afficherErreur('Un problème est survenu lors de la modification du plan-cadre.');
        }
      });
    }


  }

  /**
   * Méthode permettant de réinitialiser le formulaire global
   */
  reinitialiserFormulaire(){
    this.planCadreForm.reset();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.criteresEvaluation = [];
  }


  /**
   * Méthode pour appeler le modal de choix du programme
   * @param programme Si c'est une modification de plan cadre, un programme déjà sélectionné sera envoyé
   */
  async appelerModalProgramme(programme?: Programme) {
    let modal;
    //S'il y a un programme, c'est une modification
    if (programme) {
      modal = await this.modalCtrl.create({
        component: RechercheComboBoxRadioComponent,
        componentProps: {
          'objetsRecherche': this.programmesRecherche,
          'valeurActuelle': programme.id,
          'titre': 'Sélection d\'un programme'
        }
      });
    }
    else {
      modal = await this.modalCtrl.create({
        component: RechercheComboBoxRadioComponent,
        componentProps: {
          'objetsRecherche': this.programmesRecherche,
          'valeurActuelle': this.programmeId,
          'titre': 'Sélection d\'un programme'
        }
      })
    }

    await modal.present();

    const {data, role} = await modal.onWillDismiss();

    if (role === 'confirme') {
      this.planCadreForm.patchValue({
        'programmeAffichage': data.text,
        'programme': data.value
      });
      this.programmeId = data.value;
      await this.getPlansCadresRecherche();
      await this.getPlanCadre();

      //Vider la liste des cours sélectionnés
      this.lsCorequisSelectionnes = [];
      const tailleCorequisFormArray = this.prealablesFormArray.length;
      for (let i = 0; i <= tailleCorequisFormArray; i ++){
        this.corequisFormArray.removeAt(0);
      }
      this.lsPrealablesSelectionnes = [];
      const taillePrealableFormArray = this.prealablesFormArray.length;
      for (let i = 0; i <= taillePrealableFormArray; i ++){
        this.prealablesFormArray.removeAt(0);
      }

    }
  }



  /**
   * Méthode pour appeler le modal pour ajouter des plans cadres préalables au plan cadre
   * La liste des plans cadres disponibles dépend du programme choisi
   */
  public async appelerModalPlanCadrePrealable() {

    //Aller chercher la liste des plans-cadres qu'on peut sélectionner, donc tous ceux du programme moins ceux déjà en corequis
    const choixObjets = this.lsPlansCadresProgrammeRecherche.filter((rechercheCBO: RechercheCbo) =>
        !this.lsCorequisSelectionnes.map((pc: PlanCadres) => pc.id.toString()).includes(rechercheCBO.value));
    const objetsSelectionnes: string[] = [];

    //Ajouter les cours déjà lié au plan cadre dans les plans-cadres sélectionnés
    //Ajouter les préalables Absolus
    if (this.planCadre?.coursLiesPrealablesAbsolus && this.flagPremierAppelLiaisonAbsolu) {
      for (const planCadreAbsolu of this.planCadre.coursLiesPrealablesAbsolus) {
        objetsSelectionnes.push(planCadreAbsolu.planCadre2.id.toString());
      }
      this.flagPremierAppelLiaisonAbsolu = false;
    }
    //Ajouter les préalables relatifs
    if (this.planCadre?.coursLiesPrealablesRelatifs && this.flagPremierAppelLiaisonRelatif) {
      for (const planCadreRelatif of this.planCadre.coursLiesPrealablesRelatifs) {
        objetsSelectionnes.push(planCadreRelatif.planCadre2.id.toString());
      }
      this.flagPremierAppelLiaisonRelatif = false
    }

    // Sécurité pour être certain d'ajouter les préalable déjà sélectionnés
    for (const prealable of this.lsPrealablesSelectionnes) {
      if (!objetsSelectionnes.includes(prealable.id.toString())) {
        objetsSelectionnes.push(prealable.id.toString())
      }
    }


    const modal = await this.modalCtrl.create({
      component: RechercheComboBoxCheckboxComponent,
      componentProps: {
        'titre': 'Plans-cadres préalables',
        'objets': choixObjets,
        'objetsSelectionnes': objetsSelectionnes
      }
    });

    await modal.present();

    const {data, role} = await modal.onWillDismiss();

    if (role === 'confirme') {

      // Retirer les plans-cadres qui ont été décochés
      for (const prealable of this.lsPrealablesSelectionnes) {
        if (!data.includes(prealable.id)) {
          const index = this.prealablesFormArray.controls.findIndex(c => c.value.id === prealable.id);
          this.prealablesFormArray.removeAt(index);
          this.prealablesFormArray.updateValueAndValidity();
        }
        // Pour enlever les plans cadres qui ne sont pas sélectionnés dans le modal de la liste des plans-cadres sélectionnés
        this.lsPrealablesSelectionnes = this.lsPrealablesSelectionnes.filter(e => data.includes(e.id));
      }


      // Ajouter les préalables qui ont été cochés
      for (const idPrealable of data) {
        //Trouver le plan cadre liée au id
        const prealable: PlanCadres | undefined = this.planCadres.find((planCadre) => planCadre.id.toString() === idPrealable);

        if (prealable) {
          //Vérifier s'il y a déjà le préalable dans la liste
          if (!this.lsPrealablesSelectionnes.includes(prealable)) {
            //S'il n'est pas là, l'ajouter
            this.lsPrealablesSelectionnes.push(prealable);
            //Vérifier s'il y a déjà un formarray pour cet élément de compétence, si oui, ne peas en faire
            if (this.prealablesFormArray.controls.findIndex(c => c.value.id === prealable.id) === -1) {
              this.creerPrealableFormGroup(prealable);
            }
          }
        }

      }
    }
  }




  /**
   * Méthode pour aller chercher tous les formArray des plans cadres préalables du formulaire
   */
  get prealablesFormArray() {
    return this.planCadreForm.get('coursLiesPrealables') as FormArray;
  }

  /**
   * Méthode pour créer des formarray pour les préalables
   * @param prealable
   */
  private creerPrealableFormGroup(prealable: PlanCadres) {
    this.prealablesFormArray.push(this.formBuilder.group({
        id: [prealable.id],
        enonce: [this.assemblerTitrePlanCadre(prealable)],
        typePrealable: []
      })
    );
  }

  /**
   * Méthode pour créer des formarray pour les préalables absolus
   * @param prealable
   */
  private creerPrealableAbsoluFormGroup(prealable: PlanCadres) {
    this.prealablesFormArray.push(this.formBuilder.group({
        id: [prealable.id],
        enonce: [this.assemblerTitrePlanCadre(prealable)],
        typePrealable: ['Absolu']
      })
    );
  }

  /**
   * Méthode pour créer des formarray pour les préalables relatif
   * @param prealable
   */
  private creerPrealableRelatifFormGroup(prealable: PlanCadres) {
    this.prealablesFormArray.push(this.formBuilder.group({
        id: [prealable.id],
        enonce: [this.assemblerTitrePlanCadre(prealable)],
        typePrealable: ['Relatif']
      })
    );
  }




  /**
   * Méthode pour appeler le modal pour ajouter des plans cadres corequis au plan cadre
   * La liste des plans cadres disponibles dépend du programme choisi
   */
  public async appelerModalPlanCadreCorequis() {

    //Aller chercher la liste des plans-cadres qu'on peut sélectionner, donc tous ceux du programme moins ceux déjà en corequis
    const choixObjets = this.lsPlansCadresProgrammeRecherche.filter((rechercheCBO: RechercheCbo) =>
        !this.lsPrealablesSelectionnes.map((pc: PlanCadres) => pc.id.toString()).includes(rechercheCBO.value));
    const objetsSelectionnes: string[] = []

    //Ajouter les cours déjà lié au plan-cadre dans les plans-cadres sélectionnés
    //Ajouter les corequis
    if (this.planCadre?.coursLiesCorequis && this.flagPremierAppelLiaisonCorequis) {
      for (const corequis of this.planCadre.coursLiesCorequis) {
        //Vérifier le plan-cadre duquel on voit les détails est le premier ou le second dans le lien
        if(corequis.planCadre2.id === this.planCadre.id){
          objetsSelectionnes.push(corequis.planCadre1.id.toString());
        }
        else{
          objetsSelectionnes.push(corequis.planCadre2.id.toString());
        }

      }
      this.flagPremierAppelLiaisonCorequis = false;
    }


    for (const corequis of this.lsCorequisSelectionnes) {
      if (!objetsSelectionnes.includes(corequis.id.toString())) {
        objetsSelectionnes.push(corequis.id.toString())
      }
    }


    const modal = await this.modalCtrl.create({
      component: RechercheComboBoxCheckboxComponent,
      componentProps: {
        'titre': 'Plans-cadres corequis',
        'objets': choixObjets,
        'objetsSelectionnes': objetsSelectionnes
      }
    });

    await modal.present();

    const {data, role} = await modal.onWillDismiss();

    if (role === 'confirme') {

      // Retirer les plans-cadres qui ont été décochés
      for (const corequis of this.lsCorequisSelectionnes) {
        if (!data.includes(corequis.id)) {
          const index = this.corequisFormArray.controls.findIndex(c => c.value.id === corequis.id)
          this.corequisFormArray.removeAt(index);
          this.corequisFormArray.updateValueAndValidity();
        }
        this.lsCorequisSelectionnes = this.lsCorequisSelectionnes.filter(e => data.includes(e.id));
      }


      // Ajouter les corequis qui ont été cochés
      for (const idCorequis of data) {
        //Trouver le plan cadre liée au id
        const corequis: PlanCadres | undefined = this.planCadres.find((planCadre) => planCadre.id.toString() === idCorequis);

        if (corequis) {
          //Vérifier s'il y a déjà le préalable dans la liste
          if (!this.lsCorequisSelectionnes.includes(corequis)) {
            //S'il n'est pas là, l'ajouter
            this.lsCorequisSelectionnes.push(corequis);
            //Vérifier s'il y a déjà un formarray pour cet élément de compétence, si oui, ne peas en faire
            if (this.corequisFormArray.controls.findIndex(c => c.value.id === corequis.id) === -1) {
              this.creerCorequisFormGroup(corequis);
            }
          }
        }

      }
    }
  }


  /**
   * Méthode pour aller chercher tous les formarray des plan-cours corequis du formulaire
   */
  get corequisFormArray() {
    return this.planCadreForm.get('coursLiesCorequis') as FormArray;
  }


  /**
   * Méthode pour créer des formarray pour les corequis
   * @param corequis
   */
  private creerCorequisFormGroup(corequis: PlanCadres) {
    this.corequisFormArray.push(this.formBuilder.group({
          id: [corequis.id],
          enonce: [this.assemblerTitrePlanCadre(corequis)],
        })
    );
  }













  /**
   * @author lebel
   * Méthode utilisée pour ajouter une ou plusieurs compétence du programme au plan cadre concerné
   */
  public async appelerModalCompetence(){

    // Aller chercher les compétences du programmes qui peuvent être ajoutées au plan cadre
    const choixObjets = this.lsCompetenceRecherche;

    // Liste des objets sélectionnés
    const objetsSelectionnes: string[] = [];

    // Ajouter les compétences déjà sélectionnées du plan cadre dans la liste 'objetsSelectionnes'
    if(this.planCadre?.competences && this.flagPremierAppelLiaisonCompetence){
      for(const comp of this.planCadre.competences){
        objetsSelectionnes.push(comp.competence.id.toString());
      }
      this.flagPremierAppelLiaisonCompetence = false;
    }

      // Sécurité pour être certain d'ajouter les compétences déjà sélectionnés dans la liste d'objets déjà...
      for (const comp of this.lsCompetencesSelectionnes) {
        if (!objetsSelectionnes.includes(comp.id.toString())) {
          objetsSelectionnes.push(comp.id.toString())
        }
      }

    // Création du modal de recherche
    const modal = await this.modalCtrl.create({
      component: RechercheComboBoxCheckboxComponent,
      componentProps: {
        'titre': 'Compétences',
        'objets': choixObjets,
        'objetsSelectionnes': objetsSelectionnes
      }
    });

      await modal.present();

      const {data, role} = await modal.onWillDismiss();

      // Gérer l'évènnement comfirme
      if(role === 'confirme'){

        // Retirer les compétences qui ont été décochées
        for(const competence of this.lsCompetencesSelectionnes){
          if(!data.includes(competence.id)){
            const index = this.competenceFormArray.controls.findIndex(c => c.value === competence.id);
            this.competenceFormArray.removeAt(index);
            this.competenceFormArray.updateValueAndValidity();
          }
          this.lsCompetencesSelectionnes = this.lsCompetencesSelectionnes.filter(e => data.includes(e.id));
        }

        // Ajouter les compétences cochées
        for (const idComp of data){
          // Trouver la compétence liée au id récupéré
          this.observable$ = this.competenceService.getCompetence(idComp).subscribe((comp)=> {
            const competence = comp.data;
            if(competence){
              // Vérifier s'il y a déjà les compétences dans la liste
              if(!this.lsCompetencesSelectionnes.includes(competence)){
                // Si la compétence n'est pas là, on l'ajoute
                this.lsCompetencesSelectionnes.push(competence);
                // Vérifier s'il y à déjà un form array pour cette compétence, sinon en faire un
                if (this.competenceFormArray.controls.findIndex(c => c.value.id === competence.id) === -1){
                  this.creerCompetenceFormGroup(competence);
                }
              }
            }
          },
            (error) => {
              // Erreur : message d'erreur
              this.afficherErreur('Un problème est survenu lors du chargement des compétences.');
            });
        }
      }
      else{
        this.flagPremierAppelLiaisonCompetence = true;
      }
  }

  /**
   * @author lebel
   * Méthode pour aller chercher toutes les compétences du plan-cadre du formulaire
   */
  get competenceFormArray() {
    return this.planCadreForm.get('competences') as FormArray;
  }

  /**
   * @author lebel
   * Méthode pour créer des form array pour les compétences
   * @param competence
   */
  private creerCompetenceFormGroup(competence: Competence) {

    const formCompetence = this.formBuilder.group({
      id: [competence.id],
      code: [competence.code],
      enonce: [competence.enonce],
      contexteLocal: [''],
      atteinte: [''],
      progression: [''],
      elementsCompetences: this.formBuilder.array([])
    });
    for (const elementComp of competence.elementsCompetences){
      const elementCompetenceFormArray = formCompetence.get('elementsCompetences') as FormArray;
      elementCompetenceFormArray.push(this.formBuilder.group({
        id: [elementComp.id],
        numero: [elementComp.numero],
        texte: [elementComp.texte],
        contenuLocal: ['']
      }))
    }
    this.competenceFormArray.push(formCompetence);
  }


  /**
   * @authors lebel Jacob Beauregard-Tousignant
   * Méthode pour créer des form array pour les compétences dans une modification de plan cadre
   * @param lienCompetence
   */
  private creerCompetenceFormGroupModification(lienCompetence: LienCompetencesPlansCadres) {

    const formCompetence = this.formBuilder.group({
      id: [lienCompetence.competence.id],
      code: [lienCompetence.competence.code],
      enonce: [lienCompetence.competence.enonce],
      contexteLocal: [lienCompetence.contexteLocal],
      atteinte: [lienCompetence.atteinte],
      progression: [lienCompetence.progression],
      elementsCompetences: this.formBuilder.array([])
    });
    for (const elementComp of lienCompetence.competence.elementsCompetences){
      const elementCompetenceFormArray = formCompetence.get('elementsCompetences') as FormArray;
      //Aller chercher le lien entre l'élément de compétence et la plan cadre
      let contenuLocal = '';
      if(this.planCadre?.elementsCompetences){
        for (const lienElementPlanCadre of this.planCadre.elementsCompetences){
          if(lienElementPlanCadre.elementCompetence.id === elementComp.id){
            contenuLocal = lienElementPlanCadre.contenuLocal;
            break;
          }
        }
      }
      elementCompetenceFormArray.push(this.formBuilder.group({
        id: [elementComp.id],
        numero: [elementComp.numero],
        texte: [elementComp.texte],
        contenuLocal: [contenuLocal]
      }));

    }
    this.competenceFormArray.push(formCompetence);
    //Aller désactiver le champs de progression si la compétence est complète
  }


  /**
   * Méthode permettant d'obtenir le FormArray pour un élément de compétence spécifique
   * @author lebel
   * @param compIndex
   */
  getElementsCompetencesArray(compIndex: number): FormArray {
    // Obtenir les éléments de compétences pour une semaine de cours spécifique
    const competenceFormArray = this.planCadreForm.get('competences') as FormArray;
    const elementComp = competenceFormArray.at(compIndex);
    return elementComp.get('elementsCompetences') as FormArray;
  }



  /**
   * Méthode pour aller chercher les plans cadres d'un programme précis et les formater en objet de recherche
   */
  async getPlansCadresRecherche() {
    //Vider la liste des plans cadres pour la remplir avec le nouveau programme s'il y a changement de programme
    this.lsPlansCadresProgrammeRecherche = []
    if (this.programmeId) {
      this.observable$ = this.planCadresService.getPlansCadresParProgramme(this.programmeId.toString()).subscribe((res) => {
        if (res.data) {
          for (const planCadre of res.data) {
            //On ne peut pas sélectionner le plan-cadre lui même
            if (planCadre.id !== this.planCadre?.id)
              this.lsPlansCadresProgrammeRecherche.push({
                text: this.assemblerTitrePlanCadre(planCadre),
                value: planCadre.id.toString()
              });
          }
        }
      },
        (error) => {
          // Erreur : message d'erreur
          this.afficherErreur('Un problème est survenu lors du chargement du plan-cadre.');
          //Rediriger vers la liste
          this.router.navigate(['/programmes', this.programmeId, 'plans-cadres']);
        });
    }
  }


  /**
   * Méthode pour appeler le modal de gestion, soit ajouter ou modifier des critères d'évaluation
   */
  async appelerModalCriteresEvaluations(critereId?: number, index?: number) {
    let modal;
    if(critereId){
      this.critereEvaluationService.getCritereEvaluation(critereId).subscribe(async (critereReponse) => {
        //S'il y a un critère, c'est une modification
        const critere = critereReponse.data;
        if (critere) {
          modal = await this.modalCtrl.create({
            component: ModalCritereEvalComponent,
            componentProps: {
              'idCritere': critere.id,
              'critere': critere,
              'lsElementCompetences': this.elementsCompetencesRecherche
            }
          });


          await modal.present();

          const {data, role} = await modal.onWillDismiss();

          //Si c'est un ajout de critère
          if (role === 'confirme') {
            this.criteresEvaluation.push(data);
            this.ajouterCritereEvaluationForm(data);
          }

          //Si c'est une modification de critère
          if (role === 'confirmeModifier') {
            //Donner les nouvelles valeurs à l'ancien critère
            //Modifier le formarray
            this.modifierCritereEvaluationForm(data, index!);
            this.criteresEvaluation[index!] = data;

          }

        }


      },
        (error) => {
          // Erreur : message d'erreur
          this.afficherErreur('Un problème est survenu lors du chargement du plan-cadre.');
          //Rediriger vers la liste
          this.router.navigate(['/programmes', this.programmeId, 'plans-cadres']);
        })


    }
    else {
      modal = await this.modalCtrl.create({
        component: ModalCritereEvalComponent,
        componentProps: {
          'lsElementCompetences': this.elementsCompetencesRecherche
        }
      });
      await modal.present();

      const {data, role} = await modal.onWillDismiss();

      //Si c'est un ajout de critère
      if (role === 'confirme') {
        this.criteresEvaluation.push(data);
        this.ajouterCritereEvaluationForm(data);
      }

      //Si c'est une modification de critère
      if (role === 'confirmeModifier') {
        //Donner les nouvelles valeurs à l'ancien critère
        //Modifier le formarray
        this.modifierCritereEvaluationForm(data, index!);
        this.criteresEvaluation[index!] = data;

      }
    }




  }



  /**
   * Méthode qui récupère le formArray criteresEvaluations dans le formulaire
   */
  get criteresEvaluationsFormArray() {
    return this.planCadreForm.get('criteresEvaluations') as FormArray;
  }

  /**
   * Méthode qui créer un formgroup dans le formArray critereEvaluation.
   */
  creerCritereEvaluationFormGroup() {
    return this.formBuilder.group({
      id: [''],
      enonce: [''],
      ponderation: ['']
    });
  }


  /**
   * Méthode pour abtenir les critères d'évaluations sous forme de FormArray
   * @param planCadre
   */
  getCriteresEvaluations(planCadre: PlanCadres) {
    //Assigner les critères d'évaluations du plan-cadre à modifier à la liste à afficher
    this.criteresEvaluation = planCadre.criteresEvaluations;
    planCadre.criteresEvaluations.forEach((critere: CriteresEvaluations) => {
      this.ajouterCritereEvaluationForm(critere);
    });
  }

  /**
   * Méthode pour ajouter un nouveau critère d'évaluation formArray
   * @param critere Le critère à ajouter
   */
  ajouterCritereEvaluationForm(critere: CriteresEvaluations) {
    this.criteresEvaluationsFormArray.push(this.creerCritereEvaluationFormGroup());
    let message = '';

    //Établir le message pour les numéros de critères
    if (critere.elementsCompetence && critere.elementsCompetence.length > 1) {
      message += '(';
      let index = 0;
      for (const element of critere.elementsCompetence) {
        if (index == 0) {
          message += element.numero
        } else {
          message += ', ' + element.numero
        }
        index++;
      }
      message += ')';
    }
    this.criteresEvaluationsFormArray.at(this.criteresEvaluationsFormArray.length - 1).patchValue({
      'id': critere.id,
      'enonce': critere.enonce + message,
      'ponderation': critere.ponderation + '%'
    });


  }

  /**
   * Méthode pour modifier critère d'évaluation formArray
   * @param critere Le nouveau critère
   * @param index L'index du formArray à modifier
   */
  modifierCritereEvaluationForm(critere: CriteresEvaluations, index: number) {
    if (critere.elementsCompetence) {
      let message = '';
      //Établir le message pour les numéros de critères
      if (critere.elementsCompetence.length > 1) {
        let index = 0;
        for (const element of critere.elementsCompetence) {
          if (index == 0) {
            message += element.numero
          } else {
            message += ', ' + element.numero;
          }
          index++;

        }
      }
      this.criteresEvaluationsFormArray.at(index).patchValue({
        'id': critere.id,
        'enonce': critere.enonce + ' (' + message + ')',
        'ponderation': critere.ponderation + '%'
      });
    } else {
      this.criteresEvaluationsFormArray.at(index).patchValue({
        'id': critere.id,
        'enonce': critere.enonce,
        'ponderation': critere.ponderation + '%'
      });
    }
  }

  /**
   * Méthode pour enlever un critère d'évaluation des critères
   * @param index L'index du critère à enlever
   */
  enleverCritereFormArray(index: number) {

    this.criteresEvaluationsFormArray.removeAt(index);
    this.criteresEvaluationsFormArray.updateValueAndValidity();
  }

  /**
   * Méthode pour supprimer un critère d'évaluation
   */
  async supprimerCritere(critere: CriteresEvaluations, index: number) {
    const modal = await this.modalCtrl.create({
      component: ModalConfirmerSuppressionComponent,
      //Variable à passer au modal qui va le personnaliser avec ce message.
      //Lié au @Input du componnent du modal
      componentProps: {'message': `Souhaitez-vous vraiment supprimer le critère d'évaluation ${critere?.enonce}?`}

    });
    await modal.present();

    const {role} = await modal.onWillDismiss();


    if (role === 'confirm') {
      //Si c'est une modification de plan cadre, pour supprimer les critères de sa liste
      if (this.planCadre?.criteresEvaluations) {
        const index: number = this.planCadre.criteresEvaluations.indexOf(critere);
        if (index > -1) {
          this.planCadre.criteresEvaluations.splice(index, 1);
        }
      }

      //Mettre à jour la liste des critères
      this.enleverCritereFormArray(index);
      this.criteresEvaluation.splice(index, 1);
      //Supprimer le critère de la BD
      this.critereEvaluationService.deleteCritereEvaluation(critere?.id);
    }
  }



  /**
   * Méthode pour afficher le bon format du titre du plan cadre
   * @param planCadre Le plan cadre duquel afficher le titre formatté
   */
  public assemblerTitrePlanCadre(planCadre: PlanCadres) {
    const competences = planCadre.competences.map(competence => competence.competence.code).join(', ');
    return planCadre.code + ' ' + planCadre.titre + ' ' + planCadre.ponderation + ' (' + competences + ')' ;
  }


  /**
   * Appel la méthode du service des gabarits qui permet de récupérer le gabarit ayant l'identifiant id dans la bd
   * @param id l'identifiant du gabarit à récupérer
   * @author Emeric Chauret
   */
  obtenirGabaritParId(id: number) {
    this.observable$ = this.gabaritService.obtenirGabaritParId(id).subscribe({
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

            this.lsSection.push(section);
            this.creerSectionFormGroup(section);
          });
        }
      },
      error: () => {
        // Erreur : message d'erreur
        this.afficherErreur('Un problème est survenu lors de la suppression du plan-cadre.');
      }
    });
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
      info_suppl: [section.info_suppl]
    }));
  }



  /**
   * Méthode qui récupère le form array sections dans le formulaire
   * @author Emeric Chauret
   */
  get formArraySections() {
    return this.planCadreForm.get('sections') as FormArray;
  }


  /**
   * Méthode permettant de cacher le champs de progression si on indique qu'une compétence est complète
   * @param value La valeur du ion-button qui a été coché
   * @param index L'index du formArray permettant de cacher le bon
   * @author Jacob Beauregard-Tousignant
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  desactiverProgression(value:any, index: number){

    const champsProgression = document.querySelector(`.progression${index}`);

    if(value.detail.value === 'Complète'){
      if(champsProgression){
        champsProgression.classList.add('cacher');
      }
    }
    else{
      if(champsProgression){
        champsProgression.classList.remove('cacher');
      }
    }


  }


  /**
   * Méthode permettant d'afficher un modal pour la gestion des erreurs avec un message
   */
  afficherErreur(messageErreur:string) {
    const modalErreur = this.modalCtrl.create({
      component: ModalErreurServeurComponent,
      componentProps:{
        'message': messageErreur
      }
    });
    modalErreur.then(modal => modal.present());
  }






  protected readonly FormArray = FormArray;
  protected readonly FormGroup = FormGroup;
}
