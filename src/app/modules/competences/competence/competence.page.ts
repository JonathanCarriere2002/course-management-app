import {Component, OnInit} from '@angular/core';
import {CompetencesService} from '../../../services/competences/competences.service';
import {Competence} from '../../../models/competences/competence';
import {Subscription} from 'rxjs';
import {ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ElementCompetence} from '../../../models/elementsCompetences/element-competence';
import {
  ModalFormulaireCompetenceComponent
} from '../../partage/components/modal-formulaire-competence/modal-formulaire-competence.component';
import {CriterePerformance} from '../../../models/criteresPerformances/critere-performance';
import {ApiResponse} from '../../../models/authentification/api-response';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
/**
 * Classe permettant d'effectuer la gestion de la page associée aux compétences
 * @author lebel
 */
@Component({
  selector: 'app-competence',
  templateUrl: './competence.page.html',
  styleUrls: ['./competence.page.scss'],
})
export class CompetencePage implements OnInit {
  // Variable pour suivre si le formulaire est en mode édition
  isEditing = false;
  // Liste des competences
  competences: Competence[] = [];
  // NB de lien par default dans le fil d'arianne
  maxBreadcrumbs = 4;
  // Observable pour ecouter flux
  observable$! : Subscription;
  // Form de creation d'une competence
  competenceForm!: FormGroup;
  // Dernier critère de performance modifié pour refresh le drag and drop
  lastCritere!: CriterePerformance;
  // Id de la compétence a modifier + son object
  competenceId = NaN;
  programmeId = NaN;
  competence: Competence = {
    'id': 0,
    'code': '',
    'enonce': '',
    'annee_devis': 0,
    'pages_devis': '',
    'contexte': '',
    'programme_id': 0,
    'elementsCompetences': []
  };

