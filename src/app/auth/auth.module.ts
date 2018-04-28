import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
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
import { ToastrService } from 'ngx-toastr';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignOutComponent } from './sign-out/sign-out.component';
import { ContactUsComponent } from '../messaging/contact-us/contact-us.component';
import { VerifyChildEmailComponent } from './verify-child-email/verify-child-email.component';

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
  declarations: [ForgotPasswordComponent, ResetPasswordComponent,
     VerifyEmailComponent, SignInComponent, SignUpComponent, SignOutComponent, ContactUsComponent, VerifyChildEmailComponent]
})
export class AuthModule { }
