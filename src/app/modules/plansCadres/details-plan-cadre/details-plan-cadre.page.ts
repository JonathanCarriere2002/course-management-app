import {ActivatedRoute, Router} from '@angular/router';
import {PlanCadres} from '../../../models/planCadres/plan-cadres';
import {PlanCadresService} from '../../../services/planCadres/plan-cadres.service';
import {SectionGenerique} from '../../../models/sectionGenerique/section-generique';
import {ModalConfirmerSuppressionComponent} from '../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';
import {ModalController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {ApiResponse} from '../../../models/authentification/api-response';
import {PdfPlansCadresComponent} from '../../partage/components/pdf-plans-cadres/pdf-plans-cadres.component';
import {
  ModalErreurServeurComponent
} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
import {AuthService} from '../../../services/auth.service';
import {Component} from '@angular/core';

/**
 * Page permettant d'afficher les détails d'un plan-cadre
 * @author Jacob Beauregard-Tousignant
 * @author Samir El Haddaji
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-details-plan-cadre',
  templateUrl: './details-plan-cadre.page.html',
  styleUrls: ['./details-plan-cadre.page.scss'],
})
export class DetailsPlanCadrePage{


  // Valeur utilisée pour la barre de progrès pour l'approbation
  valeurProgressBar = 0;
  // Nombre maximum d'objets dans le fil d'arianne
  maxBreadcrumbs = 4;
  // Id du plan-cadre à afficher les détails
  private planCadreId = 0;
  // Mettre cette ligne, comme plan-cadre de base pour patienter avant que la méthode async ne trouve le vrai plan-cadre
  public planCadre: PlanCadres | undefined = {
    id:0,
    titre:'',
    code:'',
    ponderation:'',
    unites:0,
    attitudes:'',
    complet:false,

    changement: new Date(),
    ponderationFinale:0,
    approbationComite:new Date(),
    approbationDepartement:new Date(),
    depotDirectionEtudes:new Date(),
    criteresEvaluations:[],
    sections:[],
    competences: [{
      id:0,
      competence: {
        id:0,
        code:'',
        enonce:'',
        annee_devis: 0,
        contexte:'',
        pages_devis:'',
        programme_id: 0,
        elementsCompetences: []
      },
      planCadre:{
        id:0,
        titre:'',
        code:'',
        ponderation:'',
        unites:0,
        attitudes:'',
        complet:false,

        sections: [],
        changement: new Date(),
        ponderationFinale:0,
        approbationComite:new Date(),
        approbationDepartement:new Date(),
        depotDirectionEtudes:new Date(),
        criteresEvaluations:[],
        competences: [],
        elementsCompetences:[],
        programme: {
          id: 0,
          code: '',
          titre: '',
          competences: []
        },
        entreVigueur: {
          id:0,
          annee:2023,
          session:'automne',
          limite_abandon:new Date()
        },
        coursLiesPrealablesRelatifs:[],
        coursLiesPrealablesAbsolus:[],
        coursLiesCorequis:[]
      },
      atteinte:'',
      progression:''
    }],
    elementsCompetences:[],
    programme: {
      id: 0,
      code: '',
      titre: '',
      competences: []
    },
    entreVigueur: {
      id:0,
      annee:2023,
      session:'automne',
      limite_abandon:new Date()

    },
    coursLiesPrealablesAbsolus:[],
    coursLiesPrealablesRelatifs:[],
    coursLiesCorequis:[],
  };

  // Liste des sections génériques
  public listSectionsGeneriques: SectionGenerique[] = []
  programmeId = 0;
  observable$!: Subscription;

  constructor(protected planCadresService: PlanCadresService, private activatedRoute: ActivatedRoute, private modalCtrl: ModalController, private router: Router,
              private plansCadresComponent: PdfPlansCadresComponent, public authService: AuthService) { }

  /**
   * Méthode s'exécutant juste avant de quitter la page
   * @author Jacob Beauregard-Tousignant
   */
  ionViewWillLeave():void {
    this.observable$.unsubscribe();
  }

  ionViewWillEnter():void{
    //Démarrer le chargement

    //Aller récupérer l'Id dans l'URL
    this.planCadreId = parseInt((this.activatedRoute.snapshot.paramMap.get('id') as string));
    // Récupérer le plan-cadre duquel afficher les détails du service des plans-cadres
    this.observable$ = this.planCadresService.getPlanCadre(this.planCadreId).subscribe(
      (planCadre: ApiResponse<PlanCadres>) => {
      this.planCadre = planCadre.data;
      if(this.planCadre){
        this.programmeId = this.planCadre?.programme.id;
      }

      if(this.planCadre){
        // Mettre à jour la barre de progrès pour l'approbation du plan-cadre
        this.updateProgressBarChargement(this.planCadre);
      }
    },
    (error) => {
      this.afficherErreur('Un problème est survenu lors du chargement du plan-cadre.')
    });
  }

  /**
   * Fonction pour étendre le fil d'arianne
   */
  expandBreadcrumbs() {
    this.maxBreadcrumbs = 20;
  }

  /**
   * Méthode pour confirmer avec l'utilisateur qu'il veut bien supprimer le plan-cadre
   * Appel le modal de confirmation
   * @param planCadre Le plan-cadre à supprimer
   */
  async confirmerSuppression(planCadre: PlanCadres | undefined) {
    if(planCadre){
      const modal = await this.modalCtrl.create({
        component: ModalConfirmerSuppressionComponent,
        // Variable à passer au modal qui va le personnaliser avec ce message.
        // Lié au @Input du component du modal
        componentProps:{'message': `Souhaitez-vous vraiment supprimer le plan-cadre du cours ${planCadre?.titre}?`}

      });
      await modal.present();
      const { role } = await modal.onWillDismiss();
      if (role === 'confirm') {
        this.delete(planCadre?.id);
      }
    }
  }

  /**
   * Appel la méthode du service des plan-cadres, puis attend avant d'aller rechercher la liste
   * @param id
   */
  delete(id: number):void {
    this.planCadresService.deletePlanCadres(id).subscribe({
      next: () => this.router.navigate(['/programmes', this.planCadre?.programme.id, 'plans-cadres']),
      error: ()=>{
        this.afficherErreur('Un problème est survenu lors de la suppression du plan-cadre ' + this.planCadre?.code + '.')
      }
    });
  }

  /**
   * Appel de la methode d'exportation sous format csv
   * @Author : Samir El Haddaji
   */
  exporterCSV() {
    // Mettre les informations désirés sous form de array
    if(this.planCadre){
      // eslint-disable-next-line
      const dataToExport: any[] = [
        {
          'Programme': `${this.planCadre.programme.titre} (${this.planCadre.programme.code})`,
          'Titre': this.planCadre.titre,
          'Cours': `${this.planCadre.programme.titre}-${this.planCadre.programme.code}-${this.planCadre.ponderation}`,
          'Unités': this.planCadre.unites.toString(),
          'Attitudes': this.formaterQuill(this.planCadre.attitudes),
          'Pondération finale': `${this.planCadre.ponderationFinale}%`,
          'Date approbation du comité': this.planCadre.approbationComite,
          'Date approbation département': this.planCadre.approbationDepartement
        }
      ];

      // Convertire les informations sous format CSV
      const headers = Object.keys(dataToExport[0]);
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(item => {
          return headers.map(header => {
            if (Array.isArray(item[header])) {
              return item[header].join('\n');
            } else {
              return String(item[header]).replace(/(\r\n|\n|\r)/gm, ' ');
            }
          }).join(',')
        })
      ];
      const csv = csvContent.join('\n');

      // Utilisation de Blob pour le telechrgement en CSV
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Plan_Cadre_${this.planCadre.programme.titre}`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  // Methode de formatage pour les text quill
  formaterQuill(field: string) {
    return `"${field.replace(/"/g, '""')}"`;
  }

  /**
   * Méthode permettant d'obtenir un plan-cadre selon son identifiant
   * Cette méthode est utilisée pour mettre à jour les données affichées suite à l'approbation
   * @param id Identifiant du plan-cadre
   * @author Jonathan Carrière
   */
  getPlanCadre(id: number){
    // Obtenir le plan-cadre de la base de données via son identifiant
    this.observable$ = this.planCadresService.getPlanCadre(id).subscribe({
      next: (res: ApiResponse<PlanCadres>) => {
        res.data ? this.planCadre = res.data : '';
      },
      error:()=>{
        this.afficherErreur('Un problème est survenu lors du chargement du plan-cadre.');
      }
    })
  }

  /**
   * Méthode permettant de mettre à jour la barre de progrès pour l'approbation d'un plan-cadre au chargement de la page
   * @param planCadre Plan-cadre dont le statut d'approbation sera vérifié
   * @author Jonathan Carrière
   */
  updateProgressBarChargement(planCadre: PlanCadres) {
    // Vérifier si le plan-cadre a été approuvé par le département
    if (planCadre.approbationDepartement != null) {
      this.valeurProgressBar = 0.33;
    }
    // Vérifier si le plan-cadre a été approuvé par le comité de programme
    if (planCadre.approbationComite != null) {
      this.valeurProgressBar = 0.66;
    }
    // Vérifier si le plan-cadre a été approuvé par la direction des études
    if (planCadre.depotDirectionEtudes != null) {
      this.valeurProgressBar = 1;
    }
  }

  /**
   * Méthode pour afficher le bon format du titre du plan cadre
   * @param planCadre Le plan cadre duquel afficher le titre formaté
   */
  public assemblerTitrePlanCadre(planCadre:PlanCadres){
    const competences = planCadre.competences.map(competence=>competence.competence.code).join(', ');
    return planCadre.code + ' ' + planCadre.titre + ' ' + planCadre.ponderation + ' (' + competences + ')' ;
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
