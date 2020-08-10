import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UtilityService } from '@shared/services/utility.service';
import { ApiService } from '@shared/services/api.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import countryJson from '../../shared/country.json'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  public profileImg: any = '../../../assets/shared/default-profile-pic.png';
  public selecetdFile: File;
  public profile_name: string = '';
  public last_name: string = '';
  public profile_email: string = '';
  public emailExists: boolean = false;
  public country: string = '';
  public onImageSelect: boolean = false;
  public phoneNumber: string = '';
  public gender: string = '';
  public dob: any = null;
  public maxDate: any;

  public message: string = '';
  public showPasswordLoader: boolean = false;
  public incorrectPassword: boolean = false;
  public error: boolean = false;

  public currentPswd: string = '';
  public newPswd: string = '';
  public repeatPswd: string = '';
  public onSuccessSubmit: boolean = false;
  public loggedInUser: string = '';
  public userId: any = '';
  public countryJsonArray = countryJson;

  @ViewChild('profileDetailsForm', { static: true }) profileDetailsForm: NgForm;
  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(
    private _apiCallService: ApiService,
    private util: UtilityService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.userId = this.util.loginId || params["id"];
    });
  }

  ngOnInit(): void {
    this.loggedInUser = 'Admin';
    let currentDate = new Date();
    this.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() }
    this.getProfileDetails();
  }

  onFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      this.selecetdFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImg = reader.result;
      };
      reader.readAsDataURL(this.selecetdFile);
      console.log(this.selecetdFile);
      this.profileDetailsForm.form.markAsDirty();
      this.onSuccessSubmit = false;
    }
  }

  updateProfileRequest(ev, form, name, email, comapnyname) {
    ev.stopPropagation();
    this.util.startLoader();
    this.profileDetailsForm.form.disable();
    this.onImageSelect = true;
    this.emailExists = false;
    let params = {
      first_name: form.value.profileName,
      last_name: form.value.lastName,
      email: form.value.emailAdmin,
      phone: form.value.phno,
      // password: form.value.password
    }

    if (form.value.countryName) {
      params['country'] = form.value.countryName;
    }
    if (form.value.gender) {
      params['gender'] = form.value.gender;
    }

    if (this.selecetdFile) {
      params['profile_image'] = this.profileImg;
    }

    if (form.value.dp) {
      params['dob'] = JSON.stringify(form.value.dp);
    }

    let queryParam = {
      id: this.userId
    }

    this._apiCallService.updateUserDetails(params, queryParam).subscribe(res => {
      this.getProfileDetails();
      let el = document.getElementById('progress-btn');
      let that = this;
      this.onSuccessSubmit = true;
      this.profileDetailsForm.form.markAsPristine();
      if (!el.classList.contains("active")) {
        el.classList.add("active");
        setTimeout(function () {
          el.classList.remove("active");
          if (!that.cdRef['destroyed']) {
            that.cdRef.detectChanges();
          }
          that.onSuccessSubmit = false;
          that.profileDetailsForm.form.enable();
          that.onImageSelect = false;
          that.util.stopLoader();
        }, 3000);
      }
    }, err => {
      console.log('while updating profile', err);
      if (err.error.code === -2304) {
        this.emailExists = true;
      }
      this.onSuccessSubmit = false;
      this.profileDetailsForm.form.markAsPristine();
      this.profileDetailsForm.form.enable();
      this.util.stopLoader();
    })
  }

  validatePasswordForm(changePasswordForm, currentPswd, newPswd, repeatPswd) {
    // if ((currentPswd && newPswd) && currentPswd === newPswd) {
    //   return true;
    // }
    // if ((newPswd && repeatPswd) && newPswd !== repeatPswd) {
    //   return true;
    // }
  }

  getProfileDetails() {
    this.util.startLoader();
    let params = {
      id: this.userId
    }
    this._apiCallService.getLoggedUserDetails(params).subscribe(res => {
      this.profile_name = res['first_name'];
      this.last_name = res['last_name'];
      this.profile_email = res['email'];
      this.country = res['country'];
      this.phoneNumber = res['phone'];
      this.gender = res['gender'];
      this.profileImg = res['profile_image'] ? res['profile_image'] : this.profileImg;
      this.dob = res['dob'] ? JSON.parse(res['dob']) : null;
      this.util.stopLoader();
    }, err => {
      if (err.error.code === -2204) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
      this.util.stopLoader();
    });
  }

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.countryJsonArray.map(x => x.name)
        : (this.countryJsonArray.map(x => x.name).filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
      )
    );
  }

  clearDob(){
    this.dob = null;
    this.profileDetailsForm.form.markAsDirty();
  }
}
