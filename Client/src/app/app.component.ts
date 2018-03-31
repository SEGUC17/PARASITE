import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
      name: 'Content List View'
    },
    {
      url: '/auth/login',
      name: 'Login'
    },
    {
<<<<<<< HEAD
=======
      url: '/auth/signup',
      name: 'Signup'
    },
    {
>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337
      url: '/profile',
      name: 'Profile'
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
      url: '/schedule/0',
      name: 'Random Schedule'
    },
    {
      url: '/study-plan/0',
      name: 'Random Study Plan'
    },
    {
<<<<<<< HEAD
      url: '/psychologist/0',
      name: 'Psychologist'
    },
    {
      url: '/activities/9',
=======
      url: '/psychologist/view/0',
      name: 'Psychologist'
    },
    {
      url: '/activities',
>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337
      name: 'Random Activity'
    },
    {
      url: '/admin',
      name: 'Admin Control'
<<<<<<< HEAD
    }
=======
    },
    {
      url: '/admin/category',
      name: 'Admin Category Control'
  }
>>>>>>> cab72541f277f1ee5298f2968b6dcac34b18f337
  ];
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = function () {
      changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this._mobileQueryListener);

  }
  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
