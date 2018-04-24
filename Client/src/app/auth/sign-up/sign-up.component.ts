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

  private isReady = false;

  constructor(private authService: AuthService, private toastrService: ToastrService, private router: Router) { }

  ngOnInit() {
  }

  showPersonalInfoTab(): void {
    $('#personalInfo').prop('hidden', false);
    $('#credentials').prop('hidden', true);
    $('#prevTab').prop('disabled', true);
    $('#nextTab').prop('value', 'Next');
    this.isReady = false;
  }

  showCredentialsTab(): void {
    const self = this;
    if (this.isReady) {
      $('#nextTab').attr('onclick', function () {
        self.signUp();
      });
    }
    $('#personalInfo').prop('hidden', true);
    $('#credentials').prop('hidden', false);
    $('#prevTab').prop('disabled', false);
    $('#nextTab').prop('value', 'Sign Up');
    this.isReady = true;
  }

  signUp() {
    const self = this;
    self.authService.signUp(this.user).subscribe(function (res) {
      if (res.msg) {
        self.toastrService.success(res.msg);
        self.router.navigate(['/dashboard']);
      }
    });
  }

}
