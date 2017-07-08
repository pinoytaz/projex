/**
 * Purchase Model
 */
export class Purchase {
private _imageData:any
  constructor(private fields: any) {
    // Quick and dirty extend/assign fields to this model
    for (let f in fields) {
      this[f] = fields[f];
    }
  }
public get imageData():any {
    return this._imageData;
}
public set imageData(image:any){
    this._imageData = image; 
}

}
