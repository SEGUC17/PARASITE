import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { AuthService } from '../auth.service';
import { MatButtonModule } from '@angular/material';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotPassword.component.html',
  styleUrls: ['./forgotPassword.component.css']
})

export class ForgotPasswordComponent implements OnInit {
  // ------ flags -----//
  email = '';

  constructor(private _AuthService: AuthService, private _Location: Location,
    private toastrService: ToastrService, public translate: TranslateService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  submit(email): void {
    const self = this;
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email)) {
      this._AuthService.forgotPassword(email).subscribe(function (res) {
        self.translate.get('AUTH.TOASTER.EMAIL_VERIFICATION_SENT').subscribe(
          function (translation) {
            self.toastrService.success(translation);
          }
        );
      });
    } else {
      self.translate.get('AUTH.TOASTER.VALID_EMAIL_WARNING').subscribe(
        function (translation) {
          self.toastrService.warning(translation);
        }
      );
      self._Location.forward();
    }

  }

}
