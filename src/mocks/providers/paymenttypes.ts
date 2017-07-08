import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { PaymentType } from '../../models/paymenttype';

@Injectable()
export class PaymentTypes {
  paymentTypes: PaymentType[] = [];

  defaultPaymentType: any = {
        "projectId": "17-000",
        "projectName": "Project 1"
      };


  constructor(public http: Http) {
    let paymentTypes = [
      {
        "paymentTypeId": "amex088",
        "paymentTypeName": "Amex 888"
      },
        {
        "paymentTypeId": "amex099",
        "paymentTypeName": "Amex 999"
      },{
        "paymentTypeId": "mc1234",
        "paymentTypeName": "MasterCard 1234"
      }
    ];

    for (let paymentType of paymentTypes) {
      this.paymentTypes.push(new PaymentType(paymentType));
    }
  }

  query(params?: any) {
    if (!params) {
        console.log('return paymentTypes...');
      return this.paymentTypes;
    
    }

    return this.paymentTypes.filter((paymentType) => {
      for (let key in params) {
        let field = paymentType[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return paymentType;
        } else if (field == params[key]) {
          return paymentType;
        }
      }
      return null;
    });
  }

  add(paymentType: PaymentType) {
    this.paymentTypes.push(paymentType);
  }

  delete(paymentType: PaymentType) {
    this.paymentTypes.splice(this.paymentTypes.indexOf(paymentType), 1);
  }
}
