import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { User } from './user';
import { Api } from './api';

import { PaymentType } from '../models/paymenttype';

@Injectable()
export class PaymentTypes {
userEmail:string;
  
  constructor(public http: Http, public api: Api, user: User) {
    this.userEmail = user._user;
  }

  query(cmd?: any) {
    let params = {
      email: this.userEmail,
      cmd: 'list'
    };
    return this.api.get('/paymenttypes', params)
      .map(resp => resp.json());
  }

  add(paymenttype: PaymentType) {
  }

  delete(paymenttype: PaymentType) {
  }
}
