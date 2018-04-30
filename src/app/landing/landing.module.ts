import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingRoutingModule } from './/landing-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    LandingRoutingModule,
    RouterModule,
    TranslateModule.forChild()
  ],
  declarations: [LandingPageComponent]
})
export class LandingModule { }
