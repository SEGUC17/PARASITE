
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

declare const $: any;

@Component({
  selector: 'app-child-signup',
  templateUrl: './child-signup.component.html',
  styleUrls: ['./child-signup.component.scss']
})
export class ChildSignupComponent implements OnInit {
  constructor(private location: Location, private authService: AuthService,
    private toastrService: ToastrService, private router: Router, public translate: TranslateService) { }
  Firstname: String = '';
  Lastname: String = '';
  Username: String = '';
  Password: String = '';
  ConfirmPassword: String = '';
  Email: String = '';
  Address: String = '';
  Birthdate: Date;
  Div1 = false;
  Div2 = false;
  Div3 = false;
  AllisWell: Boolean = true;
  User: any;
  private done = false;
  private switch = false;
  Educational_level: String = '';
  Educational_system: String = '';
  systems: any = ['Thanaweya Amma', 'IGCSE', 'American Diploma'];
  levels: any = ['Kindergarten', 'Primary School', 'Middle School', 'High School'];

  public interests = new Set();
  public interest;
  public tags = [];

  ngOnInit() {
    window.scrollTo(0, 0);
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
        self.Birthdate = date._d;
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

  register(): void {
    const self = this;
    if (this.AllisWell) {
      this.User = {
        'firstName': this.Firstname, 'lastName': this.Lastname, 'username': this.Username, 'password': this.Password,
        'birthdate': this.Birthdate, 'email': this.Email,
        'address': this.Address, 'educationLevel': self.Educational_level, 'educationSystem': self.Educational_system,
        'interests': Array.from(this.interests)
      };
      self.authService.childSignUp(this.User).subscribe(function (res) {
        this.Div3 = true;
        if (res.msg) {
          self.translate.get('AUTH.TOASTER.CHILD_SIGN_UP_SUCCESSFULL').subscribe(
            function (translation) {
              self.toastrService.success(translation);
              self.authService.redirectToHomePage();
            }
          );
        }
      });
    }// end if
  }// end method


  showPersonalInfoTab(): void {
    $('#interests').prop('hidden', true);
    $('#personalInfo').prop('hidden', false);
    $('#credentials').prop('hidden', true);
    $('#prevTab').prop('disabled', true);
    $('#lastTab').prop('disabled', true);
    this.done = false;
  }

  showCredentialsTab(): void {
    const self = this;
    self.translate.get('AUTH.CHILD_SIGN_UP.DONE').subscribe(
      function (translation) {
        $('#interests').prop('hidden', true);
        $('#personalInfo').prop('hidden', true);
        $('#credentials').prop('hidden', false);
        $('#prevTab').prop('disabled', false);
        $('#prevTab').prop('value', translation);
        $('#lastTab').prop('disabled', false);
      });
  }

  showInterestsTab(): void {
    const self = this;
    self.translate.get('AUTH.CHILD_SIGN_UP.DONE').subscribe(
      function (translation) {
        $('#interests').prop('hidden', false);
        $('#personalInfo').prop('hidden', true);
        $('#credentials').prop('hidden', true);
        $('#prevTab').prop('disabled', false);
        $('#prevTab').prop('value', translation);
        $('#nextTab').prop('value', translation);

        this.done = true;
      });
  }

  systemIs(sys): void {
    const self = this;
    self.Educational_system = sys;
    self.toastrService.success('Education System selected ', sys);
  }

  levelIs(lev): void {
    const self = this;
    self.Educational_level = lev;
    self.toastrService.success('Eduacation Level selected ', lev);
  }

  addInterest() {
    this.interests.add(this.interest);
  }
}
