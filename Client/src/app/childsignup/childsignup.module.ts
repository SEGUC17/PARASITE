import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
@NgModule({
  providers: [AuthService],
    imports: [
    CommonModule,
    FormsModule
  ],
  declarations: []
})
export class ChildsignupModule { }
