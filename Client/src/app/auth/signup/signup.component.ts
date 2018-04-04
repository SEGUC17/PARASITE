import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

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
  Student: Boolean = false;
  Teacher: Boolean = false;
  Parent: Boolean = false;
  Flag: String = '';
  Div1 = false;
  Div2 = false;
  Div3 = false;
  AllisWell: Boolean = true;
  User: any;
  ngOnInit() {
  }




  register(): void {
    // checking that password and confirm password match and all required entries are there
     this.checked();

    if (!(this.Password === this.ConfirmPassword)) {
      this.showDiv1();
      this.AllisWell = false;
    }


    if (this.Firstname === '' || this.Lastname === '' || this.Username === '' || this.Email === '' || this.Birthdate === null) {
      this.showDiv2();
      this.AllisWell = false;

    }
  //  if (this.Teacher ===  'Teacher') {
    //  this.Teacher = true;
   // }
    // to be continued
    if (this.AllisWell) {
      this.User = { 'firstName': this.Firstname, 'lastName': this.Lastname, 'username': this.Username, 'password': this.Password,
       'birthdate': this.Birthdate, 'email': this.Email,
       'phone': this.Phone, 'address': this.Address, 'isParent': this.Parent, 'isChild': this.Student, 'isTeacher': this.Teacher };
      const self = this;
      console.log('teacher= ' + this.Teacher);
      self.authService.signUp(this.User).subscribe(function (res) {
        self.authService.setUser(res.data);
        if (res.data) {
          alert(res.msg);
        }
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

  showDiv3() {
    this.Div3 = true;
  }
  // this method redirects the user back to the last page he was on before signing up
  redirect() {
    this.location.back();
  }// end method

   checked() {
    const choice = document.getElementById('group1');
      if (choice) {
        this.Teacher = true;
      }// endif

   }// end method
}// end class



