import {Competence} from '../competences/competence';
import {PlanCadres} from '../planCadres/plan-cadres';

export interface LienCompetencesPlansCadres {
  id:number;
  competence: Competence;
  planCadre: PlanCadres;
  contexteLocal?:string;
  atteinte?: string;
  progression?:string;
}
