import { Component, OnInit, ViewChild } from '@angular/core';
import {ViewResourcesIdeasRequestsComponent } from '../view-resources-ideas-requests/view-resources-ideas-requests.component'
import {AdminService} from '../../admin.service';
@Component({
  selector: 'app-admin-control',
  templateUrl: './admin-control.component.html',
  styleUrls: ['./admin-control.component.css']
})

export class AdminControlComponent implements OnInit {

  @ViewChild(ViewResourcesIdeasRequestsComponent) _ResIReq;

  constructor(private _adminService: AdminService) { }

  ngOnInit() {

  }
  goToResIReq() {
    this._ResIReq.test();
    console.log(this._adminService.test());
  }
}

