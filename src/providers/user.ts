import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Storage } from '@ionic/storage';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;
errorMessage:string='';
status:string='';
  constructor(public http: Http, public api: Api, public storage: Storage) {
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
      this.errorMessage="";
      var payload: string = "";
    payload = "data=" + accountInfo.email + "," + accountInfo.password;

    let seq = this.api.post('verify/', payload);

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
          this.status=res.status.toLowerCase();
        if (this.status == 'success') {
        
          this._loggedIn(accountInfo.email);
            
        } else {
          this.errorMessage='Username/Password is incorrect.';
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('adduser/', accountInfo);

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        if (res.status == 'success') {
          
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

    /**
   * Send a POST request to our resetpw endpoint with the email address
   * the user entered on the form.
   */
  reset(accountInfo: any) {
    let seq = this.api.post('resetpssword/', accountInfo);

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response
        if (res.status == 'success') {
        } else {
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }
  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
      this.storage.set('firsttime', false);
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(email) {
    this._user = email;
  }
}
