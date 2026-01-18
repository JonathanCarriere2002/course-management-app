import { TestBed } from '@angular/core/testing';
import { GabaritService } from './gabarit.service';
import {Gabarit} from '../../models/gabarit/gabarit';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';

/**
 * Tests unitaires associés au service des gabarits
 * @author Jonathan Carrière
 */
describe('GabaritService', () => {
  let service: GabaritService;
  const espionHttpJasmine = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  const gabaritAjouter: Gabarit = {
    'id': 3,
    'nom': 'Gabarit plan de cours 02',
    'sections': [
      {
        'id': 1,
        'titre': 'INTRODUCTION',
        'info_suppl': '',
        'aide': '',
        'obligatoire': true,
        'type_section_id': 1
      }
    ]
  };
  const gabaritModifier: Gabarit = {
    'id': 1,
    'nom': 'Gabarit plan de cours 02',
    'sections': [
      {
        'id': 1,
        'titre': 'INTRODUCTION',
        'info_suppl': '',
        'aide': '',
        'obligatoire': true,
        'type_section_id': 1
      }
    ]
  };
  const gabaritSupprimerId = 2;
  const gabarits: Gabarit[] = [
    {
      'id': 1,
      'nom': 'Gabarit plan de cours 01',
      'sections': [
        {
          'id': 1,
          'titre': 'INTRODUCTION',
          'info_suppl': '',
          'aide': '',
          'obligatoire': true,
          'type_section_id': 1
        }
      ]
    },
    {
      'id': 2,
      'nom': 'Gabarit plan de cours 02',
      'sections': [
        {
          'id': 2,
          'titre': 'INTRODUCTION2',
          'info_suppl': '',
          'aide': '',
          'obligatoire': true,
          'type_section_id': 1
        }
      ]
    },
    {
      'id': 3,
      'nom': 'Gabarit plan de cours 03',
      'sections': [
        {
          'id': 3,
          'titre': 'INTRODUCTION3',
          'info_suppl': '',
          'aide': '',
          'obligatoire': true,
          'type_section_id': 1
        }
      ]
    }
  ]

  /**
   * Configuration globale des tests pour le service des sessions
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: HttpClient, useValue: espionHttpJasmine}]
    });
    service = TestBed.inject(GabaritService);
  });

  /**
   * Test unitaire permettant de vérifier si le service se génère correctement
   */
  it('doit générer le service', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test unitaire permettant de vérifier la création d'objets
   */
  it('creerGabarit doit créer un gabarit', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.post.and.returnValue({});
    // Créer un nouveau gabarit via le service
    const result = service.creerGabarit(gabaritAjouter);
    // Vérifier que le service peut créer un gabarit correctement
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });

  /**
   * Test unitaire permettant de vérifier la modification d'objets
   */
  it('modifierGabarit doit modifier un gabarit', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.put.and.returnValue({});
    // Modifier un gabarit via le service
    const result = service.modifierGabarit(gabaritModifier.id, gabaritModifier);
    // Vérifier que le service peut modifier un gabarit correctement
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });

  /**
   * Test unitaire permettant de vérifier la suppression d'objets
   */
  it('supprimerGabarit doit supprimer un gabarit', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.delete.and.returnValue({});
    // Supprimer un gabarit via le service
    const result = service.supprimerGabarit(gabaritSupprimerId);
    // Vérifier que le service peut supprimer un gabarit correctement
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });

  /**
   * Test unitaire permettant de vérifier l'obtention de la liste des gabarits
   */
  it('obtenirTousLesGabarits doit obtenir la liste des gabarits', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.get.and.returnValue(of({data: gabarits}));
    // Obtenir la liste des gabarits et vérifier la réponse
    service.obtenirTousLesGabarits().subscribe({
      next: reponse => expect(reponse).toEqual({data: gabarits})
    });
  });

  /**
   * Test unitaire permettant de vérifier l'obtention d'un gabarit
   */
  it('obtenirGabaritParId doit obtenir un gabarit', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.get.and.returnValue(of({data: gabarits[0]}));
    // Obtenir un gabarit et vérifier la réponse
    service.obtenirGabaritParId(gabarits[0].id).subscribe({
      next: reponse => expect(reponse).toEqual({data: gabarits[0]})
    });
  });

});
