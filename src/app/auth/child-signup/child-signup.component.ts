
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
    private toastrService: ToastrService, private router: Router, private translate: TranslateService) { }
  Firstname: String = '';
  Lastname: String = '';
  Username: String = '';
  Password: String = '';
  ConfirmPassword: String = '';
  Email: String = '';
  Address: String = '';
  Birthdate: Date;
  Phone: [String] = [''];
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
levels: any = ['KG', 'Primary School', 'Middle School', 'High School'];

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
        self.Birthdate = date._d;
      }
    });
  }

  register(): void {
    const self = this;
    if (this.AllisWell) {
   //   console.log('birthdate: ', self.Birthdate);
    //  console.log('educationSystem ', self.Educational_system);
    //  console.log('educationLevel ', self.Educational_level );
            this.User = { 'firstName': this.Firstname, 'lastName': this.Lastname, 'username': this.Username, 'password': this.Password,
      'birthdate': this.Birthdate, 'email': this.Email, 'phone': this.Phone,
       'address': this.Address, 'educationLevel': self.Educational_level, 'educationSystem': self.Educational_system};
      self.authService.childSignUp(this.User).subscribe(function (res) {
         this.Div3 = true;
         if ( res.msg ) {
          self.translate.get('AUTH.TOASTER.CHILD_SIGN_UP_SUCCESSFULL').subscribe(
            function (translation) {
              self.toastrService.success(translation);
            }
          );
        //    self.router.navigate(['/']);
           }
       });
    }// end if
   //  this.location.back();
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
    $('#interests').prop('hidden', true);
    $('#personalInfo').prop('hidden', true);
    $('#credentials').prop('hidden', false);
    $('#prevTab').prop('disabled', false);
    $('#prevTab').prop('value', 'Done');
    $('#lastTab').prop('disabled', false);
  }

  showInterestsTab(): void {

    $('#interests').prop('hidden', false);
    $('#personalInfo').prop('hidden', true);
    $('#credentials').prop('hidden', true);
    $('#prevTab').prop('disabled', false);
    $('#prevTab').prop('value', 'Done');
    $('#nextTab').prop('value', 'Done');

    this.done = true;
  }

  systemIs(sys): void {
    const self = this;
  //  console.log('entered sys meth');
        self.Educational_system = sys;
        self.toastrService.success('Education System selected ', sys );
    //    console.log(self.Educational_system);
  }

  levelIs(lev): void {
    const self = this;
  //  console.log('entered lev meth');
        self.Educational_level = lev;
        self.toastrService.success('Eduacation Level selected ', lev);
    //    console.log(self.Educational_level);
  }
}
