import { Injectable, Output, EventEmitter } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  public profilePicture: string = './../../../assets/shared/default-profile-pic.png';
  public loginId: any = localStorage.getItem('loginId');
    constructor(private ngxService: NgxUiLoaderService) { }

startLoader() {
  document.body.classList.add("overflow-hidden")
  this.ngxService.start();
}

stopLoader() {
  this.ngxService.stop();
  document.body.classList.remove("overflow-hidden")
}

}
