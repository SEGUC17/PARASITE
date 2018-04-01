import { Component, OnInit } from '@angular/core';
import { ProductRequestsService } from './product-requests.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-view-product-requests',
  templateUrl: './view-product-requests.component.html',
  styleUrls: ['./view-product-requests.component.css']
})
export class ViewProductRequestsComponent implements OnInit {

  requests: any[];

  constructor(private services: ProductRequestsService) {
    let self = this;
    this.services.getProductRequests().subscribe(function (res) {
      if (res.msg === 'Requests retrieved successfully.') {
        self.requests = res.data;
        console.log(self.requests);
      }
    });
  }

  ngOnInit() {
  }

  acceptReq(index) {
    let reqToSend = this.requests[index];
    reqToSend['result'] = true;
    console.log(reqToSend);
    this.services.evalRequest(reqToSend).subscribe(function (res) {
      if (res.msg === 'Request accepted and product added to database.') {
        let i = this.mockRequests.indexOf(this.mockRequests[index], 0);
        if (index > -1) {
          this.mockRequests.splice(i, 1);
        }
        console.log(res.data);
      }
    });
  }

  rejectReq(index) {
    let reqToSend = this.requests[index];
    reqToSend['result'] = false;
    console.log(reqToSend);
    this.services.evalRequest(reqToSend).subscribe(function (res) {
      if (res.msg === 'Request rejected and user notified.') {
        let i = this.mockRequests.indexOf(this.mockRequests[index], 0);
        if (index > -1) {
          this.mockRequests.splice(i, 1);
        }
        console.log(res.data);
      }
    });
  }

}
