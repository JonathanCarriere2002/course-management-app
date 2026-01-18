import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Programme } from '../../../models/programmes/programme';
import { ProgrammeService } from '../../../services/programmes/programme.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemReorderEventDetail, ModalController } from '@ionic/angular';
import { ApiResponse } from '../../../models/authentification/api-response';
import { RechercheComboBoxCheckboxComponent } from '../../partage/components/recherche-combo-box-checkbox/recherche-combo-box-checkbox.component';
import { Competence } from '../../../models/competences/competence';
import { CompetencesService } from '../../../services/competences/competences.service';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';

/**
 * Page permettant d'effectuer la gestion du formulaire pour les programmes
 * @author Samir El Haddaji
 */

@Component({
  selector: 'app-formulaire-programmes',
  templateUrl: './formulaire-programmes.page.html',
  styleUrls: ['./formulaire-programmes.page.scss'],
})
export class FormulaireProgrammesPage implements OnInit {
  // Identifiant de l'programme
  programmeId = 0;
  // Programme qui sera manipulé dans le formulaire
  programme: Programme = { id: 0, code: '', titre: '', competences: [] };
  // Formulaire pour un objet de type 'programme'
  programmeForm!: FormGroup;
  // Abonnement permettant de gérer les programmes de la page
  observableProgramme$: Subscription = new Subscription();
  // Abonnement permettant de gérer les compétences de la page
  observableCompetence$: Subscription = new Subscription();
  // Indique si le formulaire doit modifier un objet
  formModification = false;
  // Liste des compétences se trouvant dans le modal de sélection
  lsCompetence: Competence[] = [];
  // Liste des compétences sélectionnées pour l'programme
  competencesSelectionnes: Competence[] = [];
  // Quantité maximale pour les breadcrumbs
  maxBreadCrumbs = 4;

  /**
   * Constructeur de la page associé au formulaire pour les programmes
   * @param programmesServices Service permettant de gérer les programmes
   * @param competencesServices Service permettant de gérer les compétences dans le modal
   * @param formBuilder Constructeur pour le formulaire réactif pour les programmes
   * @param router Routeur permettant de rediriger après soumission du formulaire
   * @param activatedRoute Routeur permettant d'obtenir des informations sur la route en cours
   * @param modalCtrl Contrôleur pour le modal permettant de choisir les compétences d'un programme
   */
  constructor(
      private programmesServices: ProgrammeService,
      private competencesServices: CompetencesService,
      private formBuilder: FormBuilder,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private modalCtrl: ModalController
  ) { }

  /**
   * Méthode appelée à l'initialisation de la page pour rendre le formulaire réactif
   */
  ngOnInit() {
    // Rendre le formulaire pour les programmes réactif
    this.programmeForm = this.formBuilder.group({
      titre: ['', Validators.required],
      code: ['', [Validators.required, Validators.pattern(/^\d{3}\.[A-Z]\d$/)]],
      competences: this.formBuilder.array([])
  });
  }

  /**
   * Méthode permettant d'obtenir les données d'un programme spécifique au chargement de la page
   */
  ionViewWillEnter() {
    // Obtenir l'programme correspondant à l'identifiant de l'URL
    try {
      // Obtenir l'identifiant de l'programme de l'URL
      this.programmeId = parseInt(this.activatedRoute.snapshot.paramMap.get('id') as string);
      // Vérifier si l'URL possède un identifiant d'programme
      if (this.programmeId) {
        // Obtenir l'programme spécifique correspondant à la session
        this.getProgramme(this.programmeId);
      }
    } catch (erreur) {
      // En cas d'échec d'obtention de l'programme, rediriger vers la liste des programmes
      this.router.navigate(['/programmes']).then(promesse => true);
    }
    // Obtenir la liste des compétences de l'programme
    this.getCompetences();
  }

  /**
   * Méthode permettant de désabonner l'observable contenant les sessions quand la page est fermée
   */
  ionViewWillLeave() {
    this.observableProgramme$.unsubscribe();
    this.observableCompetence$.unsubscribe();
  }

  /**
   * Méthode permettant d'obtenir un programme spécifique selon son identifiant
   * @param id Identifiant de l'programme à obtenir
   */
  getProgramme(id: number) {
    // Obtenir l'programme recherché via le service
    this.observableProgramme$ = this.programmesServices.getProgramme(id).subscribe({
      next: (res: ApiResponse<Programme>) => {
        // Si le service retourne un programme existant
        if (res.data) {
          // Attribuer les données de l'API à l'programme
          this.programme = res.data;
          // Mettre le formulaire en mode modification
          this.formModification = true;
          // Insérer l'programme trouvé dans les champs correspondants du formulaire
          this.programmeForm.patchValue(res.data);
          // Obtenir les sections du formArray
          const competencesArray = this.programmeForm.get('competences') as FormArray;
          // Supprimer toutes les compétences se trouvant dans le formArray pour les compétences
          while (competencesArray.length) {
            competencesArray.removeAt(0);
          }
          // Ajouter toutes les compétences dans le formArray en tenant compte de l'ordre
          this.programme.competences?.forEach((competence: Competence, index: number) => {
            competencesArray.insert(index, this.createCompetenceFormGroup(competence));
          });
        }
      },
      error: (err) => {
        this.afficherErreur('Un problème est survenu lors du chargement du programme.');
      }
    });
  }

