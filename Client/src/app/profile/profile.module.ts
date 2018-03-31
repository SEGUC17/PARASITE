import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
<<<<<<< HEAD
<<<<<<< HEAD
import { ChildernComponent } from './profile/childern/childern.component';
=======
>>>>>>> 0f9635eb3ec30579faf013954906dd25c43f5ea1

@NgModule({
  imports: [
    ProfileRoutingModule
  ],
<<<<<<< HEAD
  declarations: [ProfileComponent, ChildernComponent]
=======
  declarations: [ProfileComponent]
>>>>>>> 0f9635eb3ec30579faf013954906dd25c43f5ea1
=======
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

>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337
})
export class ProfileModule { }
