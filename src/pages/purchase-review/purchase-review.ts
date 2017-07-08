import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';

import { User } from '../../providers/user';
import { PaymentType } from '../../models/paymenttype';
import { Purchase } from '../../models/purchase';
import { Project } from '../../models/project';

import { ProjectListPage } from '../project-list/project-list';
import { MainPage } from '../../pages/pages';

@Component({
  selector: 'page-purchase-review',
  templateUrl: 'purchase-review.html'
})
export class PurchaseReviewPage {
  project: Project;
  purchase: Purchase;
  paymentType: PaymentType;
  costs: any;
  salestax = 0;
  userEmail: string;
  url: string = 'http://willcate.com/projex/submitpurchase/';
  fileTransfer: TransferObject = this.transfer.create();

  constructor(public loadingCtrl: LoadingController, public user: User, private transfer: Transfer, private file: File,
    public viewCtrl: ViewController, public navCtrl: NavController, navParams: NavParams) {

    this.purchase = navParams.get('purchase');
    this.project = navParams.get('project');
    this.paymentType = navParams.get('paymentType');
    this.costs = navParams.get('costs');
    this.salestax = navParams.get('stax');
    this.userEmail = user._user;

  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('Add Amounts');
  }

  /**
   * Submit the purchase details 
   */

  submit() {
    let loader = this.loadingCtrl.create({
      content: 'Submitting purchase. Please wait...'
    });
    loader.present();
    this.purchase['project'] = this.project;
    this.purchase['paymentType'] = this.paymentType;
    this.purchase['costs'] = this.costs;
    this.purchase['salestax'] = this.salestax;
    var purch_data: string = JSON.stringify(this.purchase);
      
    var cdate: Date = new Date();
    var fdate = cdate.getFullYear() + '-' + cdate.getMonth() + '-' + cdate.getDate() + ' ' + cdate.getHours() + ':' + cdate.getMinutes() + ':' + cdate.getSeconds();
    let params = {
      email: this.userEmail,
      stamp: fdate,
      purch_data: purch_data
    };

    let options: FileUploadOptions = {
      fileKey: "jpeg_file",
      fileName: this.purchase.imageData.substr(this.purchase.imageData.lastIndexOf('/') + 1),
      mimeType: "image/jpeg",
      params: params
    }

    this.fileTransfer.upload(this.purchase.imageData, encodeURI(this.url), options)
      .then((data) => {

        var resp = JSON.parse(data.response);
        if (resp.status.toLowerCase() == 'success') {
          alert(resp.body);
          this.navCtrl.setRoot(MainPage);
        } else {
          alert(resp.body);
        }
        loader.dismissAll();
      }, (err) => {
        alert("error" + JSON.stringify(err));
        loader.dismissAll();
      });
  }

  /**
   * Go back to the image capture on the project list page 
   */

  retake() {
    this.navCtrl.setRoot(ProjectListPage);
  }
  home() {
    this.navCtrl.setRoot(MainPage);
  }
  analyze() {
    let loader = this.loadingCtrl.create({
      content: 'I\'m trying to read your receipt. Please wait...'
    });
    loader.present();
    (<any>window).OCRAD(document.getElementById('image'), text => {
      loader.dismissAll();
      console.log(text);
      alert(text);
    });
  }
}
