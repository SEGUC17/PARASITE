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
    const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      scope: 'email, public_profile, user_birthday, user_hometown'
    };

    this.facebookService.login(loginOptions)
      .then(function (res: LoginResponse) {
        self.authService.authFacebook(res.authResponse).subscribe(function(res2) { });
      })
      .catch(this.authService.handleError);
  }

}
