/**
 * @author Emeric Chauret
 */

import {Component, Input, OnChanges} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Enseignant} from '../../../../models/enseignants/enseignant';
import {EnseignantPlanCours} from '../../../../models/enseignantPlanCours/enseignant-plan-cours';
import {ModalController} from '@ionic/angular';
import {
  RechercheComboBoxCheckboxComponent
} from '../../../partage/components/recherche-combo-box-checkbox/recherche-combo-box-checkbox.component';

@Component({
  selector: 'app-enseignants-plan-cours',
  templateUrl: './enseignants-plan-cours.component.html',
  styleUrls: ['./enseignants-plan-cours.component.scss'],
})
export class EnseignantsPlanCoursComponent implements OnChanges {

  @Input() formGroup!: FormGroup;
  @Input() formArrayName!: string;
  @Input() enseignants!: Enseignant[];
  @Input() enseignantsPlanCours!: EnseignantPlanCours[];

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder) { }

  ngOnChanges() {
    this.enseignantsPlanCours.map(epc => this.ajouterEnseignantFormGroup(epc));
  }

  /**
   * Méthode qui appelle le modal pour choisir des enseignants à lier au plan de cours.
   */
  async ouvrirModalEnseignants() {

    // Crée le modal
    const modal = await this.modalCtrl.create({
      component: RechercheComboBoxCheckboxComponent,
      componentProps: {
        'titre' : 'Enseignants',
        'objets' : this.enseignants.filter(e => !this.enseignantsPlanCours.some(epc => epc.id === e.id)).map(e => ({ text: e.prenom + ' ' + e.nom, value: e.id })),
      }
    });

    // Affiche le modal
    await modal.present();

    // Récupérer les données du modal avant qu'il disparaisse
    const { data, role } = await modal.onWillDismiss();

    // Si l'utilisateur a confirmé
    if (role === 'confirme') {
      // Ajouter les enseignants qui ont été cochés
      for (const id of data) {
        const enseignant = this.enseignants.find(e => e.id == id);
        if (enseignant) {
          const enseignantPlanCours = {
            id: enseignant.id,
            nom: enseignant.prenom + ' ' + enseignant.nom,
            groupe: null,
            dispo: null
          }
          this.enseignantsPlanCours.push(enseignantPlanCours);
          this.ajouterEnseignantFormGroup(enseignantPlanCours);
        }
      }
    }
  }

  /**
   * Méthode qui ajoute un enseignant dans le formulaire.
   * Elle crée un formgroup dans le formarray enseignants.
   * Elle lie les informations de l'enseignant en paramètre aux valeurs des formcontrol.
   * @param enseignant l'enseignant à ajouter dans le formulaire (EnseignantPlanCours)
   */
  ajouterEnseignantFormGroup(enseignant: EnseignantPlanCours){
    this.formArrayEnseignants.push(this.formBuilder.group({
      id: [enseignant.id, Validators.required],
      groupe: [enseignant.groupe, Validators.min(1)],
      dispo: [enseignant.dispo, Validators.maxLength(30)]
    }));
  }

  /**
   * Méthode qui supprime un enseignant dans le formulaire.
   * Elle supprime l'enseignants dans la liste des enseignants du plan de cours.
   * Elle supprime le formgroup dans le formarray enseignants.
   * @param index l'index de l'enseignant à supprimer dans le formulaire (number)
   */
  supprimerEnseignantFormGroup(index: number){
    this.enseignantsPlanCours.splice(index, 1);
    this.formArrayEnseignants.removeAt(index);
    this.formArrayEnseignants.updateValueAndValidity();
  }

  /**
   * Méthode qui récupère le formarray enseignants dans le formulaire.
   */
  get formArrayEnseignants() {
    return this.formGroup.get(this.formArrayName) as FormArray;
  }
}
