import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  public user: User = {
    username: '',
    password: '',
    rememberMe: false
  };

  constructor(private authService: AuthService, private toastrService: ToastrService, private router: Router) { }

  ngOnInit() {
  }

  signIn() {
    const self = this;
    self.authService.signIn(this.user).subscribe(function (res) {
      self.authService.setToken(res.token);
      self.toastrService.success(res.msg, 'Welcome!');
      self.router.navigate(['/dashboard']);
    });
  }

}
