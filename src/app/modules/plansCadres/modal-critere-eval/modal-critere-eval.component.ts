import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IonModal, ModalController} from '@ionic/angular';
import {CriteresEvaluations} from '../../../models/critereEvaluation/criteres-evaluations';
import {CriteresEvaluationsService} from '../../../services/criteresEvaluations/criteres-evaluations.service';
import {ElementCompetenceService} from '../../../services/elementsCompetences/element-competence.service';
import {RechercheCbo} from '../../../models/RechercheCbo/recherche-cbo';
import {ElementCompetence} from '../../../models/elementsCompetences/element-competence';
import {ActivatedRoute, Router} from '@angular/router';

import {Subscription} from 'rxjs';
import {
  RechercheComboBoxCheckboxComponent
} from '../../partage/components/recherche-combo-box-checkbox/recherche-combo-box-checkbox.component';
import {ApiResponse} from '../../../models/authentification/api-response';
import {
  ModalErreurServeurComponent
} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';

@Component({
  selector: 'app-modal-critere-eval',
  templateUrl: './modal-critere-eval.component.html',
  styleUrls: ['./modal-critere-eval.component.scss'],
})
export class ModalCritereEvalComponent  implements OnInit {
    @ViewChild(IonModal) modal!: IonModal;

    @Input() idCritere?:number;
    @Input() critere?:CriteresEvaluations;
    @Input() lsElementCompetences?:RechercheCbo[];
    prochainId?:number;

    critereEvalForm!: FormGroup;
    elementsCompetencesRecherche: RechercheCbo[] = [];
    elementsCompetences: ElementCompetence[] = [];
    criteresEvaluation: CriteresEvaluations[] = [];

    elementsCompetencesSelectionne: ElementCompetence[] = [];

    observable$!: Subscription;

    flagPremierAppelLiaison = true;


    constructor(private critereEvaluationService: CriteresEvaluationsService, private elementCompetenceService: ElementCompetenceService,
                private modalCtrl: ModalController, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) {
    }

     ngOnInit() {
        this.critereEvalForm = this.formBuilder.group({
            //Façon "en ligne" de créer des FormControl
            enonce: ['', Validators.required],
            ponderation: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
            elementsCompetence:this.formBuilder.array([]),
            id:[''],

        });

        //S'il n'y a pas de idCritere, c'est un ajout
        if(!this.idCritere){
            //Aler chercher le dernier
          this.observable$ = this.critereEvaluationService.getCriteresEvaluations().subscribe((criteresApiResponse:ApiResponse<CriteresEvaluations[]>)=>{
            const criteres = criteresApiResponse.data
            if(criteres){
              this.prochainId = criteres[criteres.length-1].id + 1;

              this.critereEvalForm.patchValue({
                id: this.prochainId,
                enonce:'',
                ponderation:''

              })
            }

            },
            (error) => {
              // Erreur : message d'erreur
              this.afficherErreur('Un problème est survenu lors du chargement des critères d\'évaluation.');
            })

        }
        //S'il y a un id, c'est une modification
        else {
          this.prochainId = this.idCritere;
          this.critereEvalForm.patchValue({
            enonce: this.critere?.enonce,
            ponderation: this.critere?.ponderation,
            id:this.critere?.id,
          });

          if(this.critere){
              this.getElementsCompetencesFormArray(this.critere);
          }


        }

    }

    /**
     * Méthode s'effectuant juste avant d'entrer dans la page
     */
    async ionViewWillEnter(): Promise<void> {
        await this.getElementsCompetencesRecherche();
    }

    /**
     * Méthode s'axécutant juste avant de quitter la page
     * @author Jacob Beauregard-Tousignant
     */
    ionViewWillLeave():void{
        this.observable$.unsubscribe();
    }


    /**
     * Méthode qui est appelé pour fermer le modal de création d'un critère d'évaluation
     * @author Jacob Beauregard-Tousignant
     */
    annulerAjoutCritereEval():Promise<boolean> {
        this.critereEvalForm.reset();
        return this.modalCtrl.dismiss(null, 'annule')
    }

