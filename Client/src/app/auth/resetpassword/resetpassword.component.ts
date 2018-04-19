import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { AuthService } from '../auth.service';
import { MatButtonModule } from '@angular/material';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('1000ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('1000ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})

export class ResetPasswordComponent implements OnInit {
  // ------ flags -----//
  card1 = true;
  card2 = false;
  card3 = false;
  card4 = false;
  email: '';
  codes = { code1: '', code2: ''};
  pws = { newpw: '', confirmpw: ''};

  constructor(private _AuthService: AuthService) { }

  ngOnInit() {
  }


  proceed(email): void {
    const self = this;
    if (email.length === 0) {
      alert('You need to enter an email');
    } else {
      console.log(email);
    this.card1 = false;
    this.card2 = true;
    self._AuthService.resetpassword(email).subscribe(function (res) {
      if (res) {
        alert(res.msg);
        self.codes.code1 = res.code;
      }
    });
  }
}
  goback(): void {
    this.card2 = false;
    this.card1 = true;
  }
  gotocode(): void {
    this.card1 = false;
    this.card2 = false;
    this.card3 = true;

  }
  gobackto1(): void {
    this.card3 = false;
    this.card1 = true;

  }
  verifycode(codes): void {
    if (this.codes.code1 === this.codes.code2) {
      this.card3 = false;
      this.card4 = true;
    } else {
      alert('The code you have entered is incorrect');
    }
  }
  ChangePassword(pws): void {
    if (!(pws.newpw === pws.confirmpw)) {
      alert('New and confirmed passwords do not match!');


    } else if ((pws.newpw.length < 8)) {
      alert('Password should be more than 8 characters');
    } else {
      console.log(this.email);
      this._AuthService.ChangePassword(this.email, pws).subscribe(function (res) {
        console.log(res.msg);
        alert(res.msg);
      });
    }
 }
}
