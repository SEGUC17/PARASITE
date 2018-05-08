import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { cities } from '../../variables';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Tag } from '../../newsfeed/newsfeed/tag';

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

  public cities = cities;
  public interests = [];
  tagsIdonthave = [];
  public tabNumber = 1;

  constructor(
    public authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    public translate: TranslateService
  ) {
    this.authService.isNotAuthenticated();
  }

  ngOnInit() {
    window.scrollTo(0, 0);
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
        for (let i = 0; i < res.data.length; i++) {
          self.tagsIdonthave.push(res.data[i].name);
        }
      }
    });
  }

  signUp() {
    this.user.interests = this.interests;
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

  addInterest(tagName: String) {
    this.tagsIdonthave.splice(this.tagsIdonthave.indexOf(tagName), 1);
    this.interests.push(tagName);
  }

  deleteInterest(tagName: String) {
    this.interests.splice(this.interests.indexOf(tagName), 1);
    this.tagsIdonthave.push(tagName);
  }

}
