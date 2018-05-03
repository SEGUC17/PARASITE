import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { cities } from '../../variables';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    public translate: TranslateService) { }

  ngOnInit() {

    this.authService.isNotAuthenticated();

    const self = this;

    $('.datetimepicker').bootstrapMaterialDatePicker({
      clearButton: true,
      format: 'DD MMMM YYYY',
      maxDate: new Date(new Date().getFullYear() - 13, new Date().getMonth(), new Date().getDay()),
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
        self.interest = self.tags[0];
      }
    });
  }

  signUp() {
    this.user.interests = Array.from(this.interests);
    const self = this;
    self.authService.signUp(this.user).subscribe(function (res) {
      if (res.msg === 'Sign Up Is Successful!\nVerification Mail Was Sent To Your Email!') {
        self.translate.get('AUTH.TOASTER.SIGN_UP_SUCCESSFULL').subscribe(
          function (translation) {
            self.toastrService.success(translation);
          }
        );
        self.authService.redirectToHomePage();
      }
    });
  }

  addInterest() {
    this.interests.add(this.interest);
  }

}
