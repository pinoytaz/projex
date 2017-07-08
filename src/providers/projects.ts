import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { User } from './user';
import { Api } from './api';

import { Project } from '../models/project';

@Injectable()
export class Projects {
  userEmail:string;
  
constructor(public http: Http, public api: Api, user: User) {
    this.userEmail = user._user;
  }

  query(cmd?: any) {
    let params = {
      email: this.userEmail,
      cmd: 'list'
    };
    return this.api.get('/projects', params)
      .map(resp => resp.json());
  }

  add(project: Project) {
  }

  delete(project: Project) {
  }
}
