import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import { CostCodes } from '../../providers/providers';
import { PaymentType } from '../../models/paymenttype';
import { Purchase } from '../../models/purchase';
import { Project } from '../../models/project';
import { CostCode } from '../../models/costcode';
import { AddAmountsPage } from '../add-amounts/add-amounts';
import { MainPage } from '../../pages/pages';

@Component({
  selector: 'page-cost-code-list',
  templateUrl: 'cost-code-list.html'
})
export class CostCodeListPage {
  plist: any[];
  oList: Observable<any>;
  project: Project;
  purchase: Purchase;
  isNewCostCode: boolean = false;
  form: FormGroup;
  isReadyToSave: boolean = false;
  paymentType: PaymentType;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public costCodes: CostCodes, public toastCtrl: ToastController,
    formBuilder: FormBuilder, navParams: NavParams) {

    
    this.plist=[];
    
    this.oList = this.costCodes.query();
    
    this.oList.subscribe(res => {
        // If the API returned a successful response, capture all payment types

        if (res.status.toLowerCase() == 'success') {
          if(res['body'].length>0){
            for(let _p in res['body']){
              this.plist.push( new CostCode(res['body'][_p]));
            }
            this.plist.forEach(cc => {
              cc['checked'] = false;
            });
            this.isNewCostCode = this.plist.length<1;
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

    this.purchase = navParams.get('purchase');
    this.project = navParams.get('project');
    this.paymentType = navParams.get('paymentType');

    this.form = formBuilder.group({
      name: ['', Validators.required]
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
//    this.viewCtrl.setBackButtonText('Payment Types');
  }

ionViewWillEnter(){
//this.plist =[];
    this.isNewCostCode = this.plist.length<1;
}
  home() {
    this.navCtrl.setRoot(MainPage);
  }

  validate() {
    var selected: Array<CostCode> = this.plist.filter(cc => {
      return cc['checked'];
    });
    this.isReadyToSave = (selected.length > 0);
  }
    
  /**
   * Select payment type
   */
  select(costCodes: Array<CostCode>) {
    var selected = costCodes.filter(cc => {
      return cc['checked'];
    });
  }
  /**
   * Save new cost code and submit.
   */
  newCostCode() {
    var nc: CostCode = new CostCode({
      "costCodeId": 99999,
      "costCodeName": this.form.controls['name'].value
    });
      this.complete([nc]);
  }
    
  /**
   * Done clicked. Proceed to enter amounts.
   */
  done() {
    var selected = this.plist.filter(cc => {
      return cc['checked'];
    });
    this.complete(selected);
  }
complete(costcodes){
    this.navCtrl.push(AddAmountsPage, { costcodes: costcodes, project: this.project, paymentType: this.paymentType, purchase: this.purchase });
}
}
