import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { CostCode } from '../../models/costcode';

@Injectable()
export class CostCodes {
  costCodes: CostCode[] = [];

  defaultCostCode: any = {
        "costCodeId": "17-000",
        "costCodeName": "Project 1"
      };


  constructor(public http: Http) {
    let costCodes = [
      {
        "costCodeId": "07050",
        "costCodeName": "Basic Thermal & Moisture Pro..."
      },
        {
        "costCodeId": "07200",
        "costCodeName": "Thermal Protection"
      },{
        "costCodeId": "07300",
        "costCodeName": "Shingles, Roof Tiles & Coverings"
      }
    ];

    for (let costCode of costCodes) {
      this.costCodes.push(new CostCode(costCode));
    }
  }

  query(params?: any) {
    if (!params) {
        console.log('return costCodes...');
      return this.costCodes;
    
    }

    return this.costCodes.filter((costCode) => {
      for (let key in params) {
        let field = costCode[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return costCode;
        } else if (field == params[key]) {
          return costCode;
        }
      }
      return null;
    });
  }

  add(costCode: CostCode) {
    this.costCodes.push(costCode);
  }

  delete(costCode: CostCode) {
    this.costCodes.splice(this.costCodes.indexOf(costCode), 1);
  }
}
