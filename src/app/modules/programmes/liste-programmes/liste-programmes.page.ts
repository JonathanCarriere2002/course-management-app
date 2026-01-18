import { Component, ViewChild } from '@angular/core';
import { ModalConfirmerSuppressionComponent } from '../../partage/components/modal-confirmer-suppression/modal-confirmer-suppression.component';
import { IonModal, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Programme } from '../../../models/programmes/programme';
import { ProgrammeService } from '../../../services/programmes/programme.service';
import { Router } from '@angular/router';
import { ApiResponse } from '../../../models/authentification/api-response';
import {AuthService} from '../../../services/auth.service';
import {ModalErreurServeurComponent} from '../../partage/components/modal-erreur-serveur/modal-erreur-serveur.component';

@Component({
    selector: 'app-liste-programmes',
    templateUrl: './liste-programmes.page.html',
    styleUrls: ['./liste-programmes.page.scss'],
})
export class ListeProgrammesPage {
    programmes: Programme[] = [];
    programmesRecherche: Programme[] = [];
    observable$!: Subscription;
    maxBreadcrumbs = 4;
    chargement = false;
    @ViewChild(IonModal) modal!: IonModal;

    public programme: Programme = {
        id: 0,
        code: '',
        titre: '',
        competences: [{id: 0, code: '', enonce: '', annee_devis: 0, pages_devis: '', contexte: '', programme_id: 0, elementsCompetences: []}]
    };

    constructor(
        private programmeServices: ProgrammeService,
        private modalCtrl: ModalController,
        private router: Router,
        public authService : AuthService,
    ) {}

    /**
     * Méthode qui va rechercher tous les programmes
     */
    getProgramme(): void {
        this.observable$ = this.programmeServices.getProgrammes().subscribe({
            next: (res: ApiResponse<Programme[]>) => {
                this.programmes = res.data || [];
                this.programmesRecherche = this.programmes.slice();
                this.chargement = false;
            },
            error: (err) => {
              this.afficherErreur('Une erreur est survenue lors du chargement des programmes.');
              this.router.navigate(['/accueil']).then(r => true);
          }
        });
    }

    /**
     * Quand on entre dans la page, appeler getProgramme
     */
    ionViewWillEnter(): void {
        this.getProgramme();
        this.chargement = this.programmes.length === 0;
    }

    /**
     * Quand on quitte la page, on enleve notre vue sur la base de donnée
     */
    ionViewWillLeave(): void {
        this.observable$.unsubscribe();
    }

    /**
     * Method qui supprime un programme grace a son Id
     */
    delete(id: number): void {
        this.programmeServices.deleteProgramme(id).subscribe({
            next: () => this.getProgramme(),
        });
    }

  //Méthode permettant de filtrer la liste d'objets affichée via une barre de recherche
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rechercher(event: any) {
    const texteRecherche = event.target.value.toLowerCase().trim();
    if (texteRecherche !== '') {
      this.programmesRecherche = this.programmes.filter(programme =>
        programme.titre.toLowerCase().trim().includes(texteRecherche) || programme.code.toLowerCase().trim().includes(texteRecherche)
      );
    }
    else {
      this.programmesRecherche = this.programmes.slice();
    }
  }

    async confirmerSuppression(programme: Programme) {
        const modal = await this.modalCtrl.create({
            component: ModalConfirmerSuppressionComponent,
            componentProps: { message: `Souhaitez-vous vraiment supprimer le programme ${programme?.titre}?` },
        });
        await modal.present();

        const { role } = await modal.onWillDismiss();

        if (role === 'confirm') {
            this.delete(programme?.id);
        }
    }

    redirectToListePlansCadres(programmeId: number): void {
        this.router.navigate(['/programmes',programmeId ,'plans-cadres' ]);
    }

    redirectToDetails(programmeId: number) {
        this.router.navigate(['/details-programmes', programmeId]);
    }

    redirectToListePlansCours(programmeId: number) {
        this.router.navigate(['/programme', programmeId, 'plans-cours']);
    }

    redirect(page: string){
      this.router.navigate(['/' + page]);
    }

    expandBreadcrumbs() {
        this.maxBreadcrumbs = 20;
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
