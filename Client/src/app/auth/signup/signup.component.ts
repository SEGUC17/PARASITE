import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { cities } from '../../variables';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
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
    address: '',
    isTeacher: false,
  };
  public cities = cities;

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
