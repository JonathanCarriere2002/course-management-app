//@Author Samir El Haddaji

import {Component, ElementRef, Injectable, Input, ViewChild} from '@angular/core';
import {PlanCadres} from '../../../../models/planCadres/plan-cadres';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-pdf-plans-cadres',
  templateUrl: './pdf-plans-cadres.component.html',
  styleUrls: ['./pdf-plans-cadres.component.scss'],
})
export class PdfPlansCadresComponent {

  @ViewChild('pdfIframe') pdfIframe!: ElementRef;

  // Input permettant de recevoir le plan cadres
  @Input() planCadre!: PlanCadres;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
  }


  /**
   * Methode qui de redirection vers le pdf du plan-cadre
   * @author Samir El Haddaji
   */
  generatePDF() {
    const htmlContent = `
				<html>
          <head>
            <style>
            body {
                margin: 65px;
                font-family: Arial, sans-serif;
                background: #fff;
                color: black;
                display: flex;
                flex-direction: column;
            }

            .header {
                padding: 10px 15px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-top: 2px solid #000;
                border-bottom: 2px solid #000;
            }

            .header-logo {
                height: 30px;
            }

            .logo-container {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }

            .header-title {
                font-size: 20px;
                font-weight: bold;
                margin-right: 70px;
            }

            .course-title {
                font-size: 13px;
                margin-top: 5px;
            }

            .info-container {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }

            .course-number {
                display: flex;
                flex-direction: column;
                font-size: 13px;
                align-self: flex-end;
            }

            .header-right-text {
                font-size: 16px;
                text-align: right;
            }

            .informations {
                padding-top: 40px;
            }

            .textJustify {
                text-align: justify;
                page-break-inside: auto;
            }

            .section {
                break-inside: avoid;
            }

            @media print {
                table {
                    page-break-inside: auto;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }

                tr {
                    page-break-inside: avoid;
                    page-break-after: auto;
                }

                thead {
                    display: table-header-group;
                }

                tfoot {
                    display: table-footer-group;
                }
            }

            .table-content {
                position: relative;
                top: 50px;
            }

            .content-below-table {
                padding-top: 2em;
            }

            .pagebreak {
                page-break-before: always;
                margin-top: 40px;
            }
        </style>
          </head>
            <div class="header">
              <div class="logo-container">
                <img src="/assets/images/logo-cegep.png" alt="logo du cegep" class="header-logo" id="logoCegep"/>
                <div class="course-title">Titre du cours : ${this.planCadre?.titre}</div>
              </div>
              <div class="header-title">Plan-cadre</div>
              <div class="course-number">Numéro : ${this.planCadre?.code}</div>
            </div>

            <body>
            <div class="informations">
              <table border="0" cellspacing="0" cellpadding="0">
                <tbody>
                <tr>
                  <td width="177" valign="top"></td>
                  <td width="84" rowspan="3" valign="top"></td>
                </tr>
                <tr>
                  <td width="337" valign="top">
                    <p><strong>Pondération :</strong>${this.planCadre?.ponderation}</p>
                  </td>
                  <td width="177" valign="top">
                    <p><strong>Unités :</strong>${this.planCadre?.unites}</p>
                  </td>
                </tr>
                <tr>
                <td width="500" valign="top" class="informations">
                  <p><strong>Préalable</strong>:
                    ${(this.planCadre?.coursLiesPrealablesAbsolus?.length || this.planCadre?.coursLiesPrealablesRelatifs?.length)
      ? (
        (this.planCadre?.coursLiesPrealablesAbsolus || []).map(cours => `${cours.planCadre2.titre} (${cours.planCadre2.code})`)
          .concat((this.planCadre?.coursLiesPrealablesRelatifs || []).map(cours => `${cours.planCadre2.titre} (${cours.planCadre2.code})`))
          .join(', ')) : 'Aucun'}
                  </p>
                </td>
                <td width="177" valign="top"></td>
                </tr>
                <tr>
                  <td width="337" valign="top" class="informations">
                    <p><strong>Compétence</strong> <strong></strong></p>
                  </td>
                  <td width="177" valign="top" class="informations">
                    <p><strong>No</strong> <strong></strong></p>
                  </td>
                  <td width="84" valign="top" class="informations">
                    <p align="right"><strong>Atteinte</strong> <strong></strong></p>
                  </td>
                </tr>
                <tr>
                  <td width="337" valign="top">
                    <p>${this.planCadre?.competences.map(competence => competence.competence.enonce)}</p>
                  </td>
                  <td width="177" valign="top">
                    <p>${this.planCadre?.competences.map(competence => competence.competence.code)}</p>
                  </td>
                  <td width="84" valign="top">
                    <p align="right">${this.planCadre?.competences.map(competence => competence.atteinte)}</p>
                  </td>
                </tr>
                </tbody>
              </table>

            </div>
            ${this.planCadre?.sections
      ?.filter(section => section.titre.toUpperCase() !== 'COMPÉTENCE(S) DE CE COURS' && section.titre.toUpperCase() !== 'ATTITUDES')
      .map((section, index) => `
                 <div class="section">
                  <p class="textJustify"><strong>${section.titre}</strong>${section.info_suppl}</p>
                  <p class="textJustify">${section.texte.split('\n').map(line => line.trim()).join('<br>')}</p>
                </div>
              `).join('')}
            <br clear="all" />
            <div>
              <table align="center" border="1" cellspacing="0" cellpadding="0" class="table-content">
                <tbody>
                <tr>
                  <td width="150" valign="top">
                    <p align="center"><strong>OBJECTIF</strong> <strong></strong></p>
                  </td>
                  <td width="207" valign="top">
                    <p align="center"><strong>STANDARD</strong> <strong></strong></p>
                  </td>
                  <td width="303"  valign="top">
                    <p align="center"><strong>PRÉCISIONS SUR LES CONTENUS</strong></p>
                  </td>
                </tr>
                <tr>
                  <td width="116" valign="top">
                    <p align="center"><strong>Énoncé de la compétence</strong></p>
                  </td>
                  <td width="207" valign="top">
                    <p align="center">
                      <strong>Contexte de réalisation, devis ${this.planCadre?.competences.map(competence => competence.competence.annee_devis)} p.${this.planCadre?.competences.map(competence => competence.competence.pages_devis)}</strong>
                  </td>
                  <td width="303" valign="top">
                    <p align="center"><strong>Contexte de réalisation local</strong></p>
                  </td>
                </tr>
                <tr>
                  <td width="116" valign="top">
                    <p>${this.planCadre?.competences.map(competence => competence.competence.enonce)}(${this.planCadre?.competences.map(competence => competence.competence.code)})</p>
                  </td>
                  <td width="207" valign="top">
                    <p>${this.planCadre?.competences.map(competence => competence.competence.contexte.split('\n').map(line => line.trim()).join('<br>'))}</p>
                  </td>
                  <td width="303" valign="top">
                    <p>${this.planCadre?.competences.map(competence => competence.contexteLocal)}</p>
                  </td>
                </tr>
                <tr>
                  <td width="626" colspan="3" valign="top">
                    <p align="center">
                      <strong>
                        Attitudes à enseigner et à évaluer pour la compétence ${this.planCadre?.competences.map(competence => competence.competence.code)}
                      </strong>
                    </p>
                    <p align="center">${this.planCadre?.attitudes}</p>
                  </td>
                </tr>
                <tr>
                  <td width="116" valign="top">
                    <p align="center">
                      <strong>Éléments de la compétence</strong>
                    </p>
                  </td>
                  <td width="207" valign="top">
                    <p align="center">
                      <strong>Critères de performance</strong>
                    </p>
                  </td>
                  <td width="173" valign="top">
                    <p align="center">
                      <strong>Contenus locaux</strong>
                    </p>
                  </td>
                </tr>
                ${this.planCadre?.elementsCompetences?.map((elementcompetence, index) => `
                <tr>
                  <td width="116" valign="top">
                    <p>${elementcompetence.elementCompetence.numero} ${elementcompetence.elementCompetence.texte}</p>
                  </td>
                  <td width="207" valign="top">
                    <p>${elementcompetence.elementCompetence.criteresPerformance.map(criteresPerformance => criteresPerformance.texte.split('\n').map(line => line.trim()).join('<br>'))}</p>
                  </td>
                  <td width="173" valign="top">
                    <p>${elementcompetence.contenuLocal}</p>
                  </td>
                </tr>
                `).join('')}
                </tbody>
              </table>
            </div>
            <br clear="all" />
            <h1 class="pagebreak" align="left" class="content-below-table">Critères pour l'évaluation certificative finale (écf)</h1>
            <p><strong>${this.planCadre?.competences.map(competence => competence.competence.enonce)}</strong>. (${this.planCadre?.competences.map(competence => competence.competence.code)}) ${this.planCadre?.competences.map(competence => competence.atteinte)}</p>
            <p>
              ${this.planCadre?.elementsCompetences?.map((elementsCompetences) => {
      const numero = elementsCompetences.elementCompetence.numero;
      const texte = elementsCompetences.elementCompetence.texte
        .split('\n')
        .map((line) => line.trim())
        .join(' ');

      return `${numero}  ${texte}<br>`;
    })}
            </p>
            <p>Si possible, ne pas excéder 5 critères</p>
            <p>Le critère commence par un nom et doit être qualifié</p>
            <p>Ex. : Rédaction respectueuse des règles d'orthographe et de grammaire.</p>
            <table border="1" cellspacing="0" cellpadding="0">
              <tbody>
              <tr>
                <td width="508" valign="top">
                  <p>
                    <strong>Critères d'évaluation</strong>
                  </p>
                </td>
                <td width="127" valign="top">
                  <p align="center"><strong>Pondération</strong> <strong></strong></p>
                </td>
              </tr>
              ${this.planCadre?.criteresEvaluations?.map((criteresEvaluations, index) => `
              <tr>
                <td width="508" valign="top">
                  <p>${criteresEvaluations.id}. ${criteresEvaluations.enonce} (${this.planCadre?.competences.map(competence => competence.competence.code)}.${criteresEvaluations.id})</p>
                </td>
                <td width="127" valign="top">
                  <p align="center">${criteresEvaluations.ponderation}%</p>
                </td>
              </tr>
              `).join('')}
              </tbody>
            </table>
            <p>
              Note : dans le cas où le français n'est pas évalué, inscrire le pourquoi dans
              une note aux lecteurs.
            </p>
            <p>
              <strong>Pondération de l'évaluation certificative finale du cours :</strong>
              ${this.planCadre?.ponderationFinale}% de la note finale du cours
            </p>
            </body>

        </html>
      `;
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const iframeDocument = iframe.contentWindow?.document;
    if (iframeDocument) {
      iframeDocument.open();
      iframeDocument.write(htmlContent);
      iframeDocument.close();

      iframe.contentWindow?.addEventListener('afterprint', ()=>{
        document.body.removeChild(iframe);
      });

      iframe.contentWindow?.print();
    }
  }
}
