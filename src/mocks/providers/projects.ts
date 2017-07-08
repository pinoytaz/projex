import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Project } from '../../models/project';

@Injectable()
export class Projects {
  projects: Project[] = [];

  defaultProject: any = {
        "projectId": "17-000",
        "projectName": "Project 1"
      };


  constructor(public http: Http) {
    let projects = [
      {
        "projectId": "12-000",
        "projectName": "Project 1"
      },
        {
        "projectId": "17-000",
        "projectName": "B Project 1"
      },{
       "projectId": "27-000",
        "projectName": " ZProject 1"
      }
    ];

    for (let project of projects) {
      this.projects.push(new Project(project));
    }
  }

  query(params?: any) {
    if (!params) {
        console.log('return projects...');
      return this.projects;
    
    }

    return this.projects.filter((project) => {
      for (let key in params) {
        let field = project[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return project;
        } else if (field == params[key]) {
          return project;
        }
      }
      return null;
    });
  }

  add(project: Project) {
    this.projects.push(project);
  }

  delete(project: Project) {
    this.projects.splice(this.projects.indexOf(project), 1);
  }
}
