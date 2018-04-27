import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  pws = {
          newpw : '',
          confirmpw : ''
  };
  

  constructor(private _AuthService: AuthService, private _ActivatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  reset(pws: any) {
    const self = this;
    if (!(pws.newpw === pws.confirmpw)) {
      alert('New and confirmed passwords do not match!');

    } else if ((pws.newpw.length < 8)) {
      alert('Password should be more than 8 characters');
    } else {
    this._ActivatedRoute.params.subscribe(function (params) {
      self._AuthService.resetPassword(params['id'], pws ).subscribe(function (res) {
          alert(res.msg);

      });
    });
   }
  }


}
