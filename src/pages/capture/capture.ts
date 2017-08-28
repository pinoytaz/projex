import { Component } from '@angular/core';
import { NavController, ViewController, LoadingController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';

import { MainPage } from '../../pages/pages';

@Component({
  selector: 'page-capture',
  templateUrl: 'capture.html'
})
export class CapturePage {
  OCRAD: any;
  imageData: any;
  constructor(public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public camera: Camera) {
    console.log('camera loaded');
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewWillEnter() {
    console.log('camera view loaded');
    this.getPicture();
  }

  home() {
    this.navCtrl.setRoot(MainPage);
  }

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((imageData) => {
        this.imageData = 'data:image/jpg;base64,' + imageData;
      }, (err) => {
        alert('Unable to take photo');
        this.navCtrl.pop();
      })
    } else {
      alert('Camera access is needed.');
      this.navCtrl.pop();
    }
  }
  // analyze() {
  //     let loader = this.loadingCtrl.create({
  //      content: 'I\'m trying to read your receipt. Please wait...'
  //     });
  //     loader.present();
  //     (<any>window).OCRAD(document.getElementById('image'), text => {
  //       loader.dismissAll();
  //       console.log(text);
  //     this.navCtrl.push(ProjectListPage,{imageData:this.imageData})
  //     });
  //   }
}
