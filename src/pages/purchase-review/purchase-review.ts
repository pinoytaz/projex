import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, Platform } from 'ionic-angular';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';

import { User } from '../../providers/user';
import { Purchases } from '../../providers/providers';
import { PaymentType } from '../../models/paymenttype';
import { Purchase } from '../../models/purchase';
import { Project } from '../../models/project';
import { ProjectListPage } from '../project-list/project-list';

import { Camera } from '@ionic-native/camera';
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
  url: string = 'http://www.projectprohub.com/projex/services/submitpurchase/';
  fileTransfer: TransferObject = this.transfer.create();
  viewOnly: boolean = false;

  constructor(public loadingCtrl: LoadingController, public user: User, private transfer: Transfer, private file: File, public plt: Platform, private camera: Camera,
    public viewCtrl: ViewController, public navCtrl: NavController, navParams: NavParams, purchases: Purchases) {


    this.purchase = navParams.get('purchase');
    this.project = navParams.get('project');
    this.paymentType = navParams.get('paymentType');
    this.costs = navParams.get('costs');
    this.salestax = navParams.get('stax');
    this.userEmail = user._user;
    this.viewOnly = navParams.get('viewOnly');
    if (this.purchase['purchase_id'] != "") {
      purchases.getPurchaseImage(this.purchase['purchase_id']).subscribe(res => {
        // If the API returned a successful response, mark the user as logged in

        if (res.status.toLowerCase() == 'success') {
          //this.purchase['imageData'] = 'data:image/jpeg;base64,' + res['img'];
        }
      }, err => {
        console.log('getPurchaseImage');
      }, () => console.log('getPurchaseImage dne'));
    }
  }

  ionViewDidLoad() {
    //    this.viewCtrl.setBackButtonText('Add Amounts');
  }

  /**
   * Go back to amounts page and allow editing of amounts
   */
  edit() {
    this.navCtrl.push(ProjectListPage, { fromEdit: true });
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
    this.getPicture();
  }
  home() {
    this.navCtrl.setRoot(MainPage);
  }
  analyze() {
    // let loader = this.loadingCtrl.create({
    //   content: 'I\'m trying to read your receipt. Please wait...'
    // });
    // loader.present();
    // (<any>window).OCRAD(document.getElementById('image'), text => {
    //   loader.dismissAll();
    //   console.log(text);
    //   alert(text);
    // });
  }

  getPicture() {
    if (Camera['installed']()) {
      var dest: any;
      if (this.plt.is('android')) {
        dest = this.camera.DestinationType.FILE_URI
      } else if (this.plt.is('ios')) {
        dest = this.camera.DestinationType.NATIVE_URI
      } else {
        dest = this.camera.DestinationType.DATA_URL
      }
      this.camera.getPicture({
        destinationType: dest,
        quality: 40,
        targetWidth: 1024,
        targetHeight: 1024,
        cameraDirection: 0, //back camera
        allowEdit: true,
        saveToPhotoAlbum: false,
        correctOrientation: true
      }).then((imageData) => {
        //this.purchase.imageData = 'data:image/jpg;base64,' + imageData;
        this.purchase.imageData = imageData;
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      alert('Camera access is needed.');
    }
  }
}