    /**
     * Méthode récupérant les informations du formulaire de création de critère d'évaluation et l'envoie au service de création pour la base de données
     * @author Jacob beauregard-Tousignant
     */
    async creerCritereEvaluation(){
      //Récupérer la valeur du formulaire afin de lui assigner l'objet élément de compétence s'il y a un numéro
      let critere: CriteresEvaluations = this.critereEvalForm.value;
      this.observable$ = this.critereEvaluationService.createCritereEvaluation(critere).subscribe(res => {
        if(res.data){
          critere = res.data as CriteresEvaluations
        }
          //Vider le formulaire
          this.critereEvalForm.reset();
          return this.modalCtrl.dismiss(critere, 'confirme')
        },
        (error) => {
          // Erreur : message d'erreur
          this.afficherErreur('Un problème est survenu lors de la création du critères d\'évaluation.');
        });

    }

  /**
   * Méthode récupérant les informations du formulaire de création de critère d'évaluation et l'envoie au service de création pour la base de données
   * @author Jacob beauregard-Tousignant
   */
  async modifierCritere(idCritere:number){
    //Récupérer la valeur du formulaire afin de lui assigner l'objet élément de compétence s'il y a un numéro
    const nouvelleVersionCritere: CriteresEvaluations = this.critereEvalForm.value;
    //Si le critère d'évaluation n'a pas d'élément de compétence
    this.observable$ = this.critereEvaluationService.updateCritereEvaluation(idCritere, nouvelleVersionCritere).subscribe( (versionModifie)=>{
        //Vider le formulaire
        this.critereEvalForm.reset()
        return this.modalCtrl.dismiss(nouvelleVersionCritere, 'confirmeModifier');
      },
      (error) => {
        // Erreur : message d'erreur
        this.afficherErreur('Un problème est survenu lors de la modification du critère d\'évaluation.');
      });
  }


    /**
     * Méthode qui appelle le modal pour lier un élément de compétence au critère d'évaluation
     * Donne la valeur aux variables utilisées dans le component
     * @author Jacob Beauregard-Tousignant
     */
    public async appelerModalLiaisonElemComp() {
      const choixObjets = this.lsElementCompetences;
      let objetsSelectionnes:string[] = []

      if(this.critere?.elementsCompetence && this.flagPremierAppelLiaison){
        objetsSelectionnes = this.critere.elementsCompetence.map(e=>e.id.toString());
        this.elementsCompetencesSelectionne = this.critere.elementsCompetence;

        this.flagPremierAppelLiaison = false;
      }

      for(const element of this.elementsCompetencesSelectionne){
        if(!objetsSelectionnes.includes(element.id.toString())){
          objetsSelectionnes.push(element.id.toString())
        }
      }


      const modal = await this.modalCtrl.create({
          component: RechercheComboBoxCheckboxComponent,
          componentProps: {
              'titre': 'Élément de compétence',
              'objets': choixObjets,
              'objetsSelectionnes': objetsSelectionnes
          }
      });

        await modal.present();

        const {data, role} = await modal.onWillDismiss();

        if (role === 'confirme') {

          // Retirer les éléments de compétences qui ont été décochés
          for(const element of this.elementsCompetencesSelectionne){
            if(!data.includes(element.id)){
              const index = this.elementsCompetence.controls.findIndex(c => c.value.id === element.id)
              this.elementsCompetence.removeAt(index);
              this.elementsCompetence.updateValueAndValidity();
            }
            this.elementsCompetencesSelectionne = this.elementsCompetencesSelectionne.filter(e => data.includes(e.id));
          }


          // Ajouter les éléments de compétence qui ont été cochés
          for (const idElement of data) {
              //Trouver l'élément de compétence liée au id

            this.observable$ = this.elementCompetenceService.getElementComptetence(idElement).subscribe((elementCompetence : ApiResponse<ElementCompetence>)=>{
                  if (elementCompetence.data) {
                      const elementComp = elementCompetence.data
                    //Vérifier s'il y a déjà la compétence dans la liste
                    if (!this.elementsCompetencesSelectionne.includes(elementComp)){
                        //Si elle n'est pas là, l'ajouté
                        this.elementsCompetencesSelectionne.push(elementComp);
                        //Vérifier s'il y a déjà un formarray pour cet élément de compétence, si oui, ne peas en faire
                        if(this.elementsCompetence.controls.findIndex(c => c.value.id === elementComp.id) === -1){
                            this.creerElementCompetenceFormGroup(elementComp);
                        }

                    }
                }

              },
              (error) => {
                // Erreur : message d'erreur
                this.afficherErreur('Un problème est survenu lors du chargement des éléments de compétence.');
              })
          }




            this.critereEvalForm.patchValue({
                id: this.prochainId,
                enonce: this.critereEvalForm.get('enonce')?.value,
                ponderation: this.critereEvalForm.get('ponderation')?.value,
            })

        }
    }

