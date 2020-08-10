import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const headers = new HttpHeaders({
  "Content-Type": "application/x-www-form-urlencoded",
  "Access-Control-Allow-Headers": "*"
});
const options = { headers: headers };

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  userRegistration(formDetails) {
    let body = this.getUrlDataString(formDetails)
    let url = 'http://localhost:4000/api/users';
    return this.http.post(url, body, options)
  }

  login(formDetails) {
    let body = this.getUrlDataString(formDetails)
    let url = 'http://localhost:4000/api/login/';
    return this.http.post(url, body, options)
  }

  getLoggedUserDetails(formDetails) {
    let body = '?' + this.getUrlDataString(formDetails)
    let url = 'http://localhost:4000/api/getLoggedInUserDetails';
    return this.http.get(url + body, options)
  }

  updateUserDetails(formDetails, queryID) {
    let queryid = '?' + this.getUrlDataString(queryID)
    let body = this.getUrlDataString(formDetails)
    let url = 'http://localhost:4000/api/users';
    return this.http.put(url + queryid, body, options)
  }

  deleteAccount(formDetails) {
    let body = '?' + this.getUrlDataString(formDetails)
    let url = 'http://localhost:4000/api/deleteuser';
    return this.http.delete(url + body, options)
  }


  getUrlDataString(body: Object): string {
    let bodyParam: string = "";
    Object.keys(body).forEach((val, index) => {
      bodyParam += val + "=" + encodeURIComponent(body[val]);
      if (index !== Object.keys(body).length - 1) {
        bodyParam += "&";
      }
    });
    return bodyParam;
  }

}
