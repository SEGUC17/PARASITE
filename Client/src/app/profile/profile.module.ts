import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import {HttpClientModule} from '@angular/common/http';
<<<<<<< HEAD
import { ProfileService } from './profile.service';
||||||| merged common ancestors
=======
import { CommonModule } from '@angular/common';
import { ProfileService } from './profile.service';
import { BrowserModule } from '@angular/platform-browser';

>>>>>>> master

@NgModule({
  imports: [
    ProfileRoutingModule,
    HttpClientModule,
    BrowserModule
  ],
<<<<<<< HEAD
  declarations: [ProfileComponent],
  providers: [
    ProfileService
  ]
||||||| merged common ancestors
  declarations: [ProfileComponent]
=======
  declarations: [ProfileComponent],
  providers: [
    ProfileService
  ]

>>>>>>> master
})
export class ProfileModule { }
