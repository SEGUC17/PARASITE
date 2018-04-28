import { OnInit, Input, Output, ViewChild, Component } from '@angular/core';
import { ViewContentRequestsComponent } from '../view-content-requests/view-content-requests.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-control',
  templateUrl: './admin-control.component.html',
  styleUrls: ['./admin-control.component.scss']
})

export class AdminControlComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private toasterService: ToastrService,
    private router: Router
  ) { }
  links = [
    {
      name: 'Content Requests',
      url: './content-req'
    },
    {
      name: 'Category Management',
      url: './category'
    },
    {
      name: 'Product Requests',
      url: './product-req'
    },
    {
      name: 'Psychologist Requests',
      url: './psych-req'
    },
    {
      name: 'Publish Study Plan requests',
      url: './publish-req'
    },
    {
      name: 'Unverified Activities',
      url: './unverified-activites'
    },
    {
      name: 'Verified Contributor Requests',
      url: './verified-contributor-req'
    },
    {
      name: 'Reports',
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
        self.router.navigateByUrl('/content/list');
      }
    });
  }
}
