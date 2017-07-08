import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Purchase } from '../../models/purchase';

@Injectable()
export class Purchases {
  purchases: Purchase[] = [];

  defaultPurchase: any = {
    "vendor": "Home Depot",
        "receiptImage": "assets/img/speakers/bear.jpg",
        "date": "Burt is a Bear.",
          "amount": 125.8
  };


  constructor(public http: Http) {
    let purchases = [
      {
        "vendor": "X Home Depot",
        "receiptImage": "assets/img/speakers/bear.jpg",
        "date": "2017/06/19",
          "amount": 125.8
      },
        {
        "vendor": "Z Home Depot",
        "receiptImage": "assets/img/speakers/bear.jpg",
        "date": "2017/06/20",
          "amount": 125.8
      },{
        "vendor": "A Home Depot",
        "receiptImage": "assets/img/speakers/bear.jpg",
        "date": "2017/06/21",
          "amount": 125.8
      }
    ];

    for (let purchase of purchases) {
      this.purchases.push(new Purchase(purchase));
    }
  }

  query(params?: any) {
    if (!params) {
      return this.purchases;
    }

    return this.purchases.filter((purchase) => {
      for (let key in params) {
        let field = purchase[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return purchase;
        } else if (field == params[key]) {
          return purchase;
        }
      }
      return null;
    });
  }

  add(purchase: Purchase) {
    this.purchases.push(purchase);
  }

  delete(purchase: Purchase) {
    this.purchases.splice(this.purchases.indexOf(purchase), 1);
  }
}
