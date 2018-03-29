import { OnInit, Output, ViewChild, Component} from '@angular/core';
import {ViewVerifiedContributerRequestsComponent} from '../view-verified-contributer-requests/view-verified-contributer-requests.component';
import {ViewResourcesIdeasRequestsComponent } from '../view-resources-ideas-requests/view-resources-ideas-requests.component';
import {AdminService} from '../../admin.service';

@Component({
  selector: 'app-admin-control',
  templateUrl: './admin-control.component.html',
  styleUrls: ['./admin-control.component.css']
})

export class AdminControlComponent implements OnInit {

  @ViewChild(ViewVerifiedContributerRequestsComponent) VcComponent;

  @ViewChild(ViewResourcesIdeasRequestsComponent) _ResIReq;

  constructor(private _adminService: AdminService) { }

  ngOnInit() {

  }
  goToResIReq() {
    this._ResIReq.test();
    console.log(this._adminService.test());
  }

  removeElementByID (stringID) {
    let el = document.getElementById(stringID);
    el.parentNode.removeChild(el);
  }

  viewVCRequests() {
    this.VcComponent.testAccess();

  }
}

