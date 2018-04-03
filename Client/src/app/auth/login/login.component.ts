import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  Username: String = '';
  Password: String = '';
  User: any;
  Div1 = false;
  Div2 = false;
  AllisWell: Boolean = true;


  constructor(private location: Location, private authService: AuthService) { }

  ngOnInit() {
  }

  login() {
    const self = this;
    if (this.Password === '' || this.Username === '') {
      this.showDiv1();
      console.log('Sorry, you need to enter your username and password to login!');
      this.AllisWell = false;
    }

    if (this.AllisWell === true) {
      this.User = { 'username': this.Username, 'password': this.Password };
      self.authService.Login(this.User).subscribe(function (res) {
        self.authService.setUser(res.data);
        if (res.data) {
          alert(res.msg);
        }
      });
    }
    // self.location.back();
  }// end method

  // this method redirects the user back to the last page he was on before signing up
  redirect() {
    this.location.back();
  }// end method

  showDiv1() {
    this.Div1 = true;
  }

}
