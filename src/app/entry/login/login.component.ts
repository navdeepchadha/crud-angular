import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@shared/services/api.service';
import { UtilityService } from '../../shared/services/utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, AfterViewInit {

  public loginSection = false;
  public loginMail = '';
  public loginPassword = '';
  public onSuccessSubmit = false;
  // public emailExists = false;
  public incorrectPassword = false;
  public toastrMsg = '';
  public loginForm;
  public forgetForm;
  public toastDiv = false;
  public autohide = true;
  public errorMsg = '';
  public forgetpswdErrorMsg = '';
  public errorMsgUsername = '';
  public documentHead: any;
  public status: string;


  @ViewChild('forgetForm', { static: false }) forgetPasswordForm: NgForm;
  @ViewChild('loginForm', { static: false }) loginNgForm: NgForm;


  constructor(private router: Router,
    private apiService: ApiService,
    private cdRef: ChangeDetectorRef,
    private util: UtilityService,
  ) { }

  ngOnInit() {

    let id = localStorage.getItem('loginId');
    if (id) {
      this.router.navigate(['/dashboard'], { queryParams: { id: id } });
    }
    if (this.router.url === '/login') {
      this.loginSection = false;
    } else if (this.router.url === '/registration') {
      this.loginSection = true;
    }
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.cdRef.detectChanges();
  }

  goToRegistration() {
    this.loginSection = true;
    this.router.navigate(['/registration']);
  }
  backToLoginForm() {
    this.loginSection = false;
    this.router.navigate(['/login']);
  }
  onSubmit(loginForm: NgForm) {
    this.util.startLoader();
    let id;
    localStorage.clear();
    sessionStorage.clear();
    let router = this.router;
    if (loginForm.value.email && loginForm.value.password) {
      loginForm.value.grant_type = 'password';
      loginForm.value.email = loginForm.value.email.trim();
      loginForm.value.email = encodeURI(loginForm.value.email);
      this.errorMsg = '';
      this.errorMsgUsername = '';
      let params = {
        email: loginForm.value.email,
        password: loginForm.value.password
      }
      this.apiService.login(params)
        .subscribe((data) => {
          const el = document.getElementById('progress-btn');
          const that = this;
          this.onSuccessSubmit = true;
          // this.getProfileDetails();
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
              localStorage.setItem('loginId', data['id'])
              router.navigate(['/dashboard'], { queryParams: { id: data['id'] } });
            }, 3000);
          }
        }, (response) => {
          clearInterval(id);
          switch (response.error.code) {
            case -2104:
              this.errorMsg = '';
              this.errorMsgUsername = response.error.message ? response.error.message : 'Account not found!';
              break;
            case -2105:
              this.errorMsgUsername = '';
              this.errorMsg = response.error.message ? response.error.message : 'Invalid Credential!';
              break;
          }
          this.util.stopLoader();
        });
    } else {
      this.errorMsgUsername = (!loginForm.value.email || loginForm.value.email.length === 0) ? 'Please enter a valid email id' : '';
      this.errorMsg = (!loginForm.value.password || loginForm.value.password.length === 0) ? 'Please enter a valid password' : '';
      this.util.stopLoader();
    }
  }

  verifyForm() {
    if (!this.loginMail || !this.loginPassword) {
      return true;
    }
  }

  verifyForgetForm() {
    if (!this.loginMail) {
      return true;
    }
  }

}
