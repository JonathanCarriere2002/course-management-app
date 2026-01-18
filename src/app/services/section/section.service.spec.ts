/**
 * Tests unitaires pour le service des sections.
 * @author Emeric Chauret
 */

import { TestBed } from '@angular/core/testing';
import { SectionService } from './section.service';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {Section} from '../../models/section/section';

describe('SectionService', () => {
  let service: SectionService;
  const espionHttp = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
  const sections: Section[] =
    [
      {
        'id': 1,
        'titre': 'Résumé du cours',
        'info_suppl': '',
        'aide': 'Vous devez écrire le résumé des concepts qui vont être expliqués dans ce cours.',
        'obligatoire': true,
        'type_section_id': 1
      },
      {
        'id': 2,
        'titre': 'Médiagraphie',
        'info_suppl': '',
        'aide': 'Vous devez écrire vos sources.',
        'obligatoire': false,
        'type_section_id': 1
      }
    ]

  // S'exécute avant chaque test
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: espionHttp}
      ]
    });
    service = TestBed.inject(SectionService);
  });

  it('Service est appelé', () => {
    expect(service).toBeTruthy();
  });

  it('la méthode obtenirToutesLesSections doit retourner la liste des sections', () => {
    // Spécifier ce que retourne l'espion
    espionHttp.get.and.returnValue(of({data: sections}));
    // Appel de la méthode testée et assertion
    service.obtenirToutesLesSections().subscribe({
      next: reponse => expect(reponse).toEqual({data: sections})
    });
  });

  it('la méthode obtenirSectionParId doit retourner une section', () => {
    // Spécifier ce que retourne l'espion
    espionHttp.get.and.returnValue(of({data :sections[0]}));
    // Appel de la méthode testée et assertion
    service.obtenirSectionParId(sections[0].id).subscribe({
      next: reponse => expect(reponse).toEqual({data: sections[0]})
    });
  });

  it('la méthode creerSection doit retourner l\'erreur de l\'api', () => {
    // Construction de l'erreur retournée
    const error = ({
      error : {
        code: 404,
        message: 'Section non trouvée'
      }
    });
    // Spécifier ce que retourne l'espion
    espionHttp.post.and.returnValue(of(error));
    // Appel de la méthode testée et assertion
    service.creerSection(sections[0]).subscribe({
      next: (reponse) => {
        expect(reponse.error?.message).toContain('Section non trouvée');
        expect(reponse.error?.code).toEqual(404);
      }
    });
  });

  it('la méthode supprimerSection doit retourner l\'erreur de l\'api', () => {
    // Construction de l'erreur retournée
    const error = ({
      error : {
        code: 404,
        message: 'Section non trouvée'
      }
    });
    // Spécifier ce que retourne l'espion
    espionHttp.delete.and.returnValue(of(error));
    // Appel de la méthode testée et assertion
    service.supprimerSection(sections[0].id).subscribe({
      next: (reponse) => {
        expect(reponse.error?.message).toContain('Section non trouvée');
        expect(reponse.error?.code).toEqual(404);
      }
    });
  });

  it('la méthode modifierSection doit retourner l\'erreur de l\'api', () => {
    // Construction de l'erreur retournée
    const error = ({
      error : {
        code: 404,
        message: 'Section non trouvée'
      }
    });
    // Spécifier ce que retourne l'espion
    espionHttp.put.and.returnValue(of(error));
    // Appel de la méthode testée et assertion
    service.modifierSection(sections[0].id, sections[0]).subscribe({
      next: (reponse) => {
        expect(reponse.error?.message).toContain('Section non trouvée');
        expect(reponse.error?.code).toEqual(404);
      }
    });
  });
});
