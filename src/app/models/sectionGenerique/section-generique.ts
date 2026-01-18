/**
 * @author Jacob Beauregard-Tousignant
 * Interface pour les sections génériques des détails des plans-cadres et plans de cours
 * C'est à dire les sections avec un titre et un richtext
 */
export interface SectionGenerique {
  titre:string,
  contenu:string,
  infosSupplementaires?:string
}
