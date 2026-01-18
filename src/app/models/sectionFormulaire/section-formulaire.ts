/**
 * @author Emeric Chauret
 */

export interface SectionFormulaire {
  'id': number,
  'titre': string,
  'info_suppl': string,
  'texte': string,
  'aide': string,
  'obligatoire': boolean,
  'type_section_id': number
}
