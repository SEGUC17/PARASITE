import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import { ResetPasswordComponent} from './resetpassword/resetpassword.component';
const routes = [
  { path: 'auth/login', component: LoginComponent },

  { path: 'auth/signup', component: SignupComponent },

  { path: 'auth/resetpassword', component: ResetPasswordComponent}
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
