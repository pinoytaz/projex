import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { MainPage } from '../../pages/pages';
import { User } from '../../providers/user';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  confirmPassword: string;
  account: {
    firstname: string,
    lastname: string,
    isAccountant: boolean,
    accountantEmail: string,
    email: string, password: string
  } = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    isAccountant: false,
    accountantEmail: ''
  };

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController) {

  }
  isConfirmed(): boolean {
    return this.account.password == this.confirmPassword;
  }
  
changeCase(event){
  this.account[event.target.name] = this.account[event.target.name].charAt(0).toUpperCase() + this.account[event.target.name].toLowerCase().slice(1);
}
  doSignup() {
    // Attempt to signup in through our User service
    var payload: string = "";
    payload = "data=" + this.account.email + "," + this.account.password + "," + this.account.firstname + "," + this.account.lastname + "," + (this.account.accountantEmail==""?'none':this.account.accountantEmail) +"," + (this.account.isAccountant?'accountant':'field-emp');
    this.user.signup(payload).subscribe((resp) => {
      this.navCtrl.push(MainPage);
    }, (err) => {
      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: "Unable to complete the signup." + err.statusText,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}
