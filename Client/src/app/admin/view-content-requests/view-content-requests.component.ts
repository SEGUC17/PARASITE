import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
@Component({
  selector: 'app-view-content-requests',
  templateUrl: './view-content-requests.component.html',
  styleUrls: ['./view-content-requests.component.css']
})
export class ViewContentRequestsComponent implements OnInit {

  constructor(private _adminService: AdminService) { }

  ngOnInit() {
  }

  viewPendingContReqs(): void {
    let self = this;
     self._adminService.viewPendingContReqs().subscribe(function(res) {
      console.log(res.data);
      console.log(res.msg);
     });
  }
  approveContentRequest(Rid): any {
    let self = this;
    self._adminService.respondContentRequest('approved', Rid ).subscribe(function(res) {
      console.log(res.data);
      console.log(res.msg);

    });
  }
  disapproveContentRequest(Rid): any {
    let self = this;
    self._adminService.respondContentRequest('disapproved', Rid).subscribe(function(res) {
      console.log(res.data);
      console.log(res.msg);

    });
  }
}
