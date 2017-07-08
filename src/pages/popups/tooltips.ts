import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'page-tooltips',
  templateUrl: 'tooltips.html'
})
export class Tooltips {
page:any;
top:any;
constructor(public navParams: NavParams) {
      this.page = this.navParams.get('page');
    this.top = this.navParams.get('top');
  }
}
