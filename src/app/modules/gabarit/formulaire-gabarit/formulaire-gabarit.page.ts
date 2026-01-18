import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {GabaritService} from '../../../services/gabarit/gabarit.service';
import {Gabarit} from '../../../models/gabarit/gabarit';
import {ItemReorderEventDetail, ModalController} from '@ionic/angular';
import {SectionGabarit} from '../../../models/sectionGabarit/section-gabarit';
import {SectionService} from '../../../services/section/section.service';
import {Section} from '../../../models/section/section';
import {RechercheComboBoxCheckboxComponent} from '../../partage/components/recherche-combo-box-checkbox/recherche-combo-box-checkbox.component';
import {ApiResponse} from '../../../models/authentification/api-response';
import {ModalConfirmerSuppressionComponent} from '../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';
import { ModalErreurServeurComponent } from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';

/**
 * Page pour le formulaire d'ajout ainsi que de modification pour les gabarits
 * @author Emeric Chauret
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-formulaire-gabarit',
  templateUrl: './formulaire-gabarit.page.html',
  styleUrls: ['./formulaire-gabarit.page.scss'],
})
export class FormulaireGabaritPage implements OnInit {

  maxBreadCrumbs = 4;                                // nombre maximum d'objets dans le fil d'arianne
  gabaritForm!: FormGroup;                                    // formulaire pour créer et modifier un gabarit
  gabaritId = 0;                                     // l'identifiant du gabarit à modifier
  gabarit: Gabarit = {'id': 0, 'nom': '', 'sections': []}     // le gabarit à créer ou modifier
  lsSections: Section[] = [];                                 // la liste des sections
  observableGabarit$!: Subscription;                          // un observable pour le gabarit à modifier
  observableSections$!: Subscription;                         // un observable pour la liste des sections
  formModif= false;                                  // indique si le formulaire est en mode modification
  sectionsSelectionnes: Section[] = [];                       // liste des sections sélectionnées via le modal de sélection

  /**
   * Constructeur de la page pour le formulaire des gabarits
   * @param gabaritService service associé aux gabarits
   * @param sectionService service associé aux sections
   * @param formBuilder constructeur pour le formulaire
   * @param activatedRoute router permettant d'obtenir des données sur la route en utilisation
   * @param router router permettant de gérer la navigation
   * @param modalCtrl contrôleur pour le modal de sélection
   * @author Emeric Chauret
   */
  constructor(private gabaritService: GabaritService, private sectionService: SectionService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private modalCtrl: ModalController) { }

  /**
   * Méthode appeler sur l'initialisation de la page permettant de construire le formulaire
   * @author Emeric Chauret
   */
  ngOnInit() {
    // Création du formulaire pour le gabarit
    this.gabaritForm = this.formBuilder.group({
      nom: ['', Validators.required],
      sections: this.formBuilder.array([])
    });
  }

  get champNom() { return this.gabaritForm.get('nom'); }

  /**
   * Méthode qui s'exécute avant le chargement de la page
   * @author Emeric Chauret
   */
  ionViewWillEnter(){
    this.gabaritId = parseInt(this.activatedRoute.snapshot.paramMap.get('id') as string);
    if (this.gabaritId) {
      // Récupérer le gabarit ayant l'identifiant gabaritId dans la bd
      this.obtenirGabaritParId(this.gabaritId);
    }
    // Récupérer la liste des sections du gabarit
    this.obtenirToutesLesSections();
  }

  /**
   * Méthode qui s'exécute lorsqu'on quitte la page.
   * Elle effectue la désinscription des observables.
   * @author Emeric Chauret
   */
  ionViewWillLeave(){
    if(this.observableGabarit$){
      this.observableGabarit$.unsubscribe();
    }
    this.observableSections$.unsubscribe();
  }

  /**
   * Appel la méthode du service des gabarits qui permet de récupérer le gabarit ayant l'identifiant id dans la bd
   * @param id l'identifiant du gabarit à récupérern (number)
   * @author Emeric Chauret
   * @author Jonathan Carrière
   */
  obtenirGabaritParId(id: number) {
    // Observable permettant d'obtenir un gabarit par son id
    this.observableGabarit$ = this.gabaritService.obtenirGabaritParId(id).subscribe({
      next: (res: ApiResponse<Gabarit>) => {
        if (res.data) {
          this.gabarit = res.data;                   // le gabarit à modifier
          this.formModif = true;                     // le formulaire est en mode modification
          this.gabaritForm.patchValue(this.gabarit); // Insérer les données du gabarit dans the formulaire
          // Obtenir les sections du formArray
          const sectionsArray = this.gabaritForm.get('sections') as FormArray;
          // Supprimer l'ensemble des sections se retrouvant dans le formArray pour les sections
          while (sectionsArray.length) {
            sectionsArray.removeAt(0);
          }
          // Ajouter l'ensemble des sections dans le formArray en tenant compte de l'ordre
          this.gabarit.sections.forEach((section: SectionGabarit, index: number) => {
            sectionsArray.insert(index, this.creerSectionFormGroup(section));
          });
        }
      },
      error: () => {
          this.afficherErreur('Un problème est survenu lors du chargement du gabarit.');
          this.router.navigate(['/liste-gabarits']).then(r => true);
      }
    });
  }

  /**
   * Appel la méthode du service des gabarits qui permet de créer un nouveau gabarit et rediriger vers la liste des gabarits.
   * @author Emeric Chauret
   */
  creerGabarit(){
    this.gabaritService.creerGabarit(this.gabaritForm.value).subscribe({
      next: () => this.router.navigate(['/liste-gabarits']).then(r => true),
      error: () => this.afficherErreur('Un problème est survenu lors de la création du gabarit.')
    });
  }

  /**
   * Appel la méthode du service des gabarits qui permet de modifier un gabarit dans la bd et rediriger vers la liste des gabarits.
   * @author Emeric Chauret
   */
  modifierGabarit(){
    this.gabaritService.modifierGabarit(this.gabaritId, this.gabaritForm.value).subscribe({
      next: () => this.router.navigate(['/liste-gabarits']).then(r => true),
      error: () => this.afficherErreur('Un problème est survenu lors de la modification du gabarit.')
    });
  }

  /**
   * Appel la méthode du service des sections qui permet de récupérer la liste des sections dans la bd.
   * Puis, attends avant de donner une valeur à la variable lsSections.
   * @author Emeric Chauret
   */
  obtenirToutesLesSections() {
    this.observableSections$ = this.sectionService.obtenirToutesLesSections().subscribe({
      next: (res: ApiResponse<Section[]>) => {
        res.data ? this.lsSections = res.data : '';
      },
      error: () => {
          this.afficherErreur('Un problème est survenu lors du chargement du gabarit.');
          this.router.navigate(['/liste-gabarits']).then(r => true);
      }
    })
  }

  /**
   * Méthode permettant d'effectuer la gestion de la sélection des sections pour un gabarit
   * @author Jonathan Carrière
   */
  async ouvrirModalSections() {
    // Obtenir le FormArray pour les sections du gabarit provenant du formulaire
    const sectionsArray = this.gabaritForm.get('sections') as FormArray;
    // Obtenir les sections déjà sélectionnées pour le gabarit
    const sectionsSelection = sectionsArray.value.map((section: Section) => section.id);
    // Créer le modal permettant d'effectuer la gestion des sections
    const modal = await this.modalCtrl.create({
      component: RechercheComboBoxCheckboxComponent,
      componentProps: {
        'titre' : 'Sections',
        'objets' : this.lsSections.map(section => ({ text: section.titre, value: section.id })),
        'objetsSelectionnes': sectionsSelection || []
      }
    });
    // Afficher le modal permettant d'effectuer la gestion des sections
    await modal.present();
    // Obtenir les données du modal suite à sa fermeture par l'utilisateur
    const { data, role } = await modal.onWillDismiss();
    // Lorsque l'utilisateur appui sur le bouton de confirmation
    if (role === 'confirme') {
      // Ajouter les sections sélectionnées dans le formulaire
      for (const id of data) {
        // Vérifier si cette section est déjà dans le formulaire pour le gabarit
        if (!sectionsArray.value.some((section: Section) => section.id === id)) {
          // Rechercher pour la section spécifique dans la liste
          const sectionSelectionnee = this.lsSections.find(sectionRecherchee => sectionRecherchee.id === id);
          // Si la section en question est trouvée, l'ajouter dans le FormArray pour les sections
          if (sectionSelectionnee) {
            sectionsArray.push(this.creerSectionFormGroup(sectionSelectionnee));
          }
        }
      }
      // Supprimer les sections non-sélectionnés dans le formulaire
      for (let section = sectionsArray.length - 1; section >= 0; section--) {
        // Section à l'index de la liste des sections du gabarit
        const sectionSupprimee = sectionsArray.at(section);
        // Si les sections sélectionnées via le modal n'inclut pas celle-ci, la supprimer du formulaire
        if (!data.includes(sectionSupprimee.value.id)) {
          sectionsArray.removeAt(section);
        }
      }
      // Ajouter les sections sélectionnées dans le formulaire
      this.sectionsSelectionnes = this.sectionsSelectionnes.filter(section => data.includes(section.id));
    }

  }

  /**
   * Méthode permettant d'effectuer la gestion de la liste des sections via le drag and drop
   * @param evenement évènement permettant d'effectuer la gestion des sections d'un gabarit
   * @author Jonathan Carrière
   */
  gererRearrangementSections(evenement: CustomEvent<ItemReorderEventDetail>) {
    // Obtenir le formArray pour les sections du gabarit modifié avec le drag and drop
    const sectionsFormulaire = evenement.detail.complete(this.sections.controls);
    // Obtenir le formArray pour les sections du gabarit existant
    const sectionsArray = this.gabaritForm.get('sections') as FormArray;
    // Supprimer l'ensemble des sections se retrouvant dans le formArray pour les sections
    while (sectionsArray.length) {
      sectionsArray.removeAt(0);
    }
    // Ajouter l'ensemble des sections dans le formArray en tenant compte de l'ordre modifié
    sectionsFormulaire.forEach((section: FormGroup) => {
      sectionsArray.push(this.creerSectionFormGroup(section.value));
    });
  }

  /**
   * Méthode qui récupère le formArray sections dans le formulaire
   * @author Emeric Chauret
   */
  get sections() {
    return this.gabaritForm.get('sections') as FormArray;
  }

  /**
   * Méthode qui créer un formGroup dans le formArray sections.
   * Elle lie les informations de la section en paramètre aux valeurs des formControl
   * @param section la section à mapper à un formGroup (SectionGabarit)
   * @author Emeric Chauret
   */
  creerSectionFormGroup(section: SectionGabarit){
    return  this.formBuilder.group({
      id: [section.id],
      titre: [section.titre]
    });
  }

  /**
   * Méthode qui s'exécute lorsque l'utilisateur clique sur le bouton retirer d'une section.
   * Elle supprime la section par son index.
   * @param index l'index de la section à supprimer (number)
   * @author Emeric Chauret
   */
  retirerSection(index: number){
    this.sections.removeAt(index);
  }

  /**
   * Fonction pour étendre le fil d'arianne
   * @author Emeric Chauret
   */
  expandBreadcrumbs() {
    this.maxBreadCrumbs = 20;
  }

  /**
   * Méthode qui affiche le modal pour confirmer l'annulation de la création ou modification du gabarit
   * @author Emeric Chauret
   */
  async ouvrirModalConfirmerAnnulation() {
    // Crée le modal
    const modal = await this.modalCtrl.create({
      component: ModalConfirmerSuppressionComponent,
      componentProps: {'message' : `Souhaitez-vous vraiment annuler la ${this.formModif ? 'modification' : 'création'} du gabarit ?`}
    });
    // Affiche le modal
    await modal.present();
    // Récupérer les données du modal avant qu'il disparaisse
    const { role } = await modal.onWillDismiss();
    // Si l'utilisateur a confirmé l'annulation'
    if (role === 'confirm') {
      // rediriger vers la liste des gabarits
      this.router.navigate(['/liste-gabarits']).then(r => true)
    }
  }

  /**
   * Méthode permettant d'afficher un modal pour la gestion des erreurs
   * @param message le message d'erreur à afficher (string)
   * @author Emeric Chauret
   */
  afficherErreur(message: string) {
    const modalErreur = this.modalCtrl.create({
      component: ModalErreurServeurComponent,
      componentProps: {
        message: message
      }
    });
    modalErreur.then(modal => modal.present());
  }

}
