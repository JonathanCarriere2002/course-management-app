import { TestBed } from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import { EnseignantsService } from './enseignants.service';
import {Enseignant} from '../../models/enseignants/enseignant';
import {of} from 'rxjs';

/**
 * Tests unitaires associés au service des enseignants
 * @author Jonathan Carrière
 * @author Samir El Haddaji
 */
describe('EnseignantsService', () => {
  let service: EnseignantsService;
  const espionHttpJasmine = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  const enseignantAjouter: Enseignant = {
    'id': 17,
    'prenom': 'Jonathan',
    'nom': 'Carrière',
    'courriel': 'jonathan@email.qc.ca',
    'bureau': '1.063',
    'poste': 2002
  };
  const enseignantModifier: Enseignant = {
    'id': 1,
    'prenom': 'Jonathan',
    'nom': 'Carrière',
    'courriel': 'jonathan@email.qc.ca',
    'bureau': '1.063'
  };
  const enseignantSupprimerId = 2;
  const enseignants: Enseignant[] = [
    {
      'id': 1,
      'prenom': 'Jonathan',
      'nom': 'Carrière',
      'courriel': 'jonathan@email.qc.ca',
      'bureau': '1.063',
    },
    {
      'id': 2,
      'prenom': 'Jonathan2',
      'nom': 'Carrière2',
      'courriel': 'jonathan2@email.qc.ca',
      'bureau': '1.063',
    },
    {
      'id': 3,
      'prenom': 'Jonathan3',
      'nom': 'Carrière3',
      'courriel': 'jonathan3@email.qc.ca',
      'bureau': '1.063',
    }
  ];

  /**
   * Configuration globale des tests pour le service des enseignants
   * @author Jonathan Carrière
   * @author Samir El Haddaji
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: HttpClient, useValue: espionHttpJasmine}]
    });
    service = TestBed.inject(EnseignantsService);
  });

  /**
   * Test unitaire permettant de vérifier si le service se génère correctement
   * @author Jonathan Carrière
   * @author Samir El Haddaji
   */
  it('doit générer le service', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier la création d'objets
   * @author Jonathan Carrière
   */
  it('createEnseignant doit créer un enseignant', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.post.and.returnValue({});
    // Créer un nouvel enseignant via le service
    const result = service.createEnseignant(enseignantAjouter);
    // Vérifier que le service peut créer un enseignant correctement
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });

  /**
   * Test unitaire permettant de vérifier la modification d'objets
   * @author Jonathan Carrière
   */
  it('updateEnseignant doit modifier un enseignant', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.put.and.returnValue({});
    // Modifier un enseignant via le service
    const result = service.updateEnseignant(enseignantModifier.id, enseignantModifier);
    // Vérifier que le service peut modifier un enseignant correctement
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });

  /**
   * Test unitaire permettant de vérifier la suppression d'objets
   * @author Jonathan Carrière
   */
  it('deleteEnseignant doit supprimer un enseignant', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.delete.and.returnValue({});
    // Supprimer un enseignant via le service
    const result = service.deleteEnseignant(enseignantSupprimerId);
    // Vérifier que le service peut supprimer un enseignant correctement
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });

  /**
   * Test unitaire permettant de vérifier l'obtention de la liste des enseignants
   * @author Jonathan Carrière
   */
  it('getEnseignants doit obtenir la liste des enseignants', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.get.and.returnValue(of({data: enseignants}));
    // Obtenir la liste des enseignants et vérifier la réponse
    service.getEnseignants().subscribe({
      next: reponse => expect(reponse).toEqual({data: enseignants})
    });
  });

  /**
   * Test unitaire permettant de vérifier l'obtention d'un enseignant
   * @author Jonathan Carrière
   */
  it('getEnseignant doit obtenir un enseignant', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.get.and.returnValue(of({data: enseignants[0]}));
    // Obtenir un enseignant et vérifier la réponse
    service.getEnseignant(enseignants[0].id).subscribe({
      next: reponse => expect(reponse).toEqual({data: enseignants[0]})
    });
  });

});
