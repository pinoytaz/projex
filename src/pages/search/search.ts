import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { Purchase } from '../../models/purchase';

import { Purchases } from '../../providers/providers';


@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  
  pendingPurchases: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public purchases: Purchases) { }

  /**
   * Perform a service for the proper items.
   */
  getItems(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.pendingPurchases = [];
      return;
    }
    this.pendingPurchases = this.purchases.query({
      name: val
    });
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(purchase: Purchase) {
    
  }

}
