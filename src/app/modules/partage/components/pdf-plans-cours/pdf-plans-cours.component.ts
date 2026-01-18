import {Component, Input} from '@angular/core';
import {PlanCours} from '../../../../models/planCours/plan-cours';

/**
 * Component permettant d'exporter un plan de cours en PDF
 * @author Jonathan Carrière
 */
@Component({
  selector: 'app-pdf-plans-cours',
  templateUrl: './pdf-plans-cours.component.html',
  styleUrls: ['./pdf-plans-cours.component.scss'],
})
export class PdfPlansCoursComponent {

  // Input permettant de recevoir le plan de cours à exporter en PDF
  @Input() planCours!: PlanCours;

  generatePDF() {

    // Création du PDF pour le plan de cours
    const printWindow = window.open('', '_blank');

    // Afficher la page contenant le plan de cours formaté pour l'impression en PDF
    if (printWindow) {

      // Entête et style pour le plan de cours
      printWindow.document.write(`
        <html lang="fr">
          <head>
            <title>${this.planCours.plan_cadre?.code} ${this.planCours.plan_cadre?.titre}</title>
                <style>
                    body {
                        margin: 50pt;
                        font-family: Arial, sans-serif;
                        background: #fff;
                        color: black;
                    }
                    br {
                        display: none;
                    }
                    li {
                        text-align: justify;
                    }
                    p {
                        text-align: justify;
                        margin-bottom: 15pt;
                    }
                    td p {
                    text-align: left;
                    }
                    td ul,td li {
                      text-align: left;
                      margin-left: 5pt;
                      padding-left: 0;
                    }
                    tfoot {
                      display: table-footer-group;
                    }
                    thead {
                      display: table-header-group;
                    }
                    .calendrierActivites .calendrierActivitesElemCompSemCours, .calendrierActivites .semainesTable th {
                      text-align: center;
                    }
                    .calendrierActivites table {
                      border-collapse: collapse;
                      width: 100%;
                      border: 1pt solid #000;
                    }
                    .calendrierActivites td {
                      border: 1pt solid #000;
                      padding: 10pt;
                    }
                    .calendrierActivites th {
                      border: 1pt solid #000;
                      padding: 10pt;
                      text-align: center;
                    }
                    .centrerTableauComptences {
                        text-align: center;
                        margin-top: 0;
                        margin-bottom: 5pt;
                    }
                    .comptences, .comptences .competencesTable th {
                      text-align: center;
                      margin-bottom: 15pt;
                    }
                    .comptences table {
                      border-collapse: collapse;
                      width: 100%;
                      border: 1pt solid #000;
                    }
                    .comptences td {
                      border: 1pt solid #000;
                      padding: 10pt;
                    }
                    .comptences th {
                      border: 1pt solid #000;
                      padding: 10pt;
                      text-align: center;
                    }
                    .courrielEnseignant {
                        text-decoration: blue underline;
                    }
                    .courrielEnseignantLong {
                        font-size: smaller;
                    }
                    .pageTitre {
                        max-width: 450pt;
                        page-break-after: always;
                        margin-top: 20pt;
                        margin-bottom: 20pt;
                        margin-left: 50pt;
                    }
                    .pageTitre p {
                        margin-top: 15pt;
                    }
                    .pageTitreDroite {
                        margin-left: 15pt;
                        width: fit-content;
                    }
                    .pageTitreGauche {
                        float: left;
                        width: 40%;
                    }
                    .posteEnseignantInvisible {
                        display: none;
                    }
                    .sectionsPlanCours {
                        margin: 5pt;
                        font-family: Arial, sans-serif;
                        background: #fff;
                        color: black;
                    }
                    .sectionPlanCours {
                        margin-bottom: 40pt;
                    }
                    .textSectionPlanCours {
                        text-align: justify;
                    }
                    .titre {
                        text-align: center;
                        margin-top: 35pt;
                        margin-bottom: 50pt;
                        font-size: x-large;
                    }
                    .titreCompetence {
                        margin-top: 30pt;
                        margin-bottom: 15pt;
                        text-align: center;
                        font-size: large;
                    }
                    .titreSectionPlanCours {
                        margin-bottom: 15pt;
                        font-size: larger;
                    }
                    #logoCegep {
                        width: 120pt;
                        height: 35pt;
                        margin-left: 20pt;
                    }
                    @page {
                      margin-top: 50pt;
                      margin-bottom: 50pt;
                    }
                    @page :first {
                      margin-top: 35pt;
                      margin-bottom: 20pt;
                    }
                </style>
          </head>
          <body>
      `);

      // Page titre du plan de cours
      printWindow.document.write(`
        <img src="/assets/images/logo-cegep.png" alt="logo du cegep" id="logoCegep" />
        <h1 class="titre">PLAN DE COURS</h1>
        <div class="pageTitre">
            <p><span class="pageTitreGauche">Campus</span><span class="pageTitreCentre"> : </span><span class="pageTitreDroite">${this.planCours.campus?.nom}</span></p>
            <p><span class="pageTitreGauche">Programme</span><span class="pageTitreCentre"> : </span><span class="pageTitreDroite">${this.planCours.plan_cadre?.programme.titre}</span></p>
            <p><span class="pageTitreGauche">Titre du cours</span><span class="pageTitreCentre"> : </span><span class="pageTitreDroite">${this.planCours.plan_cadre?.titre}</span></p>
            <p><span class="pageTitreGauche">Code du cours</span><span class="pageTitreCentre"> : </span><span class="pageTitreDroite">${this.planCours.plan_cadre?.code}</span></p>
            <p><span class="pageTitreGauche">Pondération</span><span class="pageTitreCentre"> : </span><span class="pageTitreDroite">${this.planCours.plan_cadre?.ponderation}</span></p>
            <p><span class="pageTitreGauche">Groupe</span><span class="pageTitreCentre"> : </span><span class="pageTitreDroite">${this.planCours.enseignants[0]?.groupe || ''}</span></p>
            <p><span class="pageTitreGauche">Session</span><span class="pageTitreCentre"> : </span><span class="pageTitreDroite">${this.planCours.session?.session} ${this.planCours.session?.annee}</span></p>
            <p><span class="pageTitreGauche">Enseignant(e)</span><span class="pageTitreCentre"> : </span><span class="pageTitreDroite">${this.planCours.enseignants[0]?.nom || ''}</span></p>
            <p><span class="pageTitreGauche">No. de bureau</span><span class="pageTitreCentre"> : </span><span class="pageTitreDroite">${this.planCours.enseignants[0]?.bureau || ''}</span></p>
            <p><span class="pageTitreGauche">Téléphone</span><span class="pageTitreCentre"> : </span><span class="pageTitreDroite">(819) 770-4012<span class="posteEnseignant">, poste ${this.planCours.enseignants[0]?.poste || ''}</span></span></p>
            <p><span class="pageTitreGauche">Courriel</span><span class="pageTitreCentre"> : </span><span class="courrielEnseignant pageTitreDroite">${this.planCours.enseignants[0]?.courriel || ''}</span></p>
            <p><span class="pageTitreGauche">Disponibilité</span><span class="pageTitreCentre"> : </span><span class="pageTitreDroite">${this.planCours.enseignants[0]?.dispo || ''}</span></p>
            <p><span class="pageTitreGauche">Limite d’abandon</span><span class="pageTitreCentre"> : </span><span class="pageTitreDroite">${this.planCours.session?.limite_abandon}</span></p>
        </div>
      `);

      // Appliquer du style additionnel sur le courriel de l'enseignant s'il est trop long
      const courrielSpan = printWindow.document.querySelector('.courrielEnseignant');
      if (courrielSpan && courrielSpan.textContent && courrielSpan.textContent.length > 32) {
        courrielSpan.classList.add('courrielEnseignantLong');
      }

      // Appliquer du style additionnel sur le poste de l'enseignant s'il n'existe pas
      const posteSpan = printWindow.document.querySelector('.posteEnseignant');
      if (posteSpan && !this.planCours.enseignants[0]?.poste) {
        posteSpan.classList.add('posteEnseignantInvisible');
      }

      // Sections du plan de cours
      const sectionsPlansCours = this.planCours.sections.map((section) => {

        // Initialiser le contenu de la section
        let sectionContenu = '';

        // Section du plan de cours contenant du texte riche
        if (section.type_section_id === 1 && section.texte !== '' && section.texte !== null) {
          sectionContenu = `
            <div class="sectionPlanCours">
              <h2 class="titreSectionPlanCours">${section.titre}</h2>
              <p class="textSectionPlanCours">${section.texte}</p>
            </div>
          `;
        }

        // Section du plan de cours contenant le calendrier des activités
        else if (section.type_section_id === 2 && this.planCours.semaines_cours.length !== 0) {
          sectionContenu = `
            <div class="sectionPlanCours">
              <h2 class="titreSectionPlanCours">${section.titre}</h2>
              <div class="calendrierActivites">
                <table class="semainesTable">
                  <thead>
                    <tr>
                      <th>Semaine(s)</th>
                      <th>Élément(s) de compétence</th>
                      <th>Balises de contenu</th>
                      <th>Activités et évaluations</th>
                    </tr>
                  </thead>
                  <tbody>
          `;
          // Afficher les semaines de cours dans le calendrier des activités
          for (const semaineCours of this.planCours.semaines_cours) {
            sectionContenu += `
                <tr>
                    <td class="calendrierActivitesElemCompSemCours">${semaineCours.semaineDebut === semaineCours.semaineFin ? semaineCours.semaineDebut : semaineCours.semaineDebut + ' à ' + semaineCours.semaineFin}</td>
                    <td class="calendrierActivitesElemCompSemCours">
            `;
            // Afficher les éléments de compétences pour une semaine de cours
            for (const elementComp of semaineCours.elementsCompetences ?? []) {
              // Supprimer les points des numéros des éléments de compétences
              sectionContenu += `${elementComp.numero.toString().replace('.', '')}`;
              // Ajouter une virgule après chaque numéro d'éléments de compétences, sauf pour le dernier
              if (elementComp !== semaineCours.elementsCompetences?.[semaineCours.elementsCompetences.length - 1]) {
                sectionContenu += ', ';
              }
            }
            // Si une semaine de cours ne possède pas d'éléments de compétences, simplement afficher 'aucun'
            if (semaineCours.elementsCompetences?.length === 0) {
              sectionContenu += 'Aucun';
            }
            // Ajouter les activités et le contenu de la semaine de cours dans le tableau
            sectionContenu += `
                </td>
                    <td>${semaineCours.contenu}</td>
                    <td>${semaineCours.activites}</td>
                </tr>
            `;
          }
          // Fermer les balises pour le tableau du calendrier des activités
          sectionContenu += `
            </tbody>
            <tfoot><tr></tr></tfoot>
            </table>
            </div>
            </div>
          `;
        }

          // Afficher le tableau des compétences du plan de cours
        else if (section.type_section_id === 3 && this.planCours.plan_cadre?.competences.length !== 0) {
          // Afficher le titre de la section pour le tableau des compétences
          sectionContenu = `
            <div class="sectionPlanCours">
                <h2 class="titreSectionPlanCours">${section.titre}</h2>
          `;
          // Parcourir la liste des compétences pour le plan de cours
          for (const competence of this.planCours.plan_cadre?.competences || []) {
            sectionContenu += `
              <div class="comptences">
                <p class="titreCompetence">${competence.competence.code} ${competence.competence.enonce}</p>
                <table class="competencesTable">
                <thead><tr></tr></thead>
                  <tbody>
                    <tr>
                      <td>
                        <p class="centrerTableauComptences"><strong>OBJECTIF</strong></p>
                      </td>
                      <td>
                        <p class="centrerTableauComptences"><strong>STANDARD</strong></p>
                      </td>
                      <td>
                        <p class="centrerTableauComptences"><strong>PRÉCISIONS SUR LES CONTENUS</strong></p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p class="centrerTableauComptences"><strong>Énoncé de la compétence</strong></p>
                      </td>
                      <td>
                        <p class="centrerTableauComptences"><strong>Contexte de réalisation, devis ${competence.competence.annee_devis} p.${competence.competence.pages_devis}</strong>
                      </td>
                      <td>
                        <p class="centrerTableauComptences"><strong>Contexte de réalisation local</strong></p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>${competence.competence.enonce} (${competence.competence.code})</p>
                      </td>
                      <td>
                        <ul>
                          ${competence.competence.contexte.split('\n').map(ligne => `<li>${ligne.trim()}</li>`).join('')}
                        </ul>
                      </td>
                      <td>
                        <ul>
                          ${competence.contexteLocal ? competence.contexteLocal.split('\n').map(ligne => `<li>${ligne.trim()}</li>`).join('') : ''}
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p class="centrerTableauComptences"><strong>Attitudes à enseigner et à évaluer pour la compétence ${competence.competence.code}</strong></p>
                        <p class="centrerTableauComptences">${this.planCours.plan_cadre?.attitudes}</p>
                      </td>
                    </tr>
                    ${this.planCours.plan_cadre?.elementsCompetences && this.planCours.plan_cadre.elementsCompetences.length > 0 ? `
                      <tr>
                        <td>
                          <p class="centrerTableauComptences"><strong>Éléments de la compétence</strong></p>
                        </td>
                        <td>
                          <p class="centrerTableauComptences"><strong>Critères de performance</strong></p>
                        </td>
                        <td>
                          <p class="centrerTableauComptences"><strong>Contenus locaux</strong></p>
                        </td>
                      </tr>
                      ${this.planCours.plan_cadre?.elementsCompetences?.map((elementCompetence) => `
                        <tr>
                          <td>
                            <p>${elementCompetence.elementCompetence.numero} ${elementCompetence.elementCompetence.texte}</p>
                          </td>
                          <td>
                            <ul>
                              ${elementCompetence.elementCompetence.criteresPerformance.map(criteresPerformance => criteresPerformance.texte.split('\n').map(ligne => `<li>${ligne.trim()}</li>`).join('')).join('')}
                            </ul>
                          </td>
                          <td>
                            <p>${elementCompetence.contenuLocal}</p>
                          </td>
                        </tr>
                      `).join('')}` : ''}
                  </tbody>
                  <tfoot><tr></tr></tfoot>
                </table>
              </div>
            `;
          }
          // Fermer les balises pour le tableau des compétences
          sectionContenu += `
            </div>
          `;
        }

        // Retourner le contenu de la section du plan de cours
        return sectionContenu;

      }).join('');

      // Ajouter les sections du plan de cours dans le document
      printWindow.document.write(`
        <div class="sectionsPlanCours">
            ${sectionsPlansCours}
        </div>
      `);

      // Fermer les balises du document pour le plan de cours
      printWindow.document.write(`
        </body>
        </html>
      `);

      // Script permettant d'afficher le PDF une fois que le logo du cégep est chargé
      printWindow.document.write(`
        <script>
            // Vérifier que le logo du cégep est chargé avant d'afficher le PDF
            const logoCegep = document.getElementById('logoCegep');
            logoCegep.onload = function() {
                // Afficher le PDF pour le plan de cours
                window.print();
            };
        </script>
      `);

      // Fermer la page une fois que le PDF est fermé ou téléchargé
      printWindow.onafterprint = function(){
        printWindow.close();
      };

    }

  }

}
