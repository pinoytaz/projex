import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { User } from './user';
import { Api } from './api';

import { Purchase } from '../models/purchase';

@Injectable()
export class Purchases {
  userEmail: string;

  constructor(public http: Http, public api: Api, user: User) {
    this.userEmail = user._user;
  }

  query(cmd?: any) {
    let params = {
      email: this.userEmail,
      cmd: 'list'
    };
    return this.api.get('/purchases', params)
      .map(resp => resp.json());
  }

  getPurchaseImage(id?: any) {
    let params = 'data=' + id;
    return this.api.post('getpurchaseimage/', params)
      .map(resp => resp.json());
  }

  submit(purchase: any) {
    let seq = this.api.post('submitpurchase/', purchase);

    seq
      .map(res => res.json())
      .subscribe(res => {
        if (res.status == 'success') {

        } else {
        }
      }, err => {
        console.error('ERROR[submit]', err);
      });

    return seq;
  }

  delete(purchase: Purchase) {
  }

}
