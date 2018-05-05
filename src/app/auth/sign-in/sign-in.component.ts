import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
    public authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.authService.isNotAuthenticated();
  }

  ngOnInit() {
  }

  signIn() {
    const self = this;
    self.authService.signIn(this.user).subscribe(function (res) {
      if (res.msg === 'Sign In Is Successful!') {
        self.authService.setToken(res.token);
        self.translate.get('AUTH.TOASTER.SIGN_IN_SUCCESSFULL').subscribe(
          function (translation) {
            self.toastrService.success(translation);
          }
        );
<<<<<<< HEAD
        // self.router.navigateByUrl('/newsfeed');
        // used this instead in order for profile picture
        // of the current user and the appropriate
        // tabs appear to him
        window.location.replace('/newsfeed');
=======
        self.authService.redirectToHomePage();
>>>>>>> b0e19719ce59a107a6e8859b514eadba27798d3e
      }
    });
  }

}
