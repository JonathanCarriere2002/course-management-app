import {Component, OnInit} from '@angular/core';
import {map, Subscription} from 'rxjs';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilisateursService} from '../../../services/utilisateurs/utilisateurs.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiResponse} from '../../../models/authentification/api-response';
import {Utilisateur} from '../../../models/utilisateurs/utilisateur';
import {Role} from '../../../models/roles/role';
import {RoleService} from '../../../services/roles/role.service';
import {Programme} from '../../../models/programmes/programme';
import {ProgrammeService} from '../../../services/programmes/programme.service';
import {RechercheComboBoxCheckboxComponent} from '../../partage/components/recherche-combo-box-checkbox/recherche-combo-box-checkbox.component';
import {ModalController} from '@ionic/angular';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
import {ModalConfirmerSuppressionComponent} from '../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';

/**
 * Classe permettant d'effectuer la gestion du formulaire pour les utilisateurs
 * @author Jonathan Carrière
 * @author Emeric Chauret
 */
@Component({
  selector: 'app-utilisateur-formulaire',
  templateUrl: './utilisateur-formulaire.page.html',
  styleUrls: ['./utilisateur-formulaire.page.scss'],
})
export class UtilisateurFormulairePage implements OnInit {
  // Id de l'utilisateur
  utilisateurId  = 0;
  // Liste des utilisateurs utilisés pour la validation
  utilisateurs : Utilisateur[] = [];
  // Liste des rôles utilisés dans le formulaire
  roles : Role[] = [];
  // Formulaire pour un objet de type 'utilisateur'
  utilisateurForm!: FormGroup;
  // Observable permettant d'effectuer la gestion des données de la page
  observable$ : Subscription = new Subscription();
  // Permet de vérifier si le formulaire doit modifier un objet
  formModification= false;
  // Messages d'erreurs utilisés pour la validation des adresses courriels et mots de passe
  messageErreurCourriel = '';
  messageErreurMotDePasse = '';
  // Quantité maximale pour les breadcrumbs
  maxBreadCrumbs = 4;
  // Gestion des programmes dans le formulaire
  programmes: Programme[] = [];
  programmesSelectionnes: Programme[] = [];
  observableProgrammes$! : Subscription;
  // Variable permettant d'effectuer la gestion du chargement des données
  chargement = false;

  /**
   * Constructeur de la page associé au formulaire pour les utilisateurs
   * @param utilisateursServices Service permettant d'effectuer la gestion des utilisateurs
   * @param programmeService service injecté ProgrammeService
   * @param rolesServices Service permettant d'effectuer la gestion des rôles
   * @param formBuilder Constructeur pour le formulaire réactif pour les utilisateurs
   * @param router Routeur permettant d'effectuer une redirection après que le formulaire est soumis
   * @param activatedRoute Routeur permettant d'obtenir des informations sur la route en utilisation
   * @param modalCtrl service injecté ModalController
   * @author Jonathan Carrière
   */
  constructor(private utilisateursServices : UtilisateursService, private programmeService: ProgrammeService, private rolesServices : RoleService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private modalCtrl: ModalController) { }

  /**
   * Méthode appeler sur l'initialisation de la page permettant de rendre le formulaire réactif
   * @author Jonathan Carrière
   */
  ngOnInit() {
    // Rendre le formulaire pour les utilisateurs réactif
    this.utilisateurForm = this.formBuilder.group( {
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      courriel: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^.+@cegepoutaouais\\.qc\\.ca$')]],
      mot_de_passe: ['', [Validators.required, Validators.minLength(8)]],
      mot_de_passe_confirmation: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      bureau: ['', [Validators.pattern('^\\d\\.\\d{3}$')]],
      poste: ['', [Validators.pattern('^\\d{4}$')]],
      programmes: this.formBuilder.array([])
    });
  }

  /**
   * Méthode permettant d'obtenir la valeur à l'intérieur du champ 'rôle' de l'utilisateur
   * @author Emeric Chauret
   */
  get champRole(){
    return this.utilisateurForm.get('role') as FormControl;
  }

