import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, PopoverController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

import { PaymentTypes } from '../../providers/providers';
import { PaymentType } from '../../models/paymenttype';
import { Purchase } from '../../models/purchase';
import { Project } from '../../models/project';
import { CostCodeListPage } from '../cost-code-list/cost-code-list';
import { Tooltips } from '../popups/tooltips';

import { MainPage } from '../../pages/pages';

@Component({
  selector: 'page-payment-type-list',
  templateUrl: 'payment-type-list.html'
})
export class PaymentTypeListPage {
  plist: PaymentType[];
  oList: Observable<any>;
  noProjectPlist: PaymentType[];
  project: Project;
  purchase: Purchase;
  isNewPaymentType: boolean = false;
  form: FormGroup;
  isReadyToSave: boolean = false;
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public storage: Storage, public popoverCtrl: PopoverController, public toastCtrl: ToastController,
    public paymentTypes: PaymentTypes, formBuilder: FormBuilder, navParams: NavParams) {
    
this.plist=[];
    this.noProjectPlist = [];
    this.oList = this.paymentTypes.query();
    
    this.oList.subscribe(res => {
        // If the API returned a successful response, capture all payment types

        if (res.status.toLowerCase() == 'success') {
          if(res['body'].length>0){
            for(let _p in res['body']){
              this.plist.push( new PaymentType(res['body'][_p]));
            }
          }
        } else {
        }
      }, err => {
        let toast = this.toastCtrl.create({
          message: "Unable to connect to network",
          duration: 3000,
          position: 'top'
        });
        toast.present();
    }, ()=> console.log('dne'));
//    this.plist = this.paymentTypes.query();
    this.purchase = navParams.get('purchase');
    this.project = navParams.get('project');

    this.noProjectPlist.push(new PaymentType({
      "paymentTypeId": 99998,
      "paymentTypeName": "Reimbursement"
    }));
    this.noProjectPlist.push(new PaymentType({
      "paymentTypeId": 0,
      "paymentTypeName": "Payment type not found"
    }));

    this.form = formBuilder.group({
      name: ['', Validators.required]
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
    this.showtip();
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
//    this.viewCtrl.setBackButtonText('Projects');
  }

  showtip() {
    this.storage.get('loadpaymenttypes').then((val) => {
      if (val == null || val) {
        let popover = this.popoverCtrl.create(Tooltips, { page: 'payment-type-list', top: 100 }, { showBackdrop: true });
        popover.present();
      }
      this.storage.set('loadpaymenttypes', false);
    });
  }

  home() {
    this.navCtrl.setRoot(MainPage);
  }

  /**
   * Select payment type
   */
  select(paymentType) {
    if (paymentType.paymentTypeId == 0) {
      this.isNewPaymentType = true;
    } else {
      this.navCtrl.push(CostCodeListPage, { project: this.project, paymentType: paymentType, purchase: this.purchase });
    }
    console.log(paymentType);
  }
  newPaymentType() {
    var np: PaymentType = new PaymentType({
      "paymentTypeId": 99999,
      "paymentTypeName": this.form.controls['name'].value
    });
    this.select(np);
  }

}
