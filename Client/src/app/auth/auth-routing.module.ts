import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
<<<<<<< HEAD
const routes = [
  { path: 'auth/login', component: LoginComponent }
=======
import {SignupComponent} from './signup/signup.component'
const routes = [
  { path: 'auth/login', component: LoginComponent }, 
  { path: 'auth/signup', component: SignupComponent }
>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337
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
