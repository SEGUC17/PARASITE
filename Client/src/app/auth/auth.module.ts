import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent} from './forgotPassword/forgotPassword.component';
import { ResetPasswordComponent} from './forgotPassword/resetpassword/resetpassword.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import {
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatDatepickerModule,
  MatCheckboxModule,
  MatSelectModule
} from '@angular/material';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignOutComponent } from './sign-out/sign-out.component';

@NgModule({
  providers: [AuthService],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  declarations: [ForgotPasswordComponent, ResetPasswordComponent, VerifyEmailComponent, SignInComponent, SignUpComponent, SignOutComponent]
})
export class AuthModule { }
