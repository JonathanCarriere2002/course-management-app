import {ElementCompetence} from '../elementsCompetences/element-competence';

/**
 * @author Jacob Beauregard-Tousignant
 */
export interface CriteresEvaluations {
  'id':number,
  'enonce':string,
  'ponderation':number,
  'elementsCompetence'?:ElementCompetence[],
  'elementsCompetenceNumeros'?:ElementCompetence[]
}
