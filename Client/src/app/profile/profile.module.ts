import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    ProfileRoutingModule,
    HttpClientModule
  ],
  declarations: [ProfileComponent]
})
export class ProfileModule { }
