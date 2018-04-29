import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingRoutingModule } from './/landing-routing.module';

@NgModule({
  imports: [
    CommonModule,
    LandingRoutingModule,
    RouterModule
  ],
  declarations: [LandingPageComponent]
})
export class LandingModule { }
