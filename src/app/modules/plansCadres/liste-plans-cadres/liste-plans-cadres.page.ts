import {Component, OnInit} from '@angular/core';
import {PlanCadres} from '../../../models/planCadres/plan-cadres';
import {ModalController} from '@ionic/angular';
import {PlanCadresService} from '../../../services/planCadres/plan-cadres.service';
import {Subscription} from 'rxjs';
import {ApiResponse} from '../../../models/authentification/api-response';
import {ActivatedRoute, Router} from '@angular/router';
import {Programme} from '../../../models/programmes/programme';
import {ProgrammeService} from '../../../services/programmes/programme.service';
import {LienCompetencesPlansCadres} from '../../../models/lienCompetencesPlansCadres/lien-competences-plans-cadres';
import {PdfPlansCadresComponent} from '../../partage/components/pdf-plans-cadres/pdf-plans-cadres.component';
import {AuthService} from '../../../services/auth.service';
import {
  ModalErreurServeurComponent
} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';


/**
 * Page permettant d'afficher la liste des plans cadre
 * @author Jacob Beauregard-Tousignant
 * @author Samir El Haddaji
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-liste-plans-cadres',
  templateUrl: './liste-plans-cadres.page.html',
  styleUrls: ['./liste-plans-cadres.page.scss'],
})
export class ListePlansCadresPage implements OnInit {

  chargement = false;                 // variable permettant d'effectuer la gestion du chargement des données

  protected readonly event = event;
  planCadres: PlanCadres[] = [];
  observable$!: Subscription;
  //Liste des plans-cadres correspondant à la recherche par mot-clé
  plansCadresRecherche: PlanCadres[] = [];
  // Liste des plans-cadres filtrée selon leur statut d'Approbation qui sera affichée
  planCadresFiltre: PlanCadres[] = [];
  // Option sélectionnée pour le filtrage des plans-cadre
  selectionFiltragePlansCadre = 'tousPlanCadres';
  // Nombre maximum d'objets dans le fil d'arianne
  maxBreadcrumbs = 4;
  programmeId?:number;
  programme?:Programme;




  constructor(protected planCadresService: PlanCadresService, protected programmeService : ProgrammeService, protected authService: AuthService,
              private modalCtrl: ModalController, private route: ActivatedRoute, private router : Router,
              private plansCadresComponent: PdfPlansCadresComponent) {  }


  ngOnInit(){
    this.chargement = true
  }


  /**
   * Quand on s'apprête à entrer dans une page, et cherchant les plans-cadres selon le programme
   */
  ionViewWillEnter(): void {
    this.route.paramMap.subscribe(params => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.programmeId = +params.get('programmeId');
      //Aller chercher le programme
      this.observable$ = this.programmeService.getProgramme(this.programmeId).subscribe((programmeReponse)=>{
        this.programme = programmeReponse.data;
        this.getPlanCadre();
        //Vérifier si les plans cadres sont chargés, si non, démarrer le chargement
        this.chargement = this.planCadres.length === 0
      },
        (error) => {
        this.chargement = false;
          // Erreur : message d'erreur
          this.afficherErreur('Un problème est survenu lors du chargement des plans-cadres.');
          //Rediriger vers la liste
          this.router.navigate(['/programmes']);
        });
    },
      (error) => {
        // Erreur : message d'erreur
        this.afficherErreur('Un problème est survenu lors du chargement du plan-cadre.');
        //Rediriger vers la liste
        this.router.navigate(['/programmes', this.programmeId, 'plans-cadres']);
      });
  }

  /**
   * Méthode s'exécutant juste avant de quitter la page
   * @author Jacob Beauregard-Tousignant
   */
  ionViewWillLeave():void{
    this.observable$.unsubscribe();
    this.selectionFiltragePlansCadre = 'tousPlanCadres';
  }


  /**
   * Méthode qui va chercher tous les plans-cadres de la source de données
   */
  getPlanCadre():void{
    if(this.programmeId){
      this.observable$ = this.planCadresService.getPlansCadresParProgramme(this.programmeId.toString()).subscribe({
          next: (res: ApiResponse<PlanCadres[]>) => {
            // Obtenir la liste des plans-cadre du service
            res.data ? this.planCadres = res.data : '';
            // Attribuer la liste des plans-cadre à la liste filtrée pour l'affichage
            this.planCadresFiltre = this.planCadres;
            this.chargement = false;
          },
          error: () => {
            // Erreur : message d'erreur
            this.afficherErreur('Un problème est survenu lors du chargement des plan-cadres.');
            //Rediriger vers la liste
            this.router.navigate(['/programmes']);
          }
        }
      );
    }
    else {
      this.plansCadresRecherche = this.planCadres.slice();
      this.planCadresFiltre = this.plansCadresRecherche.slice();
      this.chargement = false;
    }

  }

  /**
   * Méthode pour exporter les données de plan-cadre en CSV
   * @author Samir
   */
  exportAllToCsv() {
    this.planCadresService.getPlanCadres().subscribe((planCadres: ApiResponse<PlanCadres[]>) => {
      if(planCadres.data){
        if (planCadres && planCadres.data.length > 0) {
          // eslint-disable-next-line
          const dataToExport: any[] = [];

          //Mettre pondération et approbation
          planCadres.data.forEach((planCadre: PlanCadres) => {
            dataToExport.push({
              'Titre': planCadre.titre,
              'Code du cours': planCadre.code,
              'Ponderation': "'" + planCadre.ponderation,
              'Approbation département': planCadre.approbationDepartement,
              'Approbation comité': planCadre.approbationComite,
            });
          });

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

          const blob = new Blob([csv], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Plan_Cadres.csv';
          a.click();
          window.URL.revokeObjectURL(url);
        }
      }

    },
      (error) => {
        // Erreur : message d'erreur
        this.afficherErreur('Un problème est survenu lors de l\'exportation.');
      });
  }


  /**
   * Fonction pour étendre le fil d'arianne
   */
  expandBreadcrumbs() {
    this.maxBreadcrumbs = 20;
  }

  /**
   * Méthode permettant de filtrer les plans-cadre selon leur statut d'approbation
   * @author Jonathan Carrière
   */
  filtrerPlansCadre() {
    // Vérifier l'option de filtrage pour l'approbation des plans-cadre sélectionné
    switch (this.selectionFiltragePlansCadre) {
      // Si l'option de filtrage correspond aux plans-cadre non approuvés
      case 'planCadreNonApprouves':
        // Afficher l'ensemble des plans-cadres non approuvés
        this.planCadresFiltre = this.plansCadresRecherche.filter(pc => pc.approbationDepartement == null);
        break;
      // Si l'option de filtrage correspond aux plans-cadre approuvés par le département
      case 'planCoursApprouvesDepartement':
        // Afficher l'ensemble des plans-cadres approuvés par le département
        this.planCadresFiltre = this.plansCadresRecherche.filter(pc => pc.approbationDepartement !== null && pc.approbationComite == null && pc.depotDirectionEtudes == null);
        break;
      // Si l'option de filtrage correspond aux plans-cadre approuvés par le comité de programme
      case 'planCoursApprouvesComite':
        // Afficher l'ensemble des plans-cadres approuvés par le comité de programme
        this.planCadresFiltre = this.plansCadresRecherche.filter(pc => pc.approbationComite !== null && pc.depotDirectionEtudes == null);
        break;
      // Si l'option de filtrage correspond aux plans-cadre approuvés par la direction des études
      case 'planCoursApprouvesDirection':
        // Afficher l'ensemble des plans-cadres approuvés par la direction des études
        this.planCadresFiltre = this.plansCadresRecherche.filter(pc => pc.depotDirectionEtudes !== null);
        break;
      default:
        // Par défaut, afficher l'ensemble des plans-cadres
        this.planCadresFiltre = this.plansCadresRecherche.slice();
    }
  }

  /**
   * Méthode pour afficher le bon format du titre du plan cadre
   * @param planCadre Le plan cadre duquel afficher le titre formatté
   */
  public assemblerTitrePlanCadre(planCadre:PlanCadres){
    const competences = planCadre.competences.map(competence=>competence.competence.code).join(', ');
    return planCadre.code + ' ' + planCadre.titre +' '+ planCadre.ponderation + ' (' + competences + ')' ;
  }

  /**
   * Méthode pour ne pas que les boutons n'ouvre les accordéons
   * @author Samir El Haddaji
   * @author Jacob Beauregard-Tousignant
   * @param event
   */
  boutonStopPropagation(event:Event){
    event.stopPropagation()
  }


  /**
   * Méthode permettant de filtrer la liste d'objets affichée via une barre de recherche
   * La recherche ce fait via le titre, le code, la pondération ou le code des compétences du plan-cadre
   * @param event Évènement de changement sur la barre de recherche
   * Adapté par Jacob du code de Jonathan Carrière
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rechercher(event: any) {
    // Texte se retrouvant dans la barre de recherche
    const texteRecherche = event.target.value.toLowerCase().trim();
    // Vérifier si la barre de recherche n'est pas vide
    if (texteRecherche !== '') {
      // Filtrer la liste affichée selon le texte dans la barre de recherche
      this.plansCadresRecherche = this.planCadres.filter(planCadre =>
        planCadre.code.toLowerCase().trim().includes(texteRecherche) || planCadre.titre.toLowerCase().trim().includes(texteRecherche) ||
          planCadre.competences.map((c : LienCompetencesPlansCadres) => c.competence.code.toLowerCase().trim()).includes(texteRecherche) ||
          planCadre.ponderation.toLowerCase().trim().includes(texteRecherche)
      );
    }
    // Si la barre de recherche est vidée, la liste complète est affichée à nouveau
    else {
      this.plansCadresRecherche = this.planCadres.slice();
    }
    //Filtrer de nouveau selon le niveau d'approbation
    this.filtrerPlansCadre();
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
