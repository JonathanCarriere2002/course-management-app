/**
 * Modèle représentant une réponse de l'API
 * @author Jonathan Carrière
 */
export interface ApiResponse<Type> {
  /** Données de la réponse */
  data?: Type,
  /** Erreur de la réponse */
  error? : {
    code : number,
    message : string[]
  }
}
