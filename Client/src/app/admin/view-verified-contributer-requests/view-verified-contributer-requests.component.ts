import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-verified-contributer-requests',
  templateUrl: './view-verified-contributer-requests.component.html',
  styleUrls: ['./view-verified-contributer-requests.component.scss']
})
export class ViewVerifiedContributerRequestsComponent implements OnInit {
  /*
    @author: MAHER.
   */

  constructor(private _adminService: AdminService, private router: Router
  ) { }

  Requests: any[];



  filter: String = 'pending';

  ngOnInit() {
    this.viewVCRs('pending');
  }

  pendingRadio() { // triggered by Radio button to change the filter
    this.filter = 'pending';
    this.viewVCRs(this.filter);
  }

  acceptedRadio() { // triggered by Radio button to change the filter
    this.filter = 'approved';
    this.viewVCRs(this.filter);
  }

  rejectedRadio() { // triggered by Radio button to change the filter
    this.filter = 'disapproved';
    this.viewVCRs(this.filter);

  }

  viewVCRs(FilteredBy) {  // request the Verified Contributer Requests from the server to this.Requests.
    let self = this;

    this._adminService.viewPendingVCR(FilteredBy).subscribe(function (res) {
      self.Requests = res.data.dataField;
      if (res.msg === 'VCRs retrieved successfully.') {
        console.log(res.data.dataField);
        console.log('loaded response.data');
      } else {
        console.log('failed');
      }
    });
  }

  onNameClick(request) {  // redirect the Admin to the user's page.
    console.log('clicked');
    this.router.navigate(['/profile/' + request.username]);
  }

  Accept(request) { // Accepted by Admin.
    this._adminService.respondToContributerValidationRequest(request._id, 'approved');

  }

  Reject(request) { // rejected by Admin.
    this._adminService.respondToContributerValidationRequest(request._id, 'disapproved');
  }

}