  constructor(private competencesService: CompetencesService,
              private modalController : ModalController,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    // Validation du formulaire de création d'une compétence
    this.competenceForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      enonce: ['', [Validators.required, Validators.minLength(5)]],
      annee_devis : ['', [Validators.required, Validators.minLength(4),
        Validators.maxLength(4), Validators.min(1975), Validators.max(3000)]],
      pages_devis : ['', [Validators.required, Validators.pattern('^\\d+(?:-\\d+)*$')]],
      contexte : ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  // Aller chercher le id de la competence dans l'URL au cas ou on modifie un item
  ionViewWillEnter() {
    // Obtenir le id de la compétence à modifier par l'URL
    this.competenceId = parseInt((this.activatedRoute.snapshot.paramMap.get('id') as string));
    // Obtenir le id du programme à lier avec la compétence
    this.programmeId = parseInt((this.activatedRoute.snapshot.paramMap.get('programmeId') as string));
    // Verifier si on modifie une comp ou creer une comp
    if(!isNaN(this.competenceId)){
      // Obtenir les données de la compétence qui sera modifiée
      this.getCompetence(this.competenceId);
    }
    // Vérifier si on créer une nouvelle compétence et ensuite associer le programme
    if(!(isNaN(this.programmeId))){
      // Lier la compétence au programme avec le Id en param
      this.competence.programme_id = this.programmeId;
    }
  }

  // Recevoir en output le nouvel ordre des enfants de la comp
  reception(nvOrdreComp: ElementCompetence[]): void {
    this.competence.elementsCompetences = nvOrdreComp;
  }

  // Fonction permettant d'obtenir l'ensemble des compétences
  getCompetences() {
      this.observable$ = this.competencesService.getCompetences().subscribe( {
        next: (res : ApiResponse<Competence[]>) =>{
          res.data ? this.competences = res.data : '';
        },
        error: () => {
          this.afficherErreur('Un problème est survenu lors du chargement de la compétence.');
        }
      })
  }

  // Fonction permettant d'obtenir la competence dont le id est envoye en param
  getCompetence(id: number) {
    this.observable$ = this.competencesService.getCompetence(id).subscribe( {
      next: (res : ApiResponse<Competence>) => {
        // Voir si le data recupere grace au id est vide
        if(res.data){
          this.competence = res.data;
          // Mettre le isEditing a True pour changer le contenu du formulaire
          this.isEditing = true;
          // Remplir le formulaire de modification avec les données de l'objet
          this.competenceForm.patchValue(this.competence);
        }
      },
      error: () => {
        // Afficher modal erreur
        this.afficherErreur('Un problème est survenu lors du chargement de la compétence.');
        // Rediriger vers liste de comps
        this.router.navigate(['/competences']).then(promesse => true);
      }
    })
  }

  // Fonction permettant de se désabonner des données à la fermeture de la page
  ionViewWillLeave() {
    this.observable$?.unsubscribe();
  }

  /**
   * Méthode pour recuperer les valeurs du form et les associer a la
   * comp qui contient le bon ordre d'elements de comp
   */
  recupererValeurForm(){
    this.competence.code = this.competenceForm.value['code'];
    this.competence.enonce = this.competenceForm.value['enonce'];
    this.competence.annee_devis = Number(this.competenceForm.value['annee_devis']);
    this.competence.pages_devis = this.competenceForm.value['pages_devis'];
    this.competence.contexte = this.competenceForm.value['contexte'];
  }

  // Fonction permettant de créer une compétence
  createCompetence() {
    // Recuperer les valeurs du form et les associer a la comp qui contient le bon ordre d'elements de comp
    this.recupererValeurForm();
    // Apeller le service à la place de toutes les propriétés
    this.competencesService.createCompetence(this.competence).subscribe( {
      next : () => {
        this.getCompetences()
        // Redirections vers la liste de competences
        this.router.navigate(['/competences']).then(promesse => true);
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors de la création de la compétence.');
      }
    });

  }

  // Methode pour modifier une competence
  updateCompetence(){
    // Recuperer les valeurs du form et les associer a la comp qui contient le bon ordre d'elements de comp
    this.recupererValeurForm();
    // Update les donnees de la competences avec le data du formulaire de modification
    this.competencesService.updateCompetence(this.competenceId, this.competence).subscribe({
      next: () => {
        this.getCompetences()
        // Redirections vers la liste de competences
        this.router.navigate(['/competences']).then(promesse => true);
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors de la modification de la compétence.');
      }
    });

  }

  /**
   * Fonction pour étendre le fil d'arianne lorsqu'on clique dessus
   */
  expandBreadcrumbs() {
    this.maxBreadcrumbs = 20;
  }

  /**
   * Methode pour ouvrir le modal d'element de competence
   * @param elementCompetence Peut recevoir un element de competence a modifier
   */
  async openModalFormulaireElementCompetence(elementCompetence?:  ElementCompetence){
    const titreModal = "Création d'un élément de compétence"
    const modal = await this.modalController.create({
      component: ModalFormulaireCompetenceComponent,
      componentProps: {
        elementCompetence,
        titreModal,
      },
    });

    // Ouvre le modal
    await modal.present();

    // Recuper le role et le data envoyer
    const {role, data} = await modal.onWillDismiss();

    if(role == 'confirm'){
      if(data != null){
        // Ajouter l'element dans la liste de comp de this.competence au premier index pour
        // qu'il soit en haut et pret a etre deplace et bien visible
        this.competence.elementsCompetences.splice(0, 0, data);
      }
    }
  }

  /**
   * Methode pour ouvrir le modal de critere de performance
   * @param criterePerformance Peut recevoir un critere a modifier
   */
  async openModalFormulaireCriterePerformance(criterePerformance?:  CriterePerformance){
    const titreModal = "Création d'un critère de performance"
    const modal = await this.modalController.create({
      component: ModalFormulaireCompetenceComponent,
      componentProps: {
        criterePerformance,
        titreModal,
      },
    });

    // Ouvre le modal
    await modal.present();

    // Recuper le role et le data envoyer
    const {role, data} = await modal.onWillDismiss();

    if(role == 'confirm'){
      if(data != null){
        // Ajouter le critere de perfo dans le premier element de comp et le derouler pour bien le voir
        this.competence.elementsCompetences[0].criteresPerformance.splice(0, 0, data);
        this.competence.elementsCompetences[0].isExpanded = true;
        this.lastCritere = data;
      }
    }
  }

  /**
   * Méthode permettant d'afficher un modal pour la gestion des erreurs de compétence
   */
  afficherErreur(messageErreur: string) {
    const modalErreur = this.modalController.create({
      component: ModalErreurServeurComponent,
      componentProps:{
        'message' : messageErreur
      }
    });
    modalErreur.then(modal => modal.present());
  }

  protected readonly NaN = NaN;
  protected readonly isNaN = isNaN;
}
