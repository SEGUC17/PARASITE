import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    const self = this;
    this.activatedRoute.params.subscribe(function (params) {
      self.authService.verifyEmail(params['id']).subscribe(function (res) {
        if (res.msg) {
          alert(res.msg);
          self.authService.setToken(res.token);
        }
      });
    });
  }

}
