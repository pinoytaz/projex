/**
 * Cost Code Model
 */
export class CostCode {

private _checked:boolean;
  constructor(private fields: any) {
    // Quick and dirty extend/assign fields to this model
    for (let f in fields) {
      this[f] = fields[f];
    }
  }
public get checked():boolean{
    return this._checked;
}
    
public set checked(checked:boolean){
    this._checked=checked;
}
}
