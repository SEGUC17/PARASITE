import { Component, OnInit } from '@angular/core';
import { ProductRequestsService } from './product-requests.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-view-product-requests',
  templateUrl: './view-product-requests.component.html',
  styleUrls: ['./view-product-requests.component.css']
})
export class ViewProductRequestsComponent implements OnInit {

  mockRequests = [{
    name: 'Dildo',
    price: 4.50,
    seller: 'Abbas Pasha',
    image: null,
    acquiringType: 'Rent',
    rentPeriod: 130,
    description: 'A dildo for all your sexual needs'
  },
  {
    name: 'Big weird toy',
    price: 5.60,
    seller: 'Mamdouh Beh',
    image: null,
    acquiringType: 'Sale',
    rentPeriod: 0,
    description: 'A big toy your sexual needs'
  }
  ];

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
    console.log('Accepted ' + index);
    let reqToSend = this.requests[index];
    reqToSend['result'] = true;
    console.log(reqToSend);
    this.services.evalRequest(reqToSend).subscribe(function (res) {
      if (res.msg === 'Request accepted and product added to database.') {
        console.log(res.data);
      }
    });
  }

  rejectReq(index) {
    console.log('Rejected ' + index);
    let reqToSend = this.requests[index];
    reqToSend['result'] = false;
    console.log(reqToSend);
    this.services.evalRequest(reqToSend).subscribe(function (res) {
      if (res.msg === 'Request rejected and user notified.') {
        console.log(res.data);
      }
    });
  }

}
