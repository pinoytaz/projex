import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';

import { MyApp } from './app.component';

import { PurchaseViewEditPage } from '../pages/purchase-view-edit/purchase-view-edit';
import { PurchaseReviewPage } from '../pages/purchase-review/purchase-review';
import { AddAmountsPage } from '../pages/add-amounts/add-amounts';
import { ListMasterPage } from '../pages/list-master/list-master';
import { ProjectListPage } from '../pages/project-list/project-list';
import { CostCodeListPage } from '../pages/cost-code-list/cost-code-list';
import { PaymentTypeListPage } from '../pages/payment-type-list/payment-type-list';
import { LoginPage } from '../pages/login/login';
import { Tooltips } from '../pages/popups/tooltips';
import { CapturePage } from '../pages/capture/capture';
import { SignupPage } from '../pages/signup/signup';
import { WelcomePage } from '../pages/welcome/welcome';
import { ResetpwPage } from '../pages/resetpw/resetpw';

import { Api } from '../providers/api';
import { Purchases } from '../providers/purchases';
import { Projects } from '../providers/projects';
import { CostCodes } from '../providers/costcodes';
import { PaymentTypes } from '../providers/paymenttypes';
import { Settings } from '../providers/settings';
import { User } from '../providers/user';

import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CalcPopup } from '../pages/popups/calc';

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}


/**
 * The Pages array lists all of the pages we want to use in our app.
 * We then take these pages and inject them into our NgModule so Angular
 * can find them. As you add and remove pages, make sure to keep this list up to date.
 */
let pages = [
  MyApp,
  PurchaseViewEditPage,
  CapturePage,
  PurchaseReviewPage,
  AddAmountsPage,
  CostCodeListPage,
  Tooltips,
  ListMasterPage,
  ProjectListPage,
  PaymentTypeListPage,
  LoginPage,
  SignupPage,
  WelcomePage,
  ResetpwPage,
  CalcPopup
];

export function declarations() {
  return pages;
}

export function entryComponents() {
  return pages;
}

export function providers() {
  return [
    Api,
    Purchases,
    Projects,
    PaymentTypes,
    CostCodes,
    User,
    Camera,
    SplashScreen,
    StatusBar,
Transfer,File,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}

@NgModule({
  declarations: declarations(),
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: providers()
})
export class AppModule { }
