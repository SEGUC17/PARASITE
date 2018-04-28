import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgotPassword/forgotPassword.component';
import { ResetPasswordComponent } from './forgotPassword/resetpassword/resetpassword.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignOutComponent } from './sign-out/sign-out.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { VerifyChildEmailComponent } from './verify-child-email/verify-child-email.component';
import { ChildSignupComponent } from './child-signup/child-signup.component';

const routes = [

  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'child-sign-up',
    component: ChildSignupComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password/:id',
    component: ResetPasswordComponent
  },
  {
    path: 'sign-in',
    component: SignInComponent
  },

  {
    path: 'sign-out',
    component: SignOutComponent
  },

  {
    path: 'verify-email/:id',
    component: VerifyEmailComponent
  },
  {
    path: 'verify-child-email/:id',
    component: VerifyChildEmailComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
