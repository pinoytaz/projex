import { Injectable } from '@angular/core';
// import { File } from '@ionic-native/file';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
// import { FileUploadOptions, TransferObject } from '@ionic-native/transfer';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  //    url: string = 'http://localhost:8100/projex';
  url: string = 'http://www.projectprohub.com/projex/services';

  constructor(public http: Http) {
  }

  get(endpoint: string, params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    // Support easy query params for GET requests
    if (params) {
      let p = new URLSearchParams();
      for (let k in params) {
        p.set(k, params[k]);
      }
      // Set the search field if we have params and don't already have
      // a search field set in options.
      options.search = !options.search && p || options.search;
    }
    console.log('get:' + endpoint + JSON.stringify(options));
    return this.http.get(this.url + '/' + endpoint, options);
  }

  postJson(endpoint: string, body: any, options?: RequestOptions) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/' + endpoint, body, { headers: headers });
  }

  post(endpoint: string, body: any, options?: RequestOptions) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + '/' + endpoint, body, { headers: headers });
  }

  put(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + '/' + endpoint, body, options);
  }

  delete(endpoint: string, options?: RequestOptions) {
    return this.http.delete(this.url + '/' + endpoint, options);
  }

  patch(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + '/' + endpoint, body, options);
  }
}
