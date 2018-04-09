import { Component, OnInit } from '@angular/core';
import { ProductRequestsService } from './product-requests.service';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-product-requests',
  templateUrl: './view-product-requests.component.html',
  styleUrls: ['./view-product-requests.component.css']
})
export class ViewProductRequestsComponent implements OnInit {

  requests: any[] = [];
  currentUser: any;

  constructor(private services: ProductRequestsService,
    private authService: AuthService,
    private router: Router) {

    let self = this;

    this.currentUser = this.authService.getUser();
//    if (this.currentUser.isAdmin) {
      this.services.getProductRequests().subscribe(function (res) {
        if (res.msg === 'Requests retrieved successfully.') {
          self.requests = res.data;
        }
      });
//     else {
//      this.router.navigateByUrl('/');
//    }
  }

  ngOnInit() {
  }

  acceptReq(index) {
    let reqToSend = this.requests[index];
    reqToSend['result'] = true;
    console.log(reqToSend);

    let self = this;
    this.services.evalRequest(reqToSend).subscribe(function (res) {
      if (res.msg === 'Request accepted and product added to database.') {
        let i = self.requests.indexOf(self.requests[index], 0);
        if (index > -1) {
          self.requests.splice(i, 1);
        }
      }
    });
  }

  rejectReq(index) {
    let reqToSend = this.requests[index];
    reqToSend['result'] = false;
    console.log(reqToSend);

    let self = this;
    this.services.evalRequest(reqToSend).subscribe(function (res) {
      if (res.msg === 'Request rejected and user notified.') {
        let i = self.requests.indexOf(self.requests[index], 0);
        if (index > -1) {
          self.requests.splice(i, 1);
        }
      }
    });
  }

}
