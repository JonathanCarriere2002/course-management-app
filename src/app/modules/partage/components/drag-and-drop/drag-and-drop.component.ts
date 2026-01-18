import {Component, EventEmitter, Inject, Input, OnChanges, Output} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {debounce} from '@agentepsilon/decko';
import {ElementCompetence} from '../../../../models/elementsCompetences/element-competence';
import {ModalConfirmerSuppressionComponent} from '../modal-confirmer-suppression/modal-confirmer-suppression.component';
import {ModalController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {ElementCompetenceService} from '../../../../services/elementsCompetences/element-competence.service';
import {CriterePerformanceService} from '../../../../services/criteresPerformances/critere-performance.service';
import {CriterePerformance} from '../../../../models/criteresPerformances/critere-performance';
import {ModalFormulaireCompetenceComponent} from '../modal-formulaire-competence/modal-formulaire-competence.component';
import {ModalErreurServeurComponent} from '../modal-erreur-serveur/modal-erreur-serveur.component';
/* @author lebel */

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss'],
})
export class DragDropComponent implements OnChanges {
  // Recevoir la competence
  @Input() elementCompetences: ElementCompetence[] = [];
  @Input() lastElement!: ElementCompetence|CriterePerformance;
  @Input() lastCritere!: CriterePerformance;
  @Output() nvEnfantsCompetence: EventEmitter<ElementCompetence[]> = new EventEmitter<ElementCompetence[]>();
  observable$!: Subscription;

  // nodes = liste d'element de competence qui est la propriete de competence
  nodes: ElementCompetence[] = [];
  // ids for connected drop lists
  dropTargetIds: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodeLookup: Record<any, ElementCompetence> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dropActionTodo: any = null;
  itemToParentMap: Record<string, string> = {};

  // A chaque fois que la comp en @input change, on re-recoit la comp et ca update le DAD automatiquement
  ngOnChanges() {
    // Compare la vieille competence a la nouvelle comp et s'il y a une diff, on refresh le DAD
    this.nodes = this.elementCompetences || [];
    this.nodeLookup = {};
    this.prepareDragDrop(this.nodes);
  }

  /**
   * Méthode pour envoyer le nouvel ordre des enfants de la compétence au component parent (output)
   * @param comp
   */
  emettre(comp: ElementCompetence[]) {
    this.nvEnfantsCompetence.emit(comp);
  }

  constructor(@Inject(DOCUMENT) private document: Document,
              private modalController: ModalController,
              private elementCompetencesService: ElementCompetenceService,
              private criterePerformanceService: CriterePerformanceService) {
    this.prepareDragDrop(this.elementCompetences);
  }

  /**
   * Méthode qui retroune l'index de l'item.id qui correspond au id en param
   * @param itemId
   */
  getIndexOfElementCompetence(itemId: number): number {
    return this.nodes.findIndex(item => item.id === itemId);
  }

  /**
   * Méthode qui retourne l'index de l'Objet associé au id en param de la liste en param
   * @param itemId
   * @param elementComp
   */
  getIndexOfCriterePerformance(itemId: number, elementComp: ElementCompetence): number {
    return elementComp.criteresPerformance.findIndex(item => item.id === itemId);
  }

