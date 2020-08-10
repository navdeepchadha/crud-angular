import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@shared/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  @Input() loggedInUser: string = '';
  @Input() loggedInId: any = '';
  @Input() profileImageURL: string = '../../../assets/shared/default-profile-pic.png';
  public showLogout: boolean = false;

  constructor(private router: Router,
    private _apiCallService: ApiService,
  ) { }

  ngOnInit(): void {
    let id = localStorage.getItem('loginId');
    if (!id) {
      this.router.navigate(['/login']);
    }
  }

  routeToDashboard() {
    let id = localStorage.getItem('loginId');
    this.router.navigate(['/dashboard'], { queryParams: { id: id } });
  }

  goToLoginPage() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  deleteAccount() {
    let params = {
      id: this.loggedInId
    }
    this._apiCallService.deleteAccount(params).subscribe(res => {
      localStorage.clear();
      this.router.navigate(['/login']);
    }, err => {
      debugger
    })
  }

}
