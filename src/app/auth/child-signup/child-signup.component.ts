
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-child-signup',
  templateUrl: './child-signup.component.html',
  styleUrls: ['./child-signup.component.scss']
})
export class ChildSignupComponent implements OnInit {
  constructor(private location: Location, private authService: AuthService,
    private toastrService: ToastrService, private router: Router) { }
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


  ngOnInit() {

  }

  register(): void {
    if (this.AllisWell) {
      this.User = { 'firstName': this.Firstname, 'lastName': this.Lastname, 'username': this.Username, 'password': this.Password,
      'birthdate': this.Birthdate, 'email': this.Email, 'phone': this.Phone, 'address': this.Address};
      const self = this;
      self.authService.childSignUp(this.User).subscribe(function (res) {
         this.Div3 = true;
         if ( res.msg ) {
            self.toastrService.success(res.msg);
            self.router.navigate(['/dashboard']);
           }
       });
    }// end if
     this.location.back();
  }// end method


  showPersonalInfoTab(): void {
    $('#personalInfo').prop('hidden', false);
    $('#credentials').prop('hidden', true);
    $('#prevTab').prop('disabled', true);
    $('#nextTab').prop('value', 'Next');
    this.done = false;
  }

  showCredentialsTab(): void {
    const self = this;
    if (this.done) {
      $('#nextTab').attr('onclick', function () {
        self.register();
      });
    }
    $('#personalInfo').prop('hidden', true);
    $('#credentials').prop('hidden', false);
    $('#prevTab').prop('disabled', false);
    $('#nextTab').prop('value', 'Sign Up');
    this.done = true;
  }


}
