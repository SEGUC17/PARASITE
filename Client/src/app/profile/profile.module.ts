import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import {HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProfileService } from './profile.service';


@NgModule({
  imports: [
    ProfileRoutingModule,
    HttpClientModule
  ],
  declarations: [ProfileComponent],
  providers: [
    ProfileService
  ]

})
export class ProfileModule { }
