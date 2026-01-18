import {Component, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import { ItemsPopoverComponent } from '../items-popover/items-popover.component';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../services/auth.service';

/**
 * Component correspondant au menu de l'application
 * @author Jonathan Carrière
 * @author Samir El Haddaji
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit{
  isListOpen = false;
    // Permet de montrer le menu si la page n'est pas accueil
  isAccueilPage = false;
  // Permet de montrer le menu si la page n'est pas page oublié mot de passe
  isOublieMotDePassePage = false;

  darkMode = false;

  ngOnInit() {
    this.checkAppMode();
  }

  public appPages = [
    { title: 'Compétences', url: '/competences' },
    { title: 'Enseignants', url: '/enseignant' },
    { title: 'Plans-Cadres', url: '/plans-cadres' },
    { title: 'Plans de Cours', url: '/liste-plans-cours' },
    { title: 'Programmes', url: '/programmes' },
    { title: 'Sessions', url: '/sessions' },
    { title: 'Tableau de bord', url: '/tableau-bord' }
  ];

  constructor(public popoverController: PopoverController, private router: Router, private authService : AuthService, private route: ActivatedRoute) {
    // Permet de montrer le menu si la page n'est pas accueil
    this.isAccueilPage = this.router.url.includes('/connexion');
    this.isOublieMotDePassePage = this.router.url.includes('/mot-de-passe-oublie');
  }

  /**
   * Methode pour ouvrir le popover en async à partir du component ItemsPopoverComponent
   * @author Samir El Haddaji
   */
  // eslint-disable-next-line
  async openPopover(event:any) {
    const popover = await this.popoverController.create({
      component: ItemsPopoverComponent,
      event : event,
      translucent: true,
      showBackdrop: false,
      backdropDismiss: true,
      dismissOnSelect: true,
    });

    popover.onWillDismiss().then(() => {
      this.isListOpen = false;
    });
    // TODO mettre un catch pour gerer l'a situation ou le then n'est pas execute
    // Error message:No catch method for promise. This may result in unhandled promise rejection

    this.isListOpen = true;
    return await popover.present();
  }

  /**
   * Méthode permettant à un utilisateur ayant un compte de se déconnexion
   * @author Samir El Haddaji
   */
  logout(){
    // Fonction permettant d'effectuer une tentative de déconnexion
    this.authService.logout()
    // Si la déconnexion a réussi, effectuer une redirection vers l'accueil'
    this.router.navigateByUrl('/connexion').then(r => true)
  }


  /**
   * Méthode pour mettre l'application en dark ou en light mode
   * @author Jacob Beauregard-Touignant
   */
  toggleDarkMode(){
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    if(this.darkMode){
      localStorage.setItem('darkModeActivated', 'true');
    }
    else{
      localStorage.setItem('darkModeActivated', 'false');
    }
  }

  /**
   * Méthode pour vérifier si l'application doit être en light mode ou en dark mode au lancement de la page
   * @author Jacob Beauregard-Tousignant
   */
  checkAppMode(){
    const checkSiDarkMode = localStorage.getItem('darkModeActivated');
    checkSiDarkMode == 'true' ? (this.darkMode = true): (this.darkMode = false);
    document.body.classList.toggle('dark', this.darkMode)
  }
}
