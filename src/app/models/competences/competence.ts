import {ElementCompetence} from '../elementsCompetences/element-competence';
/* @author lebel */
export interface Competence {
  'id': number,
  'code': string,
  'enonce': string,
  'annee_devis': number,
  'pages_devis': string,
  'contexte': string,
  'programme_id': number | null,
  'elementsCompetences': ElementCompetence[]
}
