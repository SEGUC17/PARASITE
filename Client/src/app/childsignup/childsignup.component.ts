import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-childsignup',
  templateUrl: './childsignup.component.html',
  styleUrls: ['./childsignup.component.css']
})
export class ChildsignupComponent implements OnInit {

  constructor(private location: Location, private authService: AuthService) { }
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
  AllisWell: Boolean = true;
  User: any;



  ngOnInit() {
  }

  register(): void {
    // checking that password and confirm password match and all required entries are there
    // this.checked();ser: any

    if (!(this.Password === this.ConfirmPassword)) {
      this.showDiv1();
      this.AllisWell = false;
    }


    if (this.Firstname === '' || this.Lastname === '' || this.Username === '' || this.Email === '' || this.Birthdate === null) {
      this.showDiv2();
      this.AllisWell = false;

    }

    // to be continued
    if (this.AllisWell) {
      this.User = { 'firstName': this.Firstname, 'lastName': this.Lastname, 'username': this.Username, 'password': this.Password,
      'birthdate': this.Birthdate, 'email': this.Email, 'phone': this.Phone, 'address': this.Address};
      const self = this;
      self.authService.childSignUp(this.User).subscribe(function (res) {
      self.authService.setUser(res.data);
    //  const userID = this.authService.getUser()._id;
       });
    }// end else
    // self.location.back();
  }// end method


  showDiv1() {
    this.Div1 = true;
  }

  showDiv2() {
    this.Div2 = true;
  }


  // this method redirects the user back to the last page he was on before signing up
  redirect() {
    this.location.back();
  }// end method

}
