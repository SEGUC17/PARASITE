import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AdminGuardService implements CanActivate, CanLoad {

  constructor(private authService: AuthService, private router: Router,
    private toastrService: ToastrService, private translate: TranslateService) { }

  canActivate() {
    const self = this;

    return this.authService.getUserData(['isAdmin']).map(function (user) {
      if (!user.data) {
        self.router.navigate(['/content/list']);
        self.callToastr();
        return false;
      }
      if (user.data.isAdmin) {
        return true;
      } else {
        self.router.navigate(['/content/list']);
        self.callToastr();
        return false;
      }
    }).catch(
      function(error) {
        self.router.navigate(['/content/list']);
        self.callToastr();
        return Observable.of(false);
      }
    );
  }

  canLoad() {
    const self = this;

    return this.authService.getUserData(['isAdmin']).map(function (user) {
      if (!user.data) {
        self.router.navigate(['/content/list']);
        self.callToastr();
        return false;
      }
      if (user.data.isAdmin) {
        return true;
      } else {
        self.router.navigate(['/content/list']);
        self.callToastr();
        return false;
      }
    }).catch(
      function(error) {
        self.router.navigate(['/content/list']);
        self.callToastr();
        return Observable.of(false);
      }
    );
  }

  callToastr() {
    const self = this;
    this.translate.get('APP.SIGN_IN_ADMIN').subscribe(
      function (message) {
        self.toastrService.warning(message);
      }
    );
  }
}
