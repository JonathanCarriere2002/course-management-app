//@Author Samir el HAddaji

import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tableau-bord',
  templateUrl: './tableau-bord.page.html',
  styleUrls: ['./tableau-bord.page.scss'],
})
export class TableauBordPage {

  // Quantité maximale pour les breadcrumbs
  maxBreadCrumbs = 3;

  constructor(public authService : AuthService) { }

  /**
   * Méthode permettant d'ajouter des options à l'intérieur des breadcrumbs
   */
  expandBreadcrumbs() {
    this.maxBreadCrumbs = 20;
  }

}
