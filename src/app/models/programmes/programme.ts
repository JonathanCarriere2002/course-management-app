import {Competence} from '../competences/competence';

/**
 * @author Samir El Haddaji
 */
export interface Programme {
  'id': number,
  'code': string,
  'titre': string,
  'competences'?: Competence[]
}
