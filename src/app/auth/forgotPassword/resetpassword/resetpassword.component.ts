import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  pws = {
    newpw: '',
    confirmpw: ''
  };

  constructor(private _AuthService: AuthService, private _ActivatedRoute: ActivatedRoute,
    private _toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit() {
  }

  reset(pws: any) {
    const self = this;
    if (!(pws.newpw === pws.confirmpw)) {
      self.translate.get('AUTH.TOASTER.NOT_MATCH_WARNING').subscribe(
        function (translation) {
          self._toastr.warning(translation);
        }
      );
    } else if ((pws.newpw.length < 8)) {
      self.translate.get('AUTH.TOASTER.PASSWORD_LENGTH_WARNING').subscribe(
        function (translation) {
          self._toastr.warning(translation);
        }
      );
    } else {
      this._ActivatedRoute.params.subscribe(function (params) {
        self._AuthService.resetPassword(params['id'], pws).subscribe(function (res) {
          if (self.translate.currentLang === 'en') {
            self._toastr.success(res.msg);
          } else {
            self._toastr.success('تم تحديث كلمة المرور بنجاح');
          }
        });
      });
    }
  }
}
