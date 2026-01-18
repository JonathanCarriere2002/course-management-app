import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnseignantsPlanCoursComponent } from './enseignants-plan-cours.component';
import {FormArray, FormGroup} from '@angular/forms';
import {Enseignant} from '../../../../models/enseignants/enseignant';
import {EnseignantPlanCours} from '../../../../models/enseignantPlanCours/enseignant-plan-cours';

describe('EnseignantsPlanCoursComponent', () => {
  let component: EnseignantsPlanCoursComponent;
  let fixture: ComponentFixture<EnseignantsPlanCoursComponent>;
  const formGroup: FormGroup = new FormGroup({
    'enseignants': new FormArray([])
  });
  const formArrayName = 'enseignants';
  const enseignants : Enseignant[] = [
    {
      'id': 1,
      'prenom': 'Jonathan',
      'nom': 'Carrière',
      'courriel': 'jonathan@email.qc.ca',
      'bureau': '1.063',
      'poste': 2002
    },
    {
      'id': 2,
      'prenom': 'Jeremy',
      'nom': 'Lebel',
      'courriel': 'jeremy@email.qc.ca',
      'bureau': '1.085',
      'poste': 2004
    }
  ]
  const enseignantsPlanCours: EnseignantPlanCours[] = [
    {
      'id': 1,
      'nom': 'Jonathan Carrière',
      'groupe': 1,
      'dispo': 'Lundi : 8h à 9h'
    }
  ]

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnseignantsPlanCoursComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnseignantsPlanCoursComponent);
    component = fixture.componentInstance;
    component.formGroup = formGroup;
    component.formArrayName = formArrayName;
    component.enseignants = enseignants;
    component.enseignantsPlanCours = enseignantsPlanCours;
    component.formArrayEnseignants.clear(); // supprimer tous les contrôles du formarray
    component.ngOnChanges(); // simuler un changement
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('le formArray enseignants doit avoir un formgroup', () => {
    // test
    expect(component.formArrayEnseignants.controls.length).toEqual(1);
  });

  it('la méthode ouvrirModalEnseignants doit être appelée lorsque l\'utilisateur clique sur le bouton pour ajouter des enseignants', () => {
    spyOn(component, 'ouvrirModalEnseignants')
    const boutonAjouter = fixture.nativeElement.querySelector('ion-button'); // Récupérer le bouton d'ajout dans le composant
    boutonAjouter.click(); // Simuler un clique sur le bouton
    // test
    expect(component.ouvrirModalEnseignants).toHaveBeenCalled();
  });

  it('la méthode supprimerEnseignantFormGroup dot être appelée lorsque l\'utilisateur clique sur le bouton pour supprimer un enseignant', () => {
    spyOn(component, 'supprimerEnseignantFormGroup');
    const boutonSupprimer = fixture.nativeElement.querySelector('ion-grid ion-row ion-col ion-button'); // Récupérer le bouton de suppression du premier enseignant dans le composant
    boutonSupprimer.click() // simuler un clique sur le bouton
    // test
    expect(component.supprimerEnseignantFormGroup).toHaveBeenCalledWith(0);
  });
});
