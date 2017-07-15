import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Purchases } from '../../providers/providers';
import { MainPage } from '../../pages/pages';
@Component({
  selector: 'page-purchase-view-edit',
  templateUrl: 'purchase-view-edit.html'
})
export class PurchaseViewEditPage {
  purchase: any;
  
  constructor(public navCtrl: NavController, navParams: NavParams, purchases: Purchases) {
    this.purchase = navParams.get('purchase');
  }
  
home(){
    this.navCtrl.setRoot(MainPage);
}
}
