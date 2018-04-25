import { OnInit, Input, Output, ViewChild, Component } from '@angular/core';
import { ViewVerifiedContributerRequestsComponent } from '../view-verified-contributer-requests/view-verified-contributer-requests.component';
import { ViewContentRequestsComponent } from '../../content/view-content-requests/view-content-requests.component';
import { ViewUnverifiedActivitiesComponent } from '../view-unverified-activities/view-unverified-activities.component';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import { ViewProductRequestsComponent } from '../view-product-requests/view-product-requests.component';
import { ViewPsychRequestsComponent } from '../view-psych-requests/view-psych-requests.component';
import { PublishRequestsComponent } from '../../schedule/study-plan/publish-requests/publish-requests.component';
@Component({
  selector: 'app-admin-control',
  templateUrl: './admin-control.component.html',
  styleUrls: ['./admin-control.component.scss']
})

export class AdminControlComponent implements OnInit {

  @ViewChild(ViewVerifiedContributerRequestsComponent) VcComponent;

  @ViewChild(ViewContentRequestsComponent) _ResIReq;

  @ViewChild(ViewProductRequestsComponent) ProdReqComponent;

  @ViewChild(ViewPsychRequestsComponent) PsychReqComponent;

  @ViewChild(PublishRequestsComponent) PubReqComponent;

  hideVCRequest: any = 1;
  hideContentReqs: any = 1;
  hideProdReqs: any = 1;
  hidePsychReqs: any = 1;
  hideStudyPlanPublishReqs: any = 1;

  constructor(private _adminService: AdminService,
    private router: Router) { }

  ngOnInit() {

  }

  // changing the visibility of the component
  viewProdRequests() {
    this.hideProdReqs = 1 - this.hideProdReqs;
  }

  goToResIReq() {
    this.hideContentReqs = 1 - this.hideContentReqs;
    this._ResIReq.viewPendingContReqs();
  }

  onSelectChange(event) {
    if (event.index === 1) {
      this._ResIReq.viewPendingContReqs();
    }
    if (event.index === 5) {
      this.PubReqComponent.viewStudyPlanPublishReqs();
    }
  }

  // changing the visibility of the component
  goToPsychReq() {
    this.hidePsychReqs = 1 - this.hidePsychReqs;
  }

  goToPubReq() {
    this.hideStudyPlanPublishReqs = 1 - this.hideStudyPlanPublishReqs;
    this.PubReqComponent.viewStudyPlanPublishReqs();
  }
  viewVCRequests() {
    console.log('gonna hide the component');
    this.hideVCRequest = 1 - this.hideVCRequest;  // changing the visibility of the component
  }
}
