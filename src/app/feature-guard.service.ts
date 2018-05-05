import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class FeatureGuardService implements CanActivate, CanLoad {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    const self = this;

    return this.authService.getUserData(['username']).map(function (user) {
      if (!user.data) {
        self.router.navigate(['/content/list']);
        return false;
      }
      if (user.data.username) {
        return true;
      } else {
        self.router.navigate(['/content/list']);
        return false;
      }
    }).catch(
      function (error) {
        self.router.navigate(['/content/list']);
        return Observable.of(false);
      }
    );
  }

  // duplicating code was necessary
  // attempt to refactor failed with an error
  canLoad() {
    const self = this;

    return this.authService.getUserData(['username']).map(function (user) {
      if (!user.data) {
        self.router.navigate(['/content/list']);
        return false;
      }
      if (user.data.username) {
        return true;
      } else {
        self.router.navigate(['/content/list']);
        return false;
      }
    }).catch(
      function (error) {
        self.router.navigate(['/content/list']);
        return Observable.of(false);
      }
    );
  }
}