  /**
   * Méthode permettant d'obtenir les données d'un utilisateur spécifique au chargement de la page
   * @author Jonathan Carrière
   */
  ionViewWillEnter(){
    this.chargement = true;
    // Obtenir l'identifiant de l'utilisateur de l'URL
    this.utilisateurId = parseInt(this.activatedRoute.snapshot.paramMap.get('id') as string);
    if (this.utilisateurId) {
      // Obtenir l'utilisateur spécifique correspondant à l'utilisateur
      this.getUtilisateur(this.utilisateurId);
    }
    // Obtenir la liste des programmes
    this.getProgrammes();
    // Obtenir la liste des rôles disponible pour les utilisateurs
    this.getRoles();
  }

  /**
   * Méthode permettant d'arrêter l'abonnement à l'observable contenant les utilisateurs quand la page est fermée
   * @author Jonathan Carrière
   */
  ionViewWillLeave(){
    this.observableProgrammes$.unsubscribe();
    this.observable$.unsubscribe();
    this.messageErreurCourriel = '';
    this.messageErreurMotDePasse = '';
  }

  /**
   * Méthode permettant d'obtenir un utilisateur spécifique selon son identifiant
   * @param id Identifiant de l'utilisateur à obtenir
   * @author Jonathan Carrière
   */
  getUtilisateur(id: number) {
    // Obtenir l'utilisateur recherché via le service
    this.observable$ = this.utilisateursServices.getUtilisateur(id).subscribe({
      next: (res: ApiResponse<Utilisateur>) => {
        // Si le service retourne un utilisateur existant
        if (res.data) {
          // Mettre le formulaire en mode modification
          this.formModification = true;
          // Modifier la validation pour les mots de passe puisqu'ils sont optionnelles lors de la modification
          this.utilisateurForm.get('mot_de_passe')?.clearValidators();
          this.utilisateurForm.get('mot_de_passe')?.setValidators([Validators.minLength(8)]);
          this.utilisateurForm.get('mot_de_passe')?.updateValueAndValidity();
          this.utilisateurForm.get('mot_de_passe_confirmation')?.clearValidators();
          this.utilisateurForm.get('mot_de_passe_confirmation')?.setValidators([Validators.minLength(8)]);
          this.utilisateurForm.get('mot_de_passe_confirmation')?.updateValueAndValidity();
          // Modifier la réponse de l'API afin de pouvoir remplir certains champs du formulaire
          const dataModifier = {
            ...res.data,
            mot_de_passe: '',
            role: res.data.role.toString(),
          };
          this.programmesSelectionnes = res.data.programmes ?? [];
          // ajouter les programmes de l'utilisateur au formulaire
          this.programmesSelectionnes.map(p => this.creerProgrammeFormGroup(p))
          // Insérer l'utilisateur trouvé à l'intérieur des champs correspondants dans le formulaire
          this.utilisateurForm.patchValue(dataModifier);
        }
      },
      error: () => {
        this.afficherErreur();
        this.chargement = false;
      }
    });
  }

  /**
   * Méthode permettant d'obtenir l'ensemble des rôles disponibles pour les utilisateurs
   * @author Jonathan Carrière
   */
  getRoles() {
    this.observable$ = this.rolesServices.getRoles().subscribe( {
      next: (res: ApiResponse<Role[]>) => {
        res.data ? this.roles = res.data : '';
        this.chargement = false;
      },
      error: () => {
        this.afficherErreur();
        this.chargement = false;
      }
    });
  }

