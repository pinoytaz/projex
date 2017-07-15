/**
 * Add amounts page
 * - lists all cost codes selected
 * - append salestax to all purchases
 */
import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, ViewController, NavParams, LoadingController, PopoverController } from 'ionic-angular';

import { PaymentType } from '../../models/paymenttype';
import { Purchase } from '../../models/purchase';
import { Project } from '../../models/project';
import { CostCode } from '../../models/costcode';

import { PurchaseReviewPage } from '../purchase-review/purchase-review';
import { MainPage } from '../../pages/pages';
import { CalcPopup } from '../popups/calc';

@Component({
  selector: 'page-add-amounts',
  templateUrl: 'add-amounts.html'
})
export class AddAmountsPage {
  project: Project;
  purchase: Purchase;
  isNewCostCode: boolean = false;
  form: FormGroup;
  isReadyToSave: boolean = false;
  paymentType: PaymentType;
  costcodes: Array<CostCode>;
    balance:number;
  origBalance = 0;
  hasBalance:boolean = false;
  
  constructor(public loadingCtrl: LoadingController, public viewCtrl: ViewController, public navCtrl: NavController, formBuilder: FormBuilder, navParams: NavParams,
    public popoverCtrl: PopoverController) {
    this.purchase = navParams.get('purchase');
    this.project = navParams.get('project');
    this.paymentType = navParams.get('paymentType');
    this.costcodes = navParams.get('costcodes');

    var controls = {};
    this.costcodes.forEach(costcode => {
      controls["cc_" + costcode["costCodeId"]] = ['', Validators.required];
    });
    controls['balance'] = ['', Validators.required];
    controls['salestax'] = ['', Validators.required];
    this.form = formBuilder.group(controls);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
//      this.isReadyToSave = this.form.valid;
    });
  }

  /* View load event */
  ionViewDidLoad() {
//    this.viewCtrl.setBackButtonText('Cost Codes');
  }

  /* Update the balance whenever amounts are inputted to the cost codes*/
  updateBalance() {

    var subtotal = 0;
    var self=this;
    this.costcodes.forEach(cc => {
      subtotal += parseFloat((self.form.controls['cc_' + cc['costCodeId']].value == "" ? 0 : self.form.controls['cc_' + cc['costCodeId']].value));
    });
    subtotal += parseFloat((self.form.controls['salestax'].value == "" ? 0 : self.form.controls['salestax'].value));
  if(this.hasBalance){
    this.balance = this.origBalance - subtotal;
    this.isReadyToSave=(this.balance==0);
}else{
  this.origBalance = subtotal;
  this.isReadyToSave = true;
}
  }

  home() {
    this.navCtrl.setRoot(MainPage);
  }
  resetAmounts() {
    this.origBalance = this.balance;
    this.costcodes.forEach(cc => {
      this.form.controls['cc_' + cc['costCodeId']].setValue(0);
    });
  }

  /* Executed when the submit is tapped */
  review() {
    var costs = [];
    this.costcodes.forEach(cc => {
      costs.push({
        costCodeId: cc['costCodeId'],
        costCodeName: cc['costCodeName'],
        amount: this.form.controls['cc_' + cc['costCodeId']].value
      });
    });
    this.purchase['amount'] = this.origBalance;

    if (this.balance == 0 || !this.hasBalance) {
      this.navCtrl.push(PurchaseReviewPage, { stax: this.form.controls['salestax'].value, costs: costs, purchase: this.purchase, project: this.project, paymentType: this.paymentType, viewOnly:false });
    } else {
      alert('Amounts does not match. Please check.');
    }
  }
  
  /* Reads the receipt and tries to extract the total amount */
  analyze() {
    let loader = this.loadingCtrl.create({
      content: 'I\'m trying to read your receipt. Please wait...'
    });
    loader.present();
    /* Use OCRAD function to read the image loaded at the hidden img tag */
    (<any>window).OCRAD(document.getElementById('image'), text => {
      loader.dismissAll();
  console.log(text);
      var posTotal = text.toLowerCase().indexOf('total');
      if(posTotal > -1){
        this.hasBalance = true;
        this.balance = parseFloat(text.substr(posTotal));
}else{
  this.hasBalance = false;
}
    });
  }

  
  showCalc(event) {
      let popover = this.popoverCtrl.create(CalcPopup,{target:this.form.controls[event.target.attributes['ng-reflect-name'].value]},{enableBackdropDismiss:false});
      popover.present();
    popover.onDidDismiss(ev=>{this.updateBalance();})
  }

}
