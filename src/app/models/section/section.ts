/**
 * @author Emeric Chauret
 */
export interface Section {
  'id': number,
  'titre': string,
  'info_suppl': string | null,
  'aide': string | null,
  'obligatoire': boolean,
  'type_section_id': number
}
