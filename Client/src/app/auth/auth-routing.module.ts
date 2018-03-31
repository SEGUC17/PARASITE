import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {SignupComponent} from './signup/signup.component'
const routes = [
  { path: 'auth/login', component: LoginComponent }, 
  { path: 'auth/signup', component: SignupComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
