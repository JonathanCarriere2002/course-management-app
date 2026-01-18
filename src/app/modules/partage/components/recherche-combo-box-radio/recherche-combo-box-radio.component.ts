/**
 * @author Jacob Beauregard-Tousignant
 * Vient de la documentation de Ionic:
 *  https://ionicframework.com/docs/api/select
 */

import { Component, Input, Output } from '@angular/core';
import type { OnInit } from '@angular/core';
import { RechercheCbo } from '../../../../models/RechercheCbo/recherche-cbo';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-recherche-combo-box-radio',
  templateUrl: './recherche-combo-box-radio.component.html',
  styleUrls: ['./recherche-combo-box-radio.component.scss'],
})
export class RechercheComboBoxRadioComponent implements OnInit {
  @Input() objetsRecherche: RechercheCbo[] = [];
  @Input() titre = 'Sélectionner des objets';
  @Output() @Input() valeurActuelle!: string;
  @Output() objetSelectionne!: RechercheCbo;
  objetsFiltres: RechercheCbo[] = [];


  constructor(private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.objetsFiltres = [...this.objetsRecherche];

  }

  trackItems(index: number, objet: RechercheCbo) {
    return objet.value;
  }

  /**
   * Méthode pour annuler un choix
   */
  cancelChanges():Promise<boolean> {
    return this.modalCtrl.dismiss(null, 'annule')
  }

  /**
   * Méthode pour confirmer le choix d'un élément
   */
  confirmChanges():Promise<boolean> {
    return this.modalCtrl.dismiss(this.objetSelectionne, 'confirme')
  }

  radioSelectionne(valeur:RechercheCbo){

    this.valeurActuelle = valeur.text;
    this.objetSelectionne = valeur;
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
      this.objetsFiltres = [...this.objetsRecherche];
    } else {
      /**
       * S'il y a une requête, la normalise et recherche tous les objets qui contiennent la recherche
       */
      const normalizedQuery = searchQuery.toLowerCase();
      this.objetsFiltres = this.objetsRecherche.filter((item) => {
        return item.text.toLowerCase().includes(normalizedQuery);
      });
    }
  }

}
