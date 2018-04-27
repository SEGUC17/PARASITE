import { OnInit, Input, Output, ViewChild, Component } from '@angular/core';
import { ViewContentRequestsComponent } from '../view-content-requests/view-content-requests.component';
@Component({
  selector: 'app-admin-control',
  templateUrl: './admin-control.component.html',
  styleUrls: ['./admin-control.component.scss']
})

export class AdminControlComponent implements OnInit {
  constructor() { }
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

  }
}