  /**
   * Méthode permettant de créer un nouveau programme selon les données du formulaire
   */
  createProgrammeFormulaire() {
    // Créer un nouveau programme puis rediriger vers la liste des programmes
    this.programmesServices.createProgramme(this.programmeForm.value).subscribe({
      next: () => this.router.navigate(['/programmes']).then(promesse => true)
    });
  }

  /**
   * Méthode permettant de modifier un programme selon les données du formulaire
   */
  updateProgramme() {
    // Modifier un programme selon les données du formulaire puis rediriger vers la liste des programmes
    this.programmesServices.updateProgramme(this.programmeId, this.programmeForm.value).subscribe({
      next: () => this.router.navigate(['/programmes']).then(promesse => true)
    });
  }

  /**
   * Méthode permettant d'obtenir l'ensemble des compétences de la base de données
   */
  getCompetences() {
    this.observableCompetence$ = this.competencesServices.getCompetences().subscribe({
      next: (res: ApiResponse<Competence[]>) => {
        res.data ? this.lsCompetence = res.data : '';
      },
      error: (err) => {
        this.afficherErreur('Une erreur est survenue lors du chargement des compétence.');
      }
    });
  }

  /**
   * Méthode permettant d'obtenir le formArray pour les compétences dans le formulaire des programmes
   */
  get competences() {
    return this.programmeForm.get('competences') as FormArray;
  }

  /**
   * Méthode permettant de créer un formGroup pour une compétence dans le formArray pour la liste des compétences
   * @param competence Compétence pour laquelle le formGroup sera créé
   */
  createCompetenceFormGroup(competence: Competence) {
    return this.formBuilder.group({
      id: [competence.id],
      code: [competence.code],
      enonce: [competence.enonce],
      annee_devis: [competence.annee_devis],
      pages_devis: [competence.pages_devis],
      contexte: [competence.contexte],
    });
  }

  /**
   * Méthode permettant de retirer une compétence de la liste sélectionnée pour un programme
   * @param index Index de la compétence à retirer
   */
  retirerCompetence(index: number) {
    this.competences.removeAt(index);
  }

  /**
   * Méthode permettant de gérer la sélection des compétences d'un programme via un modal
   */
  async ouvrirModalCompetences() {
    // Obtenir le FormArray pour les compétences de l'programme provenant du formulaire
    const competencesArray = this.programmeForm.get('competences') as FormArray;

    // Obtenir les compétences déjà sélectionnées pour l'programme
    const competencesSelection = competencesArray.value.map((competence: Competence) => competence.id);

    // Créer le modal permettant de gérer les compétences
    const modal = await this.modalCtrl.create({
      component: RechercheComboBoxCheckboxComponent,
      componentProps: {
        'titre': 'Compétences',
        'objets': this.lsCompetence.map(competence => ({ text: competence.enonce, value: competence.id })), // Utilisez competence.id comme valeur
        'objetsSelectionnes': competencesSelection || [],
      },
    });

    // Afficher le modal permettant de gérer les compétences
    await modal.present();

    // Obtenir les données du modal suite à sa fermeture par l'utilisateur
    const { data, role } = await modal.onWillDismiss();

    // Lorsque l'utilisateur appuie sur le bouton de confirmation
    if (role === 'confirme') {
      // Parcourir les IDs de compétences sélectionnées
      for (const id of data) {
        // Vérifier si cette compétence est déjà dans le formulaire
        if (!competencesArray.value.some((competence: Competence) => competence.id === id)) {
          // Trouver la compétence sélectionnée dans le tableau lsCompetence
          const competenceSelectionnee = this.lsCompetence.find(competenceRecherchee => competenceRecherchee.id === id);
          // Si elle est trouvée, l'ajouter au FormArray pour les compétences
          if (competenceSelectionnee) {
            competencesArray.push(this.createCompetenceFormGroup(competenceSelectionnee));
          }
        }
      }
      // Supprimer les compétences qui n'ont pas été sélectionnées dans le modal
      for (let i = competencesArray.length - 1; i >= 0; i--) {
        const competenceSupprimee = competencesArray.at(i);
        if (!data.includes(competenceSupprimee.value.id)) {
          competencesArray.removeAt(i);
        }
      }
      // Mettre à jour la liste des compétences sélectionnées
      this.competencesSelectionnes = this.competencesSelectionnes.filter(competence => data.includes(competence.id));
    }
  }

  /**
   * Méthode permettant de gérer l'ordre de la liste des compétences via le glisser-déposer
   * @param evenement Évènement permettant de gérer les compétences d'un programme
   */
  gestionOrdreCompetences(evenement: CustomEvent<ItemReorderEventDetail>) {
    // Obtenir le FormArray pour les compétences de l'programme modifié avec le glisser-déposer
    const competencesFormulaire = evenement.detail.complete(this.competences.controls);
    // Obtenir le FormArray pour les compétences de l'programme existant
    const competencesArray = this.programmeForm.get('competences') as FormArray;
    // Supprimer toutes les compétences se trouvant dans le FormArray pour les compétences
    while (competencesArray.length) {
      competencesArray.removeAt(0);
    }
    // Ajouter toutes les compétences dans le FormArray en tenant compte de l'ordre modifié
    competencesFormulaire.forEach((competence: FormGroup) => {
      competencesArray.push(this.createCompetenceFormGroup(competence.value));
    });
  }

  /**
   * Méthode permettant d'afficher un modal pour la gestion des erreurs
   * @author Samir El Haddaji
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

  /**
   * Méthode permettant d'ajouter des options à l'intérieur des breadcrumbs
   */
  expandBreadcrumbs() {
    this.maxBreadCrumbs = 20;
  }
}
