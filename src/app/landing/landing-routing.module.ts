import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ContactUsComponent } from '../contact-us/contact-us.component';

const routes = [
  { path: 'landing', component: LandingPageComponent },

  { path: 'contact-us', component: ContactUsComponent}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})
export class LandingRoutingModule { }
