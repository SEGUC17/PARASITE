import { Router } from '@angular/router';
import { OnInit, Input, Output, ViewChild, Component } from '@angular/core';
import { AdminService } from '../../admin.service';
import {ViewVerifiedContributerRequestsComponent} from '../view-verified-contributer-requests/view-verified-contributer-requests.component';
import {ViewContentRequestsComponent } from '../../content/view-content-requests/view-content-requests.component';
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

  constructor(private _adminService: AdminService,
    private router: Router) { }

  ngOnInit() {

  }

  viewProdRequests() {
    this.router.navigateByUrl('/admin/prod-req');
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
    this.router.navigateByUrl('/admin/PsychRequests');
  }

  viewVCRequests() {
    console.log('gonna hide the component');
    this.hideVCRequest = 1 - this.hideVCRequest;  // changing the visibility of the component

  }
}

