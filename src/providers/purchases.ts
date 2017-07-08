import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Api } from './api';

import { Purchase } from '../models/purchase';

@Injectable()
export class Purchases {

  constructor(public http: Http, public api: Api) {
  }

  query(params?: any) {
    return this.api.get('/purchases', params)
      .map(resp => resp.json());
  }

  submit(purchase: any) {
    let seq = this.api.post('submitpurchase/', purchase);

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        console.log(res);
        if (res.status == 'success') {

        } else {
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

  delete(purchase: Purchase) {
  }

}
