import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ActivatedRoute } from '@angular/router';
import { Params } from '@angular/router';
import { Router} from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  newpw = '';
  confirmpw = '';

  constructor(private _AuthService: AuthService, private _ActivatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  reset(newpassword) {
    const self = this;
    if (!(this.newpw === this.confirmpw)) {
      alert('New and confirmed passwords do not match!');


    } else if ((this.newpw.length < 8)) {
      alert('Password should be more than 8 characters');
    } else {
    this._ActivatedRoute.params.subscribe(function (params) {
      self._AuthService.resetPassword(params['id'], this.newpw ).subscribe(function (res) {
          alert(res.msg);

      });
    });
   }
  }


}
