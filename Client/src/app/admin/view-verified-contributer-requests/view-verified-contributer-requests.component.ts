import { Component, OnInit } from '@angular/core';
import {AdminService} from '../../admin.service';

@Component({
  selector: 'app-view-verified-contributer-requests',
  templateUrl: './view-verified-contributer-requests.component.html',
  styleUrls: ['./view-verified-contributer-requests.component.css']
})
export class ViewVerifiedContributerRequestsComponent implements OnInit {

  constructor(private _adminService: AdminService) { }

  displayedString: String = 'no data yet';

  ngOnInit() {
  }

  viewVCRs(FilteredBy) {
    var self = this;
    this._adminService.viewPendingVCR(FilteredBy).subscribe(function (res) {
      self.displayedString = res.msg;
      if (res.msg === 'VCRs retrieved successfully.') {
        console.log(res.data);
        console.log('loaded response.data');
      } else {
        console.log('failed');
      }
    });
  }

  AcceptVCR(id) {
    this._adminService.respondToContributerValidationRequest(id, 'approved');
  }

  RejectVCR(id) {
    this._adminService.respondToContributerValidationRequest('5abe5db07fb5c232bc5ca012', 'disapproved');
  }

}
