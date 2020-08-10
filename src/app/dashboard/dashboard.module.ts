import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { NgbDropdownModule,NgbDatepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';


@NgModule({
  declarations: [DashboardComponent, HeaderComponent],
  imports: [
    CommonModule,
    NgbDropdownModule,
    FormsModule,
    MatRadioModule,
    NgbDatepickerModule,
    NgbTypeaheadModule,
    MatDatepickerModule
  ]
})
export class DashboardModule { }
