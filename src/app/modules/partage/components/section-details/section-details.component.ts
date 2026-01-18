/**
 * @author Emeric Chauret
 */

import {Component, Input} from '@angular/core';
import {SectionFormulaire} from '../../../../models/sectionFormulaire/section-formulaire';

@Component({
  selector: 'app-section-details',
  templateUrl: './section-details.component.html',
  styleUrls: ['./section-details.component.scss'],
})
export class SectionDetailsComponent{
  @Input() section!: SectionFormulaire;
}
