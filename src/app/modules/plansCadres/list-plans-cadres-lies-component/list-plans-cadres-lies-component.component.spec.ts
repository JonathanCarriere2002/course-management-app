import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListPlansCadresLiesComponentComponent } from './list-plans-cadres-lies-component.component';
import {PlanCadres} from '../../../models/planCadres/plan-cadres';
import {LiensPlansCadres} from '../../../models/lienPlansCadres/liens-plans-cadres';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from '../../../services/auth.service';
import {Utilisateur} from '../../../models/utilisateurs/utilisateur';


let listPlansCadres:LiensPlansCadres[];
let planCadre:PlanCadres

describe('ListPlansCadresLiesComponentComponent', () => {
  let component: ListPlansCadresLiesComponentComponent;
  let fixture: ComponentFixture<ListPlansCadresLiesComponentComponent>;
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

  beforeEach(waitForAsync(()=>{
  listPlansCadres = [
    {
      id:1,
      planCadre1: {
        id: 1,
        code:'111-1A1-AA',
        titre:'Logique de programmation'
      },
      planCadre2:{
        id: 2,
        code:'222-2B2-BB',
        titre:'Titre 2'
      }
    },
    {
      id:2,
      planCadre1: {
        id: 2,
        code:'222-2B2-BB',
        titre:'Titre 2'
      },
      planCadre2:{
        id: 1,
        code:'111-1A1-AA',
        titre:'Logique de programmation'
      }
    }

  ];

  planCadre = {

    id: 1,
    code: '111-1A1-AA',
    titre: 'Logique de programmation',
    ponderation: '1-1-1',
    unites: 1,
    attitudes: 'Attitudes',
    complet:true,
    ponderationFinale: 60,
    programme:{
      id: 1,
      titre: 'Programme 1',
      code: '111.A1',
      competences: []
    },
    competences: [],
    sections:[],
    entreVigueur:{
      id: 1,
      session: 'Automne',
      annee: 2023,
      limite_abandon:new Date()
    },
    criteresEvaluations:[],
    coursLiesPrealablesRelatifs:[],
    coursLiesPrealablesAbsolus:[],
    coursLiesCorequis:[],
    coursLiesSuivants:[],
    changement:new Date(),
    approbationComite:new Date(),
    approbationDepartement:new Date(),
    depotDirectionEtudes:new Date(),

  }
  TestBed.configureTestingModule({
    declarations: [ ListPlansCadresLiesComponentComponent ],
    imports: [IonicModule, HttpClientModule],
    providers: [AuthService],
  }).compileComponents();
  fixture = TestBed.createComponent(ListPlansCadresLiesComponentComponent);
  component = fixture.componentInstance;
  authService = TestBed.inject(AuthService);
  //Passer les valeurs aux inputs du comonnent
  component.authService = authService;
  component.listPlansCadres = listPlansCadres;
  component.authService.setUtilisateur(utilisateur);
  component.planCadre=planCadre
  fixture.detectChanges();
}));


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Le component devrait avoir autant de plan cadre affichés que le nombre qu\'il y a dans la liste',()=>{
    const lienPlansCadres = document.querySelectorAll('.lienPlansCadres');
    expect(lienPlansCadres.length).toEqual(listPlansCadres.length);
  })

});
