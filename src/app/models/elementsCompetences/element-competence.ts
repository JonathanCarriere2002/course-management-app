/* @author Lebel */
import {CriterePerformance} from '../criteresPerformances/critere-performance';

export interface ElementCompetence {
  'id': number,
  'numero': number,
  'texte': string,
  'criteresPerformance': CriterePerformance[],
  isExpanded: boolean
}
