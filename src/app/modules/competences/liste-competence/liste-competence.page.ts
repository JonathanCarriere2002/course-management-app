import { Component } from '@angular/core';
import {Competence} from '../../../models/competences/competence';
import {Subscription} from 'rxjs';
import {CompetencesService} from '../../../services/competences/competences.service';
import {ModalController} from '@ionic/angular';
import {
  ModalConfirmerSuppressionComponent
} from '../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';
import {ApiResponse} from '../../../models/authentification/api-response';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
/* @author lebel */
@Component({
  selector: 'app-liste-competence',
  templateUrl: './liste-competence.page.html',
  styleUrls: ['./liste-competence.page.scss'],
})
export class ListeCompetencePage {

  // Liste de compétences
  competences: Competence[] = [];
  competenceRecherche: Competence[] = [];
  observable$!: Subscription;
  // Nombre maximum d'objet dans le fil d'arianne
  maxBreadcrumbs = 4;
  // Variable pour afficher ou non le component de chargement
  chargement = false;

  constructor(private competencesService: CompetencesService,
              private modalController : ModalController,
              private router: Router,
              public authService : AuthService) { }

  // Fonction permettant d'obtenir l'ensemble des compétences
  getCompetences() {
    this.observable$ = this.competencesService.getCompetences().subscribe( {
      next: (res : ApiResponse<Competence[]>) =>{
        res.data ? this.competences = res.data : '';
        this.competenceRecherche = this.competences;
        this.chargement = false;
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors du chargements des compétences.');
        // Rediriger vers liste de comps
        this.router.navigate(['/competences']).then(promesse => true);
      }
    })
  }

  /**
   * Quand on s'apprête à entrer dans une page
   */
  ionViewWillEnter():void{
    this.getCompetences();
    this.chargement = this.competences.length === 0;
  }

  /**
   * Méthode s'axécutant juste avant de quitter la page
   */
  ionViewWillLeave():void{
    this.observable$.unsubscribe();
  }

  // Methode pour supprimer une competence et ses elements de competences ainsi que ses criteres de performance
  delete(id: number): void{
    this.observable$ = this.competencesService.deleteCompetence(id).subscribe({
      next: () => this.getCompetences(),
      error: () => {
        this.afficherErreur('Un problème est survenu lors de la suppression de la compétence.');
      }
    })
  }

  /**
   * Méthode appelant le modal pour confirmer la suppression d'un plan-cadre
   * @param competence La competence qui sera supprimee
   */
  async confirmSuppression(competence: Competence) {
    const modal = await this.modalController.create({ // Création du modal de suppression
      component: ModalConfirmerSuppressionComponent,
      componentProps: {'message' : `Souhaitez-vous vraiment supprimer la compétence (${competence.code}) ${competence?.enonce}?`}
    });
    await modal.present(); // Attendre que le modal soit présent
    const {role } = await modal.onWillDismiss(); // Attendre que le modal soit fermé
    if (role === 'confirm') {
      this.delete(competence.id); // Supprimer la compétence une fois confirmé via le modal
    }
  }

  /**
   * Fonction pour étendre le fil d'arianne
   */
  expandBreadcrumbs() {
    this.maxBreadcrumbs = 20;
  }

  redirect(page: string){
    this.router.navigate(['/' + page]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rechercherComp(event: any) {
    const texteRecherche = event.target.value.toLowerCase().trim();
    if (texteRecherche !== '') {
      this.competenceRecherche = this.competences.filter(competence =>
          competence.enonce.toLowerCase().trim().includes(texteRecherche) || competence.code.toLowerCase().trim().includes(texteRecherche)
      );
    }
    else {
      this.competenceRecherche = this.competences.slice();
    }
  }

  /**
   * Méthode permettant d'afficher un modal pour la gestion des erreurs de compétence
   */
  afficherErreur(messageErreur: string) {
    const modalErreur = this.modalController.create({
      component: ModalErreurServeurComponent,
      componentProps:{
        'message' : messageErreur
      }
    });
    modalErreur.then(modal => modal.present());
  }

}
