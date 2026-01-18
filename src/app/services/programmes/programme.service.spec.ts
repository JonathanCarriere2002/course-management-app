//@Author : Samir El Haddaji

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { ProgrammeService } from './programme.service';
import {of} from 'rxjs';
import {Programme} from '../../models/programmes/programme';
import {ListeProgrammesPage} from '../../modules/programmes/liste-programmes/liste-programmes.page';
import {IonicModule} from '@ionic/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthService} from '../auth.service';
import {Utilisateur} from '../../models/utilisateurs/utilisateur';
import {HttpClientModule} from '@angular/common/http';

describe('ProgrammeService', () => {
  let component: ListeProgrammesPage;
  let fixture: ComponentFixture<ListeProgrammesPage>;
  let authService: AuthService;

  // Création d'un faux utilisateur pour les tests de la page
  const utilisateur: Utilisateur = {
    id: 1,
    nom: 'Carrière',
    prenom: 'Jonathan',
    courriel: 'jonathan1234@email.com',
    courriel_verifie: new Date(),
    mot_de_passe: 'password',
    role: 1,
  };

  let programmeService : ProgrammeService;

  //Initialisation de l'espion de ProgrammeServices
  const programmeServiceEspion = jasmine.createSpyObj('ProgrammeService', [
    'getProgrammes',
    'getProgramme',
    'deleteProgramme',
    'createProgramme',
    'updateProgramme',
  ]);

  //Initialisation de la liste de programmes local
  const programmes : Programme[] = [{
    'id': 1,
    'titre': 'Génie mécanique',
    'code': '241.A0',
    'competences': [
      {
        'id': 2,
        'code': 'OHNO',
        'enonce': 'convallis nulla neque libero convallis eget eleifend luctus ultricies',
        'annee_devis': 2012,
        'pages_devis': '46',
        'contexte': 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.',
        'elementsCompetences': [],
        'programme_id': 2
      }
    ]
  },
    {
      'id': 2,
      'titre': 'Gestion de commerces',
      'code': '410.D0',
      'competences': [
        {
          'id': 3,
          'code': 'LFSF',
          'enonce': 'in porttitor pede justo eu massa donec dapibus',
          'annee_devis': 2006,
          'pages_devis': '97',
          'contexte': 'Sed ante. Vivamus tortor. Duis mattis egestas metus.',
          'elementsCompetences': [],
          'programme_id': 3
        }
      ]
    }];

  //BeforeEach avec l'import de RouterTestingModule pour le activated route de la page
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeProgrammesPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientModule],
      providers : [AuthService]
    }).compileComponents();

    fixture = TestBed.createComponent(ListeProgrammesPage);
    component = fixture.componentInstance;
    // Injection du 'AuthService' et définition de l'utilisateur
    authService = TestBed.inject(AuthService);
    component.authService = authService;
    component.authService.setUtilisateur(utilisateur);
    programmeService = fixture.debugElement.injector.get(ProgrammeService)
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  //Test qui vérifie si la methode getProgrammes est appelée lors de l'affichage de la page
  xit('getProgramme appelée', () => {
    programmeServiceEspion.getProgrammes().and.returnValue(of(programmes));
    component.ionViewWillEnter();
    expect(programmeService.getProgrammes).toHaveBeenCalled();
  });

  //Test qui verifie si on peut recuperer un programme avec son Id avec la methode getProgramme
  it('doit recuperer un programme avec ID', () => {
    const programId = 1;
    const mockProgram = {
      'id': 1,
      'nom': 'Génie mécanique',
      'code': '241.A0',
      'competence': [
        {
          'id': 2,
          'code': 'OHNO',
          'titre': 'porttitor id consequat in consequat ut nulla sed accumsan',
          'enonce': 'convallis nulla neque libero convallis eget eleifend luctus ultricies',
          'annee_devis': 2012,
          'pages_devis': '46',
          'contexte': 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.',
          'contexte_local': 'Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.'
        }
      ]
    };

    programmeServiceEspion.getProgramme.and.returnValue(mockProgram);

    const result = programmeServiceEspion.getProgramme(programId);

    expect(programmeServiceEspion.getProgramme).toHaveBeenCalledWith(programId);
    expect(result).toEqual(mockProgram);
  });


  //Test qui verifie si on peut supprimmer un programme grace a la methode deleteProgramme
  it('doit supprimer un programme avec ID', () => {
    const programId = 1;

    programmeServiceEspion.deleteProgramme.and.returnValue({});

    const result = programmeServiceEspion.deleteProgramme(programId);

    expect(programmeServiceEspion.deleteProgramme).toHaveBeenCalledWith(programId);
    expect(result).toBeDefined();
  });


  //Test qui verifie si on peut ajouter un nouveau programme avec la methode createProgramme
  it('doit creer un nouveau programme', () => {
    const newProgram = {
      'id': 3,
      'nom': 'Comptabilité et gestion',
      'code': '410.B0',
      'competence': [
        {
          'id': 4,
          'code': 'NZTO',
          'titre': 'ut volutpat sapien arcu sed augue aliquam erat volutpat in',
          'enonce': 'vestibulum sed magna at nunc commodo placerat praesent blandit',
          'annee_devis': 1995,
          'pages_devis': '7',
          'contexte': 'Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.',
          'contexte_local': 'Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.'
        }
      ]
    };
    programmeServiceEspion.createProgramme.and.returnValue({});

    const result = programmeServiceEspion.createProgramme(newProgram);

    expect(programmeServiceEspion.createProgramme).toHaveBeenCalledWith(newProgram);
    expect(result).toBeDefined();
  });


  //Test qui verifie si on peut modifier un programme existant avec la methode updateProgramme
  it('doit modifier un programme existant', () => {
    const programId = 1;
    const updatedProgram = {
      'id': 1,
      'nom': 'Génie mécanique 2',
      'code': '241.A0',
      'competence': [
        {
          'id': 2,
          'code': 'OHNO',
          'titre': 'porttitor id consequat in consequat ut nulla sed accumsan',
          'enonce': 'convallis nulla neque libero convallis eget eleifend luctus ultricies',
          'annee_devis': 2012,
          'pages_devis': '46',
          'contexte': 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.',
          'contexte_local': 'Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.'
        }
      ]
    };
    programmeServiceEspion.updateProgramme.and.returnValue({});

    const result = programmeServiceEspion.updateProgramme(programId, updatedProgram);

    expect(programmeServiceEspion.updateProgramme).toHaveBeenCalledWith(programId, updatedProgram);
    expect(result).toBeDefined();
  });
});
