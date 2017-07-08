import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { User } from './user';
import { Api } from './api';

import { CostCode } from '../models/costcode';

@Injectable()
export class CostCodes {
userEmail:string;
  
  constructor(public http: Http, public api: Api, user: User) {
    this.userEmail = user._user;
  }
  
  

  query(cmd?: any) {
    let params = {
      email: this.userEmail,
      cmd: 'list'
    };
    return this.api.get('/costcodes', params)
      .map(resp => resp.json());
  }

  add(costCode: CostCode) {
  }

  delete(costCode: CostCode) {
  }

}
