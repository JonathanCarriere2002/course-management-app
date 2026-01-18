/**
 * @author Emeric Chauret
 */

import {EnseignantPlanCours} from '../enseignantPlanCours/enseignant-plan-cours';
import {PlanCadres} from '../planCadres/plan-cadres';
import {Campus} from '../campus/campus';
import {Session} from '../sessions/session';
import {SemaineCours} from '../semainesCours/semaine-cours';
import {SectionFormulaire} from '../sectionFormulaire/section-formulaire';
import {Utilisateur} from '../utilisateurs/utilisateur';

export interface PlanCours {
  'id': number,
  'plan_cadre': PlanCadres | null,
  'campus': Campus | null,
  'session': Session | null,
  'enseignants': EnseignantPlanCours[],
  'sections': SectionFormulaire[],
  'semaines_cours': SemaineCours[],
  'approbation': Date | null,
  'complet': boolean,
  'cree_par'?: Utilisateur
}
