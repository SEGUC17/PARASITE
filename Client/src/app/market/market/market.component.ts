import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MarketService } from '../market.service';
import { PageEvent } from '@angular/material';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Product } from '../Product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {


  products: Product[];
  currentPageNumber: number;
  entriesPerPage = 5;
  selectedName: String = 'NA';
  selectedPrice = 0;
  numberOfPages: number;
  numberOfProducts: number;
  constructor(public dialog: MatDialog, private marketService: MarketService, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.currentPageNumber = 1;
    this.firstPage();
  }
  openDialog(prod: any): void {
    let dialogRef = this.dialog.open(ProductDetailComponent, {
      width: '1000px',
      height: '400px',
      data: { product: prod }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  getPage(): void {
    const self = this;
    const limiters = {
      price: self.selectedPrice,
      name: self.selectedName
    };
    self.marketService.getMarketPage(self.entriesPerPage,
      self.currentPageNumber, limiters)
      .subscribe(function (products) {
        self.products = products.data.docs;
      });
  }

  firstPage(): void {
    const self = this;
    const limiters = {
      price: self.selectedPrice,
      name: self.selectedName
    };
    this.marketService.numberOfMarketPages(limiters)
      .subscribe(function (numberOfProducts) {
        self.numberOfProducts = numberOfProducts.data;
        self.numberOfPages = Math.ceil(self.numberOfProducts / self.entriesPerPage);
        self.getPage();
      });
  }

  onPaginateChange(event): void {
    this.currentPageNumber = event.pageIndex + 1;
    this.getPage();
  }
}
