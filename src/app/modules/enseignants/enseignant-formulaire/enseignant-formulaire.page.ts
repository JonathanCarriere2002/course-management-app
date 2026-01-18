import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiResponse} from '../../../models/authentification/api-response';
import {Enseignant} from '../../../models/enseignants/enseignant';
import {EnseignantsService} from '../../../services/enseignants/enseignants.service';
import {Programme} from '../../../models/programmes/programme';
import {ItemReorderEventDetail, ModalController} from '@ionic/angular';
import {ProgrammeService} from '../../../services/programmes/programme.service';
import {RechercheComboBoxCheckboxComponent} from '../../partage/components/recherche-combo-box-checkbox/recherche-combo-box-checkbox.component';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
import {ModalConfirmerSuppressionComponent} from '../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';

/**
 * Page permettant d'effectuer la gestion du formulaire pour les enseignants
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-enseignant-formulaire',
  templateUrl: './enseignant-formulaire.page.html',
  styleUrls: ['./enseignant-formulaire.page.scss'],
})
export class EnseignantFormulairePage implements OnInit {
  // Id de l'enseignant
  enseignantId = 0;
  // Enseignant qui sera manipulé dans le formulaire
  enseignant: Enseignant = { id: 0, prenom: '', nom: '', courriel: '', bureau: '', poste: 0 };
  // Formulaire pour un objet de type 'enseignant'
  enseignantForm!: FormGroup;
  // Observable permettant d'effectuer la gestion des enseignants de la page
  observableEnseignant$ : Subscription = new Subscription();
  // Observable permettant d'effectuer la gestion des programmes de la page
  observableProgramme$ : Subscription = new Subscription();
  // Permet de vérifier si le formulaire doit modifier un objet
  formModification= false;
  // Liste des programmes se retrouvant dans le modal de sélection
  lsProgrammes: Programme[] = [];
  // Liste des programmes sélectionnés pour l'enseignant
  programmesSelectionnes: Programme[] = [];
  // Quantité maximale pour les breadcrumbs
  maxBreadCrumbs = 4;
  // Variable permettant d'effectuer la gestion du chargement des données
  chargement = false;

  /**
   * Constructeur de la page associé au formulaire pour les sessions
   * @param enseignantsServices Service permettant d'effectuer la gestion des enseignants
   * @param programmesServices Service permettant d'effectuer la gestion des programmes dans le modal
   * @param formBuilder Constructeur pour le formulaire réactif pour les sessions
   * @param router Routeur permettant d'effectuer une redirection après que le formulaire est soumis
   * @param activatedRoute Routeur permettant d'obtenir des informations sur la route en utilisation
   * @param modalCtrl Contrôleur pour le modal permettant de choisir les programmes d'un enseignant
   */
  constructor(private enseignantsServices : EnseignantsService, private programmesServices : ProgrammeService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private modalCtrl: ModalController) { }

  /**
   * Méthode appeler sur l'initialisation de la page permettant de rendre le formulaire réactif
   */
  ngOnInit() {
    // Rendre le formulaire pour les sessions réactif
    this.enseignantForm = this.formBuilder.group( {
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      courriel: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^.+@cegepoutaouais\\.qc\\.ca$')]],
      bureau: ['', [Validators.required, Validators.pattern('^\\d\\.\\d{3}$')]],
      poste: ['', [Validators.pattern('^\\d{4}$')]],
      programmes: this.formBuilder.array([])
    });
  }

  /**
   * Méthode permettant d'obtenir les données d'un enseignant spécifique au chargement de la page
   */
  ionViewWillEnter(){
    this.chargement = true;
    this.enseignantId = parseInt(this.activatedRoute.snapshot.paramMap.get('id') as string);
    if (this.enseignantId) {
      // Obtenir l'enseignant spécifique correspondant à la session
      this.getEnseignant(this.enseignantId);
    }
    // Obtenir la liste des programmes de l'enseignant
    this.getProgrammes();
  }

  /**
   * Méthode permettant d'arrêter l'abonnement à l'observable contenant les sessions quand la page est fermée
   */
  ionViewWillLeave(){
    this.observableEnseignant$.unsubscribe();
    this.observableProgramme$.unsubscribe();
  }

  /**
   * Méthode permettant d'obtenir un enseignant spécifique selon son identifiant
   * @param id Identifiant de l'enseignant à obtenir
   */
  getEnseignant(id: number) {
    // Obtenir l'enseignant recherché via le service
    this.observableEnseignant$ = this.enseignantsServices.getEnseignant(id).subscribe({
      next: (res: ApiResponse<Enseignant>) => {
        // Si le service retourne un enseignant existant
        if (res.data) {
          // Attribuer les données de l'API à l'enseignant
          this.enseignant = res.data;
          // Mettre le formulaire en mode modification
          this.formModification = true;
          // Insérer l'enseignant trouvé à l'intérieur des champs correspondants dans le formulaire
          this.enseignantForm.patchValue(res.data);
          // Obtenir les sections du formArray
          const programmesArray = this.enseignantForm.get('programmes') as FormArray;
          // Supprimer l'ensemble des programmes se retrouvant dans le formArray pour les programmes
          while (programmesArray.length) {
            programmesArray.removeAt(0);
          }
          // Ajouter l'ensemble des programmes dans le formArray en tenant compte de l'ordre
          this.enseignant.programmes?.forEach((programme: Programme, index: number) => {
            programmesArray.insert(index, this.createProgrammeFormGroup(programme));
          });
        }
      },
      error: () => {
        this.afficherErreur();
        this.chargement = false;
      }
    });
  }

  /**
   * Méthode permettant de créer un nouvel enseignant selon les données du formulaire
   */
  createEnseignant() {
    // Créer un nouvel enseignant puis effectuer une redirection vers la liste des enseignants
    this.enseignantsServices.createEnseignant(this.enseignantForm.value).subscribe( {
      next : () => this.router.navigate(['/enseignants']).then(promesse => true),
      error: () => {
        this.afficherErreur();
      }
    });
  }

  /**
   * Méthode permettant d'effectuer la modification d'un enseignant selon les données du formulaire
   */
  updateEnseignant() {
    // Modifier un enseignant selon les données du formulaire puis effectuer une redirection vers la liste des enseignants
    this.enseignantsServices.updateEnseignant(this.enseignantId, this.enseignantForm.value).subscribe( {
      next : () => this.router.navigate(['/enseignants']).then(promesse => true),
      error: () => {
        this.afficherErreur();
      }
    });
  }

  /**
   * Méthode permettant d'obtenir l'ensemble des programmes de la base de données
   */
  getProgrammes() {
    this.observableProgramme$ = this.programmesServices.getProgrammes().subscribe( {
      next: (res: ApiResponse<Programme[]>) => {
        res.data ? this.lsProgrammes = res.data : '';
        this.chargement = false;
      },
      error: () => {
        this.afficherErreur();
        this.chargement = false;
      }
    });
  }

  /**
   * Méthode permettant d'obtenir le formArray pour les programmes dans le formulaire des enseignants
   */
  get programmes() {
    return this.enseignantForm.get('programmes') as FormArray;
  }

  /**
   * Méthode permettant de créer un formGroup pour un programme dans le formArray pour la liste des enseignants
   * @param programme Programme dont le formGroup sera créé pour
   */
  createProgrammeFormGroup(programme: Programme) {
    return this.formBuilder.group({
      id: [programme.id],
      code: [programme.code],
      titre: [programme.titre]
    });
  }

  /**
   * Méthode permettant de retirer un programme de la liste sélectionnée pour un enseignant
   * @param index Index du programme qui sera retiré
   */
  retirerProgramme(index: number){
    this.programmes.removeAt(index);
  }

  /**
   * Méthode permettant d'effectuer la gestion de la sélection des programmes d'un enseignant
   */
  async ouvrirModalProgrammes() {
    // Obtenir le FormArray pour les programmes de l'enseignant provenant du formulaire
    const programmesArray = this.enseignantForm.get('programmes') as FormArray;
    // Obtenir les programmes déjà sélectionnés pour l'enseignant
    const programmesSelection = programmesArray.value.map((programme: Programme) => programme.id);
    // Créer le modal permettant d'effectuer la gestion des programmes
    const modal = await this.modalCtrl.create({
      component: RechercheComboBoxCheckboxComponent,
      componentProps: {
        'titre' : 'Programmes',
        'objets' : this.lsProgrammes.map(programme => ({ text: programme.titre, value: programme.id })),
        'objetsSelectionnes': programmesSelection || []
      }
    });
    // Afficher le modal permettant d'effectuer la gestion des programmes
    await modal.present();
    // Obtenir les données du modal suite à sa fermeture par l'utilisateur
    const { data, role } = await modal.onWillDismiss();
    // Lorsque l'utilisateur appui sur le bouton de confirmation
    if (role === 'confirme') {
      // Ajouter les programmes sélectionnés dans le formulaire
      for (const id of data) {
        // Vérifier si ce programme est déjà dans le formulaire pour l'enseignant
        if (!programmesArray.value.some((programme: Programme) => programme.id === id)) {
          // Rechercher pour le programme spécifique dans la liste
          const programmeSelectionnee = this.lsProgrammes.find(programmeRecherchee => programmeRecherchee.id === id);
          // Si le programme en question est trouvé, l'ajouter dans le FormArray pour les programmes
          if (programmeSelectionnee) {
            programmesArray.push(this.createProgrammeFormGroup(programmeSelectionnee));
          }
        }
      }
      // Supprimer les programmes non-sélectionnés dans le formulaire
      for (let programme = programmesArray.length - 1; programme >= 0; programme--) {
        // Programme à l'index de la liste des programmes de l'enseignant
        const programmeSupprimee = programmesArray.at(programme);
        // Si les programmes sélectionnés via le modal n'inclut pas celle-ci, la supprimer du formulaire
        if (!data.includes(programmeSupprimee.value.id)) {
          programmesArray.removeAt(programme);
        }
      }
      // Ajouter les programmes sélectionnés dans le formulaire
      this.programmesSelectionnes = this.programmesSelectionnes.filter(programme => data.includes(programme.id));
    }
  }

  /**
   * Méthode permettant d'effectuer la gestion de l'ordre de la liste des programmes via le drag and drop
   * @param evenement évènement permettant d'effectuer la gestion des programmes d'un enseignant
   * @author Jonathan Carrière
   */
  gestionOrdreProgrammes(evenement: CustomEvent<ItemReorderEventDetail>) {
    // Obtenir le formArray pour les programmes de l'enseignant modifié avec le drag and drop
    const programmesFormulaire = evenement.detail.complete(this.programmes.controls);
    // Obtenir le formArray pour les programmes de l'enseignant existant
    const programmesArray = this.enseignantForm.get('programmes') as FormArray;
    // Supprimer l'ensemble des programmes se retrouvant dans le formArray pour les sections
    while (programmesArray.length) {
      programmesArray.removeAt(0);
    }
    // Ajouter l'ensemble des programmes dans le formArray en tenant compte de l'ordre modifié
    programmesFormulaire.forEach((programme: FormGroup) => {
      programmesArray.push(this.createProgrammeFormGroup(programme.value));
    });
  }

  /**
   * Méthode permettant d'ajouter des options à l'intérieur des breadcrumbs
   */
  expandBreadcrumbs() {
    this.maxBreadCrumbs = 20;
  }

  /**
   * Méthode permettant d'afficher un modal pour la gestion des erreurs
   */
  afficherErreur() {
    const modalErreur = this.modalCtrl.create({
      component: ModalErreurServeurComponent
    });
    modalErreur.then(modal => modal.present());
  }

  /**
   * Méthode qui affiche le modal pour confirmer l'annulation de la création ou modification de la session
   * @author Emeric Chauret
   */
  async ouvrirModalConfirmerAnnulation() {
    // Crée le modal
    const modal = await this.modalCtrl.create({
      component: ModalConfirmerSuppressionComponent,
      componentProps: {'message' : `Souhaitez-vous vraiment annuler la ${this.formModification ? 'modification' : 'création'} de l'enseignant ?`}
    });
    // Affiche le modal
    await modal.present();
    // Récupérer les données du modal avant qu'il disparaisse
    const { role } = await modal.onWillDismiss();
    // Si l'utilisateur a confirmé l'annulation'
    if (role === 'confirm') {
      // rediriger vers la liste des sessions
      this.router.navigate(['/enseignants']).then(r => true)
    }
  }

}
