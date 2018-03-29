import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../admin.service";

@Component({
  selector: 'app-view-verified-contributer-requests',
  templateUrl: './view-verified-contributer-requests.component.html',
  styleUrls: ['./view-verified-contributer-requests.component.css']
})
export class ViewVerifiedContributerRequestsComponent implements OnInit {

  constructor(private _adminService: AdminService) { }

  ngOnInit() {
  }

  testAccess(){

  }

}