  /**
   * Méthode qui 'créer' les items et la hiérarchie du drag and drop
   * En d'autres mots, c'est cette méthode qui initialise ou prepare le drag and drop
   * @param nodes
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prepareDragDrop(nodes: any[]) {
    // TODO Je sais pas a quoi ca sa sert mais en l'enlevant, le nodeLookUp fonctionne
    //this.nodeLookup = {};
    nodes.forEach(node => {

      this.dropTargetIds.push(String(node.id));

      this.nodeLookup[node.id] = node;

      // Vérifier si les elements de competences ont des enfants
      // eslint-disable-next-line no-prototype-builtins
      if (node.hasOwnProperty('criteresPerformance') && node.criteresPerformance && node.criteresPerformance.length > 0) {
        node.criteresPerformance.forEach((child: { id: string | number; }) => {

          this.itemToParentMap[child.id] = String(node.id);
            // Renvoyer les elements de competence (nv ordre des enfants) en output
            if (this.elementCompetences) {
                this.emettre(this.elementCompetences)
            }
        });
        this.prepareDragDrop(node.criteresPerformance);
      }
    });
      // Renvoyer les elements de competence (nv ordre des enfants) en output
      if (this.elementCompetences) {
          this.emettre(this.elementCompetences)
      }
  }

  @debounce(50)
  dragMoved(event: { pointerPosition: { x: number; y: number; }; }) {
    const e = this.document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);

    if (!e) {
      this.clearDragInfo();
      return;
    }
    const container = e.classList.contains('node-item') ? e : e.closest('.node-item');
    if (!container) {
      this.clearDragInfo();
      return;
    }
    this.dropActionTodo = {
      // targetId est l'item sur lequel le draggedItem est passé au dessus en dernier. Pour savoir ou drop le draggedItem,
      // Le code prends le dernier hovered item et il verifie si le drop est avant ou apres cet item.
      targetId: container.getAttribute('data-id')
    };
    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 3;

    if (event.pointerPosition.y - targetRect.top < oneThird) {
      // before
      this.dropActionTodo['action'] = 'before';
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      // after
      this.dropActionTodo['action'] = 'after';
    } else {
      // inside
      this.dropActionTodo['action'] = 'inside';
    }
    this.showDragInfo();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  drop(event: { item: { data: any; }; previousContainer: { id: any; }; }) {
    if (!this.dropActionTodo) return;

    // Id de l'item dragged
    const draggedItemId = event.item.data;
    // Item déplacé
    const draggedItem = this.nodeLookup[draggedItemId];
    // Id du parent original du draggedItem
    const oldParentItemId = event.previousContainer.id;
    // Id du parent de l'item draggedItem
    const targetListId = this.getParentNodeId(this.dropActionTodo.targetId, this.nodes, 'main') || 'main';
    // Id du parent de l'item draggedItem
    const firstParentId = this.getParentNodeId(this.dropActionTodo.targetId, this.nodes, 'main');
    // Ancien container du draggedItem
    const oldItemContainer = oldParentItemId != 'main' ? this.nodeLookup[oldParentItemId].criteresPerformance : this.nodes;
    // Nouveau container du draggedItem
    const newContainer = targetListId != 'main' ? this.nodeLookup[targetListId].criteresPerformance : this.nodes;
    // Objet qui est vise comme nouveau container
    const newContainerItem: ElementCompetence | string = this.nodeLookup[targetListId] || 'main';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const i = oldItemContainer.findIndex((c: { id: any; }) => c.id === draggedItemId);
    oldItemContainer.splice(i, 1);

    switch (this.dropActionTodo.action) {

      case 'before':
      case 'after':
        // Verifier si le dragged item est un element de comp et si on le drop dans un autre element de comp -> empêcher le drop
        if (typeof newContainerItem !== 'string') {
          if (Object.prototype.hasOwnProperty.call(draggedItem, 'criteresPerformance') && Object.prototype.hasOwnProperty.call(newContainerItem, 'criteresPerformance')) {
            // Deplacer le draggedItem dans le 'main'
            this.nodes.push(draggedItem);
            break;
          }
        }
        // Si le draggedItem est un critère et parent est main -> empêcher le drop car un critère doit être dans un élément de comp
        if (!(Object.prototype.hasOwnProperty.call(draggedItem, 'criteresPerformance')) && newContainerItem.toString() == 'main') {
          // Replacer l'item dans son parent et index original
          this.nodeLookup[oldParentItemId].criteresPerformance.splice(0, 0, draggedItem);
          // Dérouler le parent pour afficher le déplacement échoué du drag and drop
          this.nodeLookup[oldParentItemId].isExpanded = true
          break;
        }
        // Le drop est correct, juste verifier s'il s'agit d'un critere ou element comp
        else {
          // draggedItem == critere performance
          if (!(Object.prototype.hasOwnProperty.call(draggedItem, 'criteresPerformance'))) {
            // Utiliser le targetId pour recuperer le nouvel emplacement
            const targetIndex = this.getIndexOfCriterePerformance(+this.dropActionTodo.targetId, newContainerItem)
            if (this.dropActionTodo.action == 'before') {
              newContainerItem.criteresPerformance.splice(targetIndex, 0, draggedItem);
            } else {
              newContainerItem.criteresPerformance.splice(targetIndex + 1, 0, draggedItem);
            }
          }
          // draggedItem == Element competence -> placer au bon index dans le main
          else {
            // Index de l'item targetid qui est dans le fond la position a drop le draggedItem
            const indexToInsert = this.getIndexOfElementCompetence(+this.dropActionTodo.targetId);
            // Gestion differente pour after ou before
            if (this.dropActionTodo.action == 'before') {
              // Déplacer l'élément de comp
              newContainer.splice(indexToInsert, 0, draggedItem)
            } else {
              // Déplacer l'élément de comp
              newContainer.splice(indexToInsert + 1, 0, draggedItem)
            }
          }
        }
        break;

      case 'inside':
        // Condition qui vérifie si le drag and drop se fait dans un enfant (critère) -> empecher le drop
        if (targetListId != 'main' && firstParentId != 'main' || targetListId != firstParentId) {
          // Vérifier si le draggedItem est un critère
          if (!(Object.prototype.hasOwnProperty.call(draggedItem, 'criteresPerformance'))) {
            // Replacer l'item dans son parent et index
            this.nodeLookup[oldParentItemId].criteresPerformance.splice(0, 0, draggedItem);
            // Dérouler le parent pour afficher le déplacement échoué du drag and drop
            this.nodeLookup[oldParentItemId].isExpanded = true;
            break;
          }
          if (Object.prototype.hasOwnProperty.call(draggedItem, 'criteresPerformance')) {
            // Push l'élément de compétence dans le main vue qu'il ne peut pas être dans un critère de performance
            this.nodes.push(draggedItem);
            break;
          }
        }
        // Verification du drop d'un element comp dans un element comp -> empecher le drop
        if (Object.prototype.hasOwnProperty.call(draggedItem, 'criteresPerformance') && newContainerItem.toString() == 'main') {
          // Push l'élément de compétence dans le main vue qu'il ne peut pas être dans un critère de performance
          this.nodes.push(draggedItem);
          break;
        }
        // Le drop se fait dans un element de competence -> autoriser le drop
        else {
          this.nodeLookup[this.dropActionTodo.targetId].criteresPerformance.push(draggedItem)
          this.nodeLookup[this.dropActionTodo.targetId].isExpanded = true;
          break;
        }
    }
    // Renvoyer les elements de competence (nv ordre des enfants) en output
    if (this.elementCompetences) {
      this.emettre(this.elementCompetences)
    }
    this.clearDragInfo(true)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getParentNodeId(id: string, nodesToSearch: any[], parentId: string): string | null {
    for (const node of nodesToSearch) {
      if (node.id == id) return parentId;
      if (Array.isArray(node.criteresPerformance)) {
        const ret = this.getParentNodeId(id, node.criteresPerformance, node.id);
        if (ret) return ret;
      }
    }
    return null;
  }

  showDragInfo() {
    this.clearDragInfo();
    if (this.dropActionTodo) {
      const element = this.document.getElementById('node-' + this.dropActionTodo.targetId);
      if (element) {
        element.classList.add('drop-' + this.dropActionTodo.action);
      }
    }
  }

  clearDragInfo(dropped = false) {
    if (dropped) {
      this.dropActionTodo = null;
    }
    this.document
      .querySelectorAll('.drop-before')
      .forEach(element => element.classList.remove('drop-before'));
    this.document
      .querySelectorAll('.drop-after')
      .forEach(element => element.classList.remove('drop-after'));
    this.document
      .querySelectorAll('.drop-inside')
      .forEach(element => element.classList.remove('drop-inside'));
  }

  // Empecher l'element de comp de se derouler apres le click sur un de ses boutons (supprimer / modifier)
  stopPropagation(event: Event) {
    event.stopPropagation()
  }

  // Methode pour supprimer une competence et ses elements de competences ainsi que ses criteres de performance
  deleteElementComp(id: number): void {
    // Retirer de la BD
    this.observable$ = this.elementCompetencesService.deleteElementComptetence(id).subscribe({
      next: () =>{
        this.elementCompetencesService.getElementsComptetence()
        // Le retirer du drag and drop //
        // Récupérer l'index de l'item à supprimer de la liste
        const indexToRemove = this.getIndexOfElementCompetence(id);
        // Retirer l'element de comp de la liste de la competence concernee
        this.nodes.splice(indexToRemove, 1)
        // "Refresh" les items du drag and drop
        this.nodeLookup = {};
        this.prepareDragDrop(this.nodes);
      },
      error: () => {
        this.afficherErreur("Un problème est survenu lors de la suppression de l'élément de compétence.");
      }
    })
  }

  // Methode pour supprimer une competence et ses elements de competences ainsi que ses criteres de performance
  deleteCriterePerfo(id: number): void {
    // Retirer le critere de la BD
    this.observable$ = this.criterePerformanceService.deleteCriterePerformance(id).subscribe({
      next: () => {
        this.criterePerformanceService.getCriteresPerformance()
        // Le retirer du drag and drop //
        // Trouver le critere dans le bon element de comp et le retirer
        for (const elementComp of this.nodes as ElementCompetence[]){
          if(elementComp.criteresPerformance !== null){
            for (const criterePerfo of elementComp.criteresPerformance as CriterePerformance[]){
              if(criterePerfo.id == id){
                // Recuperer l'index de l'item a supprimer de la liste
                const indexToRemove = elementComp.criteresPerformance.findIndex(item => item.id === id);
                // Retirer le critere de perfo de la liste de la competence
                elementComp.criteresPerformance.splice(indexToRemove, 1)
                // "Refresh" les items du drag and drop
                this.nodeLookup = {};
                this.prepareDragDrop(this.nodes);
              }
            }
          }
        }
      },
      error: () => {
        this.afficherErreur('Un problème est survenu lors de la suppression du critère de performance.');
      }
    })
  }

  /**
   * Méthode appelant le modal pour confirmer la suppression d'un élément de compétence
   * @param elementComp La competence qui sera supprimee
   */
  async confirmSuppressionElementComp(elementComp: ElementCompetence) {
    const modal = await this.modalController.create({ // Création du modal de suppression
      component: ModalConfirmerSuppressionComponent,
      componentProps: {'message': `Souhaitez-vous vraiment supprimer l'élément de compétence '${elementComp.numero} ${elementComp?.texte}'?`}
    });
    await modal.present(); // Attendre que le modal soit présent
    const {role} = await modal.onWillDismiss(); // Attendre que le modal soit fermé
    if (role === 'confirm') {
      this.deleteElementComp(elementComp.id); // Supprimer la compétence une fois confirmé via le modal
    }
  }

