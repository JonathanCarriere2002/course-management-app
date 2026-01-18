/**
 * @author Emeric Chauret
 */

import {Component, Input} from '@angular/core';
import {SemaineCours} from '../../../../models/semainesCours/semaine-cours';

@Component({
  selector: 'app-tableau-calendrier-activites',
  templateUrl: './tableau-calendrier-activites.component.html',
  styleUrls: ['./tableau-calendrier-activites.component.scss'],
})
export class TableauCalendrierActivitesComponent {

  @Input() titre!: string;
  @Input() semainesCours!: SemaineCours[];

}
