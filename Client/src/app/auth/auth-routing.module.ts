import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

const routes = [
  { path: 'auth/sign-in', component: SignInComponent },

  { path: 'auth/sign-up', component: SignUpComponent },

  { path: 'auth/resetpassword', component: ResetPasswordComponent },

  { path: 'auth/verifyEmail/:id', component: VerifyEmailComponent }
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
