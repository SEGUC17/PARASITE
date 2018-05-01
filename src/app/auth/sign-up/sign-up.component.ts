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
    interests: [],
    lastName: '',
    email: '',
    birthdate: new Date(),
    phone: '',
    address: '',
    isTeacher: false,
  };
  public interests = new Set();
  public interest;

  private tags = [];
  private tabNumber = 1;

  constructor(private authService: AuthService, private toastrService: ToastrService, private router: Router) { }

  ngOnInit() {
    const self = this;

    $('.datetimepicker').bootstrapMaterialDatePicker({
      clearButton: true,
      format: 'DD MMMM YYYY',
      maxDate: new Date(),
      shortTime: true,
      time: false
    });

    $('#birthdate').bootstrapMaterialDatePicker().on('change', function (event, date) {
      if (date) {
        self.user.birthdate = date._d;
      }
    });

    this.authService.getTags().subscribe(function (res) {
      if (res.err) {
        self.toastrService.error(res.err);
      } else {
        self.tags = res.data;
      }
    });
  }

  signUp() {
    this.user.interests = Array.from(this.interests);
    const self = this;
    self.authService.signUp(this.user).subscribe(function (res) {
      if (res.msg === 'Sign Up Is Successful!\nVerification Mail Was Sent To Your Email!') {
        self.toastrService.success(res.msg);
        self.router.navigateByUrl('/content/list');
      }
    });
  }

  tabsUp() {
    this.tabNumber++;
  }

  tabsDown() {
    this.tabNumber--;
  }

  addInterest() {
    this.interests.add(this.interest);
  }

}
