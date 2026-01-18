import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ElementCompetence} from '../../../../models/elementsCompetences/element-competence';
import {RechercheComboBoxCheckboxComponent} from '../../../partage/components/recherche-combo-box-checkbox/recherche-combo-box-checkbox.component';
import {ModalController} from '@ionic/angular';
import {PlanCours} from '../../../../models/planCours/plan-cours';
import {Section} from '../../../../models/section/section';

/**
 * Component contenant la section du formulaire des plans de cours permettant d'effectuer la gestion des semaines de cours
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-semaines-cours',
  templateUrl: './semaines-cours.component.html',
  styleUrls: ['./semaines-cours.component.scss'],
})
export class SemainesCoursComponent implements OnInit {

  // Input permettant de recevoir le formulaire pour le plan de cours
  @Input() planCoursForm!: FormGroup;

  // Input contenant le nom du formArray pour les semaines de cours
  @Input() formArrayName!: string;

  // Input contenant la liste des éléments de compétences
  @Input() lsElementsCompetences!: ElementCompetence[];

  // Input contenant la liste des éléments de compétences sélectionnés
  @Input() elementsCompetencesSelectionnes!: ElementCompetence[];

  // Input contenant le plan de cours créé ou modifié via le formulaire
  @Input() planCours!: PlanCours;

  // Input contenant la section du formulaire pour les semaines de cours
  @Input() section!: Section;

  // Input permettant d'indiquer au component si le formulaire crée ou modifier un plan de cours
  @Input() formModif!: boolean;

  // Input permettant de savoir si un plan cadre a été sélectionné dans le formulaire des plans de  cours
  @Input() planCadreSelectionne!: boolean;

  /**
   * Constructeur pour le component contenant les semaines de cours du formulaire pour un plan de cours
   * @param modalCtrl Contrôleur permettant d'afficher le modal pour la suppression de semaines de cours
   * @param formBuilder FormBuilder permettant de construire le formulaire pour les semaines de cours
   */
  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder) { }

  /**
   * Méthode appelée sur l'initialisation du component permettant de charger les semaines de cours
   */
  ngOnInit() {
    // Obtenir le formArray pour les semaines de cours
    const semainesCoursFormArray = this.planCoursForm.get(this.formArrayName) as FormArray;
    // Vérifier si le formulaire pour le plan de cours est en mode 'modification' et qu'aucune semaine de cours est déjà chargée
    if (this.formModif && semainesCoursFormArray.length === 0) {
      // Charger les semaines de cours dans le formulaire
      this.planCours.semaines_cours.forEach((semaineCours) => {
        semainesCoursFormArray.push(this.createSemaineCoursFormGroup());
        semainesCoursFormArray.at(semainesCoursFormArray.length - 1).patchValue(semaineCours);
      });
      // Charger les éléments de compétences pour les semaines de cours
      this.chargerElementsCompetences();
    }
  }

  /**
   * Méthode permettant d'ajouter des semaines de cours dans la section correspondante du formulaire
   * @author Jonathan Carrière
   */
  addSemaineCours() {
    // Obtenir le FormArray pour les semaines de cours
    const semainesCours = this.planCoursForm.get(this.formArrayName) as FormArray;
    // Ajouter une semaine de cours au FormArray
    semainesCours.push(this.createSemaineCoursFormGroup());
  }

  /**
   * Méthode permettant de supprimer des semaines de cours dans la section correspondante du formulaire
   * @param index index de la semaine de cours qui sera supprimée
   * @author Jonathan Carrière
   */
  removeSemaineCours(index: number) {
    // Obtenir le FormArray pour les semaines de cours
    const semainesCours = this.planCoursForm.get(this.formArrayName) as FormArray;
    // Supprimer la semaine de cours à l'index au FormArray
    semainesCours.removeAt(index);
  }

  /**
   * Méthode permettant de créer un FormGroup pour une semaine de cours
   * @author Jonathan Carrière
   */
  createSemaineCoursFormGroup(): FormGroup {
    // Créer le FormGroup pour une semaine de cours
    return this.formBuilder.group({
      id: [''],
      semaineDebut: ['', [Validators.required, Validators.min(1), Validators.max(15)]],
      semaineFin: ['', [Validators.required, Validators.min(1), Validators.max(15)]],
      contenu: [''],
      activites: [''],
      elementsCompetences: this.formBuilder.array([])
    });
  }

  /**
   * Méthode permettant d'obtenir le FormArray correspondant aux semaines de cours dans le formulaire
   * @author Jonathan Carrière
   */
  get formArraySemainesCours() {
    // Retourner le FormArray pour les semaines de cours
    return this.planCoursForm.get(this.formArrayName) as FormArray;
  }

  /**
   * Méthode permettant d'ouvrir un modal afin d'effectuer la sélection des éléments de compétences pour une semaine de cours
   * @param semaineIndex index de la semaine de cours pour laquelle sera effectuer la sélection des éléments de compétences
   * @author Jonathan Carrière
   */
  async ouvrirModalElementsCompetences(semaineIndex: number) {

    // Obtenir le FormArray pour les éléments de compétences de la semaine de cours spécifiée selon l'index
    const elementsCompetenceArray = this.getElementsCompetencesArray(semaineIndex);

    // Obtenir les identifiants des éléments de compétences déjà sélectionnés pour une semaine de cours
    const elementsCompetencesSelection = elementsCompetenceArray.value.map((ec: ElementCompetence) => ec.id);

    // Création du modal permettant d'effectuer la sélection des éléments de compétences
    const modal = await this.modalCtrl.create({
      component: RechercheComboBoxCheckboxComponent,
      componentProps: {
        'titre' : 'Éléments de compétences',
        'objets' : this.lsElementsCompetences.map(elementCompetence => ({ text: elementCompetence.numero + ' - ' + elementCompetence.texte, value: elementCompetence.id })) || [],
        'objetsSelectionnes': elementsCompetencesSelection || []
      }
    });

    // Afficher le modal permettant d'effectuer la sélection des éléments de compétences
    await modal.present();

    // Obtenir les données du modal de sélection avant qu'il disparaisse
    const { data, role } = await modal.onWillDismiss();

    // Lorsque l'utilisateur appuie sur le bouton de confirmation pour le modal de sélection
    if (role === 'confirme') {
      // Ajouter les éléments de compétences sélectionnés dans le formulaire
      for (const id of data) {
        // Vérifier si cet élément de compétence est déjà dans le formulaire pour la semaine de cours
        if (!elementsCompetenceArray.value.some((elementCompetence: ElementCompetence) => elementCompetence.id === id)) {
          // Rechercher pour l'élément de compétence spécifique dans la liste
          const elementCompetenceSelectionner = this.lsElementsCompetences.find(elementCompetenceRechercher => elementCompetenceRechercher.id === id);
          // Si l'élément de compétence en question est trouvé, l'ajouter dans le FormArray pour les éléments de compétences d'une semaine de cours spécifique
          if (elementCompetenceSelectionner) {
            elementsCompetenceArray.push(this.createElementsCompetenceFormGroup(elementCompetenceSelectionner));
          }
        }
      }
      // Supprimer les éléments de compétences non-sélectionnés dans le formulaire
      for (let ec = elementsCompetenceArray.length - 1; ec >= 0; ec--) {
        // Élément de compétence à l'index de la liste des éléments de compétences d'une semaine de cours
        const elementCompetenceSupprimer = elementsCompetenceArray.at(ec);
        // Si les éléments de compétences sélectionnés via le modal n'inclut pas celui-ci, le supprimer du formulaire
        if (!data.includes(elementCompetenceSupprimer.value.id)) {
          elementsCompetenceArray.removeAt(ec);
        }
      }
      // Ajouter les éléments de compétences sélectionnés dans le formulaire
      this.elementsCompetencesSelectionnes = this.elementsCompetencesSelectionnes.filter(e => data.includes(e.id));
    }

  }

  /**
   * Méthode permettant de créer un FormGroup pour un élément de compétence
   * @param elementCompetence Objet de type 'ElementCompetence' pour lequel sera créé le FormGroup
   * @author Jonathan Carrière
   */
  createElementsCompetenceFormGroup(elementCompetence: ElementCompetence) {
    // Créer le FormGroupe pour l'élément de compétence
    return this.formBuilder.group({
      id: [elementCompetence.id, Validators.required],
      numero: [parseInt(String(elementCompetence.numero))],
      texte: [elementCompetence.texte]
    });
  }

  /**
   * Méthode permettant d'afficher les éléments de compétences des semaines de cours dans le formulaire
   * @author Jonathan Carrière
   */
  chargerElementsCompetences() {
    // Vérifier si le formulaire est en train de modifier un plan de cours
    if (this.formModif) {
      // Obtenir le FormArray pour les semaines de cours
      const semainesCoursFormArray = this.formArraySemainesCours;
      // Parcourir la liste des semaines de cours du plan de cours
      this.planCours.semaines_cours.forEach((semaineCours, semaineIndex) => {
        // Obtenir le FormArray pour les éléments de compétences d'une semaine de cours
        const elementsCompetencesFormArray = semainesCoursFormArray.at(semaineIndex).get('elementsCompetences') as FormArray;
        // Définir la liste des éléments de compétences d'une semaine de cours
        const elementsCompetenceList = semaineCours.elementsCompetences;
        // Si la liste des éléments de compétences pour la semaine de cours spécifiée n'est pas vide
        if (elementsCompetenceList) {
          // Parcourir la liste des éléments de compétences pour une semaine de cours
          elementsCompetenceList.forEach((elementCompetence) => {
            // Vérifier si le FormArray pour les éléments de compétences ne contient pas déjà cet objet
            if (!elementsCompetencesFormArray.value.some((ec: ElementCompetence) => ec.id === elementCompetence.id)) {
              // Trouver l'élément de compétence dans la liste de ces objets de la semaine de cours
              const selectedElementCompetence = this.lsElementsCompetences.find(ec => ec.id === elementCompetence.id);
              // Si l'élément de compétence est trouvée, l'ajouter dans le formulaire
              if (selectedElementCompetence) {
                elementsCompetencesFormArray.push(this.createElementsCompetenceFormGroup(selectedElementCompetence));
              }
            }
          });
        }
      });
    }
  }

  /**
   * Méthode permettant d'obtenir le FormArray pour un élément de compétence spécifique
   * @param semaineIndex Index de la semaine de cours qui contient les éléments de compétences
   * @author Jonathan Carrière
   */
  getElementsCompetencesArray(semaineIndex: number) {
    // Obtenir les éléments de compétences pour une semaine de cours spécifique
    const semainesCoursArray = this.planCoursForm.get(this.formArrayName) as FormArray;
    const semaineCours = semainesCoursArray.at(semaineIndex);
    return semaineCours.get('elementsCompetences') as FormArray;
  }

  /**
   * Méthode permettant de retirer un élément de compétence spécifique à une semaine de cours
   * @param semaineCoursIndex Index de la semaine de cours dans le formulaire
   * @param elementCompetenceIndex Index de l'élément de compétence de la semaine de cours dans le formulaire
   * @author Jonathan Carrière
   */
  retirerElementCompetence(semaineCoursIndex: number, elementCompetenceIndex: number) {
    // Obtenir le formArray de l'élément de compétences et supprimer l'élément de compétence spécifique
    const elementsCompetencesArray = this.getElementsCompetencesArray(semaineCoursIndex);
    elementsCompetencesArray.removeAt(elementCompetenceIndex);
  }

}
