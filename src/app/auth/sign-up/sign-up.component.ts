import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { cities } from '../../variables';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare const $: any;

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

  private tabNumber = 1;

  constructor(private authService: AuthService, private toastrService: ToastrService, private router: Router) { }

  ngOnInit() {
  }

  signUp() {
    const self = this;
    self.authService.signUp(this.user).subscribe(function (res) {
      if (res.msg === 'Sign Up Is Successful!\nVerification Mail Was Sent To Your Email!') {
        self.toastrService.success(res.msg);
        self.router.navigateByUrl('/content/list');
      }
    });
  }

}
