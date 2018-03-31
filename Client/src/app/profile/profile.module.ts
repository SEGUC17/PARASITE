import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProfileService } from './profile.service';
import { BrowserModule } from '@angular/platform-browser';
import { ChildernComponent } from './profile/childern/childern.component';
import { MatTabsModule, MatButtonModule, MatMenuModule, MatChipsModule } from '@angular/material';

@NgModule({
  imports: [
    ProfileRoutingModule,
    HttpClientModule,
    BrowserModule,
    MatTabsModule,
    MatButtonModule,
    MatMenuModule,
    MatChipsModule
  ],
  declarations: [ProfileComponent, ChildernComponent],
  providers: [
    ProfileService
  ]
})
export class ProfileModule { }
