import {ElementCompetence} from '../elementsCompetences/element-competence';
import {PlanCours} from '../planCours/plan-cours';

/**
 * Modèle représentant les semaines de cours d'un plan de cours
 * @author Jonathan Carrière
 */
export interface SemaineCours {
  /** Id pour la semaine de cours */
  'id': number,
  /** Numéro de la première semaine de cours */
  'semaineDebut': number,
  /** Numéro de la dernière semaine de cours */
  'semaineFin': number,
  /** Liste des éléments de compétences pour la semaine de cours */
  'elementsCompetences'?: ElementCompetence[],
  /** Contenu de la semaine de cours */
  'contenu': string,
  /** Activités de la semaine de cours */
  'activites': string,
  /** Plan de cours de la semaine de cours */
  'planCours'?: PlanCours
}
