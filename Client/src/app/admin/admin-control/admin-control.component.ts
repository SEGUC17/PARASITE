import { OnInit, Input, Output, ViewChild, Component} from '@angular/core';
import {ViewVerifiedContributerRequestsComponent} from '../view-verified-contributer-requests/view-verified-contributer-requests.component';
import {ViewContentRequestsComponent } from '../../content/view-content-requests/view-content-requests.component';
import {ViewUnverifiedActivitiesComponent} from'../view-unverified-activities/view-unverified-activities.component';
import {AdminService} from '../../admin.service';

@Component({
  selector: 'app-admin-control',
  templateUrl: './admin-control.component.html',
  styleUrls: ['./admin-control.component.css']
})

export class AdminControlComponent implements OnInit {

  @ViewChild(ViewVerifiedContributerRequestsComponent) VcComponent;

  @ViewChild(ViewContentRequestsComponent) _ResIReq;

  hideVCRequest: any = 1;
  hideContentReqs: any = 1;

  constructor(private _adminService: AdminService) { }

  ngOnInit() {

  }
  onSelectChange(event) {
    if (event.index === 1) {
      this._ResIReq.viewPendingContReqs();
  }
}


  viewVCRequests() {
    console.log('gonna hide the component');
    this.hideVCRequest = 1 - this.hideVCRequest;  // changing the visibility of the component
  }
}

