/**
 * @author Jacob Beauregard-Tousignant
 */

import {Component, Input} from '@angular/core';
import {SectionGenerique} from '../../../../models/sectionGenerique/section-generique';

@Component({
  selector: 'app-section-generique-detail',
  templateUrl: './section-generique-detail.component.html',
  styleUrls: ['./section-generique-detail.component.scss'],
})
/**
 * Componnent pour ajouter des sections génériques aux détails des plans-cadres et plans de cours
 * C'est à dire une section avec un titre et un richtext
 */
export class SectionGeneriqueDetailComponent{
  @Input() section: SectionGenerique = {
    contenu: '',
    titre: ''
  };



}
