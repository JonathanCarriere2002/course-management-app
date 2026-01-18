import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
})
export class ModalInfoComponent {

  @Input() public titre!: string;
  @Input() public message!: string[];

  constructor(private modalController: ModalController) { }

  ok(){
    this.modalController.dismiss().then(r => true);
  }
}
