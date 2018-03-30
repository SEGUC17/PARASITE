import { Component, OnInit } from '@angular/core';
import { ProductRequestsService } from './product-requests.service';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-view-product-requests',
  templateUrl: './view-product-requests.component.html',
  styleUrls: ['./view-product-requests.component.css']
})
export class ViewProductRequestsComponent implements OnInit {

  requests: any[];

  constructor(private services: ProductRequestsService) {
    // TODO send request to database to get products
   }

  ngOnInit() {
  }

}
