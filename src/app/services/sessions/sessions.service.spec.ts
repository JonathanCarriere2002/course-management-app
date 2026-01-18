import { TestBed } from '@angular/core/testing';
import { SessionsService } from './sessions.service';
import {HttpClient} from '@angular/common/http';
import {Session} from '../../models/sessions/session';
import {of} from 'rxjs';

/**
 * Tests unitaires associés au service des sessions
 * @author Jonathan Carrière
 */
describe('SessionsService', () => {
  let service: SessionsService;
  const espionHttpJasmine = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  const sessionAjouter: Session = {
    'id': 17,
    'session': 'Automne',
    'annee': 2030,
    'limite_abandon': new Date()
  };
  const sessionModifier: Session = {
    'id': 1,
    'session': 'Hiver',
    'annee': 2030,
    'limite_abandon': new Date()
  };
  const sessionSupprimerId = 2;
  const sessions: Session[] = [
    {
      'id': 1,
      'session': 'Hiver1',
      'annee': 2030,
      'limite_abandon': new Date()
    },
    {
      'id': 2,
      'session': 'Hiver2',
      'annee': 2030,
      'limite_abandon': new Date()
    },
    {
      'id': 3,
      'session': 'Hiver3',
      'annee': 2030,
      'limite_abandon': new Date()
    }
  ];

  /**
   * Configuration globale des tests pour le service des sessions
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: HttpClient, useValue: espionHttpJasmine}]
    });
    service = TestBed.inject(SessionsService);
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
  it('createSession doit créer une session', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.post.and.returnValue({});
    // Créer une nouvelle session via le service
    const result = service.createSession(sessionAjouter);
    // Vérifier que le service peut créer une session correctement
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });

  /**
   * Test unitaire permettant de vérifier la modification d'objets
   */
  it('updateSession doit modifier une session', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.put.and.returnValue({});
    // Modifier une session via le service
    const result = service.updateSession(sessionModifier.id, sessionModifier);
    // Vérifier que le service peut modifier une session correctement
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });

  /**
   * Test unitaire permettant de vérifier la suppression d'objets
   */
  it('deleteSession doit supprimer une session', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.delete.and.returnValue({});
    // Supprimer une session via le service
    const result = service.deleteSession(sessionSupprimerId);
    // Vérifier que le service peut supprimer une session correctement
    expect(result).toEqual(Object({}));
    expect(result).toBeDefined();
  });

  /**
   * Test unitaire permettant de vérifier l'obtention de la liste des sessions
   */
  it('getSessions doit obtenir la liste des sessions', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.get.and.returnValue(of({data: sessions}));
    // Obtenir la liste des rôles et vérifier la réponse
    service.getSessions().subscribe({
      next: reponse => expect(reponse).toEqual({data: sessions})
    });
  });

  /**
   * Test unitaire permettant de vérifier l'obtention d'une session
   */
  it('getSession doit obtenir une session', () => {
    // Configuration de l'espion Http
    espionHttpJasmine.get.and.returnValue(of({data: sessions[0]}));
    // Obtenir une session et vérifier la réponse
    service.getSession(sessions[0].id).subscribe({
      next: reponse => expect(reponse).toEqual({data: sessions[0]})
    });
  });

});
