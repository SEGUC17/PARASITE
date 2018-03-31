import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
<<<<<<< HEAD

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule
  ],
  declarations: [LoginComponent]
=======
import { SignupComponent } from './signup/signup.component';
import {FormsModule} from "@angular/forms";
import {AuthService} from './auth.service'
@NgModule({
  providers:[AuthService],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule
  ],
  declarations: [LoginComponent, SignupComponent]
>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337
})
export class AuthModule { }
