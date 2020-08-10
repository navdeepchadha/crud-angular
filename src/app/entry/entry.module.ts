import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

import { NgbTypeaheadModule ,NgbTooltipModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [LoginComponent, RegistrationComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    NgbPopoverModule
  ]
})
export class EntryModule { }
