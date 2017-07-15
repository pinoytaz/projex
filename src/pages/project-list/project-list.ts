import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, PopoverController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import * as Tesseract from 'tesseract.js';

import { Projects } from '../../providers/providers';
import { Project } from '../../models/project';
import { PaymentTypeListPage } from '../payment-type-list/payment-type-list';
import { Purchase } from '../../models/purchase';
import { MainPage } from '../../pages/pages';
import { Camera } from '@ionic-native/camera';
import { Tooltips } from '../popups/tooltips';

@Component({
  selector: 'page-project-list',
  templateUrl: 'project-list.html'
})
export class ProjectListPage {
  OCRAD: any;
  plist: Project[];
  oList: Observable<any>;
  sort = { "projectId": "fa-unsorted", "projectName": "fa-unsorted" };
  receipt: any;
  isNewProject: boolean = false;
  purchase: Purchase = new Purchase({});
  form: FormGroup;
  isReadyToSave: boolean = false;
  fromEdit: boolean = false;

  ts = {progress:null,result:null,error:null,resultorerror:null};
  constructor(public viewCtrl: ViewController, public plt: Platform, public storage: Storage, public popoverCtrl: PopoverController, public toastCtrl: ToastController,
    public navCtrl: NavController,
    public projects: Projects,
    formBuilder: FormBuilder,
    navParams: NavParams,
    public camera: Camera) {

    this.fromEdit = navParams.get('fromEdit');
    this.plist = [];
    this.oList = this.projects.query();
    this.oList.subscribe(res => {

      // If the API returned a successful response, retrive all projects returned
      if (res.status.toLowerCase() == 'success') {
        if (res['body'].length > 0) {
          for (let _p in res['body']) {
            this.plist.push(new Project(res['body'][_p]));
          }
        }
      } else {
      }
    }, err => {
      let toast = this.toastCtrl.create({
        message: "Unable to fetch the projects.",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }, () => console.log('dne'));
    //    this.plist = this.projects.query();
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
    //    this.viewCtrl.setBackButtonText('Purchases');
  }
  ionViewWillEnter() {
    if (!this.fromEdit) {
      this.getPicture();
    }
  }

  showtip() {
    this.storage.get('loadprojects').then((val) => {
      if (val == null || val) {
        let popover = this.popoverCtrl.create(Tooltips, { page: 'project-list', top: 100 }, { showBackdrop: true });
        popover.present();
      }
      this.storage.set('loadprojects', false);
    });
  }
  home() {
    this.navCtrl.setRoot(MainPage);
  }

  doSort(col) {
    var order = "";
    var current = this.sort[col];
    var iOrder = 1;
    switch (current) {
      case "fa-unsorted":
      case "fa-sort-desc": order = "fa-sort-asc"; break;
      case "fa-sort-asc": order = "fa-sort-desc"; iOrder = -1;
    }
    this.sort[col] = order;
    if (col == 'projectId') {
      this.sort['projectName'] = 'fa-unsorted';
    } else {
      this.sort['projectId'] = 'fa-unsorted';
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
   * Select project
   */
  select(project: Project) {
    this.navCtrl.push(PaymentTypeListPage, { project: project, purchase: this.purchase });
    console.log(project);
  }

  noProject() {
    var np: Project = new Project({
      "projectId": 0,
      "projectName": "N/A"
    });
    this.navCtrl.push(PaymentTypeListPage, { project: np, purchase: this.purchase });
  }
  newProject() {
    var np: Project = new Project({
      "projectId": 0,
      "projectName": this.form.controls['name'].value
    });
    this.select(np);
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
        Tesseract.recognize(imageData)
  .progress(message => console.log('progress:', message))
          .catch(err => console.log('err:', err))
        .then(result => console.log('result:' + result['text']))
        .finally(resultOrError => console.log('resultOrError:', resultOrError));
        this.purchase.imageData = imageData;
      }, (err) => {
        alert('Unable to take photo');
        this.navCtrl.pop();
      })
    } else {
      alert('Camera access is needed.');
      this.navCtrl.pop();
    }
  }

}
