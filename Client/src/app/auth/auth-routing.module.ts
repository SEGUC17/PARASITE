import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
const routes = [
  { path: 'auth/login', component: LoginComponent }
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