  /**
   * Méthode appelant le modal pour confirmer la suppression d'un critère de performance
   * @param criterePerfo Le critère qui sera supprimé
   */
  async confirmSuppressionCriterePerfo(criterePerfo: CriterePerformance) {
    const modal = await this.modalController.create({ // Création du modal de suppression
      component: ModalConfirmerSuppressionComponent,
      //componentProps: {'message': `Souhaitez-vous vraiment supprimer le critère de performance '${criterePerfo.numero} ${criterePerfo?.texte}'?`}
      componentProps: {
        'message': `Souhaitez-vous vraiment supprimer le critère de performance '${criterePerfo.numero ? `${criterePerfo.numero} ` : ''}${criterePerfo?.texte}'?`
      }

    });
    await modal.present(); // Attendre que le modal soit présent
    const {role} = await modal.onWillDismiss(); // Attendre que le modal soit fermé
    if (role === 'confirm') {
      this.deleteCriterePerfo(criterePerfo.id); // Supprimer la compétence une fois confirmé via le modal
    }
  }

  /**
   * Methode pour ouvrir le modal de modification d'element de competence
   * @param elementCompetence Peut recevoir un element de competence a modifier
   */
  async openModalFormulaireElementCompetence(elementCompetence?:  ElementCompetence){
    const titreModal = 'élément de compétence'
    const modal = await this.modalController.create({
      component: ModalFormulaireCompetenceComponent,
      componentProps: {
        elementCompetence,
        titreModal,
      },
    });

    // Ouvrir le modal
    await modal.present();

    // Recuper le role et le data envoyer
    const {role, data} = await modal.onWillDismiss();

    if(role == 'confirm'){
      if(data != null){
        // Modifier l'élément de comp dans la liste de la competence (drag and drop)
        for(const elementComp  of this.nodes){
          if(elementComp.id == data.id){
            elementComp.numero = data.numero;
            elementComp.texte = data.texte;
          }
        }
        this.prepareDragDrop(this.nodes);
      }
    }
  }

  /**
   * Methode pour ouvrir le modal de modification d'un critere de performance
   * @param criterePerformance Peut recevoir un critere a modifier
   */
  async openModalFormulaireCriterePerformance(criterePerformance?:  CriterePerformance){
    const titreModal = 'critère de performance'
    const modal = await this.modalController.create({
      component: ModalFormulaireCompetenceComponent,
      componentProps: {
        criterePerformance,
        titreModal,
      },
    });

    // Ouvre le modal
    await modal.present();

    // Recuper le role et le data envoyer
    const {role, data} = await modal.onWillDismiss();

    if(role == 'confirm'){
      if(data != null){
        // Modifier le critere dans la liste de la comp (drag and drop)
        for(const elementComp  of this.nodes){
          if(elementComp.criteresPerformance.length > 0){
            for(const criterePerfo of elementComp.criteresPerformance){
              if(criterePerfo.id == data.id){
                criterePerfo.numero = data.numero;
                criterePerfo.texte = data.texte;
              }
            }
          }
        }
        this.prepareDragDrop(this.nodes);
      }
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
