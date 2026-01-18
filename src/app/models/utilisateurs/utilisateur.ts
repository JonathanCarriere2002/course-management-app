import {Role} from '../roles/role';
import {Programme} from '../programmes/programme';

/**
 * Modèle représentant un utilisateur
 * @author Jonathan Carrière
 */
export interface Utilisateur {
  /** Id pour l'utilisateur */
  id: number;
  /** Nom de l'utilisateur */
  nom: string;
  /** Prénom de l'utilisateur */
  prenom: string;
  /** Courriel de l'utilisateur */
  courriel: string;
  /** Date de vérification du courriel de l'utilisateur */
  courriel_verifie: Date;
  /** Mot de passe de l'utilisateur */
  mot_de_passe: string;
  /** Rôle de l'utilisateur */
  role: number;
  /** Rôle (objet) de l'utilisateur */
  roleObjet?: Role;
  /** Numéro de bureau de l'utilisateur */
  bureau?: string;
  /** Numéro de poste de l'utilisateur */
  poste?: number;
  /** Liste des identifiants des programmes dont l'utilisateur fait partie */
  programmes?: Programme[];
  /** Date de création de l'utilisateur */
  created_at?: Date;
  /** Date de mise à jour de l'utilisateur */
  updated_at?: Date;
}
