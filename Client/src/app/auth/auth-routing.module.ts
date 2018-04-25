import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgotPassword/forgotPassword.component';
import { ResetPasswordComponent } from './forgotPassword/resetpassword/resetpassword.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

const routes = [
  { path: 'auth/sign-in', component: SignInComponent },

  { path: 'auth/sign-up', component: SignUpComponent },

  { path: 'auth/forgotPassword', component: ForgotPasswordComponent },

  { path: 'auth/verifyEmail/:id', component: VerifyEmailComponent },

  { path: 'auth/forgotPassword/resetpassword/:id', component: ResetPasswordComponent }
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
