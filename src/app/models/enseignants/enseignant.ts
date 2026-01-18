import {PlanCours} from '../planCours/plan-cours';
import {Programme} from '../programmes/programme';

/**
 * Modèle représentant un enseignant
 * @author Jonathan Carrière
 * @author Samir El Haddaji
 */
export interface Enseignant {
  /** Id pour l'enseignant */
  'id': number,
  /** Prénom de l'enseignant */
  'prenom': string,
  /** Nom de l'enseignant */
  'nom': string,
  /** Adresse courriel de l'enseignant */
  'courriel': string,
  /** Bureau de l'enseignant */
  'bureau': string,
  /** Poste de l'enseignant */
  'poste'?: number,
  /** Liste des plans de cours de l'enseignant */
  'plansCours'?: PlanCours[],
  /** Liste des programmes l'enseignant */
  'programmes'?: Programme[]
}
