import { Component } from '@angular/core';
import { NavController, ToastController, AlertController  } from 'ionic-angular';

import { MainPage } from '../../pages/pages';
import { User } from '../../providers/user';

@Component({
  selector: 'page-resetpw',
  templateUrl: 'resetpw.html'
})

export class ResetpwPage {
  email='';

  constructor(public alertCtrl: AlertController, public navCtrl: NavController,
      public user: User,
    public toastCtrl: ToastController) {
  }

  // Attempt to request password reset through our User service
  send() {
    this.user.reset(this.email).subscribe((resp) => {
         let alert = this.alertCtrl.create({
      title: 'Password Reset',
      subTitle: 'A link has been sent to your email address which will enable you to complete this process.',
      buttons: ['OK']
    });
    alert.present();
      this.navCtrl.push(MainPage);
    }, (err) => {
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: "Error in sending password reset request.",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}

