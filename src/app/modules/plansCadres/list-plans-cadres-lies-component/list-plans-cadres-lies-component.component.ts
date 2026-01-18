import {Component, Input} from '@angular/core';

import {LiensPlansCadres} from '../../../models/lienPlansCadres/liens-plans-cadres';
import {PlanCadres} from '../../../models/planCadres/plan-cadres';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-list-plans-cadres-lies-component',
  templateUrl: './list-plans-cadres-lies-component.component.html',
  styleUrls: ['./list-plans-cadres-lies-component.component.scss'],
})
export class ListPlansCadresLiesComponentComponent {
  @Input() listPlansCadres?: LiensPlansCadres[];
  @Input() planCadre?: PlanCadres;

  constructor(public authService: AuthService) {
  }

}
