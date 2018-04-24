import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { cities } from '../../variables';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private toastrService: ToastrService, private router: Router) { }

  ngOnInit() {
  }

  signUp() {
    const self = this;
    self.authService.signUp(this.user).subscribe(function (res) {
      self.toastrService.success(res.msg);
      self.router.navigate(['/dashboard']);
    });
  }

}
