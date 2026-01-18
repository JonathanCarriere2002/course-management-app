/**
 * @author Emeric Chauret
 */
export interface EnseignantPlanCours {
  'id': number,
  'nom': string,
  'groupe': number | null,
  'dispo': string | null,
  'bureau'?: string,
  'courriel'?: string,
  'poste'?: number,
}
