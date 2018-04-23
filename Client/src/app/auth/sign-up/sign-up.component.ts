import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { cities } from '../../variables';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

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
  year = (new Date()).getFullYear();

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  signUp() {
    const self = this;
    self.authService.signUp(this.user).subscribe(function (res) {
      if (res.msg) {
        alert(res.msg);
      }
    });
  }

}
