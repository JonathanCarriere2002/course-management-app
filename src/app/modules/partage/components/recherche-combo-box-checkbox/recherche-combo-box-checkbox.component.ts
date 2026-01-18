/**
 * @author Jacob Beauregard-Tousignant
 * Vient de la documentation de Ionic:
 *  https://ionicframework.com/docs/api/select
 */

import { Component, Input } from '@angular/core';
import type { OnInit } from '@angular/core';
import { RechercheCbo } from '../../../../models/RechercheCbo/recherche-cbo';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-recherche-combo-box-checkbox',
  templateUrl: './recherche-combo-box-checkbox.component.html',
  styleUrls: ['./recherche-combo-box-checkbox.component.scss'],
})
export class RechercheComboBoxCheckboxComponent implements OnInit {
  @Input() objets: RechercheCbo[] = [];
  @Input() objetsSelectionnes: string[] = [];
  @Input() titre = '';

  objetsFiltres: RechercheCbo[] = [];
  valeursSelectionnees: string[] = [];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.objetsFiltres = [...this.objets];
    this.valeursSelectionnees = [...this.objetsSelectionnes];
  }

  trackItems(index: number, objet: RechercheCbo) {
    return objet.value;
  }

  cancelChanges():Promise<boolean> {
    return this.modalCtrl.dismiss(null, 'annule')
  }

  confirmChanges():Promise<boolean> {
    return this.modalCtrl.dismiss(this.valeursSelectionnees, 'confirme')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchbarInput(ev: any) {
    this.filterList(ev.target.value);
  }

  /**
   * Met à jour la liste des objets sélectionnable
   * Selon la requête de recherche.
   * S'il n'y a pas de requêtes, tous les objets sont affichées.
   */
  filterList(searchQuery: string | undefined) {
    /**
     * S'il n'y a pas de requête, retourne tout
     */
    if (searchQuery === undefined) {
      this.objetsFiltres = [...this.objets];
    } else {
      /**
       * S'il y a une requête, la normalise et recherche tous les objets qui contiennent la recherche
       */
      const normalizedQuery = searchQuery.toLowerCase();
      this.objetsFiltres = this.objets.filter((item) => {
        return item.text.toLowerCase().includes(normalizedQuery);
      });
    }
  }

  isChecked(value: string) {
    return this.valeursSelectionnees.find((item) => item === value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkboxChange(ev: any) {
    const { checked, value} = ev.detail;

    if (checked) {
      this.valeursSelectionnees = [...this.valeursSelectionnees, value];
    } else {
      this.valeursSelectionnees = this.valeursSelectionnees.filter((item) => item !== value);
    }
  }

}
