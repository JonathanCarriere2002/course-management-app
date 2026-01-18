/**
 * @author Emeric Chauret
 */

import { TestBed } from '@angular/core/testing';

import { TypeSectionService } from './type-section.service';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {TypeSection} from '../../models/typeSection/type-section';

describe('TypeSectionService', () => {
  let service: TypeSectionService;
  const espionHttp = jasmine.createSpyObj('HttpClient', ['get']);
  const typesSection: TypeSection[] = [
    {
      'id': 1,
      'type': 'Texte riche',
    },
    {
      'id': 2,
      'type': 'Calendrier des activités',
    }
  ];

  // S'exécute avant chaque test
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: espionHttp}
      ]
    });
    service = TestBed.inject(TypeSectionService);
  });

  it('Service est appelé', () => {
    expect(service).toBeTruthy();
  });

  it('la méthode obtenirTousLesTypesSection doit retourner la liste des types de section', () => {
    // Spécifier ce que retourne l'espion
    espionHttp.get.and.returnValue(of({data: typesSection}));
    // Appel de la méthode testée et assertion
    service.obtenirTousLesTypesSection().subscribe({
      next: reponse => expect(reponse).toEqual({data: typesSection})
    });
  });
});
