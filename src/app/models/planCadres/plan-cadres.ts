/**
 * @author Jaocb Beauregard-Tousignant
 */
import {CriteresEvaluations} from '../critereEvaluation/criteres-evaluations';
import {Session} from '../sessions/session';
import {LiensPlansCadres} from '../lienPlansCadres/liens-plans-cadres';
import {LienCompetencesPlansCadres} from '../lienCompetencesPlansCadres/lien-competences-plans-cadres';
import {Programme} from '../programmes/programme';
import {
  LienElementsCompetencesPlansCadres
} from '../lienElementsCompetencesPLansCadres/lien-elements-competences-plans-cadres';
import {SectionFormulaire} from '../sectionFormulaire/section-formulaire';

export interface PlanCadres {
  'id': number,
  'code': string,
  'titre': string,
  'ponderation': string,
  'unites': number,
  'attitudes': string,
  'complet':boolean;

  'ponderationFinale': number,
  'sections': SectionFormulaire[],
  'changement'?: Date,
  'approbationDepartement': Date,
  'approbationComite': Date,
  'depotDirectionEtudes': Date,
  'criteresEvaluations': CriteresEvaluations[],
  'programme': Programme
  'competences':LienCompetencesPlansCadres[],
  'elementsCompetences'?:LienElementsCompetencesPlansCadres[],
  'entreVigueur':Session,
  'coursLiesPrealablesRelatifs'?:LiensPlansCadres[],
  'coursLiesPrealablesAbsolus'?:LiensPlansCadres[],
  'coursLiesCorequis'?:LiensPlansCadres[],
  'coursLiesSuivants'?:LiensPlansCadres[],

}
