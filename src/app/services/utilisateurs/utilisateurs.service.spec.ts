import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {UtilisateursService} from './utilisateurs.service';
import {Utilisateur} from '../../models/utilisateurs/utilisateur';
import {of} from 'rxjs';

/**
 * Tests unitaires associés au service des utilisateurs
 * @author Jonathan Carrière
 */
describe('UtilisateursService', () => {
  let service: UtilisateursService;
  const espionHttpJasmine = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  const utilisateurAjouter: Utilisateur = {
    'id': 99,
    'nom': 'Carrière',
    'prenom': 'Jonathan',
    'courriel': 'utilisateurAjouter@email.qc.ca',
    'courriel_verifie': new Date(),
    'mot_de_passe': 'password123!',
    'role': 1
  };
  const utilisateurModifier: Utilisateur = {
    'id': 1,
    'nom': 'Carrière',
    'prenom': 'Jonathan',
    'courriel': 'utilisateurModifier@email.qc.ca',
    'courriel_verifie': new Date(),
    'mot_de_passe': 'password123!',
    'role': 1
  };
  const utilisateurSupprimerId = 2;
  const utilisateurs: Utilisateur[] = [
    {
      'id': 1,
      'nom': 'Carrière1',
      'prenom': 'Jonathan1',
      'courriel': 'utilisateurModifier@email.qc.ca',
      'courriel_verifie': new Date(),
      'mot_de_passe': 'password123!',
      'role': 1
    },
    {
      'id': 2,
      'nom': 'Carrière2',
      'prenom': 'Jonathan2',
      'courriel': 'utilisateurModifier@email.qc.ca',
      'courriel_verifie': new Date(),
      'mot_de_passe': 'password123!',
      'role': 1
    },
    {
      'id': 3,
      'nom': 'Carrière3',
      'prenom': 'Jonathan3',
      'courriel': 'utilisateurModifier@email.qc.ca',
      'courriel_verifie': new Date(),
      'mot_de_passe': 'password123!',
      'role': 1
    }
  ];

  /**
   * Configuration globale des tests pour le service des utilisateurs
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [{provide: HttpClient, useValue: espionHttpJasmine}]
    });
    service = TestBed.inject(UtilisateursService);
  });

  /**
   * Test unitaire permettant de vérifier si le service se génère correctement
   */
  it('doit générer le service', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier la création d'objets
   * @author Jonathan Carrière
   */
  it('createUtilisateur doit créer un utilisateur', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.post.and.returnValue({});
    // Créer un nouvel utilisateur via le service
    const result = service.createUtilisateur(utilisateurAjouter);
    // Vérifier que le service peut créer un utilisateur correctement
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });

  /**
   * Test unitaire permettant de vérifier la modification d'objets
   * @author Jonathan Carrière
   */
  it('updateUtilisateur doit modifier un utilisateur', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.put.and.returnValue({});
    // Modifier un utilisateur via le service
    const result = service.updateUtilisateur(utilisateurModifier.id, utilisateurModifier);
    // Vérifier que le service peut modifier un utilisateur correctement
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });

  /**
   * Test unitaire permettant de vérifier la suppression d'objets
   * @author Jonathan Carrière
   */
  it('deleteUtilisateur doit supprimer un utilisateur', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.delete.and.returnValue({});
    // Supprimer un utilisateur via le service
    const result = service.deleteUtilisateur(utilisateurSupprimerId);
    // Vérifier que le service peut supprimer un utilisateur correctement
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });

  /**
   * Test unitaire permettant de vérifier l'obtention de la liste des utilisateurs
   */
  it('getUtilisateurs doit obtenir la liste des utilisateurs', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.get.and.returnValue(of({data: utilisateurs}));
    // Obtenir la liste des rôles et vérifier la réponse
    service.getUtilisateurs().subscribe({
      next: reponse => expect(reponse).toEqual({data: utilisateurs})
    });
  });

  /**
   * Test unitaire permettant de vérifier l'obtention d'un utilisateur
   */
  it('getUtilisateur doit obtenir un utilisateur', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.get.and.returnValue(of({data: utilisateurs[0]}));
    // Obtenir la liste des rôles et vérifier la réponse
    service.getUtilisateur(utilisateurs[0].id).subscribe({
      next: reponse => expect(reponse).toEqual({data: utilisateurs[0]})
    });
  });

});
