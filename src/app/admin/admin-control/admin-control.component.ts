import { OnInit, Input, Output, ViewChild, Component } from '@angular/core';
import { ViewContentRequestsComponent } from '../view-content-requests/view-content-requests.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-admin-control',
  templateUrl: './admin-control.component.html',
  styleUrls: ['./admin-control.component.scss']
})

export class AdminControlComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private toasterService: ToastrService,
    private router: Router,
    private translate: TranslateService
  ) { }
  links = [
    {
      name: 'ADMIN.ADMIN_CONTROL.CONTENTS_MANAGEMENT',
      url: './content-req'
    },
    {
      name: 'ADMIN.ADMIN_CONTROL.CATEGORY_MANAGEMENT',
      url: './category'
    },
    {
      name: 'ADMIN.ADMIN_CONTROL.PRODUCTS_MANAGEMENT',
      url: './product-req'
    },
    {
      name: 'ADMIN.ADMIN_CONTROL.PSYCHOLOGISTS_MANAGEMENT',
      url: './psych-req'
    },
    {
      name: 'ADMIN.ADMIN_CONTROL.STUDY_PLANS_MANAGEMENT',
      url: './publish-req'
    },
    {
      name: 'ADMIN.ADMIN_CONTROL.ACTIVITIES_MANAGEMENT',
      url: './unverified-activites'
    },
    {
      name: 'ADMIN.ADMIN_CONTROL.VERIFIED_CONTRIBUTORS_MANAGEMENT',
      url: './verified-contributor-req'
    },
    {
      name: 'ADMIN.ADMIN_CONTROL.REPORTS',
      url: './reports'
    }
  ];
  ngOnInit() {
    const self = this;
    this.authService.getUserData(['username', 'isAdmin']).subscribe(function (res) {
      if (res.status === 401) {
        self.toasterService.error('Please sign in first', 'failure');
        self.router.navigateByUrl('/auth/sign-in');
      }
      if (res.data && !res.data.isAdmin) {
        self.toasterService.error('You are not an admin', 'failure');
        self.router.navigateByUrl('/newsfeed');
      }
    });
  }
}
