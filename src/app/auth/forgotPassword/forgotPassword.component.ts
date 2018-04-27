import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { AuthService } from '../auth.service';
import { MatButtonModule } from '@angular/material';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotPassword.component.html',
  styleUrls: ['./forgotPassword.component.css']
})

export class ForgotPasswordComponent implements OnInit {
  // ------ flags -----//
 email = '';

  constructor(private _AuthService: AuthService, private _toastr: ToastrService) { }

  ngOnInit() {
  }

  submit (email): void {
    const self = this;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(email)) {

    this._AuthService.forgotPassword(email).subscribe(function(res) {
    });
    self._toastr.success('an email was sent, check your email for further instructions');
  } else {
      self._toastr.warning('Kindly provide a valid email address');
    }

  }

}
