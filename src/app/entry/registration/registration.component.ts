import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@shared/services/api.service';
import { UtilityService } from '@shared/services/utility.service';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import countryJson from '../../shared/country.json'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class RegistrationComponent implements OnInit {

  public onSuccessSubmit = false;
  // public firstName: string = '';
  public forgetpswdErrorMsg = '';
  public errorMsgUsername = '';
  public errorMsg = '';
  public countryJsonArray = countryJson;

  public ifPasswordNotSame: boolean = false;

  public registrationObj = {
    firstName: '',
    lastName: '',
    email: '',
    phNumber: '',
    country: '',
    newPassword: '',
    confirmPassword: ''
  }

  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(private cdRef: ChangeDetectorRef, private util: UtilityService, private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    let id = localStorage.getItem('loginId');
    if (id) {
      this.router.navigate(['/dashboard'], { queryParams: { id: id } });
    }
  }

  onSubmit(form: NgForm) {
    this.util.startLoader();
    form.value.email = encodeURI(form.value.email);
    // form.value.user_id = 1; // remove this after oauth is ready

    let params = {
      first_name: form.value.firstname,
      last_name: form.value.lastname,
      email: form.value.email,
      phone: form.value.phoneNo,
      password: form.value.password
    }
    if (form.value.country) {
      params['country'] = form.value.country;
    }

    this.apiService.userRegistration(params)
      .subscribe((data) => {
        const el = document.getElementById('progress-forget-btn');
        const that = this;
        let router = this.router;
        this.onSuccessSubmit = true;
        if (!el.classList.contains('active')) {
          el.classList.add('active');
          setTimeout(function () {
            el.classList.remove('active');
            if (!that.cdRef['destroyed']) {
              that.cdRef.detectChanges();
            }
            that.onSuccessSubmit = false;
            that.util.stopLoader();
            that.util.loginId = data['id'];
            localStorage.removeItem('loginId');
            localStorage.setItem('loginId', data['id'])
            router.navigate(['/dashboard'], { queryParams: { id: data['id'] } });
          }, 3000);
        }
      }, (error) => {
        console.log('forgot error', error);
        if (error.error.code === -2104) {
          this.errorMsgUsername = error.error.message ? error.error.message : 'Email already Exists!';
        }
        this.util.stopLoader();
      });
  }

  verifyForm() {
    if (!this.registrationObj['firstName'] || !this.registrationObj['lastName'] || !this.registrationObj['email']
      || !this.registrationObj['phNumber'] || !this.registrationObj['newPassword'] || !this.registrationObj['confirmPassword']) {
      return true;
    }
  }

  checkPassword(pswd, confirm) {
    if (pswd !== confirm) {
      this.ifPasswordNotSame = true;
      return true;
    } else {
      this.ifPasswordNotSame = false;
      return false;
    }
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

}
