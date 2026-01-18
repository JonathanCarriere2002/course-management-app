import { Component, OnInit } from '@angular/core';
import {SectionService} from '../../../services/section/section.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Section} from '../../../models/section/section';
import {ApiResponse} from '../../../models/authentification/api-response';
import {TypeSectionService} from '../../../services/typeSection/type-section.service';
import {TypeSection} from '../../../models/typeSection/type-section';
import {ModalController} from '@ionic/angular';
import {ModalConfirmerSuppressionComponent} from '../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';
import {
  ModalErreurServeurComponent
} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';

/**
 * Page pour le formulaire d'ajout ainsi que de modification pour les sections
 * @author Emeric Chauret
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-formulaire-section',
  templateUrl: './formulaire-section.page.html',
  styleUrls: ['./formulaire-section.page.scss'],
})
export class FormulaireSectionPage implements OnInit {

  maxBreadCrumbs = 4;              // nombre maximum d'objets dans le fil d'arianne
  sectionForm!: FormGroup;                  // formulaire pour créer et modifier une section
  sectionId = 0;                   // l'identifiant de la section à modifier
  observableSection$!: Subscription;        // un observable pour la section à modifier
  observableTypesSection$!: Subscription;   // un observable pour la liste des types de section
  typesSection: TypeSection[] = [];         // la liste des types de section
  formModif= false;                // indique si le formulaire est en mode modification
  section!: Section;                        // la section à modifier

  /**
   * Constructeur de la page pour le formulaire des gabarits
   * @param sectionService service associé aux sections
   * @param typeSectionService service associé aux types des sections
   * @param formBuilder constructeur pour le formulaire
   * @param activatedRoute router permettant d'obtenir des données sur la route en utilisation
   * @param router router permettant de gérer la navigation
   * @param modalCtrl contrôleur pour le modal de sélection
   * @author Emeric Chauret
   * @author Jonathan Carrière
   */
  constructor(private sectionService: SectionService, private typeSectionService: TypeSectionService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private modalCtrl: ModalController) { }

  /**
   * Méthode appeler sur l'initialisation de la page permettant de construire le formulaire
   * @author Emeric Chauret
   */
  ngOnInit() {
    // Création du formulaire pour la section
    this.sectionForm = this.formBuilder.group({
      titre: ['', Validators.required],
      info_suppl: [''],
      aide: [''],
      obligatoire: [false, Validators.required],
      type_section_id: ['', Validators.required]
    });
  }

  get champTitre() { return this.sectionForm.get('titre'); }

  /**
   * Méthode qui s'exécute avant le chargement de la page.
   * @author Emeric Chauret
   * @author Jonathan Carrière
   */
  ionViewWillEnter(){
    // Récupérer l'identifiant de la section à modifier dans la requête http
    this.sectionId = parseInt(this.activatedRoute.snapshot.paramMap.get('id') as string);
    if (this.sectionId) {
      // Récupérer la section ayant l'identifiant sectionId dans la bd
      this.obtenirSectionParId(this.sectionId);
    }
    this.obtenirTousLesTypesSection(); // Récupérer les types de section dans la bd
  }

  /**
   * Méthode qui s'exécute lorsqu'on quitte la page. Elle effectue la désinscription de l'observable.
   * @author Emeric Chauret
   */
  ionViewWillLeave(){
    if(this.observableSection$){
      this.observableSection$.unsubscribe();
    }
    this.observableTypesSection$.unsubscribe();
  }

  /**
   * Appel la méthode du service des sections qui permet de
   * récupérer la section ayant l'identifiant id dans la bd.
   * @param id l'identifiant de la section à récupérer (number)
   * @author Emeric Chauret
   */
  obtenirSectionParId(id: number) {
    this.observableSection$ = this.sectionService.obtenirSectionParId(id).subscribe({
      next: (res: ApiResponse<Section>) => {
        if (res.data) {
          this.section = res.data;
          this.formModif = true;                 // le formulaire est en mode modification
          this.sectionForm.patchValue(res.data); // Insérer les données de la section dans le formulaire
        }
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargement de la section.');
        this.router.navigate(['/liste-sections']).then(r => true);
      }
    });
  }

  /**
   * Appel la méthode du service des sections qui permet de créer une nouvelle section. Puis, redirige vers la liste des sections.
   * @author Emeric Chauret
   */
  creerSection(){
    this.sectionService.creerSection(this.sectionForm.value).subscribe({
      next: () => this.router.navigate(['/liste-sections']).then(r => true),
      error: () => this.afficherErreur('Un problème est survenu lors de la création de la section.')
    });
  }

  /**
   * Appel la méthode du service des sections qui permet de modifier une section dans la bd. Puis, redirige vers la liste des sections.
   * @author Emeric Chauret
   */
  modifierSection(){
    this.sectionService.modifierSection(this.sectionId, this.sectionForm.value).subscribe({
      next: () => this.router.navigate(['/liste-sections']).then(r => true),
      error: () => this.afficherErreur('Un problème est survenu lors de la modififcation de la section.')
    });
  }

  /**
   * Appel la méthode du service des types de section qui permet de récupérer la liste des types de section.
   * Puis, attends avant de donner une valeur à la variable typesSection.
   * @author Emeric Chauret
   */
  obtenirTousLesTypesSection(){
    this.observableTypesSection$ = this.typeSectionService.obtenirTousLesTypesSection().subscribe({
      next: (res: ApiResponse<TypeSection[]>) => {
        res.data ? this.typesSection = res.data : '';
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargement de la section.');
        this.router.navigate(['/liste-sections']).then(r => true);
      }
    })
  }

  /**
   * Méthode qui affiche le modal pour confirmer l'annulation de la création ou modification du gabarit
   * @author Emeric Chauret
   * @author Jonathan Carrière
   */
  async ouvrirModalConfirmerAnnulation() {
    // Crée le modal
    const modal = await this.modalCtrl.create({
      component: ModalConfirmerSuppressionComponent,
      componentProps: {'message' : `Souhaitez-vous vraiment annuler la ${this.formModif ? 'modification' : 'création'} de la section ?`}
    });
    // Affiche le modal
    await modal.present();
    // Récupérer les données du modal avant qu'il disparaisse
    const { role } = await modal.onWillDismiss();
    // Si l'utilisateur a confirmé l'annulation'
    if (role === 'confirm') {
      // rediriger vers la liste des gabarits
      this.router.navigate(['/liste-sections']).then(r => true)
    }
  }

  /**
   * Méthode permettant d'afficher un modal pour la gestion des erreurs
   * @param message message d'erreur à afficher (string)
   * @author Emeric Chauret
   */
  afficherErreur(message:string) {
    const modalErreur = this.modalCtrl.create({
      component: ModalErreurServeurComponent
    });
    modalErreur.then(modal => modal.present());
  }

  /**
   * Fonction pour étendre le fil d'arianne
   * @author Emeric Chauret
   */
  expandBreadcrumbs() {
      this.maxBreadCrumbs = 20;
  }

}
