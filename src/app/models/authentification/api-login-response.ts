import {Utilisateur} from '../utilisateurs/utilisateur';

/**
 * Modèle représentant une réponse de connexion de l'API
 * @author Jonathan Carrière
 */
export interface ApiLoginResponse {
  /** Utilisateur qui tente d'effectuer une connexion */
  user : Utilisateur,
  /** Token de l'utilisateur */
  token : string
}
