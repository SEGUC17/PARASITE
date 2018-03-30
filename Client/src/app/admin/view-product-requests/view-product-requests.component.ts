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
    // TODO send request to database to get products
  }

  ngOnInit() {
  }

  acceptReq(index) {
    console.log('Accepted ' + index);
  }

  rejectReq(index) {
    console.log('Rejected ' + index);
  }

}
