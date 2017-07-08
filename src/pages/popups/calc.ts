import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'page-calc',
  templateUrl: 'calc.html'
})
export class CalcPopup {
  result: any;
    value: any;
    decimal: boolean;
    answer: number;
    total: Array<number>;
    clear: boolean;
    previous_operator: any;
control:any;
  constructor(public viewCtrl: ViewController, public navParams: NavParams,
    public navCtrl: NavController) {
       this.result =0;
        this.decimal = false;
        this.answer = 0;
        this.total = [];
        this.clear = true;
        this.previous_operator = false;
    this.control = this.navParams.get('target');
  }
 addToCalculation(value) {

        if(this.clear == true) {
            this.result = '';
            this.clear = false;
        }

        if(value == '.') {

            if(this.decimal == true) {
                return false;
            }

            this.decimal = true;

        }
        this.result += value;

    }
sign(){
    this.result *=-1;
}
percent(){
    this.result /=100;
}
fnEnter(){
    this.getTotal();
    this.control.setValue(this.result);
    this.viewCtrl.dismiss();
}
fnClear(){
    this.clear=true;
    this.result=0;
    this.total = [];
}
    calculate(operator) {

        this.total.push(this.result);
        this.result = '';

        if(this.total.length == 2) {
            var a = Number(this.total[0]);
            var b = Number(this.total[1]);

            if(this.previous_operator == '+') {
                var total = a + b;
            } else if(this.previous_operator == '-') {
                var total = a - b;
            } else if(this.previous_operator == '*') {
                var total = a * b;
            } else {
                var total = a / b;
            }
            var answer = total;

            this.total = [];
            this.total.push(answer);
            this.result = total;
            this.clear = true;
        }
        else {
            this.clear = false;
        }

        this.decimal = false;
        this.previous_operator = operator;

    }

    getTotal() {
        var a = Number(this.total[0]);
        var b = Number(this.result);

        if(this.previous_operator == '+') {
            var total = a + b;
        } else if(this.previous_operator == '-') {
            var total = a - b;
        } else if(this.previous_operator == '*') {
            var total = a * b;
        } else {
            var total = a / b;
        }

        if(isNaN(total)) {
            return false;
        }

        this.result = total;
        this.total = [];
        this.clear = true;
    }



}
