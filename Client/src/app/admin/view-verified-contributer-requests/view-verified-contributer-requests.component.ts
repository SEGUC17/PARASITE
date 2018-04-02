import { Component, OnInit } from '@angular/core';
import {AdminService} from '../../admin.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-view-verified-contributer-requests',
  templateUrl: './view-verified-contributer-requests.component.html',
  styleUrls: ['./view-verified-contributer-requests.component.css']
})
export class ViewVerifiedContributerRequestsComponent implements OnInit {

  constructor(private _adminService: AdminService, private router: Router
  ) { }

  Requests: any[];



  filter: String = 'pending';

  ngOnInit() {
    this.viewVCRs('pending');
  }

  pendingRadio() {
      this.filter = 'pending';
      this.viewVCRs(this.filter);
  }

  acceptedRadio() {
    this.filter = 'approved';
    this.viewVCRs(this.filter);
  }

  rejectedRadio() {
    this.filter = 'disapproved';
    this.viewVCRs(this.filter);

  }

  viewVCRs(FilteredBy) {
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

  onCardClick(request) {
    console.log('clicked');
    this.router.navigate(['/profile/' + request.username]);
  }

  Accept(request) {
    this._adminService.respondToContributerValidationRequest(request._id, 'approved' );

  }

  Reject(request) {

    this._adminService.respondToContributerValidationRequest(request._id, 'disapproved' );
  }

}
