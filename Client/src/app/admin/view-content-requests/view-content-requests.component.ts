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
    console.log('child component called ');
    let self = this;
     self._adminService.viewPendingContReqs().subscribe(function(res) {
      console.log('back from server');
      console.log(res.data);
      console.log(res.msg);
     });
  }
  approveContentRequest(): any {
    let self = this;
    self._adminService.respondContentRequest('approved').subscribe(function(res) {
      console.log('back from server');
      console.log(res.data);
      console.log(res.msg);

    });
  }
}
