import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'app';
  links = [
    {
      url: '/dashboard',
      name: 'Dashboard'
    },
    {
      url: '/content-edit',
      name: 'Content Edit'
    },
    {
      url: '/content-list-view',
      name: 'Content List'
    },
    {
      url: '/auth/login',
      name: 'Login'
    },
    {

      url: '/auth/signup',
      name: 'Signup'
    },
    {
      url: '/profile',
      name: 'Profile'
    },
    {
      url: '/childsignup',
      name: 'Child SignUp'
    },
    {
      url: 'message',
      name: 'Messaging'
    },
    {
      url: '/market',
      name: 'Market'
    },
    {
      url: 'published-study-plans',
      name: 'Published Study Plans'
    },
    {
      url: '/psychologist',
      name: 'Psychologists'
    },
    {
      url: '/activities',
      name: 'Activities'
    },
    {
      url: '/admin',
      name: 'Admin Control'

    },
    {
      url: '/search',
      name: 'Search'
    },
    {
      url: '/admin/category',
      name: 'Admin Category Control'
    },
    {
      url: '/psychologist/request/add',
      name: 'Add a Psychologist'
    }
  ];
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = function () {
      changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this._mobileQueryListener);

  }
  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  signOut() {
    this.authService.signOut();
  }
}
