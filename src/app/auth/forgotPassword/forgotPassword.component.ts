import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { AuthService } from '../auth.service';
import { MatButtonModule } from '@angular/material';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ContactUsComponent } from '../../messaging/contact-us/contact-us.component';


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotPassword.component.html',
  styleUrls: ['./forgotPassword.component.css']
})

export class ForgotPasswordComponent implements OnInit {
  // ------ flags -----//
 email = '';

  constructor(private _AuthService: AuthService, private _Location: Location, private _Router: Router) { }

  ngOnInit() {
  }

  submit (email): void {
    const self = this;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email)) {
    this._AuthService.forgotPassword(email).subscribe(function(res) {
      console.log(email);
    });
  } else {
      alert('Kindly provide a valid email address');
      self._Location.forward();
    }

  }
  /*ChangePassword(pws): void {
    if (!(pws.newpw === pws.confirmpw)) {
      alert('New and confirmed passwords do not match!');


    } else if ((pws.newpw.length < 8)) {
      alert('Password should be more than 8 characters');
    } else {
      console.log(this.email);
      this._AuthService.ChangePassword(this.email, pws).subscribe(function (res) {
        console.log(res.msg);
        alert(res.msg);
      });
    }
 }
 */
}
