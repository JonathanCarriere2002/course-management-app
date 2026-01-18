/**
 * @author Jacob beauregard-Tousignant
 */


import {Component, Input} from '@angular/core';
import {PlanCadres} from '../../../../models/planCadres/plan-cadres';

@Component({
  selector: 'app-tableau-competence',
  templateUrl: './tableau-competence.component.html',
  styleUrls: ['./tableau-competence.component.scss'],
})
export class TableauCompetenceComponent {
  @Input() planCadre?:PlanCadres;

}