  /**
   * Méthode permettant de créer un nouvel utilisateur selon les données du formulaire
   * @author Jonathan Carrière
   */
  createUtilisateur() {
    // Vider les messages d'erreurs
    this.messageErreurCourriel = '';
    this.messageErreurMotDePasse = '';
    // Effectuer la validation du mot de passe
    const validationMotDePasse = this.validationMotDePasse(this.utilisateurForm.get('mot_de_passe')?.value, this.utilisateurForm.get('mot_de_passe_confirmation')?.value);
    // Effectuer la validation de l'adresse courriel
    this.validationAdresseCourriel(this.utilisateurForm.get('courriel')?.value).subscribe((adresseCourrielValide: boolean) => {
      // Si l'adresse courriel et le mot de passe sont valides, créer le nouvel utilisateur
      if (adresseCourrielValide && validationMotDePasse) {
        // Créer un nouvel utilisateur puis effectuer une redirection vers la liste des utilisateurs
        this.utilisateursServices.createUtilisateur(this.utilisateurForm.value).subscribe( {
          next : () => this.router.navigate(['/utilisateurs']).then(promesse => true),
          error: () => {
            this.afficherErreur();
          }
        });
      }
      // Sinon, afficher un message d'erreur dans la page
      else {
        // Afficher un message d'erreur pour l'adresse courriel
        if (!adresseCourrielValide) {
          this.messageErreurCourriel = 'Erreur! L\'adresse courriel de l\'utilisateur doit être unique';
        }
        // Afficher un message d'erreur pour le mot de passe
        if (!validationMotDePasse) {
          this.messageErreurMotDePasse = 'Erreur! Le mot de passe doit correspondre au mot de passe confirmé';
        }
      }
    });
  }

  /**
   * Méthode permettant d'effectuer la modification d'un utilisateur selon les données du formulaire
   * @author Jonathan Carrière
   */
  updateUtilisateur() {
    // Vider les messages d'erreurs
    this.messageErreurCourriel = '';
    this.messageErreurMotDePasse = '';
    // Effectuer la validation du mot de passe
    const validationMotDePasse = this.validationMotDePasse(this.utilisateurForm.get('mot_de_passe')?.value, this.utilisateurForm.get('mot_de_passe_confirmation')?.value);
    // Effectuer la validation de l'adresse courriel
    this.validationAdresseCourriel(this.utilisateurForm.get('courriel')?.value).subscribe((adresseCourrielValide: boolean) => {
      // Si l'adresse courriel et le mot de passe sont valides, modifier l'utilisateur
      if (adresseCourrielValide && validationMotDePasse) {
        // Modifier l'utilisateur selon les données du formulaire puis effectuer une redirection vers la liste des utilisateurs
        this.utilisateursServices.updateUtilisateur(this.utilisateurId, this.utilisateurForm.value).subscribe( {
          next : () => this.router.navigate(['/utilisateurs']).then(promesse => true),
          error: () => {
            this.afficherErreur();
          }
        });
      }
      // Sinon, afficher un message d'erreur dans la page
      else {
        // Afficher un message d'erreur pour l'adresse courriel
        if (!adresseCourrielValide) {
          this.messageErreurCourriel = 'Erreur! L\'adresse courriel de l\'utilisateur doit être unique';
        }
        // Afficher un message d'erreur pour le mot de passe
        if (!validationMotDePasse) {
          this.messageErreurMotDePasse = 'Erreur! Le mot de passe doit correspondre au mot de passe confirmé';
        }
      }
    });
  }

  /**
   * Méthode permettant de valider que l'adresse courriel entrée dans le formulaire est valide
   * @param adresseCourriel Adresse courriel à valider
   * @author Jonathan Carrière
   */
  validationAdresseCourriel(adresseCourriel: string) {
    // Obtenir la liste des utilisateurs de l'application
    return this.utilisateursServices.getUtilisateurs().pipe(
      // Utilisation de 'map' afin de transformer le résultat de la vérification en 'bool', ce qui est nécessaire pour la vérification
      // Source 01 : https://stackoverflow.com/questions/54084815/how-to-pipe-map-an-observable-in-angular
      // Source 02 : https://rxjs.dev/api/operators/map
      map((res: ApiResponse<Utilisateur[]>) => {
        // Liste contenant les utilisateurs
        this.utilisateurs = res.data || [];
        // Vérifier si le formulaire est en mode 'modification'
        if (this.formModification) {
          // Vérifier si l'adresse courriel n'est pas déjà utilisée par un autre utilisateur en excluant l'utilisateur modifié
          return !this.utilisateurs.some(
              (utilisateur) => utilisateur.courriel === adresseCourriel && utilisateur.id !== this.utilisateurId
          );
        }
        // Vérifier si le formulaire est en mode 'création'
        else {
          // Vérifier si l'adresse courriel n'est pas déjà utilisée par un autre utilisateur
          return !this.utilisateurs.some((utilisateur) => utilisateur.courriel === adresseCourriel);
        }
      })
    );
  }

