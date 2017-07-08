import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, PopoverController, ToastController
 } from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

import { ProjectListPage } from '../project-list/project-list';
import { PurchaseViewEditPage } from '../purchase-view-edit/purchase-view-edit';
import { Purchases } from '../../providers/providers';
import { Purchase } from '../../models/purchase';
import { LoginPage } from '../login/login';
import { Tooltips } from '../popups/tooltips';

@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html',
  queries: {
    addReceipt: new ViewChild('addReceipt')
  }
})
export class ListMasterPage {
  plist: Purchase[];
  
  oList: Observable<any>;
  sort = { "date": "fa-unsorted", "vendor": "fa-unsorted" };

  constructor(public popoverCtrl: PopoverController, public viewCtrl: ViewController, public storage: Storage, public navParams: NavParams, public toastCtrl: ToastController,
    public navCtrl: NavController, public purchases: Purchases, public modalCtrl: ModalController) {

    this.oList = this.purchases.query();
    this.oList.subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        console.log(res);
        if (res.status == 'success') {

        } else {
        }
      }, err => {
        let toast = this.toastCtrl.create({
          message: "Unable to connect to network",
          duration: 3000,
          position: 'top'
        });
        toast.present();
    });
//    this.oList.forEach(v => this.plist.push(v)).then();
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {

  }
  showtip() {
    this.storage.get('loadmaster').then((val) => {
      if (val==null || val) {
        let popover = this.popoverCtrl.create(Tooltips, { page: 'list-master', top: 100 }, { showBackdrop: true });
        popover.present();
      }
        this.storage.set('loadmaster', false);
    });
  }

  /**
   * This will sort the main list according to the column that was tapped.
   */
  doSort(col) {
    var order = "";
    var iOrder = 1;
    var current = this.sort[col];
    switch (current) {
      case "fa-unsorted":
      case "fa-sort-desc": order = "fa-sort-asc"; break;
      case "fa-sort-asc": order = "fa-sort-desc"; iOrder = -1;
    }
    this.sort[col] = order;
    if (col == 'date') {
      this.sort['vendor'] = 'fa-unsorted';
    } else {
      this.sort['date'] = 'fa-unsorted';
    }
    this.plist.sort(function(a, b) {
      if (a[col] < b[col]) {
        return -1 * iOrder;
      }
      if (a[col] > b[col]) {
        return 1 * iOrder;
      }

      return 0;
    });
  }
  /**
   * This will load the list of projects page
   */
  addPurchase() {
    this.navCtrl.push(ProjectListPage);
  }

  /**
   * Delete an un-approved purchase from the list of items.
   */
  deleteItem(item) {
    this.purchases.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  viewPurchase(purchase: Purchase) {
    this.navCtrl.push(PurchaseViewEditPage, {
      purchase: purchase
    });
  }

  /**
   * Logout
   */
  logout() {
    this.navCtrl.setRoot(LoginPage);
  }
}