  /**
   * Méthode pour créer des formarray pour les éléments de compétences
   * @param elementCompetence
   * @private
   */
  private creerElementCompetenceFormGroup(elementCompetence: ElementCompetence){
    this.elementsCompetence.push(this.formBuilder.group({
      id:[elementCompetence.id],
      numero: [elementCompetence.numero],
      texte: ['(' + elementCompetence.numero + ') ' + elementCompetence.texte]
    }));
  }

  get elementsCompetence() {
    return this.critereEvalForm.get('elementsCompetence') as FormArray;
  }


    /**
     * Méthode pour retirer l'élément de compétence choisit de la création du critère d'évaluation
     */
    public retirerElementCompetence(): void {
        this.critereEvalForm.setValue({
            id:this.prochainId,
            enonce: this.critereEvalForm.get('enonce')?.value,
            ponderation: this.critereEvalForm.get('ponderation')?.value,
            elementCompetenceNumero: ''
        });

    }

    /**
     * Fonction pour formater
     * @param data
     * @private
     */
    private formatData(data: string[]) {
        if (data.length === 1) {
            const objet = this.elementsCompetencesRecherche.find((elementComp) => elementComp.value === data[0]);
            return objet!.text;
        }

        return `${data.length} items`;
    }


    /**
     * Méthode qui va chercher tous les éléments de compétences
     * et les formate pour pouvoir les utiliser dans le modal de recherche pour lier une élément à un critère d'évaluation
     */
    async getElementsCompetencesRecherche(): Promise<void> {
        this.observable$ = this.elementCompetenceService.getElementsComptetence().subscribe({
            next: (res : ApiResponse<ElementCompetence[]>) => {
                res.data ? this.elementsCompetences = res.data : '';
                for (const element of this.elementsCompetences) {
                    const elementRecherche: RechercheCbo = {
                        text: element.texte,
                        value: element.id.toString(),
                    };
                    this.elementsCompetencesRecherche.push(elementRecherche);
                }
            },
          error: () => {
            // Erreur : message d'erreur
            this.afficherErreur('Un problème est survenu lors de la suppression du plan-cadre.');
          }

        });

    }

    /**
     * Méthode pour obtenir les éléments de compétences sous forme de FormArray
     * @param critere Le critère duquel récupéré les éléments de compétence
     */
    getElementsCompetencesFormArray(critere:CriteresEvaluations){
        //Assigner les critères d'évaluations du plan-cadre à modifier à la liste à afficher
        if(critere.elementsCompetence){
            this.elementsCompetences = critere.elementsCompetence;
            critere.elementsCompetence.forEach((element:ElementCompetence) => {
                this.creerElementCompetenceFormGroup(element);
            });
        }

    }

  /**
   * Méthode permettant d'afficher un modal pour la gestion des erreurs avec un message
   */
  afficherErreur(messageErreur:string) {
    const modalErreur = this.modalCtrl.create({
      component: ModalErreurServeurComponent,
      componentProps:{
        'message': messageErreur
      }
    });
    modalErreur.then(modal => modal.present());
  }


}
