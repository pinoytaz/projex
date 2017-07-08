import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MainPage } from '../../pages/pages';

import { User } from '../../providers/user';
import { SignupPage } from '../signup/signup';
import { ResetpwPage } from '../resetpw/resetpw';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: '',
    password: ''
  };
  remember: any;
  constructor(public navCtrl: NavController,
    public user: User, public storage: Storage,
    public toastCtrl: ToastController) {
    this.remember = false;
    storage.get('email').then((val) => {
      this.account.email = val;
      this.remember = true;
    });
    storage.get('pwd').then((val) => {
      this.account.password = val;
    });
  }

  // Attempt to login in through our User service
  doLogin() {

    this.user.login(this.account).subscribe((resp) => {
      if (this.user.status == 'success') {
        if (this.remember) {
          this.storage.set('email', this.account.email);
          this.storage.set('pwd', this.account.password);
        } else {
          this.storage.remove('username');
          this.storage.remove('pwd');
        }
        this.navCtrl.setRoot(MainPage);
      } else {
        let toast = this.toastCtrl.create({
          message: this.user.errorMessage,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    }, (err) => {
      //      this.navCtrl.setRoot(MainPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: 'Unable to login.\n' + err.statusText,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
  signup() {
    this.navCtrl.setRoot(SignupPage);
  }
  resetpw() {
    this.navCtrl.setRoot(ResetpwPage);
  }
}
