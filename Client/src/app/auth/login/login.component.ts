import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';
import { User } from '../user';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user: User = {
    username: '',
    password: ''
  };


  constructor(private location: Location, private authService: AuthService) { }

  ngOnInit() {
  }

  login() {
    const self = this;
    self.authService.signIn(this.user).subscribe(function (res) {
      self.authService.setToken(res.token);
      if (res.token) {
        alert(res.msg);
        self.location.back();
      }
    });
  }

  // this method redirects the user back to the last page he was on before signing up
  redirect() {
    this.location.back();
  }

}
