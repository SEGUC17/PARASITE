import { Router } from '@angular/router';
import { OnInit, Input, Output, ViewChild, Component } from '@angular/core';
import { AdminService } from '../../admin.service';
import { ViewVerifiedContributerRequestsComponent } from '../view-verified-contributer-requests/view-verified-contributer-requests.component';
import { ViewContentRequestsComponent } from '../../content/view-content-requests/view-content-requests.component';
import { ViewProductRequestsComponent } from '../view-product-requests/view-product-requests.component';
import { ViewPsychRequestsComponent } from '../view-psych-requests/view-psych-requests.component';

@Component({
  selector: 'app-admin-control',
  templateUrl: './admin-control.component.html',
  styleUrls: ['./admin-control.component.css']
})

export class AdminControlComponent implements OnInit {

  @ViewChild(ViewVerifiedContributerRequestsComponent) VcComponent;

  @ViewChild(ViewContentRequestsComponent) _ResIReq;

  @ViewChild(ViewProductRequestsComponent) ProdReqComponent;

  @ViewChild(ViewPsychRequestsComponent) PsychReqComponent;

  hideVCRequest: any = 1;
  hideContentReqs: any = 1;
  hideProdReqs: any = 1;
  hidePsychReqs: any = 1;

  constructor(private _adminService: AdminService,
    private router: Router) { }

  ngOnInit() {

  }

  viewProdRequests() {
    // this.router.navigateByUrl('/admin/prod-req');
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
  }


  goToPsychReq() {
    this.hidePsychReqs = 1 - this.hidePsychReqs;
  }

  viewVCRequests() {
    console.log('gonna hide the component');
    this.hideVCRequest = 1 - this.hideVCRequest;  // changing the visibility of the component
  }
}
