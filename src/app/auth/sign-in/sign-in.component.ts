import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FacebookService, InitParams, LoginOptions, LoginResponse } from 'ngx-facebook';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  public user: User = {
    username: '',
    password: '',
    rememberMe: false
  };

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private facebookService: FacebookService
  ) {
    let initParams: InitParams = {
      appId: environment.facebookAppID,
      xfbml: true,
      version: 'v2.8'
    };

    facebookService.init(initParams);
  }

  ngOnInit() {
  }

  signIn() {
    const self = this;
    self.authService.signIn(this.user).subscribe(function (res) {
      if (res.msg === 'Sign In Is Successful!') {
        self.authService.setToken(res.token);
        self.toastrService.success(res.msg, 'Welcome!');
        self.router.navigate(['/']);
      }
    });
  }

  signInWithFacebook() {
    const self = this;

    this.facebookService.login()
      .then(function (res: LoginResponse) {
        self.authService.authFacebook(res.authResponse).subscribe(function(res2) {
          if (res2.msg === 'Sign In Is Successful!') {
            self.authService.setToken(res2.token);
            self.toastrService.success(res2.msg, 'Welcome!');
            self.router.navigate(['/']);
          }
        });
      })
      .catch(this.authService.handleError);
  }

}
