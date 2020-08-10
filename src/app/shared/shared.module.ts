import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilityService } from './services/utility.service';
import { ApiService } from '@shared/services/api.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    UtilityService,
    ApiService
  ]
})
export class SharedModule { }
