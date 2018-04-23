import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';

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

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  signIn() {
    const self = this;
    self.authService.signIn(this.user).subscribe(function (res) {
      self.authService.setToken(res.token);
      if (res.msg) {
        alert(res.msg);
      }
    });
  }

}