  /**
   * Méthode permettant de valider que le mot de passe correspond à la confirmation pour le mot de passe
   * @param motDePasse Mot de passe entré dans le formulaire
   * @param motDePasseConfirmation Confirmation du mot de passe entré dans le formulaire
   * @author Jonathan Carrière
   */
  validationMotDePasse(motDePasse: string, motDePasseConfirmation: string) {
    // Vérifier si le mot de passe correspond à la confirmation
    return motDePasse === motDePasseConfirmation;
  }

  /**
   * Méthode permettant d'obtenir l'ensemble des programmes de la base de données
   * @author Emeric Chauret
   */
  getProgrammes() {
    this.observableProgrammes$ = this.programmeService.getProgrammes().subscribe( {
      next: (res: ApiResponse<Programme[]>) => {
        res.data ? this.programmes = res.data : '';
        this.chargement = false;
      },
      error: () => {
        this.afficherErreur();
        this.chargement = false;
      }
    });
  }

  /**
   * Méthode qui appelle le modal pour choisir des programmes à lier à l'utilisateur enseignant.
   * @author Emeric Chauret
   */
  async ouvrirModalProgrammes() {
    // Crée le modal
    const modal = await this.modalCtrl.create({
      component: RechercheComboBoxCheckboxComponent,
      componentProps: {
        'titre' : 'Programmes',
        'objets' : this.programmes.filter(p => !this.programmesSelectionnes.some(ps => ps.id === p.id)).map(p => ({ text: p.titre, value: p.id })),
      }
    });
    // Affiche le modal
    await modal.present();
    // Récupérer les données du modal avant qu'il disparaisse
    const { data, role } = await modal.onWillDismiss();
    // Si l'utilisateur a confirmé
    if (role === 'confirme') {
      // Ajouter les programmes qui ont été cochés
      for (const id of data) {
        const programme = this.programmes.find(p => p.id == id);
        if (programme) {
          this.programmesSelectionnes.push(programme);
          this.creerProgrammeFormGroup(programme);
        }
      }
    }
  }

  /**
   * Méthode qui ajoute un programme dans le formulaire.
   * Elle crée un formGroup dans le formArray programmes avec l'identifiant du programme.
   * @param programme le programme à ajouter dans le formulaire (Programme)
   * @author Emeric Chauret
   */
  creerProgrammeFormGroup(programme: Programme){
    this.formArrayProgrammes.push(this.formBuilder.group({
      id: [programme.id, Validators.required],
    }));
  }

  /**
   * Méthode qui supprime un programme dans le formulaire.
   * Elle supprime le programme dans la liste des programmes sélectionnés.
   * Elle supprime le formGroup dans le formArray programmes.
   * @param index l'index du programme à supprimer dans le formulaire (number)
   * @author Emeric Chauret
   */
  supprimerProgrammeFormGroup(index: number){
    this.programmesSelectionnes.splice(index, 1);
    this.formArrayProgrammes.removeAt(index);
    this.formArrayProgrammes.updateValueAndValidity();
  }

  /**
   * Méthode qui récupère le formArray programmes dans le formulaire.
   * @author Emeric Chauret
   */
  get formArrayProgrammes() {
    return this.utilisateurForm.get('programmes') as FormArray;
  }

  /**
   * Méthode permettant d'ajouter des options à l'intérieur des breadcrumbs
   * @author Jonathan Carrière
   */
  expandBreadcrumbs() {
    this.maxBreadCrumbs = 20;
  }

  /**
   * Méthode permettant d'afficher un modal pour la gestion des erreurs
   * @author Jonathan Carrière
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
      componentProps: {'message' : `Souhaitez-vous vraiment annuler la ${this.formModification ? 'modification' : 'création'} de l'utilisateur ?`}
    });
    // Affiche le modal
    await modal.present();
    // Récupérer les données du modal avant qu'il disparaisse
    const { role } = await modal.onWillDismiss();
    // Si l'utilisateur a confirmé l'annulation'
    if (role === 'confirm') {
      // rediriger vers la liste des sessions
      this.router.navigate(['/utilisateurs']).then(r => true)
    }
  }

}
