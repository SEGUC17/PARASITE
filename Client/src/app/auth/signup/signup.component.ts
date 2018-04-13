import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';
import { User } from '../user';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public user: User = {
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    birthdate: new Date(),
    phone: '',
    address: ''
  };

  constructor(private location: Location, private authService: AuthService) { }

  ngOnInit() {
  }

  register(): void {
    const self = this;
    self.authService.signUp(this.user).subscribe(function (res) {
      self.authService.setToken(res.token);
      if (res.token) {
        alert(res.msg);
      }
    });
  }

  redirect() {
    this.location.back();
  }

}
