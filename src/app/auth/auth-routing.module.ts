import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgotPassword/forgotPassword.component';
import { ResetPasswordComponent } from './forgotPassword/resetpassword/resetpassword.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignOutComponent } from './sign-out/sign-out.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ContactUsComponent } from '../messaging/contact-us/contact-us.component';
const routes = [

  { path: 'auth/sign-up', component: SignUpComponent },

  { path: 'auth/forgotPassword', component: ForgotPasswordComponent },
  { path: 'auth/sign-in', component: SignInComponent },

  { path: 'auth/sign-out', component: SignOutComponent },

  { path: 'auth/verifyEmail/:id', component: VerifyEmailComponent },

  { path: 'auth/forgotPassword/resetpassword/:id', component: ResetPasswordComponent },

  { path: 'messaging/contact-us', component:  ContactUsComponent }
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
