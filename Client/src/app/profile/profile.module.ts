import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ChildernComponent } from './profile/childern/childern.component';

import {HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProfileService } from './profile.service';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  imports: [
    ProfileRoutingModule,
    HttpClientModule,
    BrowserModule
  ],
  declarations: [ProfileComponent],
  providers: [
    ProfileService
  ]

})
export class ProfileModule { }
