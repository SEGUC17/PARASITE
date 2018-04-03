import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ChildsignupRoutingModule } from './childsignup-routing.module';
@NgModule({
  providers: [AuthService],
    imports: [
    CommonModule,
    FormsModule,
    ChildsignupRoutingModule
  ],
  declarations: []
})
export class ChildsignupModule { }
