import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ModalConfirmerSuppressionComponent} from './components/modal-confirmer-suppression/modal-confirmer-suppression.component';
import {MenuComponent} from './components/menu/menu.component';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {FooterComponent} from './components/footer/footer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RechercheComboBoxCheckboxComponent} from './components/recherche-combo-box-checkbox/recherche-combo-box-checkbox.component';
import {RechercheComboBoxRadioComponent} from './components/recherche-combo-box-radio/recherche-combo-box-radio.component';
import {ModalFormulaireCompetenceComponent} from './components/modal-formulaire-competence/modal-formulaire-competence.component';
import {QuillEditorComponent, QuillViewComponent} from 'ngx-quill';
import {SectionGeneriqueDetailComponent} from './components/section-generique-detail/section-generique-detail.component';
import {ModalCritereEvalComponent} from '../plansCadres/modal-critere-eval/modal-critere-eval.component';
import {DragDropComponent} from './components/drag-and-drop/drag-and-drop.component';
import {CdkDrag, CdkDropList} from '@angular/cdk/drag-drop';
import {ModalConfirmerApprobationComponent} from './components/modal-confirmer-approbation/modal-confirmer-approbation.component';
import {ItemsPopoverComponent} from './components/items-popover/items-popover.component';
import {ListPlansCadresLiesComponentComponent} from '../plansCadres/list-plans-cadres-lies-component/list-plans-cadres-lies-component.component';
import {TableauCompetenceComponent} from './components/tableau-competence/tableau-competence.component';
import {ChargementComponent} from './components/chargement/chargement.component';
import {SectionFormulaireComponent} from './components/section-formulaire/section-formulaire.component';
import {SectionDetailsComponent} from './components/section-details/section-details.component';
import {ModalInfoComponent} from './components/modal-info/modal-info.component';
import {BtnConfirmationApprobationComponent} from '../planCours/components/btn-confirmation-approbation/btn-confirmation-approbation.component';
import {PdfPlansCadresComponent} from './components/pdf-plans-cadres/pdf-plans-cadres.component';
import {ModalErreurServeurComponent} from './components/modal-erreur-serveur/modal-erreur-serveur.component';
import {PdfPlansCoursComponent} from './components/pdf-plans-cours/pdf-plans-cours.component';

/**
 * Classe permettant de partager des components à plusieurs modules de l'application
 */
@NgModule({
  declarations: [
    ModalConfirmerSuppressionComponent,
    MenuComponent,
    FooterComponent,
    RechercheComboBoxCheckboxComponent,
    RechercheComboBoxRadioComponent,
    SectionGeneriqueDetailComponent,
    ModalCritereEvalComponent,
    ModalFormulaireCompetenceComponent,
    ModalConfirmerApprobationComponent,
    ListPlansCadresLiesComponentComponent,
    TableauCompetenceComponent,
    DragDropComponent,
    ItemsPopoverComponent,
    ChargementComponent,
    SectionFormulaireComponent,
    SectionDetailsComponent,
    ModalInfoComponent,
    BtnConfirmationApprobationComponent,
    PdfPlansCadresComponent,
    ModalErreurServeurComponent,
    PdfPlansCoursComponent
  ],
  exports: [
    ModalConfirmerSuppressionComponent,
    MenuComponent,
    FooterComponent,
    RechercheComboBoxCheckboxComponent,
    RechercheComboBoxRadioComponent,
    SectionGeneriqueDetailComponent,
    ModalCritereEvalComponent,
    ModalConfirmerApprobationComponent,
    ListPlansCadresLiesComponentComponent,
    TableauCompetenceComponent,
    DragDropComponent,
    ChargementComponent,
    SectionFormulaireComponent,
    SectionDetailsComponent,
    ModalInfoComponent,
    BtnConfirmationApprobationComponent,
    PdfPlansCadresComponent,
    ModalErreurServeurComponent,
    PdfPlansCoursComponent
  ],
    imports: [
        CommonModule,
        QuillEditorComponent,
        RouterLinkActive,
        ReactiveFormsModule,
        RouterLink,
        IonicModule,
        FormsModule,
        CdkDropList,
        CdkDrag,
        QuillViewComponent,
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PartageModule { }
