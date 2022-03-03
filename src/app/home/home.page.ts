import { Component } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks: any[] = [];
  constructor(private utilService: UtilService, private alertCtrl: AlertController, private actionSheetCtrl: ActionSheetController) {
    let taskJson = localStorage.getItem('taskDb');

    if (taskJson != null) {
      this.tasks = JSON.parse(taskJson);

    }
  }


  async showAdd() {
    const alert = await this.alertCtrl.create({
      header: 'Nova tarefa',
      inputs: [
        {
          name: 'newTask',
          type: 'text',
          placeholder: 'O que deseja fazer?'
        }

      ],

      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Adicionar',
          handler: (form) => {
            console.log(form.newTask);
            this.add(form.newTask);
        
          }
        }
      ]

    });

    await alert.present();

  }

  async add(newTask: string) {
    if (newTask.trim().length < 1) {

      this.utilService.showToast('Informe o que deseja fazer!');

      return;

    }

    let task = { name: newTask, done: false, fav: false};

    this.tasks.push(task);

    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage.setItem('taskDb', JSON.stringify(this.tasks));

  }

  async openActions(task: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'O que deseja fazer?',
      cssClass: 'secondary',
      buttons: [{
        text: task.done ? 'Desfazer' : 'Feito',
        icon: task.done ? 'ellipse-outline' : 'checkmark-circle-outline',
        handler: () => {
          task.done = !task.done;

          this.updateLocalStorage();
        }
      },
         {
        text: task.fav ? 'Pode aguardar' : 'Prioridade',
        icon: task.fav ? 'star-outline' : 'star',
        handler: () => {
          task.fav = !task.fav;

          this.updateLocalStorage();
        }
      },  {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

  }

  async delete(task: any) {

    const alert = await this.alertCtrl.create({
      cssClass: 'animate_bounceInUp',
      header: 'Atenção!',
      message: 'Tem certeza que deseja excluir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

            }
          }, {
          text: 'Ok',
          id: 'confirm-button',
          handler: () => {

            this.tasks = this.tasks.filter(taskArray => task != taskArray);

            this.updateLocalStorage();

          }
        }
      ]
    });

    await alert.present();


  }
}




