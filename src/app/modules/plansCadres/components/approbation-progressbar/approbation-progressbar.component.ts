import {Component, Input} from '@angular/core';
import { PlanCadres } from '../../../../models/planCadres/plan-cadres';

/**
 * Component permettant d'effectuer la gestion de la barre de progrès pour l'approbation d'un plan-cadre
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-approbation-progressbar',
  templateUrl: './approbation-progressbar.component.html',
  styleUrls: ['./approbation-progressbar.component.scss'],
})
export class ApprobationProgressbarComponent {

  // Input permettant de recevoir le plan-cadre à approuver
  @Input() planCadre!: PlanCadres;

  /**
   * Méthode permettant de mettre à jour la barre de progrès pour l'approbation d'un plan-cadre
   * @param planCadre Plan-cadre dont le statut d'approbation sera vérifié
   * @author Jonathan Carrière
   */
  updateProgressBar(planCadre: PlanCadres) {
    // Valeur qui sera utilisée pour la barre de progrès
    let valeur = 0;
    // Vérifier si le plan-cadre a été approuvé par le département
    if (planCadre.approbationDepartement != null) {
      valeur =  0.33;
    }
    // Vérifier si le plan-cadre a été approuvé par le comité de programme
    if (planCadre.approbationComite != null) {
      valeur =  0.66;
    }
    // Vérifier si le plan-cadre a été approuvé par la direction des études
    if (planCadre.depotDirectionEtudes != null) {
      valeur =  1;
    }
    // Retourner la valeur qui sera utilisée pour la barre de progrès
    return valeur;
  }

}
