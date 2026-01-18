import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  isListOpenProgramme = false;
  isListOpenTableau = false;

  darkMode = false;

  public appPages = [
    { title: 'Compétences', url: 'competences', icon: 'clipboard-outline' },
    { title: 'Critères', url: '/liste-criteres-evaluations', icon: 'shield-checkmark-outline' },
    { title: 'Enseignants', url: '/enseignants', icon: 'person-outline' },
    { title: 'Plans-Cadres', url: '/plans-cadres', icon: 'document-text-outline' },
    { title: 'Plans de cours', url: '/liste-plans-cours', icon: 'documents-outline' },
    { title: 'Programmes', url: '/programmes', icon: 'bulb-outline' },
    { title: 'Sessions', url: '/sessions', icon: 'school-outline' },
  ];

  ngOnInit() {
    this.checkAppMode();
  }

  constructor( private router: Router, public authService : AuthService ) {}


  /**
   * Methode qui active l'ouverture du dropdown pour programme
   * @author Samir El Haddaji
   */
  toggleDropdownProgramme(event: Event) {
    event.stopPropagation();
    this.isListOpenProgramme = !this.isListOpenProgramme;
  }

  /**
   * Methode qui active l'ouverture du dropdown pour tableau de bord
   * @author Samir El Haddaji
   */
  toggleDropdownTableau(event: Event) {
    event.stopPropagation();
    this.isListOpenTableau = !this.isListOpenTableau;
  }

  /**
   * Methode qui de redirection vers liste programme
   * @author Samir El Haddaji
   */
  redirectToProgrammesPage() {
    this.router.navigate(['/programmes']);
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
