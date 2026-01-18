import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'; // , Validators Import de validation enelevee car sinon erreur async...
import {ModalController} from '@ionic/angular';
import {CriterePerformanceService} from '../../../../services/criteresPerformances/critere-performance.service';
import {ElementCompetenceService} from '../../../../services/elementsCompetences/element-competence.service';
import {ElementCompetence} from '../../../../models/elementsCompetences/element-competence';
import {CriterePerformance} from '../../../../models/criteresPerformances/critere-performance';
import {Subscription} from 'rxjs';
// import {validateContent} from 'ionicons/dist/types/components/icon/validate'; Import de validation enelevee car sinon erreur async...
// import {ApiResponse} from '../../../../models/authentification/api-response'; Import de validation enelevee car sinon erreur async...
/* @author lebel */
@Component({
  selector: 'app-modal-formulaire-competence',
  templateUrl: './modal-formulaire-competence.component.html',
  styleUrls: ['./modal-formulaire-competence.component.scss'],
})
export class ModalFormulaireCompetenceComponent implements OnInit {
  observable$! : Subscription;
  // Variable pour suivre si le formulaire est en mode édition
  isEditing = false;
  // Id de l'objet à modifier
  id = 0;
  // Formulaire du modal
  formModal!: FormGroup;
  // Titre qui est definit dans l'appel du modal
  @Input() titreModal?: string
  // Input de critere et element //
  @Input() elementCompetence?: ElementCompetence
  @Input() criterePerformance?: CriterePerformance

  constructor(private criterePerformanceService: CriterePerformanceService,
              private elementCompetenceService: ElementCompetenceService,
              private formBuilder: FormBuilder,
              private modalController: ModalController) {
  }

  ngOnInit() {
    // Validation pour un element de competence
    if(this.titreModal?.includes('élément de compétence')){
      this.formModal = this.formBuilder.group({
        numero: ['', [Validators.required, Validators.pattern('^[1-9]\\d*\\.?$')]],
        texte: ['', [Validators.required, Validators.minLength(1)]],
        isExpanded: [false]
      });
    }
    // Validation pour un critere de performance
    if(this.titreModal?.includes('critère de performance')){
      this.formModal = this.formBuilder.group({
        numero: ['', [Validators.pattern('^(\\b[1-9]\\d*(\\.[1-9]+)\\b)?$')]],
        texte: ['', [Validators.required, Validators.minLength(1)]],
        isExpanded: [false]
      });
    }

    // Verification si on edit un element comp -> remplir input, changer titre et initier le id
    if (this.elementCompetence) {
      this.isEditing = true;
      this.id = this.elementCompetence.id;
      this.titreModal = "Modification d'un élément de compétence";
      this.elementCompetence.numero;
      this.elementCompetence.texte;
      this.formModal.patchValue(this.elementCompetence);
    }
    // Verification si on edit un critere de performance -> remplir input, changer titre et initier le id
    if (this.criterePerformance) {
      this.isEditing = true;
      this.id = this.criterePerformance.id;
      this.titreModal = "Modification d'un critère de performance";
      this.criterePerformance.numero;
      this.criterePerformance.texte;
      this.formModal.patchValue(this.criterePerformance);
    }
  }

  /**
   * Methode pour fermer le modal lorsqu'on appuie sur annuler
   */
  fermerModal() {
    return this.modalController.dismiss(null, 'cancel');
  }

  /**
   * Methode de confirmation qui envoie un message de confirmation + le date creer/modifie
   * @param data
   */
  confirmModal(data?: CriterePerformance | ElementCompetence) {
    this.observable$.unsubscribe()
    return this.modalController.dismiss(data, 'confirm');
  }


  // Gestion d'ajout d'element de comp et de critere de performance //
  ajout(): void {
    // Verifier s'il s'agit d'un ajout d'element de comp ou d'un critere
    if (this.titreModal?.includes('élément de compétence')) {
      // Ajout dans la BD
      this.observable$ = this.elementCompetenceService.createElementComptetence(this.formModal.value).subscribe({
        next: (elementCompetenceApiReponse) => {
          this.elementCompetence = elementCompetenceApiReponse.data as ElementCompetence;
          this.confirmModal(this.elementCompetence);
        }
      });
    }
    else if(this.titreModal?.includes('critère de performance')) {
      // Ajout dans la BD
      this.observable$ = this.criterePerformanceService.createCriterePerformance(this.formModal.value).subscribe({
        next: (CriterePerformanceApiReponse) => {
          this.criterePerformance = CriterePerformanceApiReponse.data as CriterePerformance;
          this.confirmModal(this.criterePerformance);
        }
      });
    }
  }

  // Gestion de modification d'element de comp et de critere de performance //
  modification(): void{
    // Verifier s'il s'agit d'une modif d'un element de comp ou d'un critere
    if(this.titreModal?.includes('critère de performance')){
      // Modification dans la BD
      this.observable$ = this.criterePerformanceService.updateCriterePerformance(this.id, this.formModal.value).subscribe({
        next: (CriterePerformanceApiReponse) => {
          this.criterePerformance = CriterePerformanceApiReponse.data as CriterePerformance;
          this.confirmModal(this.criterePerformance);
        }
      });
    }
    else{
      // Modification dans la BD
      this.observable$ = this.elementCompetenceService.updateElementComptetence(this.id, this.formModal.value).subscribe({
        next: (elementCompetenceApiReponse) => {
          this.elementCompetence = elementCompetenceApiReponse.data as ElementCompetence;
          this.confirmModal(this.elementCompetence);
        }
      });
    }
  }




}
