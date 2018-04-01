import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MarketService } from '../market.service';
import { PageEvent } from '@angular/material';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Product } from '../Product';
import { Router } from '@angular/router';
@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {
  products: Product[];
  currentPageNumber: number;
  entriesPerPage = 15;
  selectedName: String = 'tshirt';
  selectedPrice = 100;
  totalNumberOfPages: number;

  constructor(private router: Router, private marketService: MarketService, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.currentPageNumber = 1;
    this.firstPage();
  }

  firstPage(): void {
    const limiters = {
      price: this.selectedPrice,
      name: this.selectedName
    };
    this.marketService.numberOfMarketPages(this.entriesPerPage,
      limiters)
      .subscribe(function (numberOfPages) {
        this.totalNumberOfPages = numberOfPages.data;
        this.getPage();
      });
  }

  goToCreate() {
    this.router.navigateByUrl('/market/createProduct');
  }

  getPage(): void {
    const limiters = {
      price: this.selectedPrice,
      name: this.selectedName
    };
    this.marketService.getMarketPage(this.entriesPerPage,
      this.currentPageNumber, limiters)
      .subscribe(function (products) {
        this.products = products.data;
      });
  }

  onPaginateChange(event): void {
    this.currentPageNumber = event.pageIndex + 1;
    this.getPage();
  }
}
