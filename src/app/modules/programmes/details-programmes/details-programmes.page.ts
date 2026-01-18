import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiResponse} from '../../../models/authentification/api-response';
import {Programme} from '../../../models/programmes/programme';
import {Competence} from '../../../models/competences/competence';
import {Subscription} from 'rxjs';
import {ProgrammeService} from '../../../services/programmes/programme.service';
import {CompetencesService} from '../../../services/competences/competences.service';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
import {ModalController} from '@ionic/angular';

/**
 * @author Samir El Haddaji
 */

@Component({
  selector: 'app-details-programmes',
  templateUrl: './details-programmes.page.html',
  styleUrls: ['./details-programmes.page.scss'],
})
export class DetailsProgrammesPage implements OnInit {
  // Liste des programmes
  programmes : Programme[] = []
  // Liste des competences
  competences : Competence[] = []
  // Id de l'programme qui sera affiché
  programmeId  = 0;
  // programme qui sera affiché
  programme: Programme = { id: 0, code: '', titre: ''};
  // Observable permettant d'effectuer la gestion des données de la page
  observable$! : Subscription;
  // Quantité maximale pour les breadcrumbs
  maxBreadCrumbs = 4;

  constructor(private programmeServices : ProgrammeService, private competenceServices : CompetencesService, private activatedRoute: ActivatedRoute, private router: Router, private modalCtrl: ModalController,) { }

  //Méthode appeler sur l'initialisation de la page permettant d'envoyer les données du programme à la page
  ngOnInit() {
    // Obtenir l'Id du programme à afficher des paramètres de l'URL
    this.programmeId = parseInt((this.activatedRoute.snapshot.paramMap.get('id') as string));
    // Obtenir le programme à afficher selon son Id et l'envoyer dans la page
    this.programmeServices.getProgramme(this.programmeId).subscribe( {
      next: (res: ApiResponse<Programme>) => {
        res.data ? this.programme = res.data : '';
      },
      // Redirection vers la liste des programmes si aucun programme possède l'identifiant dans l'URL
      error: () => {
        this.router.navigate(['/programmes']).then(r => true);
      }
    });
  }

  //Méthode permettant d'obtenir l'ensemble des programmes
  getProgrammes() {
    this.observable$ = this.programmeServices.getProgrammes().subscribe( {
      next: (res: ApiResponse<Programme[]>) => {
        res.data ? this.programmes = res.data : '';
      },
      error: (err) => {
        this.afficherErreur('Une erreur est survenue lors du chargement du programme.');
      }
    });
  }

  // Méthode permettant d'obtenir l'ensemble des competences
  getCompetences() {
    this.observable$ = this.competenceServices.getCompetences().subscribe( {
      next: (res: ApiResponse<Competence[]>) => {
        res.data ? this.competences = res.data : '';
      },
      error: (err) => {
        this.afficherErreur('Une erreur est survenue lors du chargement des compétences.');
      }
    });
  }

  // Méthode permettant d'obtenir l'ensemble des programmes au chargement de la page
  ionViewWillEnter(){
    this.getProgrammes();
    this.getCompetences();
  }

  //Méthode permettant d'arrêter de se désabonner de l'observable contenant les programmes quand la page est fermée
  ionViewWillLeave(){
    this.observable$.unsubscribe()
  }

  expandBreadcrumbs() {
    this.maxBreadCrumbs = 20;
  }

  /**
   * Méthode permettant d'afficher un modal pour la gestion des erreurs
   * @author Samir El Haddaji
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
