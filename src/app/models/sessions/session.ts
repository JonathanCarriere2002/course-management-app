import {PlanCours} from '../planCours/plan-cours';
import {PlanCadres} from '../planCadres/plan-cadres';

/**
 * Modèle représentant les sessions de cégep
 * @author Jonathan Carrière
 */
export interface Session {
  /** Id pour la session */
  'id': number,
  /** Année de la session */
  'annee': number,
  /** Type (Automne, Hiver, Été) de la session */
  'session': string,
  /** Date limite d'abandon de la session */
  'limite_abandon': Date,
  /** Liste des plans-cadre de la session */
  'plansCadres'?: PlanCadres[]
  /** Liste des plans de cours de la session */
  'plansCours'?: PlanCours[]
}
